import BaseTool from '../base-tool.js';
import languageManager from '../language-manager.js';
import { createJsonEditor } from '../json-editor.js';

export class MermaidViewer extends BaseTool {
  constructor() {
    super();
    this.defaultValue = `graph LR
  A --> B
  B --> C
  C --> A`;
    this.mermaid = null;
    this.lastSvg = null;
    this.inputEditor = null;
  }

  createUI() {
    return `
      <div class="tool-container mermaid-tool">
        <h2>${this.getTitle()}</h2>
        <p class="description">${this.getDescription()}</p>
        <div class="controls">
          ${this.getControls()}
        </div>
        <div class="mermaid-panels">
          <div class="mermaid-panels-left">
            <label class="mermaid-panel-label">${languageManager.getToolText(this.toolId, 'sourceLabel')}</label>
            <div class="mermaid-source-wrap">
              <textarea id="input" class="mermaid-source" placeholder="${languageManager.getToolText(this.toolId, 'inputPlaceholder')}"></textarea>
            </div>
          </div>
          <div class="mermaid-panels-right">
            <label class="mermaid-panel-label">${languageManager.getToolText(this.toolId, 'previewLabel')}</label>
            <div id="mermaid-error" class="mermaid-error"></div>
            <div id="mermaid-output" class="mermaid-output"></div>
          </div>
        </div>
      </div>
      <style>
        .mermaid-tool .mermaid-panels {
          display: flex;
          flex-direction: row;
          gap: 20px;
          width: 100%;
          min-height: 320px;
          margin-top: 12px;
        }
        .mermaid-tool .mermaid-panels-left {
          flex: 0 0 320px;
          min-width: 260px;
          max-width: 48%;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .mermaid-tool .mermaid-panels-right {
          flex: 1 1 360px;
          min-width: 260px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          overflow: hidden;
        }
        .mermaid-tool .mermaid-panel-label {
          font-size: 13px;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 6px;
          flex-shrink: 0;
        }
        .mermaid-tool .mermaid-source-wrap {
          flex: 1;
          min-height: 260px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }
        .mermaid-tool .mermaid-source {
          width: 100%;
          min-height: 260px;
          height: 100%;
          margin: 0;
          padding: 12px;
          border: 1px solid var(--border-color);
          border-radius: 8px;
          font-family: 'Fira Code', monospace;
          font-size: 13px;
          line-height: 1.5;
          resize: none;
          box-sizing: border-box;
        }
        .mermaid-tool .mermaid-source:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 0 3px var(--primary-glow);
        }
        .mermaid-tool .mermaid-error {
          flex-shrink: 0;
          min-height: 0;
          padding: 6px 10px;
          font-size: 12px;
          color: var(--error);
          background: rgba(239, 68, 68, 0.15);
          border-radius: 6px;
          display: none;
        }
        .mermaid-tool .mermaid-error:not(:empty) {
          display: block;
        }
        .mermaid-tool .mermaid-output {
          flex: 1;
          min-height: 240px;
          padding: 16px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          overflow: auto;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .mermaid-tool .mermaid-output svg {
          max-width: 100%;
          height: auto;
        }
        @media (max-width: 720px) {
          .mermaid-tool .mermaid-panels {
            flex-direction: column;
          }
          .mermaid-tool .mermaid-panels-left,
          .mermaid-tool .mermaid-panels-right {
            max-width: none;
            flex: 1 1 auto;
            min-height: 220px;
          }
        }
      </style>
    `;
  }

  getControls() {
    return `
      <button id="renderBtn" class="btn-secondary">${languageManager.getToolText(this.toolId, 'render')}</button>
      <button id="copyImageBtn" class="btn-secondary">${languageManager.getToolText(this.toolId, 'copyImage')}</button>
      <button id="downloadBtn" class="btn-secondary">${languageManager.getToolText(this.toolId, 'downloadPNG')}</button>
      <button id="clearBtn" class="btn-secondary">${languageManager.getText('clear', 'buttons')}</button>
    `;
  }

  ensureMermaid() {
    if (this.mermaid) return this.mermaid;
    if (typeof window !== 'undefined' && window.mermaid) {
      this.mermaid = window.mermaid;
      this.mermaid.initialize({ startOnLoad: false });
      return this.mermaid;
    }
    throw new Error('Mermaid not loaded. Ensure js/lib/mermaid/mermaid.min.js is loaded.');
  }

