import assert from "node:assert/strict";
import test from "node:test";
import { compareEnvText, parseEnv } from "../src/index.js";

test("parses env-style key value lines", () => {
  const parsed = parseEnv([
    "# comment",
    "API_URL=https://example.com # docs",
    "export TOKEN=\"abc#123\"",
    "INVALID-KEY=value"
  ].join("\n"));

  assert.deepEqual([...parsed.entries()], [
    ["API_URL", "https://example.com"],
    ["TOKEN", "abc#123"]
  ]);
});

test("compares example and local env keys", () => {
  const result = compareEnvText("API_URL=\nTOKEN=\n", "API_URL=https://example.com\nDEBUG=1\n");

  assert.deepEqual(result.missing, ["TOKEN"]);
  assert.deepEqual(result.extra, ["DEBUG"]);
});
