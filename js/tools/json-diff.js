/**
 * JSON Diff工具类
 * 使用jsdiff库进行JSON差异比较
 * @author daichangya
 */
import BaseTool from '../base-tool.js';
import languageManager from '../language-manager.js';
import { highlightJsonContent } from '../json-syntax-highlight.js';
import { createJsonEditor } from '../json-editor.js';

export class JSONDiff extends BaseTool {
  constructor() {
    super();
    this.lastJsonOldObj = null;
    this.lastJsonNewObj = null;
    this.input1Editor = null;
    this.input2Editor = null;
  }

  show() {
    this.container.innerHTML = `
      <div class="tool-container">
        <h2>${this.title}</h2>
        <p class="description">${this.description}</p>
        <div class="controls">
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
              <label>${languageManager.getToolText(this.toolId, 'json1')}</label>
              <textarea id="input" placeholder="${languageManager.getToolText(this.toolId, 'json1Placeholder')}"></textarea>
            </div>
            <div class="input-group">
              <label>${languageManager.getToolText(this.toolId, 'json2')}</label>
              <textarea id="input2" placeholder="${languageManager.getToolText(this.toolId, 'json2Placeholder')}"></textarea>
            </div>
          </div>
          <div class="output-group">
            <label>${languageManager.getToolText(this.toolId, 'diffResult')}</label>
            <div id="output" class="diff-output"></div>
          </div>
        </div>
      </div>
    `;

    this.addStyles();
    this.setupSpecificEventListeners();
    
    // 为输入框创建JSON语法高亮编辑器并设置默认值
    setTimeout(() => {
      const input1 = document.getElementById('input');
      const input2 = document.getElementById('input2');
      const json1Default = languageManager.getToolText(this.toolId, 'json1Default') || '{"name": "A", "value": 1}';
      const json2Default = languageManager.getToolText(this.toolId, 'json2Default') || '{"name": "B", "value": 2}';

      if (input1) {
        this.input1Editor = createJsonEditor(input1, {
          placeholder: languageManager.getToolText(this.toolId, 'json1Placeholder'),
          onInput: (e, value) => {
            input1.value = value;
            if (value.trim() && input2 && input2.value.trim()) {
              this.performDiff();
            }
          }
        });
        this.input1Editor.setValue(json1Default);
      }

      if (input2) {
        this.input2Editor = createJsonEditor(input2, {
          placeholder: languageManager.getToolText(this.toolId, 'json2Placeholder'),
          onInput: (e, value) => {
            input2.value = value;
            const input1Value = this.input1Editor ? this.input1Editor.getValue() : input1.value;
            if (value.trim() && input1Value && input1Value.trim()) {
              this.performDiff();
            }
          }
        });
        this.input2Editor.setValue(json2Default);
      }
    }, 0);
  }

  addStyles() {
    /* Diff 样式已统一迁移至 css/styles.css（.tool-container .diff-output 等） */
  }

  setupSpecificEventListeners() {
    const processBtn = document.getElementById('processBtn');
    const input = document.getElementById('input');
    const input2 = document.getElementById('input2');
    const output = document.getElementById('output');

    if (processBtn) {
      processBtn.addEventListener('click', () => {
        this.performDiff();
      });
    }

    // 输入变化时自动比较（如果使用编辑器，这个已经在编辑器的onInput中处理了）
    if (input && input2 && !this.input1Editor && !this.input2Editor) {
      input.addEventListener('input', () => {
        if (input.value.trim() && input2.value.trim()) {
          this.performDiff();
        }
      });
      input2.addEventListener('input', () => {
        if (input.value.trim() && input2.value.trim()) {
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
        const input = document.getElementById('input');
        const input2 = document.getElementById('input2');
        const output = document.getElementById('output');
        if (this.input1Editor) {
          this.input1Editor.setValue('');
        } else if (input) {
          input.value = '';
        }
        if (this.input2Editor) {
          this.input2Editor.setValue('');
        } else if (input2) {
          input2.value = '';
        }
        if (output) output.innerHTML = '';
        this.lastJsonOldObj = null;
        this.lastJsonNewObj = null;
      });
    }
  }

  performDiff() {
    const input = document.getElementById('input');
    const input2 = document.getElementById('input2');
    const output = document.getElementById('output');

    if (!input || !input2 || !output) return;

    try {
      const json1Text = this.input1Editor ? this.input1Editor.getValue().trim() : input.value.trim();
      const json2Text = this.input2Editor ? this.input2Editor.getValue().trim() : input2.value.trim();

      if (!json1Text || !json2Text) {
        output.textContent = languageManager.getToolText(this.toolId, 'inputRequired') || '请输入要比较的JSON';
        return;
      }

      const json1 = JSON.parse(json1Text);
      const json2 = JSON.parse(json2Text);

      // 存储解析后的对象
      this.lastJsonOldObj = json1;
      this.lastJsonNewObj = json2;

      // 直接使用文本视图渲染
      this.renderTextView(json1, json2, output);
    } catch (error) {
      output.textContent = `${languageManager.getToolText(this.toolId,'compareError')}: ${error.message}`;
    }
  }

  renderTextView(oldObj, newObj, output) {
    // 使用jsdiff的diffJson方法
    if (typeof Diff === 'undefined') {
      output.textContent = 'jsdiff库未加载';
      return;
    }

    const diff = Diff.diffJson(oldObj, newObj);
    output.innerHTML = '';

    const fragment = document.createDocumentFragment();
    diff.forEach(part => {
      let node;
      if (part.added) {
        node = document.createElement('ins');
        // 应用语法高亮
        node.innerHTML = highlightJsonContent(part.value);
      } else if (part.removed) {
        node = document.createElement('del');
        // 应用语法高亮
        node.innerHTML = highlightJsonContent(part.value);
      } else {
        // 对于未更改的部分，也应用语法高亮
        const span = document.createElement('span');
        span.innerHTML = highlightJsonContent(part.value);
        node = span;
      }
      fragment.appendChild(node);
    });

    output.appendChild(fragment);
  }
}