  show() {
    this.container.innerHTML = this.createUI();
    const input = document.getElementById('input');
    if (input) {
      input.value = this.defaultValue;
      this.inputEditor = createJsonEditor(input, {
        mode: 'plain',
        placeholder: languageManager.getToolText(this.toolId, 'inputPlaceholder'),
        onInput: (e, value) => { input.value = value; }
      });
      this.inputEditor.setValue(this.defaultValue);
    }
    this.lastSvg = null;
    this.setupSpecificEventListeners();
  }

  setupSpecificEventListeners() {
    const renderBtn = document.getElementById('renderBtn');
    const copyImageBtn = document.getElementById('copyImageBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const clearBtn = document.getElementById('clearBtn');
    const input = document.getElementById('input');
    const outputEl = document.getElementById('mermaid-output');
    const errorEl = document.getElementById('mermaid-error');

    const hideError = () => {
      if (errorEl) errorEl.textContent = '';
    };
    const showError = (msg) => {
      if (errorEl) errorEl.textContent = msg;
    };

    if (renderBtn) {
      renderBtn.addEventListener('click', async () => {
        const code = (this.inputEditor ? this.inputEditor.getValue() : input?.value || '').trim();
        if (!code) {
          showError(languageManager.getToolText(this.toolId, 'inputRequired'));
          return;
        }
        hideError();
        try {
          const mermaid = await this.ensureMermaid();
          const id = 'mermaid-' + Date.now();
          const { svg } = await mermaid.render(id, code);
          this.lastSvg = svg;
          if (outputEl) {
            outputEl.innerHTML = svg;
          }
        } catch (e) {
          this.lastSvg = null;
          showError((languageManager.getText('error', 'messages') || 'Error: ') + (e.message || String(e)));
          if (outputEl) outputEl.innerHTML = '';
        }
      });
    }

    if (copyImageBtn) {
      copyImageBtn.addEventListener('click', async () => {
        if (!this.lastSvg) {
          showError(languageManager.getToolText(this.toolId, 'renderFirst'));
          return;
        }
        hideError();
        try {
          const blob = await this.svgToPngBlob(this.lastSvg);
          await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
          const orig = copyImageBtn.textContent;
          copyImageBtn.textContent = languageManager.getText('copySuccess', 'messages');
          setTimeout(() => { copyImageBtn.textContent = orig; }, 2000);
        } catch (e) {
          showError((languageManager.getText('error', 'messages') || 'Error: ') + (e.message || String(e)));
        }
      });
    }

    if (downloadBtn) {
      downloadBtn.addEventListener('click', async () => {
        if (!this.lastSvg) {
          showError(languageManager.getToolText(this.toolId, 'renderFirst'));
          return;
        }
        hideError();
        try {
          const dataUrl = await this.svgToPngDataUrl(this.lastSvg);
          const a = document.createElement('a');
          a.download = 'mermaid-diagram-' + Date.now() + '.png';
          a.href = dataUrl;
          a.click();
        } catch (e) {
          showError((languageManager.getText('error', 'messages') || 'Error: ') + (e.message || String(e)));
        }
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        if (this.inputEditor) this.inputEditor.setValue('');
        else if (input) input.value = '';
        this.lastSvg = null;
        hideError();
        if (outputEl) outputEl.innerHTML = '';
      });
    }
  }

  async svgToCanvas(svg) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
      img.onload = () => {
        const max = 2048;
        let w = img.naturalWidth;
        let h = img.naturalHeight;
        if (w > max || h > max) {
          const r = Math.min(max / w, max / h);
          w = Math.round(w * r);
          h = Math.round(h * r);
        }
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas);
      };
      img.onerror = () => reject(new Error('SVG to image failed'));
      img.src = url;
    });
  }

  async svgToPngDataUrl(svg) {
    const canvas = await this.svgToCanvas(svg);
    return canvas.toDataURL('image/png');
  }

  async svgToPngBlob(svg) {
    const canvas = await this.svgToCanvas(svg);
    return new Promise((resolve, reject) => {
      canvas.toBlob(blob => (blob ? resolve(blob) : reject(new Error('toBlob failed'))), 'image/png');
    });
  }
}
