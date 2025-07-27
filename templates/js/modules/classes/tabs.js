


export class Tabs {

  static requiredParams = [
    'selModule',
    'selTabTitle',
    'selTabContent'
  ]



  static init = (params) => {
    const allModules =
      document.querySelectorAll(`${params.selModule}:not(.is-initialized)`);
    allModules.forEach((tabModule) => new Tabs(tabModule, params));
  }



  constructor(tabModule, params) {
    this.module = tabModule;
    this.selTabTitle = params.selTabTitle;
    this.selTabContent = params.selTabContent;
    this.itemsMap = {};
    this.activeItem = null;

    this.markInitialized();
    this.createItemMap();
    this.showOrphanedContent();
    this.activateLinkedTab();
    this.activateDefaultTab();
    this.startListening();
  }



  markInitialized = () => this.module.classList.add("is-initialized");



  createItemMap = () => {
    this.module.querySelectorAll(this.selTabTitle).forEach((tabTitle) => {
      const target = tabTitle.dataset.content;
      if (!target) return;

      const tabContentItem = document.getElementById(target);

      if (!tabContentItem) {
        this.handleMissingContentItem(target);
        return;
      }

      this.itemsMap[target] = { tabTitle, tabContentItem };
    })
  }



  showOrphanedContent = () => {
    const allContentItems = this.module.querySelectorAll(this.selTabContent);

    allContentItems.forEach((contentItem) => {
      if (!this.itemsMap[contentItem.id])
        this.handleOrphanedContent(contentItem.id);
    })
  }



  activateLinkedTab = () => {
    const target = location.hash.replace("#", "");
    if (!this.itemsMap[target]) return;

    this.openTab(this.itemsMap[target]);
  }



  activateDefaultTab = () => {
    if (this.activeItem) return;
    const firstTab = Object.values(this.itemsMap)[0];
    if (firstTab) this.openTab(firstTab);
  }



  startListening = () => {
    this.module.addEventListener("click", this.handleClick);
    this.module.addEventListener("keydown", this.handleKeydown);
    this.module.addEventListener("keyup", this.handleKeyup);
  }



  handleClick = (e) => {
    const tabTitleEl = e.target.closest(this.selTabTitle);
    if (!tabTitleEl) return;

    const clickedTab = Object.values(this.itemsMap).find(
      (item) => item.tabTitle === tabTitleEl
    );

    if (!clickedTab || clickedTab === this.activeItem) return;

    this.openTab(clickedTab);
  }



  handleKeydown = (e) => {
    const currentTab = this.getActiveTab();
    if (!currentTab) return;

    if (e.key === "Enter" || e.key === " ") e.preventDefault();

    let newTab = null;

    switch (e.key) {
      case 'ArrowLeft':
        newTab = this.getPreviousTab(currentTab);
        break;
      case 'ArrowRight':
        newTab = this.getNextTab(currentTab);
        break;
      case 'Home':
        newTab = this.getFirstTab();
        break;
      case 'End':
        newTab = this.getLastTab();
        break;
      default:
        return;
    }

    if (newTab) newTab.tabTitle.focus();
  }



  handleKeyup = (e) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    const currentTab = this.getActiveTab();
    if (currentTab) this.openTab(currentTab);
  }



  openTab = (item) => {
    this.closeActiveTab();
    this.toggleItemClass(item, true);
    this.updateAriaAttributes(item, true);
    this.activeItem = item;
  }



  closeActiveTab = () => {
    if (!this.activeItem) return;
    this.toggleItemClass(this.activeItem, false);
    this.updateAriaAttributes(this.activeItem, false);
  }



  toggleItemClass = (item, isActive) => {
    item.tabTitle.classList.toggle("is-activeTab", isActive);
    item.tabContentItem.classList.toggle("is-activeTab", isActive);
  }



  updateAriaAttributes = (item, isActive) => {
    item.tabTitle.setAttribute("aria-selected", isActive ? "true" : "false");
    item.tabTitle.setAttribute("tabindex", isActive ? "0" : "-1");
    item.tabContentItem.hidden = !isActive;
  }



  getActiveTab = () =>
    Object.values(this.itemsMap).find((item) => item.tabTitle === document.activeElement);



  getFirstTab = () => Object.values(this.itemsMap)[0];
  getLastTab = () => Object.values(this.itemsMap).slice(-1)[0];
  getPreviousTab = (current) => this.getSiblingTab(current, -1);
  getNextTab = (current) => this.getSiblingTab(current, 1);



  getSiblingTab = (current, direction) => {
    const tabs = Object.values(this.itemsMap);
    const index = tabs.indexOf(current);
    const newIndex = (index + direction + tabs.length) % tabs.length;

    return tabs[newIndex];
  }



  handleOrphanedContent = (id) =>
    console.warn(`Orphaned tab content: '${id}'`);



  handleMissingContentItem = (id) =>
    console.warn(`Missing tab content: '${id}'`);
}