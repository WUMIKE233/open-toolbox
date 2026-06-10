import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const CJK_PATTERN = /[\u3400-\u9fff]/;
const ENGLISH_PATTERN = /\b[A-Za-z][A-Za-z0-9'-]{2,}\b/;

export async function checkReadmeLocale({
  root = process.cwd(),
  file,
  requireChinese = true,
  requireEnglish = true
} = {}) {
  const absoluteRoot = path.resolve(root);
  const readmePath = file ? path.resolve(absoluteRoot, file) : await findReadme(absoluteRoot);

  if (!readmePath) {
    return {
      root: absoluteRoot,
      file: null,
      ok: false,
      hasChinese: false,
      hasEnglish: false,
      problems: ["README file not found"]
    };
  }

  const text = await readFile(readmePath, "utf8");
  const hasChinese = CJK_PATTERN.test(text);
  const hasEnglish = ENGLISH_PATTERN.test(text);
  const problems = [];

  if (requireChinese && !hasChinese) {
    problems.push("README does not contain Chinese text");
  }
  if (requireEnglish && !hasEnglish) {
    problems.push("README does not contain English text");
  }

  return {
    root: absoluteRoot,
    file: path.relative(absoluteRoot, readmePath).replaceAll(path.sep, "/"),
    ok: problems.length === 0,
    hasChinese,
    hasEnglish,
    problems
  };
}

async function findReadme(root) {
  const entries = await readdir(root, { withFileTypes: true });
  const readme = entries.find((entry) => entry.isFile() && /^readme(\..+)?$/i.test(entry.name));
  return readme ? path.join(root, readme.name) : null;
}
