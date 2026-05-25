import assert from "node:assert/strict";
import { mkdtemp, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { checkMarkdownHeadings, extractHeadings } from "../src/index.js";

test("checks skipped heading levels and duplicate titles", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "heading-check-"));
  await writeFile(path.join(root, "README.md"), [
    "# Title",
    "### Jump",
    "## Usage",
    "## Usage",
    "```",
    "### Ignored",
    "```"
  ].join("\n"));

  const result = await checkMarkdownHeadings({ root });

  assert.equal(result.filesScanned, 1);
  assert.deepEqual(result.problems.map((problem) => problem.type), [
    "skipped-level",
    "duplicate-title"
  ]);
});

test("extracts headings outside fenced code blocks", () => {
  const headings = extractHeadings("# A\n```\n## B\n```\n## C\n");

  assert.deepEqual(headings, [
    { depth: 1, title: "A", line: 1 },
    { depth: 2, title: "C", line: 5 }
  ]);
});
