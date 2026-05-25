import assert from "node:assert/strict";
import test from "node:test";
import { profileJsonl } from "../src/index.js";

test("profiles JSONL objects and parse errors", () => {
  const profile = profileJsonl([
    "{\"id\":1,\"kind\":\"click\"}",
    "{\"id\":2,\"meta\":{\"ok\":true}}",
    "[1,2,3]",
    "not json"
  ].join("\n"));

  assert.equal(profile.lines, 4);
  assert.equal(profile.valid, 2);
  assert.equal(profile.invalid.length, 2);
  assert.deepEqual(profile.fields, [
    { name: "id", count: 2, coverage: 100, types: ["number"] },
    { name: "kind", count: 1, coverage: 50, types: ["string"] },
    { name: "meta", count: 1, coverage: 50, types: ["object"] }
  ]);
});
