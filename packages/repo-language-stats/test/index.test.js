import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { collectRepoLanguageStats, languageFor } from "../src/index.js";

test("maps common file extensions to language names", () => {
  assert.equal(languageFor("index.js"), "JavaScript");
  assert.equal(languageFor("README.md"), "Markdown");
  assert.equal(languageFor("notes.txt"), "TXT");
});

test("collects repository language stats", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "language-stats-"));
  await mkdir(path.join(root, "src"));
  await writeFile(path.join(root, "README.md"), "# Title\n\nHello\n");
  await writeFile(path.join(root, "src", "index.js"), "console.log('hi');\n");
  await writeFile(path.join(root, "image.bin"), Buffer.from([0, 1, 2, 3]));

  const result = await collectRepoLanguageStats({ root });

  assert.equal(result.filesScanned, 3);
  assert.deepEqual(result.languages.map((item) => item.language).sort(), ["JavaScript", "Markdown"]);
  assert.equal(result.totalLines, 4);
});
