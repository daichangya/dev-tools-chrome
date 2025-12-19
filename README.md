# Dev Tools Chrome Extension

一个功能强大的Chrome浏览器扩展，为开发者和IT工作者提供集成化的开发工具套件。

## 📋 项目简介

本项目是一个基于 Chrome Extension Manifest V3 开发的开发者工具集合，提供14种常用的文本处理、格式化和转换工具。该扩展采用现代化的前端技术栈，支持中英文双语界面，具有良好的用户体验和可扩展的架构设计。

## 📚 文档导航

- **[README.md](./README.md)** - 项目概览和使用指南（当前文档）
- **[快速上手](./docs/QUICK_START.md)** - 5分钟快速开始和开发指南
- **[架构文档](./docs/ARCHITECTURE.md)** - 详细的技术架构和实现细节
- **[工具使用指南](./docs/TOOLS_GUIDE.md)** - 所有工具的详细使用说明

### 核心特性

- ✅ **14种实用工具** - 覆盖JSON/XML处理、加密解密、编码转换等多个场景
- ✅ **双语支持** - 内置中英文界面，支持实时切换
- ✅ **模块化架构** - 基于ES6模块化设计，易于扩展和维护
- ✅ **美观UI** - 采用Material Design图标和现代化CSS设计
- ✅ **即开即用** - 无需额外配置，安装即可使用

## 📦 项目结构

```
dev-tools-chrome/
├── manifest.json              # Chrome扩展配置文件
├── index.html                 # 主页面HTML
├── index.js                   # 主入口文件
├── background.js              # 后台服务Worker
├── css/                       # 样式文件目录
│   ├── styles.css            # 主样式文件
│   └── materialdesignicons.min.css  # 图标字体样式
├── fonts/                     # 字体文件目录
│   └── materialdesignicons-webfont.ttf
├── images/                    # 图标资源目录
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── js/                        # JavaScript源码目录
    ├── tools.js              # 工具管理器
    ├── base-tool.js          # 工具基类
    ├── i18n.js               # 国际化配置文件
    ├── language-manager.js   # 语言管理器
    └── tools/                 # 工具实现目录
        ├── json-formatter.js
        ├── xml-formatter.js
        ├── text-encrypt.js
        ├── base64-converter.js
        ├── base64-image-converter.js
        ├── case-converter.js
        ├── text-to-ascii.js
        ├── text-to-unicode.js
        ├── json-diff.js
        ├── string-reverse.js
        ├── text-diff.js
        ├── ascii-art.js
        ├── text-icon-generator.js
        └── json-to-javabean.js
```

## 🛠️ 功能列表

### 1. JSON转换和格式化 (JSON Formatter)
- JSON数据格式化和美化
- JSON验证和错误提示
- 支持压缩和展开显示

### 2. XML格式化 (XML Formatter)
- XML数据格式化
- XML结构验证

### 3. 加密/解密文本 (Text Encryption)
- 支持多种加密算法
- 凯撒密码加密/解密
- Base64编码/解码

### 4. Base64文件转换器 (Base64 Converter)
- 文本转Base64编码
- Base64编码转文本
- 支持文件上传和转换

### 5. Base64转图片 (Base64 Image Converter)
- Base64编码转图片预览
- 图片下载功能
- 支持多种图片格式

### 6. 大小写转换 (Case Converter)
- 转换为大写
- 转换为小写
- 首字母大写（标题格式）
- 句首大写（句子格式）

### 7. 文本到ASCII (Text to ASCII)
- 文本转ASCII码
- 文本转二进制
- ASCII码转文本

### 8. 文本到Unicode (Text to Unicode)
- 文本转Unicode编码
- 支持\u格式和U+格式
- Unicode编码转文本

### 9. JSON差异比较 (JSON Diff)
- 两个JSON对象对比
- 差异高亮显示
- 支持添加、删除、修改等操作识别

### 10. 字符串逆序 (String Reverse)
- 按字符反转
- 按单词反转
- 按句子反转

### 11. 文本比较 (Text Diff)
- 字符级别比较
- 单词级别比较
- 行级别比较
- 差异可视化

### 12. ASCII艺术字生成器 (ASCII Art Generator)
- 标准字体生成
- 方块字体生成
- 简单字体生成

### 13. 文字图标生成器 (Text Icon Generator)
- 自定义文字图标
- 多种样式（标准、圆角、描边）
- 颜色和大小自定义
- PNG格式导出

