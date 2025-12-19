/**
 * Text Diff工具类
 * 使用jsdiff库进行文本差异比较
 * @author daichangya
 */
import BaseTool from '../base-tool.js';
import languageManager from '../language-manager.js';

export class TextDiff extends BaseTool {
  constructor() {
    super();
  }

  show() {
    this.container.innerHTML = `
      <h2>${this.title}</h2>
      <p>${this.description}</p>
      <div class="controls">
          <select id="compareType">
            <option value="character">${languageManager.getToolText(this.toolId,'character')}</option>
            <option value="word">${languageManager.getToolText(this.toolId,'word')}</option>
            <option value="line">${languageManager.getToolText(this.toolId,'line')}</option>
          </select>
          <button id="processBtn">${languageManager.getText('compare', 'buttons')}</button>
          <button id="copyBtn">${languageManager.getText('copy', 'buttons')}</button>
          <button id="clearBtn">${languageManager.getText('clear', 'buttons')}</button>
          <a href="https://jsdiff.com/" target="_blank" style="margin-left: 10px; color: #0066cc; text-decoration: none;">
            🌐 ${languageManager.getToolText(this.toolId, 'openInWebsite') || '在 jsdiff.com 中打开'}
          </a>
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
    this.addStyles();
  }

  addStyles() {
    if (document.getElementById('text-diff-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'text-diff-styles';
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
      .diff-output ins {
        background-color: #e6ffe6;
        color: #006600;
        text-decoration: none;
      }
      .diff-output del {
        background-color: #ffe6e6;
        color: #cc0000;
        text-decoration: none;
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
        this.performDiff();
      });
    }

    // 输入变化时自动比较
    if (input && input2 && compareType) {
      const performDiff = () => {
        if (input.value.trim() && input2.value.trim()) {
          this.performDiff();
        }
      };
      
      input.addEventListener('input', performDiff);
      input2.addEventListener('input', performDiff);
      compareType.addEventListener('change', performDiff);
    }

    // 设置copy按钮（输出是div，需要特殊处理）
    const copyBtn = document.getElementById('copyBtn');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        const output = document.getElementById('output');
        if (output && output.textContent) {
          navigator.clipboard.writeText(output.textContent)
            .then(() => {
              const originalText = copyBtn.textContent;
              copyBtn.textContent = languageManager.getText('copySuccess', 'messages');
              setTimeout(() => {
                copyBtn.textContent = originalText;
              }, 2000);
            })
            .catch(err => {
              console.error('复制失败:', err);
            });
        }
      });
    }

    // 设置clear按钮
    const clearBtn = document.getElementById('clearBtn');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        const input = document.getElementById('input');
        const input2 = document.getElementById('input2');
        const output = document.getElementById('output');
        if (input) input.value = '';
        if (input2) input2.value = '';
        if (output) output.innerHTML = '';
      });
    }
  }

  performDiff() {
    const input = document.getElementById('input');
    const input2 = document.getElementById('input2');
    const output = document.getElementById('output');
    const compareType = document.getElementById('compareType');

    if (!input || !input2 || !output || !compareType) return;

    const text1 = input.value;
    const text2 = input2.value;

    if (!text1 || !text2) {
      output.innerHTML = languageManager.getToolText(this.toolId,'inputRequired');
      return;
    }

    // 检查jsdiff库是否加载
    if (typeof Diff === 'undefined') {
      output.innerHTML = 'jsdiff库未加载';
      return;
    }

    const type = compareType.value;
    let diff;

    // 根据类型使用对应的jsdiff方法
    try {
      switch (type) {
        case 'character':
          diff = Diff.diffChars(text1, text2);
          break;
        case 'word':
          diff = Diff.diffWords(text1, text2);
          break;
        case 'line':
          diff = Diff.diffLines(text1, text2);
          break;
        default:
          diff = Diff.diffChars(text1, text2);
      }

      // 格式化并显示差异
      output.innerHTML = this.formatDiffs(diff);
    } catch (error) {
      output.innerHTML = `比较错误: ${error.message}`;
    }
  }

  formatDiffs(diff) {
    if (!diff || diff.length === 0) {
      return '<span class="diff-unchanged">没有差异</span>';
    }

    return diff.map(part => {
      let className = '';
      let prefix = '';

      if (part.added) {
        className = 'diff-added';
        prefix = '+ ';
      } else if (part.removed) {
        className = 'diff-removed';
        prefix = '- ';
      } else {
        className = 'diff-unchanged';
        prefix = '  ';
      }

      // 使用<ins>和<del>标签，同时保持样式类
      if (part.added) {
        return `<ins class="${className}">${this.escapeHtml(part.value)}</ins>`;
      } else if (part.removed) {
        return `<del class="${className}">${this.escapeHtml(part.value)}</del>`;
      } else {
        return `<span class="${className}">${this.escapeHtml(part.value)}</span>`;
      }
    }).join('');
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}