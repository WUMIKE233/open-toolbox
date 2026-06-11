import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const CJK_PATTERN = /[\u3400-\u9fff]/;
const ENGLISH_PATTERN = /\b[A-Za-z][A-Za-z0-9'-]{2,}\b/;

export async function checkReadmeLocale({
  root = process.cwd(),
  file,
  requireChinese = true,
  requireEnglish = true,
  minChineseChars = 1,
  minEnglishWords = 1
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
      chineseChars: 0,
      englishWords: 0,
      problems: ["README file not found"]
    };
  }

  const text = await readFile(readmePath, "utf8");
  const chineseChars = (text.match(new RegExp(CJK_PATTERN, "g")) ?? []).length;
  const englishWords = (text.match(new RegExp(ENGLISH_PATTERN, "g")) ?? []).length;
  const hasChinese = chineseChars > 0;
  const hasEnglish = englishWords > 0;
  const problems = [];

  if (requireChinese && !hasChinese) {
    problems.push("README does not contain Chinese text");
  } else if (requireChinese && chineseChars < minChineseChars) {
    problems.push(`README has ${chineseChars} Chinese character(s), below minimum ${minChineseChars}`);
  }
  if (requireEnglish && !hasEnglish) {
    problems.push("README does not contain English text");
  } else if (requireEnglish && englishWords < minEnglishWords) {
    problems.push(`README has ${englishWords} English word(s), below minimum ${minEnglishWords}`);
  }

  return {
    root: absoluteRoot,
    file: path.relative(absoluteRoot, readmePath).replaceAll(path.sep, "/"),
    ok: problems.length === 0,
    hasChinese,
    hasEnglish,
    chineseChars,
    englishWords,
    problems
  };
}

async function findReadme(root) {
  const entries = await readdir(root, { withFileTypes: true });
  const readme = entries.find((entry) => entry.isFile() && /^readme(\..+)?$/i.test(entry.name));
  return readme ? path.join(root, readme.name) : null;
}
