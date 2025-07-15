


export class FormValidation {

  static init = (params) => {
    const selForm = `${params.selForm}:not(.has-validation)`;
    const allForms = document.querySelectorAll(selForm);

    allForms.forEach(form => new FormValidation(form, params));
  }



  constructor(form, params) {
    this.form = form;
    this.availableLocales = params.availableLocales;
    this.config = params['config'];

    this.classTo = params.config.classTo;
    this.errorClass = params.config.errorClass;
    this.errorTextClass = params.config.errorTextClass;
    this.selErrorItem = `.${this.classTo}.${this.errorClass}`;

    this.initForm();
    this.markInitialized();
    this.startListening();
  }



  initForm = () => {
    this.validation = new Pristine(this.form, this.config);
    Pristine.setLocale(this.getLocale(this.availableLocales));
  }



  markInitialized = () => {
    this.form.classList.add('has-validation');
  }



  startListening = () => {
    this.form.addEventListener('submit', (e) => {
      this.markSubmitted();
      
      if (!this.validation.validate()) {
        e.preventDefault();
        this.updateAriaAttributes();
        this.scrollFirstErrorIntoView();
      }
    });

    this.form.addEventListener('change', (e) => {
      this.updateAriaAttributes();
    })
  }



  markSubmitted = () => {
    this.form.classList.add('is-submitted');
  }



  getLocale = (availableLocales) => {
    const docLang = document.documentElement.lang;
    return availableLocales.includes(docLang) ? docLang : 'en';
  }



  updateAriaAttributes = () => {
    const selInputs = 'input, textarea, select';

    this.form.querySelectorAll(selInputs).forEach((input) => {
      const errorParent = input.closest(this.selErrorItem);

      if (!errorParent) {
        input.removeAttribute('aria-describedby');
        return;
      }

      const errorElement = errorParent.querySelector(`.${this.errorTextClass}`);

      errorElement.id = `${input.name}-error`;
      errorElement.setAttribute('role', 'alert');
      input.setAttribute('aria-describedby', errorElement.id);
    })
  }



  scrollFirstErrorIntoView = () => {
    const firstErrorItem = this.form.querySelector(this.selErrorItem);
    firstErrorItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}