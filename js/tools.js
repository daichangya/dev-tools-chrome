// 工具模块管理器：从注册表读工具列表，动态生成侧栏菜单
import languageManager from './language-manager.js';
import { TOOL_REGISTRY, CATEGORY_ORDER } from './tool-registry.js';

class ToolManager {
  constructor() {
    this.currentTool = null;
    this.tools = {};
    this.sidebarCollapsed = this.getSidebarState();
    this.initializeTools();
    this.renderToolMenu();
    this.setupEventListeners();
    this.setupSidebarToggle();
    this.setupSearch();
    const defaultItem = document.querySelector('[data-tool-id="jsonformatter"]');
    if (defaultItem) this.switchTool(defaultItem);
  }

  initializeTools() {
    for (const entry of TOOL_REGISTRY) {
      this.tools[entry.id] = entry.loader();
    }
  }

  /** 根据注册表与当前语言生成侧栏菜单（分组 + 菜单项） */
  renderToolMenu() {
    const container = document.getElementById('tool-menu-list');
    if (!container) return;
    
    const fragment = document.createDocumentFragment();
    const collapsedState = this.getCollapsedState();
    
    for (const cat of CATEGORY_ORDER) {
      const entries = TOOL_REGISTRY.filter((e) => e.category === cat);
      if (entries.length === 0) continue;
      
      const group = document.createElement('div');
      group.className = 'tool-menu-group';
      group.setAttribute('data-category', cat);
      
      // 分组标题
      const title = document.createElement('div');
      title.className = 'tool-menu-group-title';
      title.innerHTML = `
        <span>${languageManager.getText(cat, 'categories') || cat}</span>
        <i class="mdi mdi-chevron-down collapse-icon"></i>
      `;
      
      // 点击标题折叠/展开
      title.addEventListener('click', (e) => {
        e.stopPropagation();
        group.classList.toggle('collapsed');
        this.saveCollapsedState();
      });
      
      // 应用初始折叠状态
      if (collapsedState[cat]) {
        group.classList.add('collapsed');
      }
      
      group.appendChild(title);
      
      // 菜单项容器
      const itemsContainer = document.createElement('div');
      itemsContainer.className = 'tool-menu-group-items';
      
      for (const entry of entries) {
        const item = document.createElement('div');
        item.className = 'menu-item';
        item.setAttribute('data-tool-id', entry.id);
        item.setAttribute('data-category', entry.category);
        item.setAttribute('data-tooltip', languageManager.getText(entry.id, 'menuItems') || entry.id);
        item.innerHTML = `<i class="mdi ${entry.icon}"></i><span>${languageManager.getText(entry.id, 'menuItems') || entry.id}</span>`;
        itemsContainer.appendChild(item);
      }
      
      group.appendChild(itemsContainer);
      fragment.appendChild(group);
    }
    
    container.innerHTML = '';
    container.appendChild(fragment);
  }

  setupEventListeners() {
    const container = document.getElementById('tool-menu-list');
    if (!container) return;
    container.addEventListener('click', (e) => {
      const item = e.target.closest('.menu-item');
      if (item) this.switchTool(item);
    });
  }

  switchTool(menuItem) {
    document.querySelectorAll('.menu-item').forEach((el) => el.classList.remove('active'));
    if (menuItem) menuItem.classList.add('active');
    const toolId = menuItem ? (menuItem.getAttribute('data-tool-id') || '') : '';
    if (this.tools[toolId]) {
      if (this.currentTool) this.currentTool.hide();
      this.currentTool = this.tools[toolId];
      this.currentTool.show();
    } else if (toolId) {
      console.error(`Tool with ID ${toolId} not found.`);
    }
  }

  getToolId(menuItem) {
    return menuItem ? (menuItem.getAttribute('data-tool-id') || '') : '';
  }

  // 设置侧边栏折叠功能
  setupSidebarToggle() {
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.getElementById('sidebar-toggle');
    
    if (!sidebar || !toggleBtn) return;
    
    // 应用初始状态
    if (this.sidebarCollapsed) {
      sidebar.classList.add('collapsed');
      this.updateMainContentLayout();
    }
    
    toggleBtn.addEventListener('click', () => {
      sidebar.classList.toggle('collapsed');
      this.sidebarCollapsed = sidebar.classList.contains('collapsed');
      this.saveSidebarState();
      
      // 更新主内容区布局
      this.updateMainContentLayout();
    });
  }

  // 更新主内容区布局
  updateMainContentLayout() {
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    if (!sidebar || !mainContent) return;
    
    const isCollapsed = sidebar.classList.contains('collapsed');
    if (isCollapsed) {
      mainContent.style.marginLeft = '60px';
      mainContent.style.width = 'calc(100% - 60px)';
    } else {
      mainContent.style.marginLeft = '280px';
      mainContent.style.width = 'calc(100% - 280px)';
    }
  }

  // 获取侧边栏状态
  getSidebarState() {
    try {
      return localStorage.getItem('sidebar-collapsed') === 'true';
    } catch {
      return false;
    }
  }

  // 保存侧边栏状态
  saveSidebarState() {
    try {
      localStorage.setItem('sidebar-collapsed', this.sidebarCollapsed.toString());
    } catch {}
  }

  // 获取分组折叠状态
  getCollapsedState() {
    try {
      const saved = localStorage.getItem('tool-menu-collapsed');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  }

  // 保存分组折叠状态
  saveCollapsedState() {
    const state = {};
    document.querySelectorAll('.tool-menu-group').forEach((group) => {
      const cat = group.getAttribute('data-category');
      state[cat] = group.classList.contains('collapsed');
    });
    try {
      localStorage.setItem('tool-menu-collapsed', JSON.stringify(state));
    } catch {}
  }

  // 设置搜索功能
  setupSearch() {
    const searchInput = document.getElementById('tool-search');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      const menuItems = document.querySelectorAll('.menu-item');
      const groups = document.querySelectorAll('.tool-menu-group');
      
      let hasMatches = false;
      
      menuItems.forEach((item) => {
        const text = item.textContent.toLowerCase();
        const toolId = item.getAttribute('data-tool-id');
        const matches = text.includes(query) || toolId.includes(query);
        
        item.style.display = matches ? '' : 'none';
        
        // 如果匹配，展开其所在分组
        if (matches && query) {
          const group = item.closest('.tool-menu-group');
          if (group) {
            group.classList.remove('collapsed');
            hasMatches = true;
          }
        }
      });
      
      // 如果没有搜索词，恢复所有项显示
      if (!query) {
        menuItems.forEach((item) => {
          item.style.display = '';
        });
      }
    });
  }
}

export default ToolManager;
