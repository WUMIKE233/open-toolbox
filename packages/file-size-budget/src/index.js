import { readdir, stat } from "node:fs/promises";
import path from "node:path";

const IGNORED_DIRS = new Set([".git", "node_modules", "coverage", "dist", "build"]);

export async function checkFileSizeBudget({
  root = process.cwd(),
  maxBytes,
  extensions
} = {}) {
  const budget = parseSize(maxBytes);
  const absoluteRoot = path.resolve(root);
  const normalizedExtensions = extensions ? normalizeExtensions(extensions) : null;
  const files = await findFiles(absoluteRoot, normalizedExtensions);
  const overBudget = [];

  for (const file of files) {
    const fileStat = await stat(file);
    if (fileStat.size > budget) {
      overBudget.push({
        file: path.relative(absoluteRoot, file).replaceAll(path.sep, "/"),
        bytes: fileStat.size,
        budgetBytes: budget
      });
    }
  }

  return {
    root: absoluteRoot,
    filesScanned: files.length,
    budgetBytes: budget,
    overBudget
  };
}

export function parseSize(value) {
  if (typeof value === "number" && Number.isFinite(value) && value >= 0) {
    return Math.floor(value);
  }
  if (typeof value !== "string") {
    throw new Error("A size budget is required.");
  }

  const match = /^(\d+(?:\.\d+)?)\s*(b|kb|mb)?$/i.exec(value.trim());
  if (!match) {
    throw new Error(`Invalid size budget: ${value}`);
  }

  const amount = Number(match[1]);
  const unit = (match[2] ?? "b").toLowerCase();
  const multiplier = unit === "mb" ? 1024 * 1024 : unit === "kb" ? 1024 : 1;
  return Math.floor(amount * multiplier);
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
    } else if (entry.isFile() && (!extensions || extensions.has(getExtension(entry.name)))) {
      files.push(fullPath);
    }
  }

  return files;
}

function getExtension(fileName) {
  return path.extname(fileName).slice(1).toLowerCase();
}
