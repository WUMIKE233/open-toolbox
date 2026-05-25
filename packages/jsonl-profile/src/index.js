import { readFile } from "node:fs/promises";
import path from "node:path";

export async function profileJsonlFile(filePath) {
  const content = await readFile(filePath, "utf8");
  return profileJsonl(content, { source: path.resolve(filePath) });
}

export function profileJsonl(content, { source = "<memory>" } = {}) {
  const fieldMap = new Map();
  const invalid = [];
  let lines = 0;
  let valid = 0;

  for (const [index, rawLine] of content.split(/\r?\n/).entries()) {
    if (rawLine.trim() === "") {
      continue;
    }

    lines += 1;
    try {
      const value = JSON.parse(rawLine);
      if (!isPlainObject(value)) {
        invalid.push({ line: index + 1, error: "Line is not a JSON object" });
        continue;
      }

      valid += 1;
      for (const [key, fieldValue] of Object.entries(value)) {
        const current = fieldMap.get(key) ?? { name: key, count: 0, types: new Set() };
        current.count += 1;
        current.types.add(getType(fieldValue));
        fieldMap.set(key, current);
      }
    } catch (error) {
      invalid.push({ line: index + 1, error: error.message });
    }
  }

  return {
    source,
    lines,
    valid,
    invalid,
    fields: [...fieldMap.values()]
      .map((field) => ({
        name: field.name,
        count: field.count,
        coverage: valid === 0 ? 0 : Number(((field.count / valid) * 100).toFixed(2)),
        types: [...field.types].sort()
      }))
      .sort((left, right) => right.count - left.count || left.name.localeCompare(right.name))
  };
}

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function getType(value) {
  if (value === null) {
    return "null";
  }
  if (Array.isArray(value)) {
    return "array";
  }
  return typeof value;
}
