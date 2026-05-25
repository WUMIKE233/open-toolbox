import assert from "node:assert/strict";
import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { auditMarkdownLinks } from "../src/index.js";

test("reports missing local markdown links", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "md-audit-"));
  await mkdir(path.join(root, "docs"));
  await writeFile(path.join(root, "README.md"), [
    "[good](docs/page.md)",
    "[remote](https://example.com)",
    "[anchor](#usage)",
    "[bad](docs/missing.md)"
  ].join("\n"));
  await writeFile(path.join(root, "docs", "page.md"), "# Page\n");

  const result = await auditMarkdownLinks({ root });

  assert.equal(result.filesScanned, 2);
  assert.equal(result.linksChecked, 2);
  assert.deepEqual(result.broken, [
    {
      file: "README.md",
      line: 4,
      target: "docs/missing.md"
    }
  ]);
});
