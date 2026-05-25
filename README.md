# Open Toolbox

[English](#english) | [中文](#中文)

## English

Open Toolbox is a small collection of dependency-free command line tools for maintainers, data tinkerers, and people who like their repositories tidy.

### Projects

| Project | Purpose |
| --- | --- |
| [`md-local-link-auditor`](packages/md-local-link-auditor) | Scan Markdown files and report broken local links. |
| [`jsonl-profile`](packages/jsonl-profile) | Profile JSON Lines files and summarize field coverage and types. |
| [`env-example-check`](packages/env-example-check) | Compare `.env.example` with a local `.env` file or process environment. |
| [`license-header-check`](packages/license-header-check) | Check source files for a required license header snippet. |
| [`md-toc`](packages/md-toc) | Generate a compact Markdown table of contents from headings. |
| [`package-scripts-list`](packages/package-scripts-list) | List `package.json` scripts across a repository. |
| [`repo-todo-scan`](packages/repo-todo-scan) | Scan repositories for TODO-style maintenance notes. |
| [`file-size-budget`](packages/file-size-budget) | Check repository files against simple size budgets. |

### Quick Start

```bash
npm test
```

Each package can also be used directly with Node:

```bash
node packages/md-local-link-auditor/bin/md-local-link-auditor.js --root .
node packages/jsonl-profile/bin/jsonl-profile.js ./data.jsonl
node packages/env-example-check/bin/env-example-check.js --example .env.example --env .env
node packages/license-header-check/bin/license-header-check.js --root . --text "SPDX-License-Identifier: MIT"
node packages/md-toc/bin/md-toc.js README.md
node packages/package-scripts-list/bin/package-scripts-list.js --root .
node packages/repo-todo-scan/bin/repo-todo-scan.js --root .
node packages/file-size-budget/bin/file-size-budget.js --root . --max 200kb --ext js,md,json
```

### Why These Tools

The projects are intentionally small, boring, and easy to maintain. They avoid runtime dependencies, have focused tests, and solve common open-source chores that otherwise become custom scripts in every repository.

### Development

```bash
npm test
```

The repository uses Node's built-in test runner. No install step is required for runtime dependencies.

### License

MIT

## 中文

Open Toolbox 是一组零运行时依赖的命令行小工具，面向开源维护者、数据处理爱好者，以及希望仓库保持整洁的人。

### 项目

| 项目 | 用途 |
| --- | --- |
| [`md-local-link-auditor`](packages/md-local-link-auditor) | 扫描 Markdown 文件并报告失效的本地链接。 |
| [`jsonl-profile`](packages/jsonl-profile) | 分析 JSON Lines 文件，汇总字段覆盖率与字段类型。 |
| [`env-example-check`](packages/env-example-check) | 对比 `.env.example` 与本地 `.env` 文件或当前进程环境变量。 |
| [`license-header-check`](packages/license-header-check) | 检查源码文件是否包含指定的许可证头片段。 |
| [`md-toc`](packages/md-toc) | 根据 Markdown 标题生成简洁的目录。 |
| [`package-scripts-list`](packages/package-scripts-list) | 汇总仓库内各个 `package.json` 的 scripts 命令。 |
| [`repo-todo-scan`](packages/repo-todo-scan) | 扫描仓库中的 TODO、FIXME 和可选 NOTE 维护事项。 |
| [`file-size-budget`](packages/file-size-budget) | 按简单大小预算检查仓库文件。 |

### 快速开始

```bash
npm test
```

每个包也可以直接通过 Node 运行：

```bash
node packages/md-local-link-auditor/bin/md-local-link-auditor.js --root .
node packages/jsonl-profile/bin/jsonl-profile.js ./data.jsonl
node packages/env-example-check/bin/env-example-check.js --example .env.example --env .env
node packages/license-header-check/bin/license-header-check.js --root . --text "SPDX-License-Identifier: MIT"
node packages/md-toc/bin/md-toc.js README.md
node packages/package-scripts-list/bin/package-scripts-list.js --root .
node packages/repo-todo-scan/bin/repo-todo-scan.js --root .
node packages/file-size-budget/bin/file-size-budget.js --root . --max 200kb --ext js,md,json
```

### 为什么做这些工具

这些项目刻意保持小巧、直接、易维护。它们避免运行时依赖，配有聚焦的测试，并解决开源仓库中常见却容易被重复写成临时脚本的维护任务。

### 开发

```bash
npm test
```

本仓库使用 Node 内置测试运行器。运行这些工具不需要安装额外的运行时依赖。

### 许可证

MIT
