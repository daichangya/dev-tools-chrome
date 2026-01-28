/**
 * Text Diff工具类
 * 使用jsdiff库进行文本差异比较
 * @author daichangya
 */
import BaseTool from '../base-tool.js';
import languageManager from '../language-manager.js';
import { createJsonEditor } from '../json-editor.js';

export class TextDiff extends BaseTool {
  constructor() {
    super();
    this.input1Editor = null;
    this.input2Editor = null;
  }

  show() {
    this.container.innerHTML = `
      <div class="tool-container">
        <h2>${this.title}</h2>
        <p class="description">${this.description}</p>
        <div class="controls">
          <select id="compareType">
            <option value="character">${languageManager.getToolText(this.toolId, 'character')}</option>
            <option value="word">${languageManager.getToolText(this.toolId, 'word')}</option>
            <option value="line">${languageManager.getToolText(this.toolId, 'line')}</option>
          </select>
          <button id="processBtn">${languageManager.getText('compare', 'buttons')}</button>
          <button id="copyBtn" class="btn-secondary">${languageManager.getText('copy', 'buttons')}</button>
          <button id="clearBtn" class="btn-secondary">${languageManager.getText('clear', 'buttons')}</button>
          <a href="https://jsdiff.com/" target="_blank" class="tool-external-link" rel="noopener noreferrer">
            ${languageManager.getToolText(this.toolId, 'openInWebsite') || '在 jsdiff.com 中打开'}
          </a>
        </div>
        <div class="input-output input-output-diff">
          <div class="input-output-diff-row">
            <div class="input-group">
              <label>${languageManager.getToolText(this.toolId, 'text1')}</label>
              <textarea id="input" placeholder="${languageManager.getToolText(this.toolId, 'text1Placeholder')}"></textarea>
            </div>
            <div class="input-group">
              <label>${languageManager.getToolText(this.toolId, 'text2')}</label>
              <textarea id="input2" placeholder="${languageManager.getToolText(this.toolId, 'text2Placeholder')}"></textarea>
            </div>
          </div>
          <div class="output-group">
            <label>${languageManager.getToolText(this.toolId, 'diffResult')}</label>
            <div id="output" class="diff-output"></div>
          </div>
        </div>
      </div>
    `;
    const input = document.getElementById('input');
    const input2 = document.getElementById('input2');
    const text1Default = languageManager.getToolText(this.toolId, 'text1Default') || '';
    const text2Default = languageManager.getToolText(this.toolId, 'text2Default') || '';
    if (input) input.value = text1Default;
    if (input2) input2.value = text2Default;

    if (input) {
      this.input1Editor = createJsonEditor(input, {
        mode: 'plain',
        placeholder: languageManager.getToolText(this.toolId, 'text1Placeholder'),
        onInput: () => {
          if (this.input2Editor && this.input1Editor.getValue().trim() && this.input2Editor.getValue().trim()) {
            this.performDiff();
          }
        }
      });
      if (text1Default) this.input1Editor.setValue(text1Default);
    }
    if (input2) {
      this.input2Editor = createJsonEditor(input2, {
        mode: 'plain',
        placeholder: languageManager.getToolText(this.toolId, 'text2Placeholder'),
        onInput: () => {
          if (this.input1Editor && this.input1Editor.getValue().trim() && this.input2Editor.getValue().trim()) {
            this.performDiff();
          }
        }
      });
      if (text2Default) this.input2Editor.setValue(text2Default);
    }

    this.setupCommonEventListeners();
    this.setupSpecificEventListeners();
  }

  addStyles() {
    /* Diff 样式已统一迁移至 css/styles.css（.tool-container .diff-output 等） */
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

    // 输入变化时自动比较（已由 CodeMirror onInput 处理；compareType 变更时触发）
    if (compareType) {
      compareType.addEventListener('change', () => {
        if (this.input1Editor && this.input2Editor && this.input1Editor.getValue().trim() && this.input2Editor.getValue().trim()) {
          this.performDiff();
        }
      });
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
        const output = document.getElementById('output');
        if (this.input1Editor) this.input1Editor.setValue('');
        if (this.input2Editor) this.input2Editor.setValue('');
        if (output) output.innerHTML = '';
      });
    }
  }

  performDiff() {
    const output = document.getElementById('output');
    const compareType = document.getElementById('compareType');

    if (!output || !compareType) return;

    const text1 = this.input1Editor ? this.input1Editor.getValue() : (document.getElementById('input')?.value || '');
    const text2 = this.input2Editor ? this.input2Editor.getValue() : (document.getElementById('input2')?.value || '');

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