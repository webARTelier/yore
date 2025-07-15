


export class MoreLess {

  static init = (params) => {
    const selTrigger = `${params.selTrigger}:not(.is-initialized)`;
    const allTriggers = document.querySelectorAll(selTrigger);

    allTriggers.forEach(trigger => new MoreLess(trigger, params));
  }



  constructor(trigger, params) {
    this.trigger = trigger;
    this.textOpen = params.textTriggerOpen;
    this.textClosed = params.textTriggerClosed;
    const contentID = trigger.dataset.target;
    this.content = document.getElementById(contentID);

    if (!this.content) {
      this.handleMissingContent(contentID);
      return;
    }

    this.markInitialized();
    this.startListening();
  }



  markInitialized = () => {
    this.trigger.classList.add('is-initialized');
  }



  startListening = () => {
    this.trigger.addEventListener('click', () => {
      this.toggleTrigger();
    })
  }



  toggleTrigger = () => {
    const state = this.content.dataset.state;
    const expanded = state === 'open';

    const newState = expanded ? 'closed' : 'open';
    const newAriaState = expanded ? 'false' : 'true';
    const text = expanded ? this.textClosed : this.textOpen;

    this.content.dataset.state = newState;
    this.trigger.setAttribute('aria-expanded', newAriaState);
    this.trigger.textContent = text;
  }



  handleMissingContent = () => {
    console.warn(`Missing content! Behavior 'more/less' not available for content ${contentID}`);
  }
}