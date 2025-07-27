


export class InputCharCount {

  static requiredParams = [
    'selInput',
    'labels'
  ]



  static init = (params) => {
    const selInput = `${params.selInput}:not(.is-initialized)`;
    const allInputs = document.querySelectorAll(selInput);

    allInputs.forEach(input => new InputCharCount(input, params));
  }



  constructor(input, params) {
    this.input = input;
    this.defaultLang = 'en';
    this.maxChars = 0;
    this.availableLabels = params.labels;
    this.labels = {};

    this.markInitialized();

    if (!this.setLabel()) return;

    this.getMaxChars();
    this.createCounter();
    this.setCounterStatus();
    this.startListening();
  }



  get isCountdown() {
    return this.input.dataset.countdown === 'true';
  }



  markInitialized = () => {
    this.input.classList.add('is-initialized');
  }



  getMaxChars = () => {
    const maxLength = this.input.getAttribute('maxlength');
    if (maxLength) this.maxChars = parseInt(maxLength, 10);
  }



  setLabel = () => {
    let lang = document.documentElement.lang;
    if (!(lang in this.availableLabels)) lang = this.defaultLang;

    if (!(lang in this.availableLabels)) {
      this.handleMissingLabels();
      return false;
    }

    let labelType = 'default';
    if (this.isCountdown) labelType = 'countdown';

    if (!('prefix' in this.availableLabels[lang][labelType])) {
      this.handleMissingLabelPart('prefix');
      return false;
    }

    if (!('suffix' in this.availableLabels[lang][labelType])) {
      this.handleMissingLabelPart('suffix');
      return false;
    }

    this.labels.prefix = this.availableLabels[lang][labelType]['prefix'];
    this.labels.suffix = this.availableLabels[lang][labelType]['suffix'];

    return true;
  }



  createCounter = () => {
    this.counter = document.createElement('div');
    this.counter.classList.add('c-charCounter');
    this.counter.setAttribute('role', 'status');
    this.counter.setAttribute('aria-live', 'polite');
    this.input.after(this.counter);
  }



  startListening = () => {
    this.input.addEventListener('input', () => {
      this.setCounterStatus();
    })
  }



  setCounterStatus = () => {
    const charCount = this.input.value.length;

    let label = `${this.labels.prefix} ${charCount} ${this.labels.suffix}`;

    if (this.maxChars) {
      charCount >= this.maxChars
        ? this.input.classList.add('is-atLimit')
        : this.input.classList.remove('is-atLimit');

      let xOfN = `${charCount} / ${this.maxChars}`;

      if (this.isCountdown) {
        xOfN = `${this.maxChars - charCount} / ${this.maxChars}`;
      }

      label = `${this.labels.prefix} ${xOfN} ${this.labels.suffix}`;
    }

    this.counter.innerHTML = label;
  }



  handleMissingLabels = () => {
    console.warn('Missing labels in configuration data.');
    console.warn('Input char counter could not be initialized.');
  }



  handleMissingLabelPart = (labelPart) => {
    console.warn(`Missing label ${labelPart} in configuration data.`);
    console.warn('Input char counter could not be initialized.');
  }
}