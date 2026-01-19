import BaseTool from '../base-tool.js';
import languageManager from '../language-manager.js';

export class TextDiff extends BaseTool {
  constructor() {
    super();
  }

  show() {
    this.container.innerHTML = `
     <h2>${this.getTitle()}</h2>
     <p class="description">${this.getDescription()}</p>
      <div class="controls">
          <select id="compareType">
            <option value="character">${languageManager.getToolText(this.toolId,'character')}</option>
            <option value="word">${languageManager.getToolText(this.toolId,'word')}</option>
            <option value="line">${languageManager.getToolText(this.toolId,'line')}</option>
          </select>
          <button id="processBtn">${languageManager.getText('compare', 'buttons')}</button>
          <button id="copyBtn">${languageManager.getText('copy', 'buttons')}</button>
          <button id="clearBtn">${languageManager.getText('clear', 'buttons')}</button>
      </div>
      <div class="container" style="display: flex; flex-direction: column; gap: 20px;">
        <div style="display: flex; justify-content: space-between; gap: 20px;">
          <div class="input-container" style="width: 48%;">
            <h3>${languageManager.getToolText(this.toolId,'text1')}</h3>
            <textarea id="input" placeholder="${languageManager.getToolText(this.toolId,'text1Placeholder')}" style="width: 100%; height: 200px;"></textarea>
          </div>
          <div class="input-container" style="width: 48%;">
            <h3>${languageManager.getToolText(this.toolId,'text2')}</h3>
            <textarea id="input2" placeholder="${languageManager.getToolText(this.toolId,'text2Placeholder')}" style="width: 100%; height: 200px;"></textarea>
          </div>
        </div>
        <div class="output-container" style="width: 100%;">
          <h3>${languageManager.getToolText(this.toolId,'diffResult')}</h3>
          <div id="output" class="diff-output" style="height: 300px;"></div>
        </div>
      </div>
    `;
    this.setupCommonEventListeners();
    this.setupSpecificEventListeners();

    // 添加差异显示样式
    const style = document.createElement('style');
    style.textContent = `
      .diff-output {
        font-family: monospace;
        white-space: pre-wrap;
        padding: 10px;
        background: #f5f5f5;
        border: 1px solid #ddd;
        max-height: 400px;
        overflow-y: auto;
      }
      .diff-added {
        background-color: #e6ffe6;
        color: #006600;
      }
      .diff-removed {
        background-color: #ffe6e6;
        color: #cc0000;
      }
      .diff-unchanged {
        color: #666;
      }
    `;
    document.head.appendChild(style);
  }

  setupSpecificEventListeners() {
    const processBtn = document.getElementById('processBtn');
    const input = document.getElementById('input');
    const input2 = document.getElementById('input2');
    const output = document.getElementById('output');
    const compareType = document.getElementById('compareType');

    if (processBtn) {
      processBtn.addEventListener('click', () => {
        const text1 = input.value;
        const text2 = input2.value;

        if (!text1 || !text2) {
          output.innerHTML = languageManager.getToolText(this.toolId,'inputRequired');
          return;
        }

        const type = compareType.value;
        const diffs = this.compareTexts(text1, text2, type);
        output.innerHTML = this.formatDiffs(diffs);
      });
    }

    // 调用父类的通用事件监听器设置
    this.setupCommonEventListeners();
  }

  compareTexts(text1, text2, type) {
    let parts1, parts2;

    switch (type) {
      case 'character':
        parts1 = text1.split('');
        parts2 = text2.split('');
        break;
      case 'word':
        parts1 = text1.split(/\s+/);
        parts2 = text2.split(/\s+/);
        break;
      case 'line':
        parts1 = text1.split('\n');
        parts2 = text2.split('\n');
        break;
    }

    return this.findDiff(parts1, parts2);
  }

  findDiff(parts1, parts2) {
    const matrix = Array(parts2.length + 1).fill().map(() =>
      Array(parts1.length + 1).fill(0)
    );

    // 填充矩阵
    for (let i = 0; i <= parts2.length; i++) {
      for (let j = 0; j <= parts1.length; j++) {
        if (i === 0) {
          matrix[i][j] = j;
        } else if (j === 0) {
          matrix[i][j] = i;
        } else if (parts2[i - 1] === parts1[j - 1]) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j] + 1,    // 删除
            matrix[i][j - 1] + 1,    // 插入
            matrix[i - 1][j - 1] + 1  // 替换
          );
        }
      }
    }

    // 回溯找出差异
    const diffs = [];
    let i = parts2.length;
    let j = parts1.length;

    while (i > 0 || j > 0) {
      if (i > 0 && j > 0 && parts2[i - 1] === parts1[j - 1]) {
        diffs.unshift({
          type: 'unchanged',
          value: parts1[j - 1]
        });
        i--;
        j--;
      } else if (i > 0 && (j === 0 || matrix[i - 1][j] <= matrix[i][j - 1])) {
        diffs.unshift({
          type: 'added',
          value: parts2[i - 1]
        });
        i--;
      } else if (j > 0) {
        diffs.unshift({
          type: 'removed',
          value: parts1[j - 1]
        });
        j--;
      }
    }

    return diffs;
  }

  formatDiffs(diffs) {
    return diffs.map(diff => {
      let className = '';
      let prefix = '';

      switch (diff.type) {
        case 'added':
          className = 'diff-added';
          prefix = '+ ';
          break;
        case 'removed':
          className = 'diff-removed';
          prefix = '- ';
          break;
        case 'unchanged':
          className = 'diff-unchanged';
          prefix = '  ';
          break;
      }

      return `<span class="${className}">${prefix}${this.escapeHtml(diff.value)}</span>\n`;
    }).join('');
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}