import { access, readdir, readFile } from "node:fs/promises";
import path from "node:path";

const IGNORED_DIRS = new Set([".git", "node_modules", "coverage", "dist", "build"]);
const SIMPLE_FIELDS = ["main", "module", "types"];

export async function checkPackageEntrypoints({ root = process.cwd() } = {}) {
  const absoluteRoot = path.resolve(root);
  const packageFiles = await findPackageJsonFiles(absoluteRoot);
  const packages = [];
  let issueCount = 0;

  for (const file of packageFiles) {
    const manifest = JSON.parse(await readFile(file, "utf8"));
    const checks = await buildChecks({
      manifest,
      packageFile: file
    });

    issueCount += checks.filter((check) => !check.exists).length;
    packages.push({
      name: manifest.name ?? path.basename(path.dirname(file)),
      path: path.relative(absoluteRoot, file).replaceAll(path.sep, "/"),
      checks
    });
  }

  packages.sort((left, right) => left.path.localeCompare(right.path));

  return {
    root: absoluteRoot,
    packageCount: packageFiles.length,
    issueCount,
    packages
  };
}

async function buildChecks({ manifest, packageFile }) {
  const packageDir = path.dirname(packageFile);
  const targets = collectTargets(manifest);
  const checks = [];

  for (const target of targets) {
    const absoluteTarget = path.resolve(packageDir, target.target);
    checks.push({
      field: target.field,
      label: target.label,
      target: normalizeTarget(target.target),
      exists: await pathExists(absoluteTarget)
    });
  }

  return checks.sort((left, right) => left.label.localeCompare(right.label));
}

function collectTargets(manifest) {
  const targets = [];

  for (const field of SIMPLE_FIELDS) {
    if (typeof manifest[field] === "string" && manifest[field].trim()) {
      targets.push({
        field,
        label: field,
        target: manifest[field]
      });
    }
  }

  if (typeof manifest.bin === "string" && manifest.bin.trim()) {
    targets.push({
      field: "bin",
      label: "bin",
      target: manifest.bin
    });
  } else if (isPlainObject(manifest.bin)) {
    for (const key of Object.keys(manifest.bin).sort()) {
      const value = manifest.bin[key];
      if (typeof value === "string" && value.trim()) {
        targets.push({
          field: "bin",
          label: `bin.${key}`,
          target: value
        });
      }
    }
  }

  collectExportTargets(manifest.exports, "exports", targets);
  return targets;
}

function collectExportTargets(value, label, targets) {
  if (typeof value === "string") {
    if (isRelativeExportTarget(value)) {
      targets.push({
        field: "exports",
        label,
        target: value
      });
    }
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((item, index) => collectExportTargets(item, `${label}[${index}]`, targets));
    return;
  }

  if (isPlainObject(value)) {
    for (const key of Object.keys(value).sort()) {
      collectExportTargets(value[key], formatExportLabel(label, key), targets);
    }
  }
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

function isRelativeExportTarget(target) {
  return target.startsWith("./");
}

function normalizeTarget(target) {
  return target.replaceAll(path.sep, "/");
}

function formatExportLabel(label, key) {
  if (key === "." || key.startsWith("./")) {
    return `${label}[${JSON.stringify(key)}]`;
  }

  if (/^[A-Za-z_$][A-Za-z0-9_$]*$/u.test(key)) {
    return `${label}.${key}`;
  }

  return `${label}[${JSON.stringify(key)}]`;
}

function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

async function pathExists(targetPath) {
  try {
    await access(targetPath);
    return true;
  } catch {
    return false;
  }
}
