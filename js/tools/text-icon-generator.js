import BaseTool from '../base-tool.js';
import languageManager from '../language-manager.js';

export class TextIconGenerator extends BaseTool {
  constructor() {
    super();
    this.defaultValue = 'A';
    this.iconSize = 128;
    this.styles = {
      standard: {
        bgColor: '#ffffff',
        textColor: '#000000',
        font: 'bold 80px Arial'
      },
      rounded: {
        bgColor: '#4CAF50',
        textColor: '#ffffff',
        font: 'bold 80px Arial',
        borderRadius: 20
      },
      outline: {
        bgColor: 'transparent',
        textColor: '#000000',
        font: 'bold 80px Arial',
        borderWidth: 3,
        borderColor: '#000000'
      }
    };
  }

  show() {
    this.container.innerHTML = this.createUI()
    const input = document.getElementById('input');
    if (input) input.value = this.defaultValue;
    
    this.setupCommonEventListeners();
    this.setupSpecificEventListeners();
  }

  getControls() {
    return `
      <select id="styleSelect">
        <option value="standard">${languageManager.getToolText(this.toolId,'standardStyle')}</option>
        <option value="rounded">${languageManager.getToolText(this.toolId,'roundedStyle')}</option>
        <option value="outline">${languageManager.getToolText(this.toolId,'outlineStyle')}</option>
      </select>
      <input type="color" id="textColor" value="#000000" title="${languageManager.getToolText(this.toolId,'textColor')}">
      <input type="color" id="bgColor" value="#ffffff" title="${languageManager.getToolText(this.toolId,'bgColor')}">
      <input type="number" id="sizeSlider" min="16" max="512" value="128" title="${languageManager.getToolText(this.toolId,'iconSize')}">
      <span id="sizeValue">128px</span>
      <button id="generateBtn">${languageManager.getText('generate','buttons')}</button>
      <button id="downloadBtn">${languageManager.getText('downloadPNG','buttons')}</button>
    `;
  }
  
  createUI(title, description) {
    return super.createUI(title, description) + `
      <style>
        .preview-container {
          margin-top: 20px;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
        }
        .preview-container h3 {
          margin-top: 0;
          margin-bottom: 10px;
        }
      </style>
    `;
  }

  setupSpecificEventListeners() {
    const generateBtn = document.getElementById('generateBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const input = document.getElementById('input');
    const styleSelect = document.getElementById('styleSelect');
    const output = document.getElementById('output');
    
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.iconSize;
    this.canvas.height = this.iconSize;
    this.ctx = this.canvas.getContext('2d');
    
    if (generateBtn) {
      generateBtn.addEventListener('click', () => {
        const text = input.value.trim().charAt(0);
        if (!text) {
          output.value = languageManager.getText('messages.inputTextRequired');
          return;
        }
        
        this.generateIcon(text, styleSelect.value);
        output.value = languageManager.getText('messages.iconGenerated');
      });
    }
    
    if (downloadBtn) {
      downloadBtn.addEventListener('click', () => {
        if (!this.canvas) {
          output.value = languageManager.getText('messages.generateFirst');
          return;
        }
        this.downloadIcon();
      });
    }
  }

  generateIcon(text, style) {
    const styleConfig = this.styles[style] || this.styles.standard;
    const ctx = this.ctx;
    
    // 获取动态设置
    const textColor = document.getElementById('textColor').value;
    const bgColor = document.getElementById('bgColor').value;
    const size = parseInt(document.getElementById('sizeSlider').value);
    
    // 更新图标大小
    this.iconSize = size;
    document.getElementById('sizeValue').textContent = size + 'px';
    this.canvas.width = size;
    this.canvas.height = size;
    
    // 清空画布
    ctx.clearRect(0, 0, this.iconSize, this.iconSize);
    
    // 绘制背景
    const useCustomBg = style === 'standard';
    const bgColorToUse = true ? bgColor : styleConfig.bgColor;
    if (bgColorToUse !== 'transparent') {
      ctx.fillStyle = bgColorToUse;
      if (styleConfig.borderRadius) {
        this.drawRoundedRect(0, 0, this.iconSize, this.iconSize, styleConfig.borderRadius);
        ctx.fill();
      } else {
        ctx.fillRect(0, 0, this.iconSize, this.iconSize);
      }
    }
    
    // 绘制描边
    if (styleConfig.borderWidth) {
      ctx.strokeStyle = styleConfig.borderColor;
      ctx.lineWidth = styleConfig.borderWidth;
      ctx.strokeRect(0, 0, this.iconSize, this.iconSize);
    }
    
    // 绘制文字
    ctx.font = styleConfig.font.replace(/\d+px/, size * 0.9 + 'px');
    const textColorToUse = true ? textColor : styleConfig.textColor;
    ctx.fillStyle = textColorToUse;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, this.iconSize/2, this.iconSize/2 + (size * 0.05));
    
    // 显示预览
    if (!this.previewContainer) {
      this.previewContainer = document.createElement('div');
      this.previewContainer.className = 'preview-container';
      this.previewContainer.innerHTML = `<h3>${languageManager.getToolText(this.toolId,'iconPreview')}</h3>`;
      this.container.appendChild(this.previewContainer);
    }
    
    const img = document.createElement('img');
    img.src = this.canvas.toDataURL('image/png');
    img.alt = '图标预览';
    img.style.maxWidth = '100%';
    img.style.height = 'auto';
    
    this.previewContainer.innerHTML = `<h3>${languageManager.getToolText(this.toolId,'iconPreview')}</h3>`;
    this.previewContainer.appendChild(img);
  }

  drawRoundedRect(x, y, width, height, radius) {
    // 根据图标尺寸动态调整圆角半径
    const adjustedRadius = Math.min(radius, Math.floor(width / 4));
    this.ctx.beginPath();
    this.ctx.moveTo(x + adjustedRadius, y);
    this.ctx.lineTo(x + width - adjustedRadius, y);
    this.ctx.quadraticCurveTo(x + width, y, x + width, y + adjustedRadius);
    this.ctx.lineTo(x + width, y + height - adjustedRadius);
    this.ctx.quadraticCurveTo(x + width, y + height, x + width - adjustedRadius, y + height);
    this.ctx.lineTo(x + adjustedRadius, y + height);
    this.ctx.quadraticCurveTo(x, y + height, x, y + height - adjustedRadius);
    this.ctx.lineTo(x, y + adjustedRadius);
    this.ctx.quadraticCurveTo(x, y, x + adjustedRadius, y);
    this.ctx.closePath();
  }

  downloadIcon() {
    const link = document.createElement('a');
    link.download = `icon-${Date.now()}.png`;
    link.href = this.canvas.toDataURL('image/png');
    link.click();
  }
}