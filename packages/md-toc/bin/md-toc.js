#!/usr/bin/env node
import { generateMarkdownTocFile } from "../src/index.js";

function parseArgs(argv) {
  const options = { minDepth: 2, maxDepth: 4 };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--min-depth") {
      options.minDepth = Number(argv[index + 1]);
      index += 1;
    } else if (arg === "--max-depth") {
      options.maxDepth = Number(argv[index + 1]);
      index += 1;
    } else if (arg === "--help" || arg === "-h") {
      options.help = true;
    } else if (!options.file) {
      options.file = arg;
    } else {
      throw new Error(`Unknown option: ${arg}`);
    }
  }

  return options;
}

function printHelp() {
  console.log(`md-toc

Usage:
  md-toc <file.md> [--min-depth 2] [--max-depth 4]

Options:
  --min-depth <number> Minimum heading depth. Defaults to 2.
  --max-depth <number> Maximum heading depth. Defaults to 4.
  -h, --help           Show help.`);
}

try {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    printHelp();
    process.exit(0);
  }
  if (!options.file) {
    throw new Error("Missing input Markdown file.");
  }

  const toc = await generateMarkdownTocFile(options.file, options);
  console.log(toc);
} catch (error) {
  console.error(error.message);
  process.exit(2);
}
