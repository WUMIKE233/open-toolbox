import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const IGNORED_DIRS = new Set([".git", "node_modules", "coverage", "dist", "build"]);
const MARKDOWN_LINK_PATTERN = /!?\[[^\]]*]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;
const AUTOLINK_PATTERN = /<https?:\/\/[^>\s]+>/gi;

export async function reportExternalMarkdownLinks({ root = process.cwd() } = {}) {
  const absoluteRoot = path.resolve(root);
  const files = await findMarkdownFiles(absoluteRoot);
  const links = [];
  const hostCounts = new Map();

  for (const file of files) {
    const content = await readFile(file, "utf8");
    const relativeFile = path.relative(absoluteRoot, file).replaceAll(path.sep, "/");

    for (const link of extractExternalLinks(content)) {
      const item = { file: relativeFile, ...link };
      links.push(item);
      hostCounts.set(link.host, (hostCounts.get(link.host) ?? 0) + 1);
    }
  }

  return {
    root: absoluteRoot,
    filesScanned: files.length,
    linksFound: links.length,
    hosts: Object.fromEntries([...hostCounts.entries()].sort(([left], [right]) => left.localeCompare(right))),
    links: links.sort((left, right) => left.file.localeCompare(right.file) || left.line - right.line)
  };
}

export function extractExternalLinks(text) {
  const links = [];
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

    const seenOnLine = new Set();
    collectMatches(line, MARKDOWN_LINK_PATTERN, 1, index + 1, links, seenOnLine);
    collectMatches(line, AUTOLINK_PATTERN, 0, index + 1, links, seenOnLine);
  }

  return links;
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

function collectMatches(line, pattern, targetIndex, lineNumber, links, seenOnLine) {
  pattern.lastIndex = 0;
  for (const match of line.matchAll(pattern)) {
    const value = cleanUrl(match[targetIndex]);
    const parsed = parseHttpUrl(value);
    if (parsed && !seenOnLine.has(parsed.href)) {
      seenOnLine.add(parsed.href);
      links.push({
        line: lineNumber,
        url: parsed.href,
        host: parsed.host
      });
    }
  }
}

function cleanUrl(value) {
  return value.trim().replace(/^<|>$/g, "");
}

function parseHttpUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:" ? url : null;
  } catch {
    return null;
  }
}
