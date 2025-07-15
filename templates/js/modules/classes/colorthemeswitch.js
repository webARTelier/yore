


export class ColorThemeSwitch {

  static init = (params) => {
    const selSwitch = `${params.selSwitch}:not(.is-initialized)`;
    const allSwitches = document.querySelectorAll(selSwitch);

    allSwitches.forEach(colorSwitch => {
      new ColorThemeSwitch(colorSwitch, params);
    })
  }



  constructor(colorSwitch, params) {
    this.switch = colorSwitch;
    this.themes = params.themes;
    this.selOptionsParent = params.selOptionsParent;
    this.optionsParent = document.querySelector(params.selOptionsParent);

    if (!this.optionsParent) {
      this.handleMissingOptionsContainer();
      return;
    }

    this.selOption = params.selOption;
    this.classRoot = document.querySelector(params.selClassRoot);

    if (!this.classRoot) {
      this.handleMissingClassRoot();
      return;
    }

    this.markInitialized();
    this.createOptions();
    this.startListening();
    this.setPreselected();
  }



  markInitialized = () => {
    this.switch.classList.add('is-initialized');
  }



  createOptions = () => {
    const optionHook = this.selOption.replace('.', '');
    let optionsHTML = '';

    Object.keys(this.themes).forEach(theme => {
      optionsHTML += `<div class="m-colorSwitch__option ${optionHook}" data-theme="${theme}">${theme}</div>`;
    })

    this.optionsParent.innerHTML = optionsHTML;
    this.allOptions = this.optionsParent.querySelectorAll(this.selOption);
  }



  startListening = () => {
    this.switch.addEventListener('click', (e) => {
      const clickedTheme = e.target.dataset.theme;
      if (!clickedTheme) return;
      this.setColorTheme(clickedTheme);
    })
  }



  setColorTheme = (theme) => {
    localStorage.setItem('colorTheme', theme);
    this.deactivateThemes();
    this.activateTheme(theme);
  }



  activateTheme = (theme) => {
    const themeClass = this.themes[theme];
    if (!themeClass) return;


    const activeOption = this.switch.querySelector(`[data-theme="${theme}"]`);
    if (activeOption) activeOption.classList.add('is-active');

    this.classRoot.classList.add(themeClass);
  }



  deactivateThemes = () => {
    this.allOptions.forEach(option => option.classList.remove('is-active'));

    Object.values(this.themes).forEach(themeClass => {
      this.classRoot.classList.remove(themeClass);
    })
  }



  setPreselected = () => {
    const preselectedTheme = localStorage.getItem('colorTheme');
    const systemPrefersDark =
      window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (preselectedTheme) {
      this.activateTheme(preselectedTheme);
      return;
    }

    if (!('dark' in this.themes) || !('light' in this.themes)) return;

    !preselectedTheme && systemPrefersDark
      ? this.activateTheme('dark')
      : this.activateTheme('light');
  }



  handleMissingOptionsContainer = () => {
    console.warn('Missing options container! Initialization failed!');
  }



  handleMissingClassRoot = () => {
    console.warn('Missing class root element! Initialization failed!');
  }
}