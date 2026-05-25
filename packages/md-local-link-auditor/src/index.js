import { access, readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";

const IGNORED_DIRS = new Set([".git", "node_modules", "coverage", "dist", "build"]);
const LINK_PATTERN = /!?\[[^\]]*]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;

export async function auditMarkdownLinks({ root = process.cwd() } = {}) {
  const absoluteRoot = path.resolve(root);
  const files = await findMarkdownFiles(absoluteRoot);
  const broken = [];
  let linksChecked = 0;

  for (const file of files) {
    const content = await readFile(file, "utf8");
    const lines = content.split(/\r?\n/);

    for (let lineIndex = 0; lineIndex < lines.length; lineIndex += 1) {
      const line = lines[lineIndex];
      for (const match of line.matchAll(LINK_PATTERN)) {
        const target = decodeTarget(match[1]);
        if (!shouldCheckTarget(target)) {
          continue;
        }

        linksChecked += 1;
        const withoutAnchor = target.split("#")[0];
        const resolved = path.resolve(path.dirname(file), withoutAnchor);
        if (!(await exists(resolved))) {
          broken.push({
            file: path.relative(absoluteRoot, file).replaceAll(path.sep, "/"),
            line: lineIndex + 1,
            target
          });
        }
      }
    }
  }

  return {
    root: absoluteRoot,
    filesScanned: files.length,
    linksChecked,
    broken
  };
}

async function findMarkdownFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (!IGNORED_DIRS.has(entry.name)) {
        files.push(...await findMarkdownFiles(path.join(directory, entry.name)));
      }
    } else if (entry.isFile() && /\.(md|markdown)$/i.test(entry.name)) {
      files.push(path.join(directory, entry.name));
    }
  }

  return files;
}

function decodeTarget(target) {
  try {
    return decodeURIComponent(target);
  } catch {
    return target;
  }
}

function shouldCheckTarget(target) {
  return target.length > 0
    && !target.startsWith("#")
    && !/^[a-z][a-z0-9+.-]*:/i.test(target);
}

async function exists(target) {
  try {
    await access(target);
    return true;
  } catch {
    return false;
  }
}
