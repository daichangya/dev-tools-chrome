import BaseTool from '../base-tool.js';
import languageManager from '../language-manager.js';

export class JSONDiff extends BaseTool {
  constructor() {
    super();
  }

  show() {
    this.container.innerHTML = `
     <h2>${this.getTitle()}</h2>
     <p class="description">${this.getDescription()}</p>
      <div class="controls">
        <button id="processBtn">${languageManager.getText('compare', 'buttons')}</button>
        <button id="copyBtn">${languageManager.getText('copy', 'buttons')}</button>
        <button id="clearBtn">${languageManager.getText('clear', 'buttons')}</button>
      </div>
      <div class="container" style="display: flex; flex-direction: column; gap: 20px;">
        <div style="display: flex; justify-content: space-between; gap: 20px;">
          <div class="input-container" style="width: 48%;">
            <h3>${languageManager.getToolText(this.toolId,'json1')}</h3>
            <textarea id="input" placeholder="${languageManager.getToolText(this.toolId,'json1Placeholder')}" style="width: 100%; height: 200px;"></textarea>
          </div>
          <div class="input-container" style="width: 48%;">
            <h3>${languageManager.getToolText(this.toolId,'json2')}</h3>
            <textarea id="input2" placeholder="${languageManager.getToolText(this.toolId,'json2Placeholder')}" style="width: 100%; height: 200px;"></textarea>
          </div>
        </div>
        <div class="output-container" style="width: 100%;">
          <h3>${languageManager.getToolText(this.toolId,'diffResult')}</h3>
          <textarea id="output" readonly style="width: 100%; height: 300px;"></textarea>
        </div>
      </div>
    `;
    this.setupCommonEventListeners();
    this.setupSpecificEventListeners();
  }

  setupSpecificEventListeners() {
    const processBtn = document.getElementById('processBtn');
    const input = document.getElementById('input');
    const input2 = document.getElementById('input2');
    const output = document.getElementById('output');

    if (processBtn) {
      processBtn.addEventListener('click', () => {
        try {
          const json1 = JSON.parse(input.value.trim());
          const json2 = JSON.parse(input2.value.trim());
          
          const differences = this.compareObjects(json1, json2);
          output.value = this.formatDifferences(differences);
        } catch (error) {
          output.value = `${languageManager.getToolText(this.toolId,'compareError')}: ${error.message}`;
        }
      });
    }

    // 调用父类的通用事件监听器设置
    this.setupCommonEventListeners();
  }

  compareObjects(obj1, obj2, path = '') {
    const differences = [];
    
    // 获取所有键
    const allKeys = new Set([...Object.keys(obj1), ...Object.keys(obj2)]);
    
    for (const key of allKeys) {
      const currentPath = path ? `${path}.${key}` : key;
      
      if (!(key in obj1)) {
        differences.push({
          path: currentPath,
          type: 'added',
          value: obj2[key]
        });
        continue;
      }
      
      if (!(key in obj2)) {
        differences.push({
          path: currentPath,
          type: 'removed',
          value: obj1[key]
        });
        continue;
      }
      
      const value1 = obj1[key];
      const value2 = obj2[key];
      
      if (typeof value1 !== typeof value2) {
        differences.push({
          path: currentPath,
          type: 'type_changed',
          oldValue: value1,
          newValue: value2
        });
        continue;
      }
      
      if (typeof value1 === 'object' && value1 !== null && value2 !== null) {
        differences.push(...this.compareObjects(value1, value2, currentPath));
      } else if (value1 !== value2) {
        differences.push({
          path: currentPath,
          type: 'value_changed',
          oldValue: value1,
          newValue: value2
        });
      }
    }
    
    return differences;
  }

  formatDifferences(differences) {
    if (differences.length === 0) {
      return languageManager.getToolText(this.toolId,'noDiffFound');
    }

    return differences.map(diff => {
      switch (diff.type) {
        case 'added':
          return `${languageManager.getToolText(this.toolId,'added')}: ${diff.path} = ${JSON.stringify(diff.value)}`;
        case 'removed':
          return `${languageManager.getToolText(this.toolId,'removed')}: ${diff.path} = ${JSON.stringify(diff.value)}`;
        case 'type_changed':
          return `${languageManager.getToolText(this.toolId,'typeChanged')}: ${diff.path}\n  - ${languageManager.getToolText(this.toolId,'oldValue')}: ${JSON.stringify(diff.oldValue)}\n  - ${languageManager.getToolText(this.toolId,'newValue')}: ${JSON.stringify(diff.newValue)}`;
        case 'value_changed':
          return `${languageManager.getToolText(this.toolId,'valueChanged')}: ${diff.path}\n  - ${languageManager.getToolText(this.toolId,'oldValue')}: ${JSON.stringify(diff.oldValue)}\n  - ${languageManager.getToolText(this.toolId,'newValue')}: ${JSON.stringify(diff.newValue)}`;
        default:
          return `${languageManager.getToolText(this.toolId,'unknownChange')}: ${diff.path}`;
      }
    }).join('\n\n');
  }
}