/**
 * 代码语法高亮编辑器组件
 * 使用CodeMirror实现JSON/XML等语法高亮
 * @author daichangya
 */

/**
 * 将textarea转换为带语法高亮的代码编辑器
 * @param {HTMLTextAreaElement} textarea - 要转换的textarea元素
 * @param {Object} options - 配置选项
 * @param {string} options.mode - 编辑器模式：'json'、'xml' 或 'plain'，默认为 'json'
 * @param {string} options.placeholder - 占位符文本
 * @param {Function} options.onInput - 输入事件回调
 * @param {Function} options.onBlur - 失焦事件回调
 * @param {Function} options.onFocus - 聚焦事件回调
 * @param {boolean} options.readOnly - 是否只读
 * @returns {Object} - 返回编辑器API对象
 */
export function createJsonEditor(textarea, options = {}) {
  const {
    mode = 'json', // 'json'、'xml' 或 'plain'
    placeholder = '',
    onInput = null,
    onBlur = null,
    onFocus = null,
    readOnly = false
  } = options;

  // 检查CodeMirror是否加载
  if (typeof CodeMirror === 'undefined') {
    console.error('CodeMirror未加载');
    return {
      getValue: () => textarea.value,
      setValue: (value) => { textarea.value = value || ''; },
      updateHighlight: () => {},
      syncStyles: () => {}
    };
  }

  // 根据模式设置CodeMirror配置
  let modeConfig;
  if (mode === 'xml') {
    modeConfig = 'xml';
  } else if (mode === 'plain') {
    modeConfig = null; // 无语法高亮，仅统一字体与样式
  } else {
    // 默认JSON模式
    modeConfig = { name: 'javascript', json: true };
  }

  // 创建CodeMirror编辑器
  const editor = CodeMirror.fromTextArea(textarea, {
    mode: modeConfig,
    lineNumbers: false,
    lineWrapping: true,
    theme: 'default',
    readOnly: readOnly,
    placeholder: placeholder || undefined,
    indentUnit: 2,
    tabSize: 2,
    indentWithTabs: false,
    autoCloseBrackets: (mode === 'xml' || mode === 'plain') ? false : true, // XML/plain 模式不自动补全括号
    matchBrackets: true,
    styleActiveLine: false
  });

  // 设置初始值
  if (textarea.value) {
    editor.setValue(textarea.value);
  }

  // 事件处理
  editor.on('change', (cm) => {
    const value = cm.getValue();
    // 同步到原始textarea
    textarea.value = value;
    
    if (onInput) {
      onInput({ target: { value } }, value);
    }
  });

  if (onBlur) {
    editor.on('blur', (cm) => {
      onBlur({ target: { value: cm.getValue() } }, cm.getValue());
    });
  }

  if (onFocus) {
    editor.on('focus', (cm) => {
      onFocus({ target: { value: cm.getValue() } }, cm.getValue());
    });
  }

  // 同步样式
  const syncStyles = () => {
    setTimeout(() => {
      const computedStyle = window.getComputedStyle(textarea);
      const editorElement = editor.getWrapperElement();
      const isInToolArea = textarea.closest('.input-group, .output-group, .mermaid-source-wrap');

      const width = computedStyle.width || textarea.style.width || '100%';
      editorElement.style.width = width;

      if (isInToolArea) {
        editorElement.style.height = '';
        editorElement.style.minHeight = '0';
      } else {
        const height = computedStyle.height || textarea.style.height || textarea.getAttribute('style')?.match(/height:\s*([^;]+)/)?.[1] || '200px';
        editorElement.style.height = height;
      }

      editor.refresh();
    }, 50);
  };

  // 初始同步样式
  syncStyles();

  // 监听窗口大小变化
  window.addEventListener('resize', () => {
    editor.refresh();
  });

  // 返回API
  return {
    editor,
    getValue: () => editor.getValue(),
    setValue: (value) => {
      editor.setValue(value || '');
      textarea.value = value || '';
    },
    updateHighlight: () => {
      // CodeMirror自动处理语法高亮，无需手动更新
      editor.refresh();
    },
    syncStyles,
    refresh: () => editor.refresh()
  };
}
