


export class SelectfieldColor {

  static requiredParams = [
    'selSelect'
  ]



  static init = (params) => {
    const selSelect = `${params.selSelect}:not(.is-initialized)`;
    const allSelects = document.querySelectorAll(selSelect);

    allSelects.forEach(select => new SelectfieldColor(select));
  }



  constructor(select) {
    this.select = select;
    this.handleChange();
    this.markInitialized();
  }



  markInitialized = () => {
    this.select.classList.add('is-initialized');
  }



  handleChange = () => {
    this.setState();
    this.select.addEventListener("change", () => {
      this.setState();
    })
  }



  setState = () => {
    this.selectHasValue()
      ? this.select.classList.add('has-value')
      : this.select.classList.remove('has-value')
  }



  selectHasValue = () => !!this.select.value;
}