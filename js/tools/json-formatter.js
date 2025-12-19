import BaseTool from '../base-tool.js';
import languageManager from '../language-manager.js';
import { createJsonEditor } from '../json-editor.js';

export class JSONFormatter extends BaseTool {
  constructor() {
    super();
    this.defaultValue = '{\n  "example": "Json Formatter",\n  "data": [1, 2, 3],\n  "nested": {\n    "key": "value"\n  }\n}';
    this.inputEditor = null;
    this.outputEditor = null;
  }

  show() {
    this.container.innerHTML = this.createUI()
    const input = document.getElementById('input');
    const output = document.getElementById('output');
    
    if (input) {
      input.value = this.defaultValue;
      // 创建JSON语法高亮编辑器
      this.inputEditor = createJsonEditor(input, {
        placeholder: languageManager.getText('inputRequired', 'messages'),
        onInput: (e, value) => {
          input.value = value;
        }
      });
      this.inputEditor.setValue(this.defaultValue);
    }
    
    if (output) {
      // 为输出也创建JSON语法高亮编辑器（只读）
      this.outputEditor = createJsonEditor(output, {
        placeholder: '',
        readOnly: true,
        onInput: () => {
          // 输出是只读的，但保持同步
          output.value = this.outputEditor.getValue();
        }
      });
    }
    
    this.setupCommonEventListeners();
    this.setupSpecificEventListeners();
  }

  preprocessJSON(jsonString) {
    let processedText = jsonString;
    // 处理类似{"msg":"校验通过","ret":"00000"}的格式
    if (processedText.startsWith('{') && processedText.endsWith('}')) {
      processedText = processedText.replace(/\\"/g, '"');
    }
    console.log(processedText);
    return processedText;
  }

  setupSpecificEventListeners() {
    const processBtn = document.getElementById('processBtn');
    const input = document.getElementById('input');
    const output = document.getElementById('output');

    if (processBtn) {
      processBtn.addEventListener('click', () => {
        try {
          const inputText = this.inputEditor ? this.inputEditor.getValue().trim() : input.value.trim();
          if (!inputText) {
            const errorMsg = '请输入要格式化的JSON字符串';
            if (this.outputEditor) {
              this.outputEditor.setValue(errorMsg);
            } else {
              output.value = errorMsg;
            }
            return;
          }

          // 预处理JSON字符串
          const processedText = this.preprocessJSON(inputText);

          // 尝试解析JSON
          const jsonObj = JSON.parse(processedText);
          // 格式化输出，使用2个空格缩进
          const formatted = JSON.stringify(jsonObj, null, 2);
          if (this.outputEditor) {
            this.outputEditor.setValue(formatted);
          } else {
            output.value = formatted;
          }
        } catch (error) {
          const errorMsg = `JSON解析错误：${error.message}`;
          if (this.outputEditor) {
            this.outputEditor.setValue(errorMsg);
          } else {
            output.value = errorMsg;
          }
        }
      });
    }

    // 设置copy按钮（处理CodeMirror编辑器）
    const copyBtn = document.getElementById('copyBtn');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        const value = this.outputEditor ? this.outputEditor.getValue() : (output ? output.value : '');
        if (value) {
          navigator.clipboard.writeText(value)
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
        if (this.inputEditor) {
          this.inputEditor.setValue('');
        } else if (input) {
          input.value = '';
        }
        if (this.outputEditor) {
          this.outputEditor.setValue('');
        } else if (output) {
          output.value = '';
        }
      });
    }
  }
}