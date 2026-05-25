#!/usr/bin/env node
import { checkMarkdownHeadings } from "../src/index.js";

function parseArgs(argv) {
  const options = { root: process.cwd(), json: false };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--root") {
      options.root = argv[index + 1];
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
  console.log(`markdown-heading-check

Usage:
  markdown-heading-check --root <directory> [--json]

Options:
  --root <directory> Directory to scan. Defaults to the current directory.
  --json             Print machine-readable JSON.
  -h, --help         Show help.`);
}

try {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    printHelp();
    process.exit(0);
  }

  const result = await checkMarkdownHeadings({ root: options.root });
  if (options.json) {
    console.log(JSON.stringify(result, null, 2));
  } else if (result.problems.length === 0) {
    console.log(`OK: scanned ${result.filesScanned} Markdown file(s), headings look consistent.`);
  } else {
    console.log(`Found ${result.problems.length} heading problem(s):`);
    for (const item of result.problems) {
      console.log(`${item.file}:${item.line} ${item.type}: ${item.message}`);
    }
  }

  process.exit(result.problems.length === 0 ? 0 : 1);
} catch (error) {
  console.error(error.message);
  process.exit(2);
}
