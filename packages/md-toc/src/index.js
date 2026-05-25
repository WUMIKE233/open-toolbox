import { readFile } from "node:fs/promises";

export async function generateMarkdownTocFile(filePath, options = {}) {
  return generateMarkdownToc(await readFile(filePath, "utf8"), options);
}

export function generateMarkdownToc(text, { minDepth = 2, maxDepth = 4 } = {}) {
  const headings = extractHeadings(text)
    .filter((heading) => heading.depth >= minDepth && heading.depth <= maxDepth);

  const usedSlugs = new Map();
  return headings.map((heading) => {
    const slug = createUniqueSlug(heading.title, usedSlugs);
    const indent = "  ".repeat(Math.max(0, heading.depth - minDepth));
    return `${indent}- [${heading.title}](#${slug})`;
  }).join("\n");
}

export function extractHeadings(text) {
  const headings = [];
  let inFence = false;

  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trimEnd();
    if (/^```|^~~~/.test(line.trimStart())) {
      inFence = !inFence;
      continue;
    }
    if (inFence) {
      continue;
    }

    const match = /^(#{1,6})\s+(.+?)\s*#*\s*$/.exec(line);
    if (match) {
      headings.push({
        depth: match[1].length,
        title: stripInlineMarkdown(match[2].trim())
      });
    }
  }

  return headings;
}

function stripInlineMarkdown(text) {
  return text
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\[([^\]]+)]\([^)]+\)/g, "$1")
    .replace(/[*_~]/g, "");
}

function createUniqueSlug(title, usedSlugs) {
  const baseSlug = slugify(title);
  const count = usedSlugs.get(baseSlug) ?? 0;
  usedSlugs.set(baseSlug, count + 1);
  return count === 0 ? baseSlug : `${baseSlug}-${count}`;
}

function slugify(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, "-");
}
