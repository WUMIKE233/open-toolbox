import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const IGNORED_DIRS = new Set([".git", "node_modules", "coverage", "dist", "build"]);
const DEFAULT_EXTENSIONS = [
  "js",
  "jsx",
  "ts",
  "tsx",
  "mjs",
  "cjs",
  "md",
  "mdx",
  "py",
  "go",
  "rs",
  "java",
  "cs",
  "css",
  "scss",
  "html"
];

export async function scanTodos({
  root = process.cwd(),
  extensions = DEFAULT_EXTENSIONS,
  includeNote = false
} = {}) {
  const absoluteRoot = path.resolve(root);
  const normalizedExtensions = normalizeExtensions(extensions);
  const files = await findFiles(absoluteRoot, normalizedExtensions);
  const tags = includeNote ? ["TODO", "FIXME", "NOTE"] : ["TODO", "FIXME"];
  const tagPattern = new RegExp(`^\\s*(?:(?://|#|<!--|/\\*|\\*|;|--)\\s*)?(${tags.join("|")})\\b\\s*:?\\s*(.*)`, "i");
  const items = [];

  for (const file of files) {
    const content = await readFile(file, "utf8");
    const lines = content.split(/\r?\n/);
    for (let index = 0; index < lines.length; index += 1) {
      const match = tagPattern.exec(lines[index]);
      if (match) {
        items.push({
          file: path.relative(absoluteRoot, file).replaceAll(path.sep, "/"),
          line: index + 1,
          tag: match[1].toUpperCase(),
          text: match[2].trim()
        });
      }
    }
  }

  return {
    root: absoluteRoot,
    filesScanned: files.length,
    itemCount: items.length,
    items
  };
}

function normalizeExtensions(extensions) {
  return new Set(
    extensions
      .map((extension) => extension.trim().replace(/^\./, "").toLowerCase())
      .filter(Boolean)
  );
}

async function findFiles(directory, extensions) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      if (!IGNORED_DIRS.has(entry.name)) {
        files.push(...await findFiles(fullPath, extensions));
      }
    } else if (entry.isFile() && extensions.has(getExtension(entry.name))) {
      files.push(fullPath);
    }
  }

  return files;
}

function getExtension(fileName) {
  return path.extname(fileName).slice(1).toLowerCase();
}
