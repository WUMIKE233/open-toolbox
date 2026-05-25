import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const IGNORED_DIRS = new Set([".git", "node_modules", "coverage", "dist", "build"]);
const DEFAULT_EXTENSIONS = ["js", "jsx", "ts", "tsx", "mjs", "cjs"];

export async function checkLicenseHeaders({
  root = process.cwd(),
  header,
  extensions = DEFAULT_EXTENSIONS,
  maxLines = 8
} = {}) {
  if (!header || header.trim() === "") {
    throw new Error("A non-empty header snippet is required.");
  }

  const absoluteRoot = path.resolve(root);
  const normalizedExtensions = normalizeExtensions(extensions);
  const files = await findSourceFiles(absoluteRoot, normalizedExtensions);
  const missing = [];

  for (const file of files) {
    const content = await readFile(file, "utf8");
    const leadingText = content.split(/\r?\n/).slice(0, maxLines).join("\n");
    if (!leadingText.includes(header.trim())) {
      missing.push(path.relative(absoluteRoot, file).replaceAll(path.sep, "/"));
    }
  }

  return {
    root: absoluteRoot,
    filesScanned: files.length,
    missing,
    extensions: [...normalizedExtensions].sort()
  };
}

function normalizeExtensions(extensions) {
  return new Set(
    extensions
      .map((extension) => extension.trim().replace(/^\./, "").toLowerCase())
      .filter(Boolean)
  );
}

async function findSourceFiles(directory, extensions) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      if (!IGNORED_DIRS.has(entry.name)) {
        files.push(...await findSourceFiles(fullPath, extensions));
      }
    } else if (entry.isFile() && extensions.has(getExtension(entry.name))) {
      files.push(fullPath);
    }
  }

  return files;
}

function getExtension(fileName) {
  const extension = path.extname(fileName).slice(1).toLowerCase();
  return extension;
}
