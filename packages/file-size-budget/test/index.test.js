import assert from "node:assert/strict";
import { mkdtemp, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { checkFileSizeBudget, parseSize } from "../src/index.js";

test("parses byte, kb, and mb budgets", () => {
  assert.equal(parseSize("10"), 10);
  assert.equal(parseSize("2kb"), 2048);
  assert.equal(parseSize("1.5mb"), 1572864);
});

test("reports files over budget", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "file-size-budget-"));
  await writeFile(path.join(root, "small.js"), "ok");
  await writeFile(path.join(root, "large.js"), "x".repeat(12));
  await writeFile(path.join(root, "large.md"), "x".repeat(12));

  const result = await checkFileSizeBudget({
    root,
    maxBytes: "10b",
    extensions: ["js"]
  });

  assert.equal(result.filesScanned, 2);
  assert.deepEqual(result.overBudget, [
    { file: "large.js", bytes: 12, budgetBytes: 10 }
  ]);
});
