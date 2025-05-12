import BaseTool from '../base-tool.js';
import languageManager from '../language-manager.js';


export class ASCIIArtGenerator extends BaseTool {
  constructor() {
    super();

    this.defaultValue = 'HELLO';
    this.fonts = {
      standard: {
        A: '  /\\  \n /  \\ \n/====\\\n',
        B: '|===\\\n|===<\n|===/',
        C: ' ====\n|    \n ====',
        // 可以继续添加更多字母的ASCII艺术字体
      }
    };
  }

  show() {
    this.container.innerHTML = this.createUI()
    const input = document.getElementById('input');
    if (input) {
      input.value = this.defaultValue;
    }
    
    this.setupCommonEventListeners();
    this.setupSpecificEventListeners();
  }

    getControls() {
    return `
         <select id="fontStyle">
            <option value="standard">${languageManager.getToolText(this.toolId,'standardFont')}</option>
            <option value="block">${languageManager.getToolText(this.toolId,'blockFont')}</option>
            <option value="simple">${languageManager.getToolText(this.toolId,'simpleFont')}</option>
          </select>
          <button id="processBtn">${languageManager.getText('generate', 'buttons')}</button>
          <button id="copyBtn">${languageManager.getText('copy', 'buttons')}</button>
          <button id="clearBtn">${languageManager.getText('clear', 'buttons')}</button>
    `;
  }

  setupSpecificEventListeners() {
    const processBtn = document.getElementById('processBtn');
    const input = document.getElementById('input');
    const output = document.getElementById('output');
    const fontStyle = document.getElementById('fontStyle');

    if (processBtn) {
      processBtn.addEventListener('click', () => {
        const inputText = input.value.trim();
        if (!inputText) {
          output.textContent = languageManager.getToolText(this.toolId,'inputRequired');
          return;
        }

        try {
          const asciiArt = this.generateASCIIArt(inputText, fontStyle.value);
          output.textContent = asciiArt;
        } catch (error) {
          output.textContent = `${languageManager.getText('generateError', 'messages')}: ${error.message}`;
        }
      });
    }

    // 调用父类的通用事件监听器设置
    this.setupCommonEventListeners();
  }

  generateASCIIArt(text, style) {
    switch (style) {
      case 'standard':
        return this.generateStandardStyle(text);
      case 'block':
        return this.generateBlockStyle(text);
      case 'simple':
        return this.generateSimpleStyle(text);
      default:
        return this.generateSimpleStyle(text);
    }
  }

  generateStandardStyle(text) {
    // 这里使用一个简单的字体示例
    const standardFont = {
      A: '  /\\  \n /  \\ \n/====\\\n',
      B: '|===\\\n|===<\n|===/',
      C: ' ====\n|    \n ====',
      // 可以继续添加更多字母
    };

    const lines = ['', '', ''];
    const upperText = text.toUpperCase();

    for (const char of upperText) {
      if (standardFont[char]) {
        const charLines = standardFont[char].split('\n');
        lines[0] += charLines[0] + ' ';
        lines[1] += charLines[1] + ' ';
        lines[2] += charLines[2] + ' ';
      } else {
        lines[0] += '   ';
        lines[1] += ' ' + char + ' ';
        lines[2] += '   ';
      }
    }

    return lines.join('\n');
  }

  generateBlockStyle(text) {
    const blockChars = {
      ' ': '   \n   \n   ',
      'O': '███\n█ █\n███',
      'X': '█ █\n █ \n█ █',
      // 可以继续添加更多字符的方块样式
    };

    const lines = ['', '', ''];
    const upperText = text.toUpperCase();

    for (const char of upperText) {
      const blockChar = blockChars[char] || `███\n█${char}█\n███`;
      const charLines = blockChar.split('\n');
      lines[0] += charLines[0] + ' ';
      lines[1] += charLines[1] + ' ';
      lines[2] += charLines[2] + ' ';
    }

    return lines.join('\n');
  }

  generateSimpleStyle(text) {
    return text.split('').map(char => {
      return `
 _${char}_ 
|_${char}_|
`;
    }).join('');
  }
}