


export class FormProgress {

  static requiredParams = [
    'selForm',
    'selBar',
    'selField',
    'selValue'
  ]



  static init = (params) => {
    const selForm = `${params.selForm}:not(.has-progressbar)`;
    const allForms = document.querySelectorAll(selForm);

    allForms.forEach(form => new FormProgress(form, params));
  }



  constructor(form, params) {
    this.form = form;
    this.selBar = params.selBar;
    this.selField = params.selField;
    this.selValue = params.selValue;

    this.start = 0;
    this.end = 100;
    this.totalFields = 0;
    this.radioBtnDoublets = 0;
    this.filledFields = 0;
    this.progressPerField = 0;

    this.bar = this.form.querySelector(this.selBar);
    this.value = this.form.querySelector(this.selValue);

    if (!this.hasRequiredElements()) return;

    this.markInitialized();
    this.determineStartEnd();
    this.collectFields();
    this.countRadioBtnDoublets();
    this.calculateProgressPerField();
    this.updateProgress();
    this.startListening();
  }



  markInitialized = () => {
    this.form.classList.add('has-progressbar');
  }



  hasRequiredElements = () => {
    const hasBar = Boolean(this.bar);
    const hasValue = Boolean(this.value);

    if (!hasBar) this.handleMissingElement('bar');
    if (!hasValue) this.handleMissingElement('value');

    return hasBar && hasValue;
  }



  determineStartEnd = () => {
    const start = parseInt(this.form.dataset.progressstart, 10);
    const end = parseInt(this.form.dataset.progressend, 10);

    this.start = isNaN(start) ? 0 : start;
    this.end = isNaN(end) ? 100 : end;

    if (this.end < this.start) this.handleEndBeforeStart();
  }



  collectFields = () => {
    this.totalFields = Array.from(this.form.querySelectorAll(this.selField));
  }



  countRadioBtnDoublets = () => {
    let radioGroups = new Set();

    this.totalFields.forEach(field => {
      if (radioGroups.has(field.name)) this.radioBtnDoublets++;
      radioGroups.add(field.name);
    })
  }



  countFilledFields = () => {
    this.filledFields = this.totalFields.reduce((filled, field) => {

      if (['radio', 'checkbox'].includes(field.type)) {
        return filled + (field.checked ? 1 : 0);
      }

      return filled + (field.value.trim() !== '' ? 1 : 0);
    }, 0);
  }



  calculateProgressPerField = () => {
    const total = this.totalFields.length - this.radioBtnDoublets;
    this.progressPerField = total > 0
      ? (this.end - this.start) / total 
      : 0;
  }



  startListening = () => {
    this.form.addEventListener('change', (e) => {
      if (e.target.matches(this.selField)) {
        this.updateProgress();
      }
    })
  }



  updateProgress = () => {
    const currentProgress = this.calculateProgress();
    this.bar.setAttribute('value', currentProgress);
    this.value.textContent = `${Math.round(currentProgress)}%`;

    Math.round(currentProgress) === this.end
      ? this.form.classList.add('is-complete')
      : this.form.classList.remove('is-complete');
    
  }



  calculateProgress = () => {
    this.countFilledFields();
    const progress = this.filledFields * this.progressPerField;
    return Math.min(this.start + progress, this.end);
  }



  handleMissingElement = (element) => {
    console.warn(`Missing form progress ${element} element!`);
    console.warn('Initialising of form progress element stopped!');
  }



  handleEndBeforeStart = () => {
    this.end = this.start;
    console.warn(
      'Form progress end percentage is higher than progress start percentage!'
    )
  }
}