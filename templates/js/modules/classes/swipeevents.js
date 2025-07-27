


export class SwipeEvents {

  static requiredParams = [
    'selSwipeElement',
    'swipeThreshold',
    'swipeTimeout',
    'swipeUnit',
    'debounceThenExecute'
  ]



  static init = (params) => {
    const selSwipeElement = `${params.selSwipeElement}:not(.is-initialized)`;
    const allSwipeElements = document.querySelectorAll(selSwipeElement);

    allSwipeElements.forEach(swipeElement => {
      new SwipeEvents(swipeElement, params);
    })
  }



  constructor(swipeElement, params) {
    this.swipeElement = swipeElement;
    this.swipeThreshold = params.swipeThreshold;
    this.swipeTimeout = params.swipeTimeout;
    this.swipeUnit = params.swipeUnit;
    this.debounceThenExecute = params.debounceThenExecute;

    this.xDown = null;
    this.yDown = null;
    this.xDiff = null;
    this.yDiff = null;
    this.timeDown = null;
    this.timeDiff = null;
    this.startEl = null;
    this.touchCount = 0;
    this.changedTouches = [];

    this.defineSwipeThreshold();
    this.startListening();
    this.markInitialized();
    this.watchResize();
  }



  markInitialized = () => {
    this.swipeElement.classList.add('is-initialized');
  }



  startListening = () => {
    const events = {
      'touchstart': this.handleTouchStart,
      'touchmove': this.handleTouchMove,
      'touchend': this.handleTouchEnd,
      'touchcancel': this.resetValues
    }

    Object.entries(events).forEach(([event, handler]) => {
      this.swipeElement.addEventListener(event, handler);
    })
  }



  handleTouchStart = (e) => {
    this.touchCount = e.touches.length;

    if (this.touchCount > 1) {
      this.resetValues();
      return;
    }

    this.startEl = e.target;
    this.timeDown = Date.now();
    this.xDown = e.touches[0].clientX;
    this.yDown = e.touches[0].clientY;
    this.xDiff = 0;
    this.yDiff = 0;
  }



  handleTouchMove = (e) => {
    if (!this.xDown || !this.yDown) return;
    if (e.touches.length > 1) {

      this.resetValues();
      return;
    }

    const xUp = e.touches[0].clientX;
    const yUp = e.touches[0].clientY;

    this.xDiff = this.xDown - xUp;
    this.yDiff = this.yDown - yUp;
  }



  handleTouchEnd = (e) => {
    if (this.touchCount > 1 || this.startEl !== e.target) {
      this.resetValues();
      return;
    }

    this.timeDiff = Date.now() - this.timeDown;
    this.changedTouches = e.changedTouches || e.touches || [];
    this.eventType = this.determineSwipeEventType();

    if (!this.eventType) {
      this.resetValues();
      return;
    }

    this.createEventData();
    this.dispatchSwipeEvents();
    this.resetValues();
  }



  defineSwipeThreshold = () => {
    if (this.swipeUnit === 'vh')
      this.swipeThreshold = this.getThresholdVhInPx();

    if (this.swipeUnit === 'vw')
      this.swipeThreshold = this.getThresholdVwInPx();
  }



  getThresholdVwInPx = () =>
    Math.round((this.swipeThreshold / 100) * document.documentElement.clientWidth);

  getThresholdVhInPx = () =>
    Math.round((this.swipeThreshold / 100) * document.documentElement.clientHeight);



  determineSwipeEventType = () => {
    if (Math.abs(this.xDiff) > Math.abs(this.yDiff)) {
      return this.determineHorizontalSwipe();
    }
    return this.determineVerticalSwipe();
  }



  determineHorizontalSwipe = () => {
    if (Math.abs(this.xDiff) <= this.swipeThreshold) return '';
    if (this.timeDiff >= this.swipeTimeout) return '';
    return this.xDiff > 0 ? 'yoreSwipe-left' : 'yoreSwipe-right';
  }



  determineVerticalSwipe = () => {
    if (Math.abs(this.yDiff) <= this.swipeThreshold) return '';
    if (this.timeDiff >= this.swipeTimeout) return '';
    return this.yDiff > 0 ? 'yoreSwipe-up' : 'yoreSwipe-down';
  }



  createEventData = () => {
    this.eventData = {
      dir: this.eventType.replace(/swiped-/, ''),
      touchType: (this.changedTouches[0] || {}).touchType || 'direct',
      fingers: this.touchCount,
      xStart: parseInt(this.xDown, 10),
      xEnd: parseInt((this.changedTouches[0] || {}).clientX || -1, 10),
      yStart: parseInt(this.yDown, 10),
      yEnd: parseInt((this.changedTouches[0] || {}).clientY || -1, 10)
    }
  }



  dispatchSwipeEvents = () => {
    this.startEl.dispatchEvent(new CustomEvent('yoreSwipe', {
      bubbles: true,
      cancelable: true,
      detail: this.eventData
    }))

    this.startEl.dispatchEvent(new CustomEvent(this.eventType, {
      bubbles: true,
      cancelable: true,
      detail: this.eventData
    }))
  }



  resetValues = () => {
    this.xDown = null;
    this.yDown = null;
    this.xDiff = null;
    this.yDiff = null;
    this.timeDown = null;
    this.timeDiff = null;
    this.eventType = null;
    this.eventData = null;
    this.startEl = null;
    this.changedTouches = [];
    this.touchCount = 0;
  }



  watchResize = () => {
    const resizeDebounced =
      this.debounceThenExecute(this.defineSwipeThreshold, 300);
    window.addEventListener('resize', () => resizeDebounced());
  }
}