### 14. JSON转JavaBean (JSON to JavaBean)
- JSON对象转JavaBean类
- 自动生成getter/setter方法
- 支持嵌套对象处理

## 🏗️ 技术架构

### 技术栈

- **前端框架**: 原生JavaScript (ES6+)
- **模块化**: ES6 Modules
- **浏览器API**: Chrome Extension API (Manifest V3)
- **UI框架**: 原生HTML5 + CSS3
- **图标库**: Material Design Icons
- **国际化**: 自定义i18n实现

### 架构设计

#### 1. 模块化设计

项目采用ES6模块化设计，主要模块包括：

- **ToolManager** (`js/tools.js`): 工具管理器，负责工具的注册、切换和生命周期管理
- **BaseTool** (`js/base-tool.js`): 工具基类，提供统一的UI模板和通用功能
- **LanguageManager** (`js/language-manager.js`): 语言管理器，处理多语言切换
- **i18n** (`js/i18n.js`): 国际化配置文件，存储所有语言文本

#### 2. 工具开发模式

每个工具都继承自 `BaseTool` 基类，实现以下方法：

```javascript
export class CustomTool extends BaseTool {
  constructor() {
    super();
    // 初始化工具特定配置
  }

  show() {
    // 渲染工具UI
    this.container.innerHTML = this.createUI();
    this.setupEventListeners();
  }

  setupSpecificEventListeners() {
    // 设置工具特定的交互逻辑
  }
}
```

#### 3. 国际化机制

- 所有文本内容存储在 `i18n.js` 中
- 支持中英文双语
- 通过 `LanguageManager` 实现动态切换
- 工具文本通过 `languageManager.getText()` 方法获取

#### 4. 样式系统

- 使用CSS变量定义主题颜色
- 响应式布局设计
- Material Design风格的图标系统

## 📥 安装指南

### 方法一：从源码安装（开发模式）

1. **下载项目代码**
   ```bash
   git clone <repository-url>
   cd dev-tools-chrome
   ```

2. **打开Chrome扩展管理页面**
   - 在Chrome浏览器地址栏输入: `chrome://extensions/`
   - 或者通过菜单：`更多工具` → `扩展程序`

3. **开启开发者模式**
   - 在扩展程序页面右上角，开启"开发者模式"开关

4. **加载扩展**
   - 点击"加载已解压的扩展程序"按钮
   - 选择项目根目录（包含 `manifest.json` 的文件夹）
   - 点击"选择文件夹"

5. **完成安装**
   - 扩展安装成功后，会在Chrome工具栏显示扩展图标
   - 点击图标即可打开工具集

### 方法二：打包安装

1. 在扩展程序页面点击"打包扩展程序"
2. 选择项目根目录
3. 生成 `.crx` 文件
4. 通过拖拽方式安装生成的 `.crx` 文件

## 🚀 使用指南

### 基本操作

1. **打开工具**
   - 点击Chrome工具栏中的扩展图标
   - 或者通过扩展菜单打开

2. **选择工具**
   - 在左侧侧边栏点击需要的工具菜单项
   - 工具界面会在主内容区域显示

3. **使用工具**
   - 在输入框中输入或粘贴需要处理的内容
   - 根据需要调整工具选项（如果有）
   - 点击"转换"或相应的处理按钮
   - 结果会显示在输出框中

4. **复制结果**
   - 点击"复制结果"按钮
   - 或者手动选择输出框内容复制

5. **切换语言**
   - 在顶部右侧选择语言（中文/English）
   - 界面文本会实时切换

### 工具使用示例

#### JSON格式化示例

1. 选择"JSON转换和格式化"工具
2. 在输入框粘贴JSON字符串（压缩或未格式化的）
3. 点击"转换"按钮
4. 格式化后的JSON会显示在输出框
5. 点击"复制结果"复制到剪贴板

#### Base64编码示例

1. 选择"Base64 文件转换器"工具
2. 在输入框输入需要编码的文本
3. 点击"转换为Base64"按钮
4. 获取Base64编码结果
5. 如需解码，粘贴Base64编码后点击"Base64转文件"

## 🔧 开发指南

### 环境要求

- Chrome浏览器（支持Manifest V3）
- 文本编辑器或IDE（推荐VS Code）
- 基础JavaScript和HTML/CSS知识

### 添加新工具

