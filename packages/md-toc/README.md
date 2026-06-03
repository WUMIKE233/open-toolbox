# md-toc

## English

Generate a compact Markdown table of contents from headings. It keeps only ATX headings (`# Heading`) and skips headings inside fenced code blocks.

### Usage

```bash
node packages/md-toc/bin/md-toc.js README.md
node packages/md-toc/bin/md-toc.js README.md --min-depth 2 --max-depth 3
```

### API

```js
import { generateMarkdownToc } from "md-toc";

const toc = generateMarkdownToc("# Title\n\n## Usage\n");
```

## 中文

根据标题生成简洁的 Markdown 目录。它只处理 ATX 标题（`# Heading`），并跳过代码围栏中的标题。

### 用法

```bash
node packages/md-toc/bin/md-toc.js README.md
node packages/md-toc/bin/md-toc.js README.md --min-depth 2 --max-depth 3
```

### API

```js
import { generateMarkdownToc } from "md-toc";

const toc = generateMarkdownToc("# Title\n\n## Usage\n");
```
