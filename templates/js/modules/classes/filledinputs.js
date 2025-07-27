


export class FilledInputs {

  static requiredParams = [
    'selForm',
    'selItem'
  ]



  static init(params) {
    const selForm = `${params.selForm}:not(.has-filledMarks)`;
    this.allForms = document.querySelectorAll(selForm);

    this.allForms.forEach(form => {
      new FilledInputs(form, params);
    })
  }



  constructor(form, params) {
    this.form = form;
    this.selItem = params.selItem;

    this.itemMap = [];

    this.markInitialized();
    this.createItemMap();
    this.markPrefilledInputs();
    this.startListening();
  }



  markInitialized = () => {
    this.form.classList.add('has-filledMarks');
  }



  createItemMap = () => {
    const allItems = this.form.querySelectorAll(this.selItem);

    allItems.forEach(item => {
      const input = item.querySelector('input, textarea, select');
      if (!input) return;

      const itemData = { 'item': item, 'input': input }
      this.itemMap.push(itemData);
    })
  }



  markPrefilledInputs = () => {
    this.itemMap.forEach(({ item, input }) => this.setValueState(input));
  }



  startListening = () => {
    this.form.addEventListener('change', (e) => {
      this.setValueState(e.target);
    })
  }



  setValueState = (input) => {
    const match = this.itemMap.find(item => item.input === input);
    if (!match) return;

    const { item } = match;

    input.value
      ? item.classList.add('has-value')
      : item.classList.remove('has-value');
  }
}