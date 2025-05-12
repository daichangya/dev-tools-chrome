// 工具模块管理器
import languageManager from './language-manager.js';
import BaseTool from './base-tool.js';

// 引入所有工具类
import { JSONFormatter } from './tools/json-formatter.js';
import { XMLFormatter } from './tools/xml-formatter.js';
import { TextEncryption } from './tools/text-encrypt.js';
import { Base64Converter } from './tools/base64-converter.js';
import { CaseConverter } from './tools/case-converter.js';
import { TextToASCII } from './tools/text-to-ascii.js';
import { TextToUnicode } from './tools/text-to-unicode.js';
import { JSONDiff } from './tools/json-diff.js';
import { StringReverser } from './tools/string-reverse.js';
import { TextDiff } from './tools/text-diff.js';
import { ASCIIArtGenerator } from './tools/ascii-art.js';
import { TextIconGenerator } from './tools/text-icon-generator.js';
import { Base64ImageConverter } from './tools/base64-image-converter.js';
import { JsonToJavaBean } from './tools/json-to-javabean.js';

class ToolManager {
  constructor() {
    this.currentTool = null;
    this.tools = {};
    this.initializeTools();
    this.setupEventListeners();
    
    // 设置默认工具为JSONFormatter
    const defaultToolItem = document.querySelector('[data-tool-id="jsonformatter"]');
    if (defaultToolItem) {
      this.switchTool(defaultToolItem);
    }
  }

  // 初始化所有工具
  initializeTools() {
    this.tools = {
      'jsonformatter': new JSONFormatter(),
      'textencryption': new TextEncryption(),
      'base64converter': new Base64Converter(),
      'caseconverter': new CaseConverter(),
      'texttoascii': new TextToASCII(),
      'texttounicode': new TextToUnicode(),
      'jsondiff': new JSONDiff(),
      'stringreverser': new StringReverser(),
      'textdiff': new TextDiff(),
      'asciiartgenerator': new ASCIIArtGenerator(),
      'xmlformatter': new XMLFormatter(),
      'texticongenerator': new TextIconGenerator(),
      'base64imageconverter': new Base64ImageConverter(),
      'jsontojavabean': new JsonToJavaBean()
    };
  }

  // 设置事件监听器
  setupEventListeners() {
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
      item.addEventListener('click', () => {
        this.switchTool(item);
      });
    });
  }

  // 切换工具
  switchTool(menuItem) {
    // 移除所有active类
    document.querySelectorAll('.menu-item').forEach(item => {
      item.classList.remove('active');
    });

    // 添加active类到选中项
    menuItem.classList.add('active');

    // 获取工具ID
    const toolId = this.getToolId(menuItem);
    
    // 切换到相应的工具
    if (this.tools[toolId]) {
      if (this.currentTool) {
        this.currentTool.hide();
      }
      this.currentTool = this.tools[toolId];
      this.currentTool.show();
    }else{
      console.error(`Tool with ID ${toolId} not found.`);
    }
  }

  // 获取工具ID
  getToolId(menuItem) {
    return menuItem.getAttribute('data-tool-id') || '';
  }
}

// 导出工具管理器
export default ToolManager;