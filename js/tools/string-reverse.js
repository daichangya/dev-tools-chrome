import BaseTool from '../base-tool.js';
import languageManager from '../language-manager.js';

export class StringReverser extends BaseTool {
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
      <select id="reverseType">
            <option value="char">${languageManager.getToolText(this.toolId,'reverseByChar')}</option>
            <option value="word">${languageManager.getToolText(this.toolId,'reverseByWord')}</option>
            <option value="sentence">${languageManager.getToolText(this.toolId,'reverseBySentence')}</option>
        </select>
        <button id="processBtn">${languageManager.getText('process', 'buttons')}</button>
        <button id="copyBtn">${languageManager.getText('copy', 'buttons')}</button>
        <button id="clearBtn">${languageManager.getText('clear', 'buttons')}</button>
    `;
  }

  setupSpecificEventListeners() {
    const processBtn = document.getElementById('processBtn');
    const input = document.getElementById('input');
    const output = document.getElementById('output');
    const reverseType = document.getElementById('reverseType');

    if (processBtn) {
      processBtn.addEventListener('click', () => {
        const inputText = input.value;
        if (!inputText) {
          output.value = languageManager.getText('inputRequired', 'messages');
          return;
        }

        switch (reverseType.value) {
          case 'char':
            output.value = this.reverseByChar(inputText);
            break;
          case 'word':
            output.value = this.reverseByWord(inputText);
            break;
          case 'sentence':
            output.value = this.reverseBySentence(inputText);
            break;
        }
      });
    }

    // 调用父类的通用事件监听器设置
    this.setupCommonEventListeners();
  }

  reverseByChar(text) {
    return text.split('').reverse().join('');
  }

  reverseByWord(text) {
    return text.split(/\s+/).map(word => {
      return word.split('').reverse().join('');
    }).join(' ');
  }

  reverseBySentence(text) {
    return text.split(/([.!?]+)/).map((part, index) => {
      // 如果是标点符号，直接返回
      if (index % 2 === 1) return part;
      // 如果是句子，反转单词顺序
      return part.trim().split(/\s+/).reverse().join(' ');
    }).join('');
  }
}