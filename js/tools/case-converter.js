import BaseTool from '../base-tool.js';
import languageManager from '../language-manager.js';

export class CaseConverter extends BaseTool {
  constructor() {
    super();
    this.defaultValue = 'hello world';
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
     <select id="caseType">
          <option value="upper">${languageManager.getToolText(this.toolId,'upperCase')}</option>
          <option value="lower">${languageManager.getToolText(this.toolId,'lowerCase')}</option>
          <option value="title">${languageManager.getToolText(this.toolId,'titleCase')}</option>
          <option value="sentence">${languageManager.getToolText(this.toolId,'sentenceCase')}</option>
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
    const caseType = document.getElementById('caseType');

    if (processBtn) {
      processBtn.addEventListener('click', () => {
        const inputText = input.value;
        if (!inputText) {
          output.value = languageManager.getText(this.toolId,'inputRequired');
          return;
        }

        switch (caseType.value) {
          case 'upper':
            output.value = inputText.toUpperCase();
            break;
          case 'lower':
            output.value = inputText.toLowerCase();
            break;
          case 'title':
            output.value = this.toTitleCase(inputText);
            break;
          case 'sentence':
            output.value = this.toSentenceCase(inputText);
            break;
        }
      });
    }

    // 调用父类的通用事件监听器设置
    this.setupCommonEventListeners();
  }

  toTitleCase(text) {
    return text.toLowerCase().split(' ').map(word => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    }).join(' ');
  }

  toSentenceCase(text) {
    return text.toLowerCase().replace(/(^|\. *)([a-z])/g, (match, separator, char) => {
      return separator + char.toUpperCase();
    });
  }
}