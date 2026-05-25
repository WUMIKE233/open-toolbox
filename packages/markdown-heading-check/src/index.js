import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const IGNORED_DIRS = new Set([".git", "node_modules", "coverage", "dist", "build"]);

export async function checkMarkdownHeadings({ root = process.cwd() } = {}) {
  const absoluteRoot = path.resolve(root);
  const files = await findMarkdownFiles(absoluteRoot);
  const problems = [];

  for (const file of files) {
    const headings = extractHeadings(await readFile(file, "utf8"));
    const seenTitles = new Map();
    let previousDepth = 0;

    for (const heading of headings) {
      const relativeFile = path.relative(absoluteRoot, file).replaceAll(path.sep, "/");
      if (previousDepth > 0 && heading.depth > previousDepth + 1) {
        problems.push({
          file: relativeFile,
          line: heading.line,
          type: "skipped-level",
          message: `Heading jumps from H${previousDepth} to H${heading.depth}`
        });
      }

      const titleKey = heading.title.toLowerCase();
      if (seenTitles.has(titleKey)) {
        problems.push({
          file: relativeFile,
          line: heading.line,
          type: "duplicate-title",
          message: `Duplicate heading title also appears on line ${seenTitles.get(titleKey)}`
        });
      } else {
        seenTitles.set(titleKey, heading.line);
      }

      previousDepth = heading.depth;
    }
  }

  return {
    root: absoluteRoot,
    filesScanned: files.length,
    problems
  };
}

export function extractHeadings(text) {
  const headings = [];
  let inFence = false;

  for (const [index, rawLine] of text.split(/\r?\n/).entries()) {
    const line = rawLine.trimEnd();
    if (/^```|^~~~/.test(line.trimStart())) {
      inFence = !inFence;
      continue;
    }
    if (inFence) {
      continue;
    }

    const match = /^(#{1,6})\s+(.+?)\s*#*\s*$/.exec(line);
    if (match) {
      headings.push({
        depth: match[1].length,
        title: stripInlineMarkdown(match[2].trim()),
        line: index + 1
      });
    }
  }

  return headings;
}

async function findMarkdownFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      if (!IGNORED_DIRS.has(entry.name)) {
        files.push(...await findMarkdownFiles(fullPath));
      }
    } else if (entry.isFile() && /\.(md|markdown)$/i.test(entry.name)) {
      files.push(fullPath);
    }
  }

  return files;
}

function stripInlineMarkdown(text) {
  return text
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\[([^\]]+)]\([^)]+\)/g, "$1")
    .replace(/[*_~]/g, "");
}
