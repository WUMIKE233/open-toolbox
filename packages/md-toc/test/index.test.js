import assert from "node:assert/strict";
import test from "node:test";
import { extractHeadings, generateMarkdownToc } from "../src/index.js";

test("generates a nested Markdown table of contents", () => {
  const toc = generateMarkdownToc([
    "# Title",
    "## Install",
    "### `CLI` Usage",
    "```",
    "## Ignored",
    "```",
    "## Install"
  ].join("\n"));

  assert.equal(toc, [
    "- [Install](#install)",
    "  - [CLI Usage](#cli-usage)",
    "- [Install](#install-1)"
  ].join("\n"));
});

test("extracts ATX headings outside fenced code blocks", () => {
  const headings = extractHeadings("## A\n~~~\n## B\n~~~\n### C\n");

  assert.deepEqual(headings, [
    { depth: 2, title: "A" },
    { depth: 3, title: "C" }
  ]);
});
