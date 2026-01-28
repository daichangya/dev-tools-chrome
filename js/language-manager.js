import i18n from './i18n.js';

class LanguageManager {
  constructor() {
    this.currentLanguage = 'en';
    this.supportedLanguages = ['zh', 'en'];
    this.setupLanguageSelector();
    // 初始化时应用默认语言设置
    this.updateUI();
  }

  setupLanguageSelector() {
 
    // 添加事件监听
    const select = document.getElementById('language-select');
    select.addEventListener('change', (e) => {
      this.setLanguage(e.target.value);
    });
  }

  setLanguage(lang) {
    if (this.supportedLanguages.includes(lang)) {
      this.currentLanguage = lang;
      this.updateUI();
    }
  }

  getText(key, category = null) {
    const langData = i18n[this.currentLanguage];
    if (!langData) return key;
    if(!category && key.includes('.')){
      const [category, key] = key.split('.');
      return langData[category]?.[key] || key;
    }

    if (category) {
      return langData[category]?.[key] || key;
    }

    return langData[key] || key;
  }

  getToolText(toolId, field) {
    return this.getText(toolId, 'tools')?.[field] || '';
  }


  updateUI() {
    // 更新标题和副标题
    document.querySelector('.logo').textContent = this.getText('appTitle');
    document.querySelector('.subtitle').textContent = this.getText('appSubtitle');

    // 更新侧栏分组标题（菜单由 ToolManager 根据注册表动态生成）
    document.querySelectorAll('.tool-menu-group').forEach((grp) => {
      const cat = grp.getAttribute('data-category');
      const titleEl = grp.querySelector('.tool-menu-group-title');
      if (cat && titleEl) titleEl.textContent = this.getText(cat, 'categories') || cat;
    });
    // 更新菜单项文案
    const menuItems = document.querySelectorAll('.menu-item span');
    menuItems.forEach((item) => {
      const toolId = item.parentElement.getAttribute('data-tool-id');
      if (toolId) item.textContent = this.getText(toolId, 'menuItems');
    });

    // 触发当前工具的重新渲染
    const currentTool = document.querySelector('.menu-item.active');
    if (currentTool) currentTool.click();
  }
}

export default new LanguageManager();