


export class ScrollbarObserver {

  static requiredParams = [
    'useResizeObserver',
    'useMutationObserver',
    'useBodyObserver',
    'useWindowResize',
    'getCssCustomProperty',
    'getScrollbarWidth'
  ]



  static init = (params) => {
    const scope = document.body;
    const isAlreadySet =
      params.getCssCustomProperty(scope, '--scrollbarWidth') !== '';

    if (isAlreadySet) return;

    new ScrollbarObserver(params);
  }



  constructor(params = {}) {

    const {
      useResizeObserver = true,
      useMutationObserver = true,
      useBodyObserver = false,
      useWindowResize = true,
    } = params;

    this.root = document.documentElement;
    this.rootStyle = this.root.style;
    this.scrollbarWidth = 0;
    this.lastWidth = 0;
    this.observers = [];

    this.getScrollbarWidth = params.getScrollbarWidth;

    this.measureScrollbarWidth();
    this.setInitialState()

    this.initObservers({
      useResizeObserver,
      useMutationObserver,
      useBodyObserver,
      useWindowResize,
    })
  }



  measureScrollbarWidth() {
    const scrollDiv = document.createElement('div');

    scrollDiv.style.width = '100px';
    scrollDiv.style.height = '100px';
    scrollDiv.style.overflow = 'scroll';
    scrollDiv.style.position = 'absolute';
    scrollDiv.style.top = '-9999px';

    document.body.appendChild(scrollDiv);
    this.scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
    document.body.removeChild(scrollDiv);
  }



  setInitialState = () => {
    const hasInitialScrollbar = !!this.getScrollbarWidth();

    if (hasInitialScrollbar) {
      this.setCustomProperties(this.scrollbarWidth);
      return;
    }

    this.setCustomProperties(0);
  }



  setCustomProperties(scrollbarWidth) {
    requestAnimationFrame(() => {
      this.rootStyle.setProperty('--scrollbarWidth', `${scrollbarWidth}px`);
      this.rootStyle.setProperty('--scrollbarCompensation',
        `${scrollbarWidth === 0 ? this.scrollbarWidth : 0}px`);
    })
  }


  
  updateScrollbarVars() {
    const currentWidth = this.getScrollbarWidth();

    if (currentWidth !== this.lastWidth) {
      this.setCustomProperties(currentWidth);
      this.lastWidth = currentWidth;
    }
  }



  initObservers({
    useResizeObserver,
    useMutationObserver,
    useBodyObserver,
    useWindowResize
  }) {

    if (useResizeObserver && 'ResizeObserver' in window) {
      const resizeObserver =
        new ResizeObserver(() => this.updateScrollbarVars());

      resizeObserver.observe(this.root);
      this.observers.push(() => resizeObserver.disconnect());
    }



    if (useMutationObserver && 'MutationObserver' in window) {
      const mutationObserver =
        new MutationObserver(() => this.updateScrollbarVars());

      mutationObserver.observe(this.root, {
        attributes: true,
        attributeFilter: ['style', 'class'],
      });

      this.observers.push(() => mutationObserver.disconnect());
    }



    if (useBodyObserver && 'MutationObserver' in window) {
      const bodyObserver =
        new MutationObserver(() => this.updateScrollbarVars());

      bodyObserver.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        characterData: true,
      });

      this.observers.push(() => bodyObserver.disconnect());
    }



    if (useWindowResize) {
      const handler = () => this.updateScrollbarVars();

      window.addEventListener('resize', handler);
      this.observers.push(() =>
        window.removeEventListener('resize', handler));
    }
  }



  triggerUpdate() {
    this.updateScrollbarVars();
  }



  stopObserving() {
    this.observers.forEach(fn => fn());
  }
}