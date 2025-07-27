


export class Tabcordion {

  static requiredParams = [
    'selModule',
    'selTabcordionTitle',
    'selTabcordionContent',
    'isViewportOrUp',
    'debounceThenExecute'
  ]



  static init = (params) => {
    const selTabcordionModule = `${params.selModule}:not(.is-initialized)`;
    const allTabcordionModules = document.querySelectorAll(selTabcordionModule);

    allTabcordionModules.forEach(tabcordionModule => {
      new Tabcordion(tabcordionModule, params);
    });
  }



  constructor(tabcordionModule, params) {
    this.module = tabcordionModule;
    this.mode = '';
    this.selTitle = params.selTabcordionTitle;
    this.selContent = params.selTabcordionContent;
    this.itemsMap = {};
    this.activeItem = null;
    this.isViewportOrUp = params.isViewportOrUp;
    this.debounceThenExecute = params.debounceThenExecute;

    this.markInitialized();
    this.defineMode();
    this.createItemMap();
    this.createAccordionTitles();
    this.showOrphanedContent();
    this.activateLinkedItem();
    this.activateDefaultItem();
    this.startListening();
    this.watchResize();
  }



  markInitialized = () => {
    this.module.classList.add('is-initialized');
  }



  defineMode = () => {
    const tabViewport = this.module.dataset.tabviewport;

    this.isViewportOrUp(tabViewport)
      ? this.setMode('tabs', 'accordion')
      : this.setMode('accordion', 'tabs');
  }



  setMode = (modeToAdd, modeToRemove) => {
    if (this.module.classList.contains(`is-${modeToAdd}`)) return;
    this.module.classList.remove(`is-${modeToRemove}`);
    this.module.classList.add(`is-${modeToAdd}`);
    this.mode = modeToAdd;
  }



  createItemMap = () => {
    const allItemTitles = this.module.querySelectorAll(this.selTitle);

    allItemTitles.forEach(itemTitle => {
      const target = itemTitle.dataset.content;
      if (!target) return;

      const itemContent = document.getElementById(target);

      if (!itemContent) {
        this.handleMissingContentItem(target);
        return;
      }

      this.itemsMap[target] = { itemTitle, itemContent };
    })
  }



  createAccordionTitles = () => {
    const allItems = Object.values(this.itemsMap);

    allItems.forEach((item) => {
      const itemID = item.itemContent.id;
      const accordionTitle = document.createElement('button');
      const label = item.itemContent.dataset.label;

      accordionTitle.classList.add('m-tabcordion__accordionTitle', 'js-tabcordionAccordionTitle');
      accordionTitle.addEventListener('click', () => this.openItem(item));
      accordionTitle.setAttribute('role', 'tab');
      accordionTitle.setAttribute('aria-controls', itemID);
      accordionTitle.setAttribute('aria-selected', 'false');
      accordionTitle.setAttribute('tabindex', -1);
      accordionTitle.innerHTML = label;
      item.itemContent.before(accordionTitle);

      this.itemsMap[itemID]['accordionTitle'] = accordionTitle;
    });
  }



  showOrphanedContent = () => {
    const allContentItems = this.module.querySelectorAll(this.selContent);

    allContentItems.forEach(contentItem => {
      if (!this.itemsMap.hasOwnProperty(contentItem.id)) {
        this.handleOrphanedContent(contentItem.id);
      }
    });
  }



  activateLinkedItem = () => {
    if (!location.hash) return;

    const target = location.hash.replace('#', '');

    if (!this.itemsMap.hasOwnProperty(target)) {
      this.handleMissingLinkedItem(target);
      return;
    }

    this.openItem(this.itemsMap[target]);
  }



  activateDefaultItem = () => {
    if (this.activeItem) return;
    const firstItem = Object.values(this.itemsMap)[0];
    this.openItem(firstItem);
  }



  startListening = () => {
    this.module.addEventListener('click', (event) => {
      const target = event.target;
      const clickedItem =
        Object.values(this.itemsMap).find(item =>
          item.itemTitle === target || item.accordionTitle === target);

      if (!clickedItem || clickedItem === this.activeItem) return;

      this.openItem(clickedItem);
    })

    this.module.addEventListener("keydown", this.handleKeydown);
    this.module.addEventListener("keyup", this.handleKeyup);
  }



  handleKeydown = (event) => {
    const currentItem = this.getFocusedItem();
    if (!currentItem) return;

    const { key } = event;

    if (key === 'Enter' || key === ' ') {
      event.preventDefault();
      return;
    }

    let newItem = null;

    switch (key) {
      case 'ArrowLeft':
      case 'ArrowUp':
        newItem = this.getPreviousItem(currentItem);
        break;
      case 'ArrowRight':
      case 'ArrowDown':
        newItem = this.getNextItem(currentItem);
        break;
      case 'Home':
        newItem = this.getFirstItem();
        break;
      case 'End':
        newItem = this.getLastItem();
        break;
      default:
        return;
    }

    if (!newItem) return;

    const focusTarget = this.mode === 'accordion'
      ? newItem.accordionTitle
      : newItem.itemTitle;

    focusTarget.focus();
  }




  handleKeyup = (e) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    const currentTab = this.getFocusedItem();
    if (currentTab) this.openItem(currentTab);
  }



  openItem = (item) => {
    this.closeActiveItem();
    this.toggleItemClass(item, 'add');
    this.updateAriaAttributes(item, true);
    this.activeItem = item;
  }



  closeActiveItem = () => {
    if (!this.activeItem) return;
    this.toggleItemClass(this.activeItem, 'remove');
    this.updateAriaAttributes(this.activeItem, false);
  }



  toggleItemClass = (item, action) => {
    ['itemTitle', 'accordionTitle', 'itemContent'].forEach(prop => {
      item[prop].classList[action]('is-activeTabcordionItem');
    })
  }



  updateAriaAttributes = (item, isActive) => {
    item.itemTitle.setAttribute("aria-selected", isActive ? "true" : "false");
    item.itemTitle.setAttribute("tabindex", isActive ? "0" : "-1");
    item.accordionTitle.setAttribute("aria-selected", isActive ? "true" : "false");
    item.accordionTitle.setAttribute("tabindex", isActive ? "0" : "-1");
    item.itemContent.hidden = !isActive;
  }



  watchResize = () => {
    const resizeDebounced = this.debounceThenExecute(this.defineMode, 300);
    window.addEventListener('resize', () => {
      resizeDebounced();
    });
  }



  getFocusedItem = () =>
    Object.values(this.itemsMap).find((item) =>
      item.itemTitle === document.activeElement
      || item.accordionTitle === document.activeElement
    );



  getFirstItem = () => Object.values(this.itemsMap)[0];
  getLastItem = () => Object.values(this.itemsMap).slice(-1)[0];
  getPreviousItem = (current) => this.getSiblingTab(current, -1);
  getNextItem = (current) => this.getSiblingTab(current, 1);



  getSiblingTab = (current, direction) => {
    const tabs = Object.values(this.itemsMap);
    const index = tabs.indexOf(current);
    const newIndex = (index + direction + tabs.length) % tabs.length;

    return tabs[newIndex];
  }



  handleOrphanedContent = (item) => {
    console.warn(`Orphaned tabcordion content item '${item}'`);
  }



  handleMissingLinkedItem = (item) => {
    console.warn(`Missing linked item '${item}'`);
  }



  handleMissingContentItem = (item) => {
    console.warn(`Missing tabcordion content '${item}'`);
  }
}