1. **创建工具文件**
   在 `js/tools/` 目录下创建新工具文件，例如 `custom-tool.js`:

   ```javascript
   import BaseTool from '../base-tool.js';
   import languageManager from '../language-manager.js';

   export class CustomTool extends BaseTool {
     constructor() {
       super();
     }

     show() {
       this.container.innerHTML = this.createUI();
       this.setupCommonEventListeners();
       this.setupSpecificEventListeners();
     }

     setupSpecificEventListeners() {
       const processBtn = document.getElementById('processBtn');
       const input = document.getElementById('input');
       const output = document.getElementById('output');

       if (processBtn) {
         processBtn.addEventListener('click', () => {
           // 实现工具逻辑
           const inputText = input.value;
           output.value = this.process(inputText);
         });
       }
     }

     process(text) {
       // 工具核心处理逻辑
       return text;
     }
   }
   ```

2. **注册工具**
   在 `js/tools.js` 中导入并注册新工具:

   ```javascript
   import { CustomTool } from './tools/custom-tool.js';

   // 在 initializeTools() 方法中添加
   this.tools = {
     // ... 其他工具
     'customtool': new CustomTool()
   };
   ```

3. **添加菜单项**
   在 `index.html` 中添加菜单项:

   ```html
   <div class="menu-item" data-tool-id="customtool">
     <i class="mdi mdi-icon-name"></i>
     <span>自定义工具</span>
   </div>
   ```

4. **添加国际化文本**
   在 `js/i18n.js` 中添加工具相关文本:

   ```javascript
   zh: {
     menuItems: {
       'customtool': '自定义工具'
     },
     tools: {
       'customtool': {
         title: '自定义工具',
         description: '工具描述'
       }
     }
   }
   ```

### 调试技巧

1. **查看控制台日志**
   - 右键点击扩展图标 → "检查弹出内容"
   - 或者在工具页面按 `F12` 打开开发者工具

2. **检查后台服务**
   - 在扩展程序页面点击"service worker"链接
   - 查看后台脚本的日志和错误

3. **重新加载扩展**
   - 修改代码后，在扩展程序页面点击刷新图标
   - 重新打开工具页面测试

### 代码规范

- 使用ES6+语法
- 遵循模块化设计原则
- 工具类必须继承 `BaseTool`
- 使用 `languageManager` 获取国际化文本
- 保持代码注释清晰

## 📝 文件说明

### 核心文件

- **manifest.json**: Chrome扩展配置文件，定义扩展的基本信息、权限和资源
- **index.html**: 工具集主页面，包含侧边栏导航和主内容区域
- **index.js**: 入口文件，初始化工具管理器
- **background.js**: 后台服务Worker，处理扩展图标点击事件

### 工具管理

- **js/tools.js**: 工具管理器，负责工具的注册、切换和显示
- **js/base-tool.js**: 工具基类，提供统一的UI模板和通用功能接口

### 国际化

- **js/i18n.js**: 国际化文本配置，包含中英文所有文本内容
- **js/language-manager.js**: 语言管理器，处理语言切换和文本获取

### 样式资源

- **css/styles.css**: 主样式文件，定义UI样式和主题
- **css/materialdesignicons.min.css**: Material Design图标样式
- **fonts/**: 图标字体文件

## 🔒 权限说明

本扩展仅申请了必要的权限：

- **clipboardWrite**: 用于复制结果到剪贴板

扩展不收集用户数据，所有处理都在本地完成，不会上传任何信息到服务器。

## 🐛 已知问题

- 某些复杂JSON格式可能需要手动预处理
- 大文件处理可能影响性能（建议使用较小的文件）

## 🔮 未来计划

- [ ] 添加更多编码格式支持（URL编码、HTML实体等）
- [ ] 支持工具历史记录
- [ ] 添加主题切换功能
- [ ] 支持快捷键操作
- [ ] 添加更多JSON处理工具（JSONPath、JSON Schema验证等）
- [ ] 支持插件系统，允许第三方工具扩展

## 🤝 贡献指南

欢迎提交Issue和Pull Request来帮助改进这个项目！

### 贡献流程

1. Fork本项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启Pull Request

## 📄 许可证

本项目采用 MIT License 开源协议。

## 👨‍💻 作者

开发团队

## 🙏 致谢

- Material Design Icons - 提供图标库
- Chrome Extension API - 提供扩展开发框架

---

**版本**: 1.0.2  
**最后更新**: 2024

如有问题或建议，欢迎通过Issue反馈！
