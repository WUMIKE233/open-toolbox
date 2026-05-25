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

### Quick Start

```bash
npm test
```

Each package can also be used directly with Node:

```bash
node packages/md-local-link-auditor/bin/md-local-link-auditor.js --root .
node packages/jsonl-profile/bin/jsonl-profile.js ./data.jsonl
node packages/env-example-check/bin/env-example-check.js --example .env.example --env .env
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

### 快速开始

```bash
npm test
```

每个包也可以直接通过 Node 运行：

```bash
node packages/md-local-link-auditor/bin/md-local-link-auditor.js --root .
node packages/jsonl-profile/bin/jsonl-profile.js ./data.jsonl
node packages/env-example-check/bin/env-example-check.js --example .env.example --env .env
```

### 为什么做这些工具

这些项目刻意保持小巧、直接、易维护。它们避免运行时依赖，配有聚焦的测试，并解决开源仓库中常见却容易被反复写成临时脚本的维护任务。

### 开发

```bash
npm test
```

本仓库使用 Node 内置测试运行器。运行这些工具不需要安装额外的运行时依赖。

### 许可证

MIT
