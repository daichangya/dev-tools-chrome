import BaseTool from '../base-tool.js';
import languageManager from '../language-manager.js';
import { createJsonEditor } from '../json-editor.js';

export class JsonToJavaBean extends BaseTool {
  constructor() {
    super();
    this.defaultValue = '{\n  \"example\": \"Json Formatter\",\n  \"data\": [1, 2, 3],\n  \"nested\": {\n    \"key\": \"value\"\n  }\n}';
    this.inputEditor = null;
  }

  show() {
    this.container.innerHTML = this.createUI();
    const input = document.getElementById('input');
    if (input) {
      input.value = this.defaultValue;
      // 创建JSON语法高亮编辑器
      setTimeout(() => {
        this.inputEditor = createJsonEditor(input, {
          placeholder: languageManager.getText('inputRequired', 'messages'),
          onInput: (e, value) => {
            input.value = value;
          }
        });
        this.inputEditor.setValue(this.defaultValue);
      }, 0);
    }
    this.setupCommonEventListeners();
    this.setupSpecificEventListeners();
  }

   jsonToJavaBean(className, json) {
    const jsonObj = typeof json === 'string' ? JSON.parse(json) : json;
    const classMap = new Map();

    const indent = (level) => '    '.repeat(level);

    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    function isDateString(value) {
        return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(value);
    }

    function wrapPrimitive(type) {
        switch (type) {
            case 'int': return 'Integer';
            case 'double': return 'Double';
            case 'boolean': return 'Boolean';
            default: return type;
        }
    }

    function detectType(key, value) {
        if (Array.isArray(value)) {
            if (value.length === 0) return 'List<Object>';
            const type = detectType(key, value[0]);
            return `List<${wrapPrimitive(type)}>`;
        } else if (value && typeof value === 'object') {
            const keys = Object.keys(value);
            const allSimpleValues = keys.every(k => ['string', 'number', 'boolean'].includes(typeof value[k]));
            if (allSimpleValues && keys.length > 3) return 'Map<String, Object>';
            const nestedClassName = capitalize(key);
            processClass(nestedClassName, value);
            return nestedClassName;
        } else if (isDateString(value)) {
            return 'Date';
        } else if (typeof value === 'string') {
            return 'String';
        } else if (typeof value === 'number') {
            return Number.isInteger(value) ? 'int' : 'double';
        } else if (typeof value === 'boolean') {
            return 'boolean';
        } else {
            return 'Object';
        }
    }

    function processClass(name, obj) {
        if (classMap.has(name)) return;

        const fields = [];
        const methods = [];

        for (const key in obj) {
            const type = detectType(key, obj[key]);
            const capKey = capitalize(key);
            fields.push(`${indent(1)}private ${type} ${key};`);
            methods.push(
`${indent(1)}public ${type} get${capKey}() {
${indent(2)}return ${key};
${indent(1)}}

${indent(1)}public void set${capKey}(${type} ${key}) {
${indent(2)}this.${key} = ${key};
${indent(1)}}`
            );
        }

        classMap.set(name, { fields, methods });
    }

    processClass(className, jsonObj);

    const imports = new Set();
    for (const [, def] of classMap) {
        def.fields.forEach(f => {
            if (f.includes('List<')) imports.add('import java.util.List;');
            if (f.includes('Map<')) imports.add('import java.util.Map;');
            if (f.includes('Date ')) imports.add('import java.util.Date;');
        });
    }

    const outer = classMap.get(className);
    classMap.delete(className);

    const nestedClasses = Array.from(classMap.entries()).map(([name, def]) => {
        return `    public static class ${name} {

${def.fields.join('\n\n')}

\n${def.methods.join('\n\n')}

    }`;
    });

    return `${Array.from(imports).sort().join('\n')}

public class ${className} {

${outer.fields.join('\n\n')}

\n${outer.methods.join('\n\n')}

${nestedClasses.length > 0 ? '\n\n' + nestedClasses.join('\n\n') : ''}
}`;
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
            output.value = languageManager.getToolText(this.toolId,'inputRequired');
            return;
          }

          const jsonObj = JSON.parse(inputText);
          const className = prompt('请输入Java类名:', 'MyClass') || 'MyClass';
          output.value = this.jsonToJavaBean(className, jsonObj);
        } catch (error) {
          output.value = `转换错误: ${error.message}`;
        }
      });
    }

    // 设置copy按钮（处理CodeMirror编辑器）
    const copyBtn = document.getElementById('copyBtn');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        const output = document.getElementById('output');
        const value = output ? output.value : '';
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
        const input = document.getElementById('input');
        const output = document.getElementById('output');
        if (this.inputEditor) {
          this.inputEditor.setValue('');
        } else if (input) {
          input.value = '';
        }
        if (output) {
          output.value = '';
        }
      });
    }
  }
}