import languageManager from './language-manager.js';

class BaseTool {
  constructor() {
    this.container = document.querySelector('.main-content');
    this.toolId = this.constructor.name.toLowerCase();
    this.title = this.getTitle();
    this.description = this.getDescription();
    this.defaultValue = languageManager.getText('defaultText', this.toolId);
  }

  show() {
    // 由子类实现
  }

  hide() {
    if (this.container) {
      this.container.innerHTML = '';
    }
  }

  createUI() {
    return `
      <div class="tool-container">
        <h2>${this.getTitle()}</h2>
        <p class="description">${this.getDescription()}</p>
        <div class="controls">
          ${this.getControls()}
        </div>
        <div class="input-output">
          <div class="input-group">
            <textarea id="input" placeholder="${languageManager.getText('inputRequired')}"></textarea>
          </div>
          <div class="output-group">
            <textarea id="output" readonly></textarea>
          </div>
        </div>
      </div>
    `;
  }

  getControls() {
    return `
      <button id="processBtn">${languageManager.getText('process', 'buttons')}</button>
      <button id="copyBtn">${languageManager.getText('copy', 'buttons')}</button>
      <button id="clearBtn">${languageManager.getText('clear', 'buttons')}</button>
    `;
  }

  setupCommonEventListeners() {
    const copyBtn = document.getElementById('copyBtn');
    const clearBtn = document.getElementById('clearBtn');
    const input = document.getElementById('input');
    const output = document.getElementById('output');

    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        if (output && output.value) {
          navigator.clipboard.writeText(output.value)
            .then(() => {
              const originalText = copyBtn.textContent;
              copyBtn.textContent = languageManager.getText('copySuccess', 'messages');
              setTimeout(() => {
                copyBtn.textContent = originalText;
              }, 2000);
            });
        }
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        if (input) input.value = '';
        if (output) output.value = '';
      });
    }
  }

  getTitle() {
    return languageManager.getToolText(this.toolId, 'title');
  }

  getDescription() {
    return languageManager.getToolText(this.toolId, 'description');
  }
}

export default BaseTool;