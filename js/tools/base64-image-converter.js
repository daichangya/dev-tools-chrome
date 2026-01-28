import BaseTool from '../base-tool.js';
import languageManager from '../language-manager.js';
import { createJsonEditor } from '../json-editor.js';

export class Base64ImageConverter extends BaseTool {
  constructor() {
    super();
    this.inputEditor = null;
  }

  show() {
    this.container.innerHTML = this.createUI();
    const input = document.getElementById('input');
    const defaultVal = languageManager.getToolText(this.toolId, 'defaultText') || this.defaultValue || '';
    if (input) {
      input.value = defaultVal;
      this.inputEditor = createJsonEditor(input, {
        mode: 'plain',
        placeholder: languageManager.getToolText(this.toolId, 'inputBase64ImageRequired'),
        onInput: (e, value) => { input.value = value; }
      });
      if (defaultVal) this.inputEditor.setValue(defaultVal);
    }
    this.setupEventListeners();
  }

  getControls() {
    return super.getControls() + `
      <button id="downloadBtn" class="btn-secondary">${languageManager.getToolText(this.toolId,'downloadImage')}</button>
    `;
  }

  setupEventListeners() {
    super.setupCommonEventListeners();
    
    const processBtn = document.getElementById('processBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const input = document.getElementById('input');
    
    const getInputValue = () => this.inputEditor ? this.inputEditor.getValue() : (input && input.value);

    if (processBtn) {
      processBtn.addEventListener('click', () => {
        this.processBase64(getInputValue());
      });
    }

    if (downloadBtn) {
      downloadBtn.addEventListener('click', () => {
        this.downloadImage(getInputValue());
      });
    }

    const clearBtn = document.getElementById('clearBtn');
    if (clearBtn && this.inputEditor) {
      clearBtn.addEventListener('click', () => this.inputEditor.setValue(''));
    }
  }

  processBase64(base64String) {
    const output = document.getElementById('output');
    
    if (!base64String) {
      output.value = languageManager.getToolText(this.toolId,'inputBase64ImageRequired');
      return;
    }
    
    try {
      // 创建图片预览
      const previewContainer = document.createElement('div');
      previewContainer.className = 'image-preview';
      previewContainer.innerHTML = `<img src="${base64String}" alt="预览图片" style="max-width: 100%; max-height: 300px;">`;
      
      // 替换输出区域
      const outputContainer = document.querySelector('.output-container');
      outputContainer.innerHTML = '<h3>预览</h3>';
      outputContainer.appendChild(previewContainer);
      
      output.value = languageManager.getToolText(this.toolId,'imagePreviewGenerated');
    } catch (e) {
      output.value = languageManager.getToolText(this.toolId,'invalidBase64Image') + ': ' + e.message;
    }
  }

  downloadImage(base64String) {
    if (!base64String) {
      alert(languageManager.getToolText(this.toolId,'inputBase64ImageRequired'));
      return;
    }
    
    try {
      const link = document.createElement('a');
      link.href = base64String;
      link.download = 'image.png';
      link.click();
    } catch (e) {
      alert(languageManager.getToolText(this.toolId,'downloadFailed') + ': ' + e.message);
    }
  }
}