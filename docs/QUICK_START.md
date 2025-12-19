# 快速上手指南

本文档帮助开发者快速了解项目并开始使用或开发。

## 5分钟快速开始

### 安装扩展

1. 打开 Chrome 浏览器
2. 访问 `chrome://extensions/`
3. 开启"开发者模式"
4. 点击"加载已解压的扩展程序"
5. 选择项目根目录

### 使用工具

1. 点击工具栏中的扩展图标
2. 在左侧菜单选择工具
3. 输入内容并点击"转换"
4. 复制结果

## 开发环境设置

### 必需工具

- Chrome 浏览器（最新版本）
- 代码编辑器（推荐 VS Code）
- Git（可选）

### 推荐 VS Code 插件

- **ES6 Code Snippets**: JavaScript ES6 代码片段
- **HTML CSS Support**: HTML/CSS 支持
- **Chrome Extension Reloader**: 自动重载扩展
- **Live Server**: 本地服务器（用于测试）

### 项目结构速览

```
项目根目录/
├── manifest.json          # 扩展配置（必须）
├── index.html            # 主页面
├── index.js              # 入口文件
├── background.js         # 后台服务
└── js/
    ├── tools.js          # 工具管理器 ⭐
    ├── base-tool.js      # 工具基类 ⭐
    └── tools/            # 工具实现
```

## 开发工作流

### 1. 修改现有工具

1. 找到工具文件：`js/tools/[tool-name].js`
2. 修改处理逻辑
3. 在扩展程序页面点击"刷新"图标
4. 重新打开工具页面测试

### 2. 添加新工具

#### 步骤1: 创建工具文件

创建 `js/tools/my-tool.js`:

```javascript
import BaseTool from '../base-tool.js';

export class MyTool extends BaseTool {
  show() {
    this.container.innerHTML = this.createUI();
    this.setupCommonEventListeners();
    this.setupSpecificEventListeners();
  }

  setupSpecificEventListeners() {
    const processBtn = document.getElementById('processBtn');
    const input = document.getElementById('input');
    const output = document.getElementById('output');

    processBtn.addEventListener('click', () => {
      output.value = input.value.toUpperCase();
    });
  }
}
```

#### 步骤2: 注册工具

在 `js/tools.js` 中：

```javascript
import { MyTool } from './tools/my-tool.js';

// 在 initializeTools() 中添加
this.tools['mytool'] = new MyTool();
```

#### 步骤3: 添加菜单项

在 `index.html` 中添加：

```html
<div class="menu-item" data-tool-id="mytool">
  <i class="mdi mdi-icon-name"></i>
  <span>我的工具</span>
</div>
```

#### 步骤4: 添加国际化文本

在 `js/i18n.js` 中：

```javascript
zh: {
  menuItems: {
    'mytool': '我的工具'
  },
  tools: {
    'mytool': {
      title: '我的工具',
      description: '工具描述'
    }
  }
}
```

### 3. 调试技巧

**查看控制台**:
- 在工具页面按 `F12`
- 查看 Console 标签页的日志和错误

**重新加载扩展**:
- 修改代码后，在 `chrome://extensions/` 页面点击扩展的刷新图标
- 重新打开工具页面

**查看后台日志**:
- 在扩展程序页面点击"service worker"链接

## 常见问题

### Q: 工具不显示？

**A**: 检查以下几点：
1. 工具是否在 `tools.js` 中注册？
2. `data-tool-id` 是否与注册的键名一致？
3. 控制台是否有错误信息？

### Q: 文本显示为键名而不是翻译？

**A**: 检查：
1. 是否在 `i18n.js` 中添加了对应的文本？
2. `toolId` 是否正确？
3. 语言是否正确选择？

### Q: 如何自定义工具UI？

**A**: 覆盖 `createUI()` 方法：

```javascript
createUI() {
  return `
    <div class="tool-container">
      <h2>${this.getTitle()}</h2>
      <div class="custom-ui">
        <!-- 自定义UI -->
      </div>
    </div>
  `;
}
```

### Q: 如何添加新的按钮？

**A**: 覆盖 `getControls()` 方法：

```javascript
getControls() {
  return `
    ${super.getControls()}
    <button id="customBtn">自定义按钮</button>
  `;
}
```

## 代码示例

### 示例1: 简单文本处理工具

```javascript
import BaseTool from '../base-tool.js';

export class TextProcessor extends BaseTool {
  show() {
    this.container.innerHTML = this.createUI();
    this.setupCommonEventListeners();
    this.setupSpecificEventListeners();
  }

  setupSpecificEventListeners() {
    const processBtn = document.getElementById('processBtn');
    const input = document.getElementById('input');
    const output = document.getElementById('output');

    processBtn.addEventListener('click', () => {
      const text = input.value;
      // 移除所有空格
      output.value = text.replace(/\s/g, '');
    });
  }
}
```

### 示例2: 带选项的工具

```javascript
getControls() {
  return `
    <select id="mode">
      <option value="upper">大写</option>
      <option value="lower">小写</option>
    </select>
    <button id="processBtn">转换</button>
    <button id="copyBtn">复制</button>
    <button id="clearBtn">清空</button>
  `;
}

setupSpecificEventListeners() {
  const processBtn = document.getElementById('processBtn');
  const mode = document.getElementById('mode');
  const input = document.getElementById('input');
  const output = document.getElementById('output');

  processBtn.addEventListener('click', () => {
    const text = input.value;
    if (mode.value === 'upper') {
      output.value = text.toUpperCase();
    } else {
      output.value = text.toLowerCase();
    }
  });
}
```

### 示例3: 异步处理

```javascript
async processAsync(text) {
  // 模拟异步操作
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(text.toUpperCase());
    }, 1000);
  });
}

setupSpecificEventListeners() {
  const processBtn = document.getElementById('processBtn');
  const input = document.getElementById('input');
  const output = document.getElementById('output');

  processBtn.addEventListener('click', async () => {
    processBtn.disabled = true;
    processBtn.textContent = '处理中...';
    
    try {
      const result = await this.processAsync(input.value);
      output.value = result;
    } catch (error) {
      output.value = `错误: ${error.message}`;
    } finally {
      processBtn.disabled = false;
      processBtn.textContent = '转换';
    }
  });
}
```

## 开发检查清单

添加新工具时，确保：

- [ ] 创建了工具类文件
- [ ] 继承自 `BaseTool`
- [ ] 在 `tools.js` 中注册
- [ ] 在 `index.html` 中添加菜单项
- [ ] 在 `i18n.js` 中添加中英文文本
- [ ] 实现了 `show()` 方法
- [ ] 实现了 `setupSpecificEventListeners()` 方法
- [ ] 添加了错误处理
- [ ] 测试了基本功能
- [ ] 测试了语言切换

## 资源链接

- [Chrome Extension 官方文档](https://developer.chrome.com/docs/extensions/)
- [Manifest V3 迁移指南](https://developer.chrome.com/docs/extensions/mv3/intro/)
- [Material Design Icons](https://materialdesignicons.com/)

## 下一步

- 阅读 [ARCHITECTURE.md](./ARCHITECTURE.md) 了解详细架构
- 阅读 [README.md](../README.md) 了解项目概览
- 查看现有工具的实现作为参考

---

**提示**: 遇到问题时，可以先查看控制台错误信息，大多数问题都有明确的错误提示。

