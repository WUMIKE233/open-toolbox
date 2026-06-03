# license-header-check

## English

Check source files for a required license header snippet. It is useful for repositories that need every source file to include a copyright or SPDX header.

### Usage

```bash
node packages/license-header-check/bin/license-header-check.js --root . --header-file LICENSE_HEADER
node packages/license-header-check/bin/license-header-check.js --root packages --text "SPDX-License-Identifier: MIT" --ext js,ts
```

### API

```js
import { checkLicenseHeaders } from "license-header-check";

const result = await checkLicenseHeaders({
  root: ".",
  header: "SPDX-License-Identifier: MIT",
  extensions: ["js", "ts"]
});
```

## 中文

检查源代码文件是否包含指定的许可证头片段。它适合需要每个源文件都包含版权声明或 SPDX 头的仓库。

### 用法

```bash
node packages/license-header-check/bin/license-header-check.js --root . --header-file LICENSE_HEADER
node packages/license-header-check/bin/license-header-check.js --root packages --text "SPDX-License-Identifier: MIT" --ext js,ts
```

### API

```js
import { checkLicenseHeaders } from "license-header-check";

const result = await checkLicenseHeaders({
  root: ".",
  header: "SPDX-License-Identifier: MIT",
  extensions: ["js", "ts"]
});
```
