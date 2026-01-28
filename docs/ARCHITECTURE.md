# 技术架构文档

本文档详细说明 Dev Tools Chrome Extension 的技术架构和实现细节。

## 目录

- [架构概览](#架构概览)
- [核心模块](#核心模块)
- [工具系统](#工具系统)
- [国际化系统](#国际化系统)
- [样式系统](#样式系统)
- [扩展生命周期](#扩展生命周期)

## 架构概览

项目采用分层模块化架构，主要分为以下几个层次：

```
┌─────────────────────────────────────┐
│         用户界面层 (UI Layer)        │
│  - index.html                       │
│  - CSS样式系统                       │
└─────────────────────────────────────┘
            ↓
┌─────────────────────────────────────┐
│      业务逻辑层 (Business Layer)      │
│  - ToolManager (工具管理)            │
│  - BaseTool (工具基类)               │
│  - 各工具实现类                       │
└─────────────────────────────────────┘
            ↓
┌─────────────────────────────────────┐
│      基础设施层 (Infrastructure)      │
│  - LanguageManager (国际化)          │
│  - i18n (文本资源)                   │
│  - Chrome Extension API              │
└─────────────────────────────────────┘
```

## 核心模块

### 1. ToolManager (工具管理器)

**文件**: `js/tools.js`

工具管理器从 **工具注册表**（`js/tool-registry.js`）读入工具列表，负责：

- **工具注册**: 在 `initializeTools()` 中遍历 `TOOL_REGISTRY`，对每项执行 `loader()` 得到实例并填入 `this.tools[id]`
- **侧栏菜单**: `renderToolMenu()` 根据 `TOOL_REGISTRY` 与 `CATEGORY_ORDER` 生成分组与菜单 DOM，挂载到 `#tool-menu-list`，文案取自 i18n 的 `categories` 与 `menuItems`
- **工具切换**: `switchTool(menuItem)` 根据 `data-tool-id` 更新激活状态并调用对应工具的 `show()` / `hide()`
- **事件绑定**: 在 `#tool-menu-list` 上做点击委托，由 `switchTool` 处理 `.menu-item` 点击

**设计模式**: 注册表模式（工具列表与加载方式来自 tool-registry）+ 默认导出单例

### 2. BaseTool (工具基类)

**文件**: `js/base-tool.js`

所有工具都继承自 `BaseTool`，它提供了：

- **统一的UI模板**: `createUI()` 方法生成标准化的工具界面
- **通用功能**: 复制、清空等按钮的通用实现
- **生命周期管理**: `show()` 和 `hide()` 方法管理工具显示状态

**UI模板结构**:

```html
<div class="tool-container">
  <h2>工具标题</h2>
  <p class="description">工具描述</p>
  <div class="controls">
    <!-- 自定义控制按钮 -->
  </div>
  <div class="input-output">
    <textarea id="input">输入区域</textarea>
    <textarea id="output" readonly>输出区域</textarea>
  </div>
</div>
```

**继承模式**:

```javascript
class CustomTool extends BaseTool {
  constructor() {
    super();  // 调用父类构造函数
  }

  show() {
    // 1. 渲染UI
    this.container.innerHTML = this.createUI();
    // 2. 设置通用事件监听器
    this.setupCommonEventListeners();
    // 3. 设置工具特定的事件监听器
    this.setupSpecificEventListeners();
  }

  setupSpecificEventListeners() {
    // 子类实现具体的交互逻辑
  }
}
```

### 3. LanguageManager (语言管理器)

**文件**: `js/language-manager.js`

语言管理器采用单例模式，负责：

- **语言切换**: 监听语言选择器变化，更新界面语言
- **文本获取**: 提供 `getText()` 和 `getToolText()` 方法获取本地化文本
- **UI更新**: 语言切换时自动更新所有界面文本

**关键方法**:

```javascript
class LanguageManager {
  getText(key, category = null) {
    // 支持多种调用方式:
    // 1. getText('appTitle')
    // 2. getText('process', 'buttons')
    // 3. getText('buttons.process')
  }

  getToolText(toolId, field) {
    // 获取工具特定的文本
    // 例如: getToolText('jsonformatter', 'title')
  }

  updateUI() {
    // 更新所有UI元素的文本内容
  }
}
```

**文本查找顺序**:

1. 从 `i18n[currentLanguage][category][key]` 获取
2. 如果不存在，返回 `key` 本身（防止显示空白）

### 4. i18n (国际化配置)

**文件**: `js/i18n.js`

国际化配置文件采用嵌套对象结构：

```javascript
const i18n = {
  zh: {
    appTitle: '开发者工具',
    menuItems: {
      'jsonformatter': 'JSON转换和格式化',
      // ...
    },
    tools: {
      'jsonformatter': {
        title: 'JSON转换和格式化',
        description: '格式化和验证JSON数据'
      }
    },
    buttons: {
      process: '转换',
      copy: '复制结果'
    }
  },
  en: {
    // 英文配置
  }
};
```

**文本分类**:

- `appTitle`, `appSubtitle`: 应用级文本
- `menuItems`: 侧边栏菜单项文本
- `tools`: 工具特定的文本（标题、描述、提示等）
- `buttons`: 通用按钮文本
- `messages`: 通用消息文本

## 工具系统

### 工具注册表

工具列表以 **工具注册表** 为唯一数据源，由 `js/tool-registry.js` 导出。侧栏菜单由 ToolManager 根据注册表与 i18n 动态生成，不再在 `index.html` 中手写菜单项。

- **TOOL_REGISTRY**：数组，每项含 `id`、`icon`（MDI 类名如 `mdi-code-json`）、`category`、`loader`（无参函数，返回工具实例）。
- **CATEGORY_ORDER**：分类展示顺序；侧栏按该顺序分组，分组标题来自 i18n 的 `categories`。

### 工具注册流程（新增工具时）

1. **定义工具类**: 在 `js/tools/` 目录下创建工具类文件（继承 BaseTool）。
2. **登记到注册表**: 在 `js/tool-registry.js` 中增加一条：`{ id, icon, category, loader: () => new XxxTool() }`，并在文件顶部添加对应 import。
3. **添加国际化**: 在 `js/i18n.js` 的 `menuItems` 与 `tools[id]` 中为 zh/en 各增加该工具的文案；若使用新分类，则在 `categories` 中补充。

**无需** 修改 `index.html`、也无需在 `js/tools.js` 中增加 import 或 `this.tools[id] = ...`；菜单与加载逻辑均从注册表读取。

### 工具实现示例

以下是一个完整的工具实现示例：

```javascript
import BaseTool from '../base-tool.js';
import languageManager from '../language-manager.js';

export class ExampleTool extends BaseTool {
  constructor() {
    super();
    // 设置默认值（可选）
    this.defaultValue = '示例文本';
  }

  show() {
    // 渲染UI
    this.container.innerHTML = this.createUI();
    
    // 设置默认值（可选）
    const input = document.getElementById('input');
    if (input) {
      input.value = this.defaultValue;
    }
    
    // 设置事件监听器
    this.setupCommonEventListeners();
    this.setupSpecificEventListeners();
  }

  // 覆盖 getControls() 方法可以自定义控制按钮
  getControls() {
    return `
      <button id="processBtn">处理</button>
      <button id="customBtn">自定义操作</button>
      <button id="copyBtn">复制</button>
      <button id="clearBtn">清空</button>
    `;
  }

  setupSpecificEventListeners() {
    const processBtn = document.getElementById('processBtn');
    const input = document.getElementById('input');
    const output = document.getElementById('output');

    if (processBtn) {
      processBtn.addEventListener('click', () => {
        try {
          const inputText = input.value.trim();
          if (!inputText) {
            output.value = languageManager.getText('inputRequired');
            return;
          }

          // 执行工具逻辑
          const result = this.process(inputText);
          output.value = result;
        } catch (error) {
          output.value = `错误: ${error.message}`;
        }
      });
    }
  }

  process(text) {
    // 工具核心处理逻辑
    return text.toUpperCase();
  }
}
```

### 工具类型分类

根据功能特点，工具可以分为以下几类：

1. **格式化工具**: JSON格式化、XML格式化
2. **转换工具**: 大小写转换、编码转换
3. **加密工具**: 文本加密/解密
4. **比较工具**: JSON差异、文本差异
5. **生成工具**: ASCII艺术、图标生成
6. **代码生成工具**: JSON转JavaBean

## 国际化系统

### 文本获取方式

**方式一: 直接获取**
```javascript
languageManager.getText('appTitle');  // '开发者工具'
```

**方式二: 分类获取**
```javascript
languageManager.getText('process', 'buttons');  // '转换'
```

**方式三: 点号分隔**
```javascript
languageManager.getText('buttons.process');  // '转换'
```

**方式四: 工具特定文本**
```javascript
languageManager.getToolText('jsonformatter', 'title');  // 'JSON转换和格式化'
```

### 添加新语言

1. 在 `js/i18n.js` 中添加新的语言配置对象:

```javascript
const i18n = {
  // ... 现有语言
  ja: {
    appTitle: '開発者ツール',
    // ... 完整的日文翻译
  }
};
```

2. 在 `js/language-manager.js` 中更新支持的语言列表:

```javascript
this.supportedLanguages = ['zh', 'en', 'ja'];
```

3. 在 `index.html` 中添加语言选择选项:

```html
<select id="language-select">
  <option value="zh">中文</option>
  <option value="en">English</option>
  <option value="ja">日本語</option>
</select>
```

## 样式系统

### CSS变量系统

项目使用CSS变量定义主题，便于主题切换：

```css
:root {
  --primary-color: #4CAF50;
  --primary-hover: #45a049;
  --text-color: #333;
  --border-color: #ddd;
  --bg-light: #f5f5f5;
  --secondary-color: #2196F3;
  --accent-color: #FFC107;
}
```

### 布局系统

- **顶部栏**: 固定定位，包含标题和语言选择器
- **侧边栏**: 固定定位，包含工具菜单
- **主内容区**: 动态内容区域，显示当前选中的工具界面

### 响应式设计

- 使用Flexbox布局实现响应式
- 侧边栏宽度固定为240px
- 主内容区自适应剩余空间

## 扩展生命周期

### 1. 扩展安装

用户通过Chrome扩展管理页面安装扩展后：
- Chrome读取 `manifest.json`
- 注册后台服务Worker (`background.js`)
- 加载扩展资源

### 2. 扩展启动

用户点击扩展图标后：
- `background.js` 监听到 `chrome.action.onClicked` 事件
- 创建新标签页，加载 `index.html`

### 3. 页面加载

`index.html` 加载时：
- 加载CSS样式
- 加载 `index.js` 模块
- 触发 `DOMContentLoaded` 事件

### 4. 工具初始化

`index.js` 执行时：
- 创建 `ToolManager` 实例
- `ToolManager` 初始化所有工具实例
- 绑定侧边栏菜单事件
- 显示默认工具（JSON格式化）

### 5. 工具切换

用户点击菜单项时：
- `ToolManager.switchTool()` 被调用
- 隐藏当前工具 (`currentTool.hide()`)
- 显示新工具 (`newTool.show()`)
- 更新菜单激活状态

### 6. 语言切换

用户切换语言时：
- `LanguageManager.setLanguage()` 被调用
- 更新 `currentLanguage` 属性
- 调用 `updateUI()` 更新所有文本
- 重新渲染当前工具以更新文本

## 最佳实践

### 1. 错误处理

所有工具都应该包含错误处理：

```javascript
try {
  const result = this.process(input.value);
  output.value = result;
} catch (error) {
  output.value = `错误: ${error.message}`;
}
```

### 2. 输入验证

在处理前验证输入：

```javascript
const inputText = input.value.trim();
if (!inputText) {
  output.value = languageManager.getText('inputRequired');
  return;
}
```

### 3. 使用国际化文本

所有用户可见的文本都应使用国际化：

```javascript
// ❌ 错误
output.value = '请输入内容';

// ✅ 正确
output.value = languageManager.getText('inputRequired');
```

### 4. 内存管理

工具切换时清理资源：

```javascript
hide() {
  // 清理事件监听器
  // 清空容器
  if (this.container) {
    this.container.innerHTML = '';
  }
}
```

## 调试指南

### 1. 控制台调试

打开工具页面后，按 `F12` 打开开发者工具：

```javascript
// 在控制台中可以访问全局对象
// 当前工具管理器实例存储在 window 上（如果需要）
```

### 2. 后台调试

在扩展程序页面点击"service worker"链接查看后台脚本日志。

### 3. 网络请求

如果工具需要网络请求，在Network标签页查看请求详情。

### 4. 性能分析

使用Performance标签页分析工具加载和切换的性能。

## 扩展性设计

### 1. 插件系统（未来）

可以通过插件系统允许第三方工具：

```javascript
// 未来可能的API
ToolManager.registerPlugin('custom-tool', CustomToolClass);
```

### 2. 主题系统（未来）

通过CSS变量系统可以轻松实现主题切换：

```javascript
document.documentElement.style.setProperty('--primary-color', '#newColor');
```

### 3. 工具配置（未来）

可以为工具添加配置选项：

```javascript
class ConfigurableTool extends BaseTool {
  constructor(config = {}) {
    super();
    this.config = { ...this.defaultConfig, ...config };
  }
}
```

---

**文档版本**: 1.0  
**最后更新**: 2024

