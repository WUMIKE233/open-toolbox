import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const IGNORED_DIRS = new Set([".git", "node_modules", "coverage", "dist", "build"]);

export async function listPackageScripts({ root = process.cwd() } = {}) {
  const absoluteRoot = path.resolve(root);
  const packageFiles = await findPackageJsonFiles(absoluteRoot);
  const packages = [];

  for (const file of packageFiles) {
    const parsed = JSON.parse(await readFile(file, "utf8"));
    packages.push({
      name: parsed.name ?? path.basename(path.dirname(file)),
      path: path.relative(absoluteRoot, file).replaceAll(path.sep, "/"),
      scripts: Object.fromEntries(Object.entries(parsed.scripts ?? {}).sort(([left], [right]) => left.localeCompare(right)))
    });
  }

  return packages.sort((left, right) => left.path.localeCompare(right.path));
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
