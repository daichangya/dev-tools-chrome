/**
 * JSON语法高亮工具（最小化版本）
 * 仅用于diff输出的HTML高亮，编辑器已使用CodeMirror
 * @author daichangya
 */

/**
 * 高亮JSON内容（用于diff输出）
 * @param {string} text - JSON文本
 * @returns {string} - 带HTML标签的高亮文本
 */
export function highlightJsonContent(text) {
  if (!text) return '';
  
  const escapeHtml = (text) => {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  };

  // 使用更精确的正则表达式
  let result = escapeHtml(text);
  
  // 先标记字符串，避免后续处理破坏它们
  const stringPlaceholders = [];
  result = result.replace(/"([^"\\]|\\.)*"/g, (match) => {
    const placeholder = `__STRING_${stringPlaceholders.length}__`;
    stringPlaceholders.push(match);
    return placeholder;
  });
  
  // 高亮数字（不在字符串中）
  result = result.replace(/\b(-?\d+\.?\d*)\b/g, (match) => {
    return `<span class="json-number">${match}</span>`;
  });
  
  // 高亮布尔值和null
  result = result.replace(/\b(true|false|null)\b/g, (match) => {
    return `<span class="json-literal">${match}</span>`;
  });
  
  // 恢复字符串并高亮
  stringPlaceholders.forEach((str, index) => {
    const highlighted = `<span class="json-string">${str}</span>`;
    result = result.replace(`__STRING_${index}__`, highlighted);
  });
  
  // 高亮键名（但需要避免重复高亮）
  result = result.replace(/(<span class="json-string">"([^"\\]|\\.)*"<\/span>)\s*:/g, (match, stringPart) => {
    return `<span class="json-key">${stringPart}</span>:`;
  });
  
  return result;
}
