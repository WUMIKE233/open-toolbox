import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const IGNORED_DIRS = new Set([".git", "node_modules", "coverage", "dist", "build"]);

export async function checkPackageNameScope({ root = process.cwd(), scope, prefix } = {}) {
  const absoluteRoot = path.resolve(root);
  const packageFiles = await findPackageJsonFiles(absoluteRoot);
  const packages = [];
  const problems = [];

  for (const file of packageFiles) {
    const manifest = JSON.parse(await readFile(file, "utf8"));
    const relativePath = path.relative(absoluteRoot, file).replaceAll(path.sep, "/");
    const item = {
      path: relativePath,
      name: typeof manifest.name === "string" ? manifest.name : null,
      private: Boolean(manifest.private)
    };

    packages.push(item);

    if (!item.name) {
      problems.push({
        path: relativePath,
        type: "missing-name",
        message: "package.json is missing a string name field"
      });
      continue;
    }

    if (!matchesExpectedName(item.name, { scope, prefix })) {
      problems.push({
        path: relativePath,
        name: item.name,
        type: "name-mismatch",
        message: `Package name does not match expected ${describeExpectation({ scope, prefix })}`
      });
    }
  }

  return {
    root: absoluteRoot,
    packages: packages.sort((left, right) => left.path.localeCompare(right.path)),
    problems
  };
}

export function matchesExpectedName(name, { scope, prefix } = {}) {
  const checks = [];
  if (scope) {
    checks.push(name.startsWith(`${scope}/`));
  }
  if (prefix) {
    checks.push(packageSegment(name).startsWith(prefix));
  }

  return checks.length === 0 || checks.some(Boolean);
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

function packageSegment(name) {
  return name.includes("/") ? name.split("/").at(-1) : name;
}

function describeExpectation({ scope, prefix }) {
  const parts = [];
  if (scope) {
    parts.push(`scope ${scope}`);
  }
  if (prefix) {
    parts.push(`prefix ${prefix}`);
  }
  return parts.join(" or ") || "rules";
}
