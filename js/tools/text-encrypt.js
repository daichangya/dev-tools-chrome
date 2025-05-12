import BaseTool from '../base-tool.js';
import languageManager from '../language-manager.js';

export class TextEncryption extends BaseTool {
  constructor() {
    super();
  }

  show() {
    this.container.innerHTML = this.createUI()
    this.setupCommonEventListeners();
    this.setupSpecificEventListeners();
  }

  getControls() {
    return `
        <select id="encryptMethod">
          <option value="base64">Base64</option>
          <option value="caesar">${languageManager.getToolText(this.toolId,'caesarCipher')}</option>
        </select>
        <select id="operation">
          <option value="encrypt">${languageManager.getToolText(this.toolId,'encrypt')}</option>
          <option value="decrypt">${languageManager.getToolText(this.toolId,'decrypt')}</option>
        </select>
        <input type="number" id="shift" value="3" min="1" max="25" style="display: none;" placeholder="${languageManager.getToolText(this.toolId,'shiftPlaceholder')}">
        <button id="processBtn">${languageManager.getText('process', 'buttons')}</button>
        <button id="copyBtn">${languageManager.getText('copy', 'buttons')}</button>
        <button id="clearBtn">${languageManager.getText('clear', 'buttons')}</button>
    `;
  }

  setupSpecificEventListeners() {
    const processBtn = document.getElementById('processBtn');
    const input = document.getElementById('input');
    const output = document.getElementById('output');
    const encryptMethod = document.getElementById('encryptMethod');
    const operation = document.getElementById('operation');
    const shift = document.getElementById('shift');

    // 显示/隐藏位移量输入框
    encryptMethod.addEventListener('change', () => {
      shift.style.display = encryptMethod.value === 'caesar' ? 'inline-block' : 'none';
    });

    if (processBtn) {
      processBtn.addEventListener('click', () => {
        const inputText = input.value;
        if (!inputText) {
          output.value = languageManager.getToolText(this.toolId,'inputRequired');
          return;
        }

        try {
          const method = encryptMethod.value;
          const isEncrypt = operation.value === 'encrypt';

          if (method === 'base64') {
            output.value = this.processBase64(inputText, isEncrypt);
          } else if (method === 'caesar') {
            const shiftValue = parseInt(shift.value) || 3;
            output.value = this.processCaesar(inputText, shiftValue, isEncrypt);
          }
        } catch (error) {
          output.value = `${languageManager.getText('processError', 'messages')}: ${error.message}`;
        }
      });
    }

    // 调用父类的通用事件监听器设置
    this.setupCommonEventListeners();
  }

  processBase64(text, isEncrypt) {
    if (isEncrypt) {
      return btoa(encodeURIComponent(text));
    } else {
      try {
        return decodeURIComponent(atob(text));
      } catch (e) {
        throw new Error(languageManager.getToolText(this.toolId,'invalidBase64'));
      }
    }
  }

  processCaesar(text, shift, isEncrypt) {
    if (!isEncrypt) {
      shift = 26 - shift; // 解密时反向移位
    }

    return text.split('').map(char => {
      const code = char.charCodeAt(0);
      if (code >= 65 && code <= 90) { // 大写字母
        return String.fromCharCode(((code - 65 + shift) % 26) + 65);
      } else if (code >= 97 && code <= 122) { // 小写字母
        return String.fromCharCode(((code - 97 + shift) % 26) + 97);
      }
      return char; // 非字母字符保持不变
    }).join('');
  }
}