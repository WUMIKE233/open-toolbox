export function compareEnvText(exampleText, envText) {
  return compareEnvMaps(parseEnv(exampleText), parseEnv(envText));
}

export function compareEnvObjects(exampleText, envObject) {
  return compareEnvMaps(parseEnv(exampleText), new Map(Object.entries(envObject)));
}

export function parseEnv(text) {
  const entries = new Map();

  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (line === "" || line.startsWith("#")) {
      continue;
    }

    const withoutExport = line.startsWith("export ") ? line.slice(7).trimStart() : line;
    const separatorIndex = withoutExport.indexOf("=");
    if (separatorIndex === -1) {
      continue;
    }

    const key = withoutExport.slice(0, separatorIndex).trim();
    const value = stripInlineComment(withoutExport.slice(separatorIndex + 1).trim());
    if (/^[A-Za-z_][A-Za-z0-9_]*$/.test(key)) {
      entries.set(key, unquote(value));
    }
  }

  return entries;
}

function compareEnvMaps(exampleMap, envMap) {
  const exampleKeys = [...exampleMap.keys()].sort();
  const envKeys = [...envMap.keys()].sort();

  return {
    expected: exampleKeys,
    present: envKeys,
    missing: exampleKeys.filter((key) => !envMap.has(key)),
    extra: envKeys.filter((key) => !exampleMap.has(key))
  };
}

function stripInlineComment(value) {
  if (value.startsWith("\"") || value.startsWith("'")) {
    return value;
  }
  return value.replace(/\s+#.*$/, "");
}

function unquote(value) {
  if ((value.startsWith("\"") && value.endsWith("\"")) || (value.startsWith("'") && value.endsWith("'"))) {
    return value.slice(1, -1);
  }
  return value;
}
