import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const IGNORED_DIRS = new Set([".git", "node_modules", "coverage", "dist", "build"]);

export async function summarizePackageLicenses({ root = process.cwd() } = {}) {
  const absoluteRoot = path.resolve(root);
  const packageFiles = await findPackageJsonFiles(absoluteRoot);
  const packages = [];
  const counts = new Map();
  const missing = [];

  for (const file of packageFiles) {
    const parsed = JSON.parse(await readFile(file, "utf8"));
    const license = typeof parsed.license === "string" && parsed.license.trim() !== ""
      ? parsed.license.trim()
      : null;
    const item = {
      name: parsed.name ?? path.basename(path.dirname(file)),
      path: path.relative(absoluteRoot, file).replaceAll(path.sep, "/"),
      license
    };

    packages.push(item);
    if (license) {
      counts.set(license, (counts.get(license) ?? 0) + 1);
    } else {
      missing.push(item.path);
    }
  }

  return {
    root: absoluteRoot,
    packages: packages.sort((left, right) => left.path.localeCompare(right.path)),
    counts: Object.fromEntries([...counts.entries()].sort(([left], [right]) => left.localeCompare(right))),
    missing
  };
}

async function findPackageJsonFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      if (!IGNORED_DIRS.has(entry.name)) {
        files.push(...await findPackageJsonFiles(fullPath));
      }
    } else if (entry.isFile() && entry.name === "package.json") {
      files.push(fullPath);
    }
  }

  return files;
}
