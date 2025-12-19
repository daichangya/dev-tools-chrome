import BaseTool from '../base-tool.js';
import languageManager from '../language-manager.js';
import { createJsonEditor } from '../json-editor.js';

export class XMLFormatter extends BaseTool {
  constructor() {
    super();
    this.defaultValue = '<note>\n  <to>Tove</to>\n  <from>Jani</from>\n  <heading>Reminder</heading>\n  <body>Don\'t forget me this weekend!</body>\n</note>';
    this.indentSize = 2;
    this.collapseEnabled = false;
    this.inputEditor = null;
    this.outputEditor = null;
  }

  show() {
    this.container.innerHTML = this.createUI()
    
    const input = document.getElementById('input');
    const output = document.getElementById('output');
    
    if (input) {
      input.value = this.defaultValue;
      // 创建XML语法高亮编辑器
      this.inputEditor = createJsonEditor(input, {
        mode: 'xml',
        placeholder: languageManager.getText('inputRequired', 'messages'),
        onInput: (e, value) => {
          input.value = value;
        }
      });
      this.inputEditor.setValue(this.defaultValue);
    }
    
    if (output) {
      // 为输出也创建XML语法高亮编辑器（只读）
      this.outputEditor = createJsonEditor(output, {
        mode: 'xml',
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

  setupSpecificEventListeners() {
    const processBtn = document.getElementById('processBtn');
    const input = document.getElementById('input');
    const output = document.getElementById('output');

    if (processBtn) {
        processBtn.addEventListener('click', () => {
        try {
          const inputText = this.inputEditor ? this.inputEditor.getValue().trim() : input.value.trim();
          if (!inputText) {
            const errorMsg = '请输入要格式化的XML代码';
            if (this.outputEditor) {
              this.outputEditor.setValue(errorMsg);
            } else {
              output.value = errorMsg;
            }
            return;
          }
          
          const formatted = this.formatXML(inputText);
          if (this.outputEditor) {
            this.outputEditor.setValue(formatted);
          } else {
            output.value = formatted;
          }
        } catch (error) {
          const errorMsg = `XML格式化错误：${error.message}`;
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

  /**
   * 格式化XML（不使用XSLT）
   * @param {string} sourceXml - 源XML字符串
   * @returns {string} 格式化后的XML字符串
   */
  formatXML(sourceXml) {
    try {
      // 解析XML
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(sourceXml, 'application/xml');
      
      // 检查解析错误
      const parserError = xmlDoc.querySelector('parsererror');
      if (parserError) {
        throw new Error('XML解析失败：' + parserError.textContent);
      }
      
      // 递归格式化XML节点
      const formatted = this.formatNode(xmlDoc.documentElement || xmlDoc.firstChild, 0);
      return formatted;
    } catch (error) {
      throw new Error('XML格式化失败：' + error.message);
    }
  }

  /**
   * 递归格式化XML节点
   * @param {Node} node - XML节点
   * @param {number} indent - 当前缩进级别
   * @returns {string} 格式化后的节点字符串
   */
  formatNode(node, indent) {
    if (!node) return '';
    
    const indentStr = ' '.repeat(indent * this.indentSize);
    let result = '';
    
    // 处理元素节点
    if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node;
      const tagName = element.tagName;
      
      // 开始标签和属性
      let attrs = '';
      if (element.attributes && element.attributes.length > 0) {
        for (let i = 0; i < element.attributes.length; i++) {
          const attr = element.attributes[i];
          attrs += ` ${attr.name}="${this.escapeXml(attr.value)}"`;
        }
      }
      
      // 获取子节点（包括文本节点）
      const children = Array.from(element.childNodes);
      const textNodes = children.filter(n => n.nodeType === Node.TEXT_NODE);
      const elementNodes = children.filter(n => n.nodeType === Node.ELEMENT_NODE);
      
      // 如果只有文本内容且没有子元素
      if (elementNodes.length === 0 && textNodes.length > 0) {
        const textContent = textNodes.map(n => n.textContent).join('').trim();
        if (textContent) {
          // 单行格式：<tag attr="value">text</tag>
          result = `${indentStr}<${tagName}${attrs}>${this.escapeXml(textContent)}</${tagName}>\n`;
        } else {
          // 自闭合标签：<tag attr="value"/>
          result = `${indentStr}<${tagName}${attrs}/>\n`;
        }
      } else if (elementNodes.length === 0) {
        // 空标签
        result = `${indentStr}<${tagName}${attrs}/>\n`;
      } else {
        // 多行格式：有子元素
        result = `${indentStr}<${tagName}${attrs}>\n`;
        
        // 处理文本节点（在开始标签后）
        const leadingText = textNodes
          .filter(n => n.previousSibling === null || n.previousSibling.nodeType === Node.ELEMENT_NODE)
          .map(n => n.textContent.trim())
          .filter(t => t)
          .join(' ');
        if (leadingText) {
          result += `${indentStr}${' '.repeat(this.indentSize)}${this.escapeXml(leadingText)}\n`;
        }
        
        // 处理子元素
        elementNodes.forEach(child => {
          result += this.formatNode(child, indent + 1);
        });
        
        // 处理文本节点（在结束标签前）
        const trailingText = textNodes
          .filter(n => n.nextSibling === null || n.nextSibling.nodeType === Node.ELEMENT_NODE)
          .map(n => n.textContent.trim())
          .filter(t => t)
          .join(' ');
        if (trailingText) {
          result += `${indentStr}${' '.repeat(this.indentSize)}${this.escapeXml(trailingText)}\n`;
        }
        
        result += `${indentStr}</${tagName}>\n`;
      }
    } else if (node.nodeType === Node.TEXT_NODE) {
      // 处理纯文本节点
      const text = node.textContent.trim();
      if (text) {
        result = `${indentStr}${this.escapeXml(text)}\n`;
      }
    }
    
    return result;
  }

  /**
   * 转义XML特殊字符
   * @param {string} text - 要转义的文本
   * @returns {string} 转义后的文本
   */
  escapeXml(text) {
    if (!text) return '';
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }
}