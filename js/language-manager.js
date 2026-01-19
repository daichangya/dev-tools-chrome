import i18n from './i18n.js';

class LanguageManager {
  constructor() {
    this.currentLanguage = 'zh';
    this.supportedLanguages = ['zh', 'en'];
    this.setupLanguageSelector();
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
      const [cat, k] = key.split('.');
      return langData[cat]?.[k] || key;
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

    // 更新菜单项
    const menuItems = document.querySelectorAll('.menu-item span');
    menuItems.forEach(item => {
      const toolId = item.parentElement.getAttribute('data-tool-id');
      if (toolId) {
        item.textContent = this.getText(toolId, 'menuItems');
      }
    });

    // 触发当前工具的重新渲染
    const currentTool = document.querySelector('.menu-item.active');
    if (currentTool) {
      currentTool.click();
    }
  }
}

export default new LanguageManager();