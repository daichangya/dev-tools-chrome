import BaseTool from '../base-tool.js';
import languageManager from '../language-manager.js';

export class Base64Converter extends BaseTool {
  constructor() {
    super();
  }

  show() {
    this.container.innerHTML = this.createUI()
    const input = document.getElementById('input');
    if (input) {
      input.value = this.defaultValue;
    }
    this.setupCommonEventListeners();
    this.setupSpecificEventListeners();
  }

  getControls() {
    return `
     <input type="file" id="fileInput" style="display: none;">
          <button id="selectFileBtn">${languageManager.getToolText(this.toolId,'selectFile')}</button>
          <button id="processBtn">${languageManager.getToolText(this.toolId,'encode')}</button>
          <button id="decodeBtn">${languageManager.getToolText(this.toolId,'decode')}</button>
    `;
  }

  setupSpecificEventListeners() {
    const fileInput = document.getElementById('fileInput');
    const selectFileBtn = document.getElementById('selectFileBtn');
    const processBtn = document.getElementById('processBtn');
    const decodeBtn = document.getElementById('decodeBtn');
    const input = document.getElementById('input');
    const output = document.getElementById('output');

    selectFileBtn.addEventListener('click', () => {
      fileInput.click();
    });

    fileInput.addEventListener('change', (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const base64String = e.target.result;
          input.value = base64String;
        };
        reader.readAsDataURL(file);
      }
    });

    processBtn.addEventListener('click', () => {
      const inputText = input.value.trim();
      if (!inputText) {
        output.value = languageManager.getToolText(this.toolId,'inputRequired', this.toolId);
        return;
      }

      try {
        // 如果输入的不是Base64，则进行编码
        if (!this.isBase64(inputText)) {
          output.value = btoa(encodeURIComponent(inputText));
        } else {
          output.value = inputText; // 已经是Base64格式
        }
      } catch (error) {
        output.value = `转换错误：${error.message}`;
      }
    });

    decodeBtn.addEventListener('click', () => {
      const inputText = input.value.trim();
      if (!inputText) {
        output.value = languageManager.getToolText(this.toolId,'inputBase64Required', this.toolId);
        return;
      }

      try {
        if (this.isBase64(inputText)) {
          // 尝试解码Base64
          const decoded = decodeURIComponent(atob(inputText.replace(/^data:.*?;base64,/, '')));
          output.value = decoded;
        } else {
          output.value = languageManager.getToolText(this.toolId,'invalidBase64', this.toolId);
        }
      } catch (error) {
        output.value = `解码错误：${error.message}`;
      }
    });

    // 调用父类的通用事件监听器设置
    this.setupCommonEventListeners();
  }

  isBase64(str) {
    try {
      // 检查是否是data URL
      if (str.startsWith('data:')) {
        return true;
      }
      // 检查是否是标准Base64格式
      return btoa(atob(str)) === str;
    } catch (e) {
      return false;
    }
  }
}