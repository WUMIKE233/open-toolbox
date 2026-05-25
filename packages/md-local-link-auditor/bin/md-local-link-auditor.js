#!/usr/bin/env node
import { auditMarkdownLinks } from "../src/index.js";

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
  console.log(`md-local-link-auditor

Usage:
  md-local-link-auditor --root <directory> [--json]

Options:
  --root <directory>  Directory to scan. Defaults to the current directory.
  --json              Print machine-readable JSON.
  -h, --help          Show help.`);
}

try {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    printHelp();
    process.exit(0);
  }

  const result = await auditMarkdownLinks({ root: options.root });
  if (options.json) {
    console.log(JSON.stringify(result, null, 2));
  } else if (result.broken.length === 0) {
    console.log(`OK: scanned ${result.filesScanned} Markdown file(s), no broken local links.`);
  } else {
    console.log(`Found ${result.broken.length} broken local link(s):`);
    for (const item of result.broken) {
      console.log(`${item.file}:${item.line} ${item.target}`);
    }
  }

  process.exit(result.broken.length === 0 ? 0 : 1);
} catch (error) {
  console.error(error.message);
  process.exit(2);
}
