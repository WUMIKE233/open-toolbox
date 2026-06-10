import assert from "node:assert/strict";
import { mkdtemp, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { checkReadmeLocale } from "../src/index.js";

test("passes when README contains Chinese and English text", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "readme-locale-"));
  await writeFile(path.join(root, "README.md"), "# 工具箱\n\nEnglish quick start.\n", "utf8");

  const result = await checkReadmeLocale({ root });

  assert.equal(result.ok, true);
  assert.equal(result.hasChinese, true);
  assert.equal(result.hasEnglish, true);
  assert.deepEqual(result.problems, []);
});

test("reports missing Chinese text", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "readme-locale-"));
  await writeFile(path.join(root, "README.md"), "# Toolkit\n\nEnglish only.\n", "utf8");

  const result = await checkReadmeLocale({ root });

  assert.equal(result.ok, false);
  assert.deepEqual(result.problems, ["README does not contain Chinese text"]);
});

test("allows language requirements to be relaxed", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "readme-locale-"));
  await writeFile(path.join(root, "README.md"), "# Toolkit\n\nEnglish only.\n", "utf8");

  const result = await checkReadmeLocale({ root, requireChinese: false });

  assert.equal(result.ok, true);
});
