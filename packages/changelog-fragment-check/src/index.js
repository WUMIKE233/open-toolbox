import { access, readdir, readFile } from "node:fs/promises";
import path from "node:path";

const DEFAULT_CATEGORIES = ["added", "changed", "deprecated", "removed", "fixed", "security"];
const DEFAULT_EXTENSIONS = ["md", "markdown"];

export async function checkChangelogFragments({
  directory = ".changes",
  categories = DEFAULT_CATEGORIES,
  extensions = DEFAULT_EXTENSIONS
} = {}) {
  const absoluteDirectory = path.resolve(directory);
  const allowedCategories = new Set(categories.map((category) => category.toLowerCase()));
  const allowedExtensions = normalizeExtensions(extensions);
  const files = await findFragmentFiles(absoluteDirectory, allowedExtensions);
  const invalid = [];

  for (const file of files) {
    const content = await readFile(file, "utf8");
    const category = getFragmentCategory(content);
    if (!category || !allowedCategories.has(category.toLowerCase())) {
      invalid.push({
        file: path.relative(absoluteDirectory, file).replaceAll(path.sep, "/"),
        category
      });
    }
  }

  return {
    directory: absoluteDirectory,
    filesScanned: files.length,
    valid: files.length - invalid.length,
    invalid,
    allowedCategories: [...allowedCategories].sort()
  };
}

function getFragmentCategory(content) {
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (line === "") {
      continue;
    }

    const frontmatterMatch = /^category:\s*(.+)$/i.exec(line);
    if (frontmatterMatch) {
      return frontmatterMatch[1].trim();
    }

    const headingMatch = /^#{1,6}\s+(.+)$/.exec(line);
    if (headingMatch) {
      return headingMatch[1].trim().split(/\s+/)[0];
    }

    return line.split(/\s+/)[0].replace(/:$/, "");
  }

  return null;
}

async function findFragmentFiles(directory, extensions) {
  if (!(await exists(directory))) {
    return [];
  }

  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...await findFragmentFiles(fullPath, extensions));
    } else if (entry.isFile() && extensions.has(path.extname(entry.name).slice(1).toLowerCase())) {
      files.push(fullPath);
    }
  }

  return files;
}

async function exists(target) {
  try {
    await access(target);
    return true;
  } catch {
    return false;
  }
}

function normalizeExtensions(extensions) {
  return new Set(
    extensions
      .map((extension) => extension.trim().replace(/^\./, "").toLowerCase())
      .filter(Boolean)
  );
}
