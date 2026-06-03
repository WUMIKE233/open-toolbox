import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { extractExternalLinks, reportExternalMarkdownLinks } from "../src/index.js";

test("extracts external links outside fenced code blocks", () => {
  const links = extractExternalLinks([
    "# Links",
    "[OpenAI](https://openai.com/docs)",
    "<http://example.com/a>",
    "```",
    "[Ignored](https://ignored.example)",
    "```",
    "[Local](./README.md)"
  ].join("\n"));

  assert.deepEqual(links, [
    { line: 2, url: "https://openai.com/docs", host: "openai.com" },
    { line: 3, url: "http://example.com/a", host: "example.com" }
  ]);
});

test("reports links and host counts across markdown files", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "external-links-"));
  await mkdir(path.join(root, "docs"));
  await writeFile(path.join(root, "README.md"), "[A](https://example.com/a)\n");
  await writeFile(path.join(root, "docs", "guide.md"), "[B](https://example.com/b)\n[C](https://nodejs.org)\n");

  const result = await reportExternalMarkdownLinks({ root });

  assert.equal(result.filesScanned, 2);
  assert.equal(result.linksFound, 3);
  assert.deepEqual(result.hosts, {
    "example.com": 2,
    "nodejs.org": 1
  });
});
