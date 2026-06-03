import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const IGNORED_DIRS = new Set([".git", "node_modules", "coverage", "dist", "build"]);
const LANGUAGE_BY_EXTENSION = new Map([
  [".cjs", "JavaScript"],
  [".css", "CSS"],
  [".html", "HTML"],
  [".js", "JavaScript"],
  [".json", "JSON"],
  [".jsx", "JavaScript"],
  [".md", "Markdown"],
  [".mjs", "JavaScript"],
  [".ts", "TypeScript"],
  [".tsx", "TypeScript"],
  [".yaml", "YAML"],
  [".yml", "YAML"]
]);

export async function collectRepoLanguageStats({ root = process.cwd() } = {}) {
  const absoluteRoot = path.resolve(root);
  const files = await findFiles(absoluteRoot);
  const languages = new Map();
  let totalBytes = 0;
  let totalLines = 0;

  for (const file of files) {
    const buffer = await readFile(file);
    if (looksBinary(buffer)) {
      continue;
    }

    const bytes = buffer.byteLength;
    const text = buffer.toString("utf8");
    const lines = countLines(text);
    const language = languageFor(file);
    const current = languages.get(language) ?? { language, files: 0, bytes: 0, lines: 0 };
    current.files += 1;
    current.bytes += bytes;
    current.lines += lines;
    languages.set(language, current);
    totalBytes += bytes;
    totalLines += lines;
  }

  const summary = [...languages.values()].sort((left, right) => {
    if (right.bytes !== left.bytes) {
      return right.bytes - left.bytes;
    }
    return left.language.localeCompare(right.language);
  });

  return {
    root: absoluteRoot,
    filesScanned: files.length,
    totalBytes,
    totalLines,
    languages: summary
  };
}

export function languageFor(filePath) {
  const extension = path.extname(filePath).toLowerCase();
  return LANGUAGE_BY_EXTENSION.get(extension) ?? (extension ? extension.slice(1).toUpperCase() : "Other");
}

async function findFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      if (!IGNORED_DIRS.has(entry.name)) {
        files.push(...await findFiles(fullPath));
      }
    } else if (entry.isFile()) {
      files.push(fullPath);
    }
  }

  return files;
}

function looksBinary(buffer) {
  return buffer.subarray(0, 1024).includes(0);
}

function countLines(text) {
  if (text.length === 0) {
    return 0;
  }
  const newlineCount = text.match(/\n/g)?.length ?? 0;
  return text.endsWith("\n") ? newlineCount : newlineCount + 1;
}
