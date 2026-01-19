import BaseTool from '../base-tool.js';
import languageManager from '../language-manager.js';

export class JSONFormatter extends BaseTool {
  constructor() {
    super();
    this.defaultValue = '{\n  "example": "这是一个JSON示例",\n  "data": [1, 2, 3],\n  "nested": {\n    "key": "value"\n  }\n}';
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

  preprocessJSON(jsonString) {
    let processedText = jsonString;
    // 处理类似{"msg":"校验通过","ret":"00000"}的格式
    // if (processedText.startsWith('{') && processedText.endsWith('}')) {
    if (true) {
      processedText = processedText.replace(/\\n/g, '');
      processedText = processedText.replace(/\\t/g, '');
      processedText = processedText.replace(/\s+/g, ' ');
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
          const inputText = input.value.trim();
          if (!inputText) {
            output.value = '请输入要格式化的JSON字符串';
            return;
          }

          // 预处理JSON字符串
          const processedText = this.preprocessJSON(inputText);

          // 尝试解析JSON
          const jsonObj = JSON.parse(processedText);
          // 格式化输出，使用2个空格缩进
          output.value = JSON.stringify(jsonObj, null, 2);
        } catch (error) {
          output.value = `JSON解析错误：${error.message}`;
        }
      });
    }

    // 调用父类的通用事件监听器设置
    this.setupCommonEventListeners();
  }
}