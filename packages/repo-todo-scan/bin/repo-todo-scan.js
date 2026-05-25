#!/usr/bin/env node
import { scanTodos } from "../src/index.js";

function parseArgs(argv) {
  const options = {
    root: process.cwd(),
    extensions: undefined,
    includeNote: false,
    json: false
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--root") {
      options.root = argv[index + 1];
      index += 1;
    } else if (arg === "--ext") {
      options.extensions = argv[index + 1].split(",");
      index += 1;
    } else if (arg === "--include-note") {
      options.includeNote = true;
    } else if (arg === "--json") {
      options.json = true;
    } else if (arg === "--help" || arg === "-h") {
      options.help = true;
    } else {
      throw new Error(`Unknown option: ${arg}`);
    }
  }

  return options;
}

function printHelp() {
  console.log(`repo-todo-scan

Usage:
  repo-todo-scan --root <directory> [--ext js,ts,md] [--include-note] [--json]

Options:
  --root <directory> Directory to scan. Defaults to the current directory.
  --ext <list>       Comma-separated extensions to include.
  --include-note     Include NOTE entries alongside TODO and FIXME.
  --json             Print machine-readable JSON.
  -h, --help         Show help.`);
}

try {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    printHelp();
    process.exit(0);
  }

  const result = await scanTodos(options);
  if (options.json) {
    console.log(JSON.stringify(result, null, 2));
  } else if (result.items.length === 0) {
    console.log(`OK: scanned ${result.filesScanned} file(s), no TODO-style notes found.`);
  } else {
    for (const item of result.items) {
      const suffix = item.text ? ` ${item.text}` : "";
      console.log(`${item.file}:${item.line} ${item.tag}:${suffix}`);
    }
  }

  process.exit(result.items.length === 0 ? 0 : 1);
} catch (error) {
  console.error(error.message);
  process.exit(2);
}
