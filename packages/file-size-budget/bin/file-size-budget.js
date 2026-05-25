#!/usr/bin/env node
import { checkFileSizeBudget } from "../src/index.js";

function parseArgs(argv) {
  const options = {
    root: process.cwd(),
    extensions: undefined,
    json: false
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--root") {
      options.root = argv[index + 1];
      index += 1;
    } else if (arg === "--max") {
      options.maxBytes = argv[index + 1];
      index += 1;
    } else if (arg === "--ext") {
      options.extensions = argv[index + 1].split(",");
      index += 1;
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
  console.log(`file-size-budget

Usage:
  file-size-budget --root <directory> --max <size> [--ext js,md,json] [--json]

Options:
  --root <directory> Directory to scan. Defaults to the current directory.
  --max <size>       Maximum file size, such as 500b, 200kb, or 1mb.
  --ext <list>       Comma-separated extensions to include.
  --json             Print machine-readable JSON.
  -h, --help         Show help.`);
}

try {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    printHelp();
    process.exit(0);
  }

  const result = await checkFileSizeBudget(options);
  if (options.json) {
    console.log(JSON.stringify(result, null, 2));
  } else if (result.overBudget.length === 0) {
    console.log(`OK: scanned ${result.filesScanned} file(s), all are within ${result.budgetBytes} bytes.`);
  } else {
    console.log(`Files over ${result.budgetBytes} bytes:`);
    for (const item of result.overBudget) {
      console.log(`${item.file} ${item.bytes} bytes`);
    }
  }

  process.exit(result.overBudget.length === 0 ? 0 : 1);
} catch (error) {
  console.error(error.message);
  process.exit(2);
}
