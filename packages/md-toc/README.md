# md-toc

Generate a compact Markdown table of contents from headings. It keeps only ATX headings (`# Heading`) and skips headings inside fenced code blocks.

## Usage

```bash
node packages/md-toc/bin/md-toc.js README.md
node packages/md-toc/bin/md-toc.js README.md --min-depth 2 --max-depth 3
```

## API

```js
import { generateMarkdownToc } from "md-toc";

const toc = generateMarkdownToc("# Title\n\n## Usage\n");
```
