


export class Scrollspy {

  static requiredParams = [
    'selNav',
    'selNavItem',
    'selContentItem'
  ]



  static init = (params) => {
    const selNav = `${params.selNav}:not(.is-initialized)`;
    const allNavs = document.querySelectorAll(selNav);

    allNavs.forEach(nav => new Scrollspy(nav, params));
  }



  constructor(nav, params) {
    this.nav = nav;
    this.selNavItem = params.selNavItem;
    this.selContentArea = `.${this.nav.dataset.contentarea}`;
    this.selContentItem = params.selContentItem;
    this.itemsMap = {};
    this.intersectingContent = [];
    this.highlightTopmost = this.nav.dataset.highlight != 'bottom';

    if (!this.hasContentArea()) {
      this.handleMissingContentArea();
      return;
    }

    this.content = document.querySelector(this.selContentArea);

    if (!this.content) {
      this.handleMissingContentArea();
      return;
    }

    this.markInitialized();
    this.createItemsMap();
    this.showOrphanedContent();
    this.observeAllContentItems();
  }



  markInitialized = () => {
    this.nav.classList.add('is-initialized');
  }



  createItemsMap = () => {
    const allNavItems = this.nav.querySelectorAll(this.selNavItem);

    allNavItems.forEach(navItem => {
      const anchor = this.getHrefAnchor(navItem);
      if (!anchor) return;

      const contentItem = document.getElementById(anchor);

      if (!contentItem) {
        this.handleMissingContentItem(anchor);
        return;
      }

      this.itemsMap[anchor] = { navItem, contentItem };
    })
  }



  getHrefAnchor = (navItem) => {

    if (!navItem.href) {
      this.handleMissingHref(navItem);
      return;
    }

    const anchor = new URL(navItem.href).hash.substring(1);

    if (!anchor) {
      this.handleMissingHrefAnchor(navItem);
      return;
    }

    return anchor;
  }



  showOrphanedContent = () => {
    const allContentItems = this.content.querySelectorAll(this.selContentItem);

    allContentItems.forEach(contentItem => {
      if (!this.itemsMap.hasOwnProperty(contentItem.id)) {
        this.handleOrphanedContent(contentItem.id);
      }
    })
  }



  observeAllContentItems = () => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(this.updateIntersectingContent);

      this.deactivateAllNavItems();
      const activeItem = this.findActiveItem();
      if (activeItem) this.activateNavItem(activeItem);
    })

    Object.values(this.itemsMap).forEach(mapEntry => {
      observer.observe(mapEntry.contentItem);
    })
  }



  updateIntersectingContent = (entry) => {

    if (entry.isIntersecting) {

      if (!this.intersectingContent.includes(entry.target)) {
        this.intersectingContent.push(entry.target);
        return;
      }
    }

    this.intersectingContent =
      this.intersectingContent.filter(item => item !== entry.target);
  }



  findActiveItem = () => {
    if (this.intersectingContent.length === 0) return null;

    const sortedItems = [...this.intersectingContent].sort((a, b) => {
      const aTop = a.getBoundingClientRect().top;
      const bTop = b.getBoundingClientRect().top;
      return aTop - bTop;
    })

    return this.highlightTopmost
      ? sortedItems[0]
      : sortedItems[sortedItems.length - 1];
  }



  activateNavItem = (contentItem) => {
    const navItem = this.getMatchingNavItem(contentItem);
    navItem.classList.add('is-active');
    navItem.setAttribute('aria-current', 'true');
  }



  deactivateAllNavItems = () => {
    Object.values(this.itemsMap).forEach(mapEntry => {
      mapEntry.navItem.classList.remove('is-active');
      mapEntry.navItem.removeAttribute('aria-current');
    })
  }



  getMatchingNavItem = (contentItem) => this.itemsMap[contentItem.id].navItem;



  hasContentArea = () => !!document.querySelector(this.selContentArea);



  handleMissingContentArea = () => {
    console.warn('Missing content area for scrollspy navigation');
  }



  handleMissingHref = (navItem) => {
    console.warn(`Missing href attribute at '${navItem.outerHTML}'`);
  }



  handleMissingHrefAnchor = (navItem) => {
    console.warn(`Missing href anchor at ${navItem.outerHTML}`);
  }



  handleMissingContentItem = (item) => {
    console.warn(`No matching content for scrollspy item '${item}'`);
  }



  handleOrphanedContent = (contentItem) => {
    console.warn(`Orphaned scrollspy content '${contentItem}'`);
  }
}