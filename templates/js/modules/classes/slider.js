


export class Slider {

  static init = (params) => {
    const selSlider = `${params.selSlider}:not(.is-initialized)`;
    const allSliders = document.querySelectorAll(selSlider);

    allSliders.forEach(slider => new Slider(slider, params));
  }



  constructor(slider, params) {
    this.allConfigs = params.config;
    this.slider = slider;
    this.generateRandomString = params.generateRandomString;

    this.type = '';
    this.uniqueString = '';
    this.uniqueClass = '';
    this.config = {};
    this.clonedConfig = {};
    this.swiper = null;

    this.initSlider();
  }



  initSlider = () => {
    this.type = this.slider.dataset.type;

    if (!this.type) {
      this.handleMissingSliderType();
      return;
    }

    this.uniqueClass = this.createUniqueClass();
    this.clonedConfig = this.adaptConfig();

    if (!this.clonedConfig) return;

    this.markInitialized();
    this.initKeyboardHandling();

    this.swiper = new Swiper(this.slider, this.clonedConfig);
  }



  markInitialized = () => {
    this.slider.classList.add(this.uniqueClass, 'is-initialized');
    this.slider.setAttribute('tabindex', '0'); // macht das Element fokussierbar
  }



  createUniqueClass = () => {
    const uniqueString = this.generateRandomString(10);
    const uniqueClass = `slider-${uniqueString}`;
    return uniqueClass;
  }



  adaptConfig = () => {
    let currentConfig = this.allConfigs[this.type];

    if (!currentConfig) {
      this.handleMissingConfig();
      return;
    }

    currentConfig = JSON.parse(JSON.stringify(currentConfig));
    currentConfig = this.adaptNavigation(currentConfig);
    currentConfig = this.adaptPagination(currentConfig);

    currentConfig.keyboard = {
      enabled: false,
      onlyInViewport: false,
    };

    return currentConfig;
  }



  adaptNavigation = (config) => {
    if (!config['navigation']) return config;

    const prevElement = config['navigation']['prevEl'];
    const nextElement = config['navigation']['nextEl'];
    const newPrevElement = `.${this.uniqueClass} ${prevElement}`;
    const newNextElement = `.${this.uniqueClass} ${nextElement}`;
    config['navigation']['prevEl'] = newPrevElement;
    config['navigation']['nextEl'] = newNextElement;

    return config;
  }



  adaptPagination = (config) => {
    if (!config['pagination']) return config;

    const paginationElement = config['pagination']['el'];
    const newPaginationElement = `.${this.uniqueClass} ${paginationElement}`;
    config['pagination']['el'] = newPaginationElement;

    return config;
  }



  initKeyboardHandling = () => {
    this.slider.addEventListener('focusin', () => {
      if (this.swiper?.keyboard?.enable) {
        this.swiper.keyboard.enable();
      }
    });

    this.slider.addEventListener('focusout', () => {
      if (this.swiper?.keyboard?.disable) {
        this.swiper.keyboard.disable();
      }
    });
  }



  handleMissingSliderType = () => {
    console.warn(`Missing slider type for ${this.uniqueClass}`);
    console.warn(`Slider initialization failed!`);
  }



  handleMissingConfig = () => {
    console.warn(`Missing configuration for ${this.uniqueClass}`);
    console.warn(`Slider initialization failed!`);
  }
}