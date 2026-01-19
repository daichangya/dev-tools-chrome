import BaseTool from '../base-tool.js';
import languageManager from '../language-manager.js';

export class TextToUnicode extends BaseTool {
  constructor() {
    super();
    this.defaultValue = languageManager.getToolText(this.toolId,'defaultText');
  }

  show() {
    this.container.innerHTML = this.createUI()
    const input = document.getElementById('input');
    if (input){
        input.value = this.defaultValue;
    }
    this.setupCommonEventListeners();
    this.setupSpecificEventListeners();
  }

  getControls() {
    return `
   <select id="convertType">
          <option value="toUnicode">${languageManager.getToolText(this.toolId,'toUnicode')}</option>
          <option value="toText">${languageManager.getToolText(this.toolId,'toText')}</option>
        </select>
        <select id="format">
          <option value="\\u">${languageManager.getToolText(this.toolId,'uFormat')}</option>
          <option value="U+">${languageManager.getToolText(this.toolId,'uplusFormat')}</option>
        </select>
        <button id="processBtn">${languageManager.getText('convert', 'buttons')}</button>
        <button id="copyBtn">${languageManager.getText('copy', 'buttons')}</button>
        <button id="clearBtn">${languageManager.getText('clear', 'buttons')}</button>
    `;
  }

  setupSpecificEventListeners() {
    const processBtn = document.getElementById('processBtn');
    const input = document.getElementById('input');
    const output = document.getElementById('output');
    const convertType = document.getElementById('convertType');
    const format = document.getElementById('format');

    if (processBtn) {
      processBtn.addEventListener('click', () => {
        const inputText = input.value.trim();
        if (!inputText) {
          output.value = languageManager.getToolText(this.toolId,'inputRequired');
          return;
        }

        try {
          if (convertType.value === 'toUnicode') {
            output.value = this.textToUnicode(inputText, format.value);
          } else {
            output.value = this.unicodeToText(inputText);
          }
        } catch (error) {
          output.value = `${languageManager.getText('convertError', 'messages')}: ${error.message}`;
        }
      });
    }

    // 调用父类的通用事件监听器设置
    this.setupCommonEventListeners();
  }

  textToUnicode(text, format) {
    return text.split('').map(char => {
      const hex = char.charCodeAt(0).toString(16).padStart(4, '0');
      return format === '\\u' ? `\\u${hex}` : `U+${hex}`;
    }).join(' ');
  }

  unicodeToText(unicode) {
    // 移除所有空格
    unicode = unicode.replace(/\s/g, '');
    
    // 处理三种格式的Unicode：\u格式、U+格式和HTML实体格式(&#x...;)
    const pattern = /(\\u[0-9a-fA-F]{4}|U\+[0-9a-fA-F]{4}|&#x[0-9a-fA-F]{4,6};)/g;
    return unicode.replace(pattern, match => {
      let hex;
      if (match.startsWith('\\u')) {
        hex = match.slice(2);
      } else if (match.startsWith('U+')) {
        hex = match.slice(2);
      } else if (match.startsWith('&#x')) {
        // 处理HTML实体格式，去掉&#x前缀和;后缀
        hex = match.slice(3, -1);
      }
      return String.fromCharCode(parseInt(hex, 16));
    });
  }
}