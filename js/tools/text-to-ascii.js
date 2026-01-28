import BaseTool from '../base-tool.js';
import languageManager from '../language-manager.js';
import { createJsonEditor } from '../json-editor.js';

export class TextToASCII extends BaseTool {
  constructor() {
    super();
    this.inputEditor = null;
  }

  show() {
    this.container.innerHTML = this.createUI();
    const input = document.getElementById('input');
    if (input) {
      input.value = this.defaultValue || '';
      this.inputEditor = createJsonEditor(input, {
        mode: 'plain',
        placeholder: languageManager.getToolText(this.toolId, 'toAscii'),
        onInput: (e, value) => { input.value = value; }
      });
      this.inputEditor.setValue(this.defaultValue || '');
    }
    this.setupCommonEventListeners();
    this.setupSpecificEventListeners();
  }

  getControls() {
    return `
         <select id="convertType">
            <option value="ascii">${languageManager.getToolText(this.toolId,'toAscii')}</option>
            <option value="binary">${languageManager.getToolText(this.toolId,'toBinary')}</option>
            <option value="text">${languageManager.getToolText(this.toolId,'toText')}</option>
          </select>
          <button id="processBtn" class="btn-secondary">${languageManager.getText('convert', 'buttons')}</button>
          <button id="copyBtn" class="btn-secondary">${languageManager.getText('copy', 'buttons')}</button>
          <button id="clearBtn" class="btn-secondary">${languageManager.getText('clear', 'buttons')}</button>
    `;
  }


  setupSpecificEventListeners() {
    const processBtn = document.getElementById('processBtn');
    const input = document.getElementById('input');
    const output = document.getElementById('output');
    const convertType = document.getElementById('convertType');

    if (processBtn) {
      processBtn.addEventListener('click', () => {
        const inputText = (this.inputEditor ? this.inputEditor.getValue() : input.value).trim();
        if (!inputText) {
          output.value = languageManager.getToolText(this.toolId,'inputRequired');
          return;
        }

        try {
          switch (convertType.value) {
            case 'ascii':
              output.value = this.textToAscii(inputText);
              break;
            case 'binary':
              output.value = this.textToBinary(inputText);
              break;
            case 'text':
              output.value = this.asciiToText(inputText);
              break;
          }
        } catch (error) {
          output.value = `${languageManager.getText('convertError', 'messages')}: ${error.message}`;
        }
      });
    }

    const clearBtn = document.getElementById('clearBtn');
    if (clearBtn && this.inputEditor) {
      clearBtn.addEventListener('click', () => this.inputEditor.setValue(''));
    }
    this.setupCommonEventListeners();
  }

  textToAscii(text) {
    return text.split('').map(char => char.charCodeAt(0)).join(' ');
  }

  textToBinary(text) {
    return text.split('').map(char => {
      return char.charCodeAt(0).toString(2).padStart(8, '0');
    }).join(' ');
  }

  asciiToText(ascii) {
    return ascii.split(' ').map(code => {
      const num = parseInt(code);
      if (isNaN(num)) {
        throw new Error(languageManager.getToolText(this.toolId,'invalidAscii'));
      }
      return String.fromCharCode(num);
    }).join('');
  }
}