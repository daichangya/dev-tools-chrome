// 导入工具管理器
import ToolManager from './js/tools.js';
import i18n from './js/i18n.js';

// 初始化工具管理器
document.addEventListener('DOMContentLoaded', function() {
  i18n.init()
  // 创建工具管理器实例
  const toolManager = new ToolManager();
});