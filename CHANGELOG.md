# 更新日志 (Changelog)

本文档记录 Dev Tools Chrome Extension 的版本更新内容。

## [1.0.5] - 2025-01-28

### 变更说明

- **按钮样式修复（Copy / Clear 等次要按钮）**
  - 将「控件行内次要按钮」的 CSS 规则块从全局 `button` 规则之前移动到之后，确保在任何加载顺序下都能正确覆盖全局主按钮样式。
  - 在次要按钮选择器中补全遗漏的按钮 ID：`#selectFileBtn`（Base64 转换器）、`#copyImageBtn`、`#renderBtn`（Mermaid 查看器），使复制、清空、下载、选择文件、渲染、复制图片等按钮统一使用次要样式（浅底 + 描边）。
  - 在 [js/base-tool.js](js/base-tool.js) 及各工具的控件模板中，为所有非主操作按钮统一添加 `class="btn-secondary"`（如 copy、clear、download、decode、generate、selectFile、copyImage、render 等），主操作按钮（如 processBtn）保持无该 class，便于后续仅通过 class 维护样式。

### 涉及文件

- `css/styles.css`：次要按钮规则位置调整与 ID 补全。
- `js/base-tool.js`：copyBtn、clearBtn 添加 `btn-secondary`。
- `js/tools/*.js`：各工具中 copy、clear、download、decode、generate、selectFile、copyImage、render 等按钮添加 `btn-secondary`。

---

## [1.0.4] - 此前版本

（此前版本更新内容可在此补充或保留为空。）

---

格式说明：版本号遵循 [语义化版本](https://semver.org/lang/zh-CN/)，日期为发布或打包日期。
