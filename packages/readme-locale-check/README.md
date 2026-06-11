# readme-locale-check

[English](#english) | [中文](#中文)

## English

`readme-locale-check` verifies that a repository README contains both Chinese and English language signals. It is useful for bilingual project maintenance rules and lightweight release checks.

### Usage

```bash
node packages/readme-locale-check/bin/readme-locale-check.js --root .
node packages/readme-locale-check/bin/readme-locale-check.js --root . --json
node packages/readme-locale-check/bin/readme-locale-check.js --root . --min-chinese-chars 20 --min-english-words 20
```

Options:

- `--root <directory>`: directory that contains the README.
- `--file <path>`: README path relative to `--root`.
- `--no-chinese`: do not require Chinese text.
- `--no-english`: do not require English text.
- `--min-chinese-chars <n>`: require at least `n` Chinese characters when Chinese is required.
- `--min-english-words <n>`: require at least `n` English words when English is required.
- `--json`: print machine-readable JSON.

## 中文

`readme-locale-check` 用于检查仓库 README 是否同时包含中文和英文信号。它适合放进双语 README 维护规则、发布前检查或仓库巡检脚本中。

### 使用方式

```bash
node packages/readme-locale-check/bin/readme-locale-check.js --root .
node packages/readme-locale-check/bin/readme-locale-check.js --root . --json
node packages/readme-locale-check/bin/readme-locale-check.js --root . --min-chinese-chars 20 --min-english-words 20
```

参数说明：

- `--root <directory>`：包含 README 的目录。
- `--file <path>`：相对 `--root` 的 README 路径。
- `--no-chinese`：不强制要求中文。
- `--no-english`：不强制要求英文。
- `--min-chinese-chars <n>`：要求至少包含 `n` 个中文字符。
- `--min-english-words <n>`：要求至少包含 `n` 个英文词。
- `--json`：输出机器可读 JSON。
