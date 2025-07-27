


export class Accordion {

  static requiredParams = [
    'selAccordion',
    'selTitle',
    'selContent',
    'getCssCustomProperty'
  ]


  
  static init = (params) => {
    const selAccordion = `${params.selAccordion}:not(.is-initialized)`;
    const allAccordions = document.querySelectorAll(selAccordion);

    allAccordions.forEach(accordion => new Accordion(accordion, params));
  }



  constructor(accordion, params) {
    this.accordion = accordion;
    this.selTitle = params.selTitle;
    this.selContent = params.selContent;
    this.itemsMap = new Map();
    this.getCssCustomProperty = params.getCssCustomProperty;
    this.isOpenSingle = this.accordion.dataset.type === 'openSingle';
    this.animationDelay = 0;

    this.markInitialized();
    this.getAnimationDelay();
    this.createItemsMap();
    this.startListening();
  }



  markInitialized = () => {
    this.accordion.classList.add('is-initialized');
  }



  getAnimationDelay = () => {
    const scope = document.body;
    const delay = this.getCssCustomProperty(scope, '--an-duration');
    const delayUnitless = parseFloat(delay.replace('s', ''));
    const delayInMs = delayUnitless * 1000;

    this.animationDelay = delayInMs;
  }



  createItemsMap = () => {
    const allTitles = this.accordion.querySelectorAll(this.selTitle);

    allTitles.forEach(title => {
      const contentID = title.dataset.content;
      const content = this.accordion.querySelector(`#${contentID}`);
      this.itemsMap.set(title, content);
    })
  }



  startListening = () => {
    this.accordion.addEventListener('click', (e) => {
      const clickedTitle =
        [...this.itemsMap.keys()].find(title => title.contains(e.target));

      if (clickedTitle) this.setItemState(e.target);
    })

    this.accordion.addEventListener('keyup', this.checkKey);
  }



  setItemState = (title) => {
    const hasClickedOnOpenSingleItem =
      this.isOpenSingle && title.classList.contains('is-active');

    if (hasClickedOnOpenSingleItem) {
      this.toggleItem(title);
      return;
    }

    if (this.isOpenSingle) this.closeAllItems();
    this.toggleItem(title);
    // this.scrollActiveItemIntoView(title);
  }



  checkKey = (e) => {
    e.preventDefault();

    switch (e.key) {
      case ' ':
        this.setItemState(e.target)
        break;
      default:
        return;
    }
  }



  toggleItem = (title) => {
    const content = this.itemsMap.get(title);

    let ariaState = title.getAttribute("aria-expanded") === 'true';
    ariaState = !ariaState;
    title.setAttribute("aria-expanded", ariaState);

    content.classList.toggle('is-open');
    title.classList.toggle('is-active');
  };



  scrollActiveItemIntoView = (title) => {
    setTimeout(() => { title.scrollIntoView(); }, this.animationDelay);
  }



  closeAllItems = () => {
    this.itemsMap.forEach((content, title) => {
      title.setAttribute('aria-expanded', 'false');
      title.classList.remove('is-active');
      content.classList.remove('is-open');
    })
  }
}