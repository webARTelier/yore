


export class Dialogs {

  static requiredParams = [
    'selDialog',
    'selTriggerOpen',
    'selTriggerClose'
  ]



  static init = (params) => {
    const allDialogs = document.querySelectorAll(params.selDialog);
    if (allDialogs.length) new Dialogs(allDialogs, params);
  }



  constructor(allDialogs, params) {
    this.lastFocused = null;
    this.selTriggerOpen = params.selTriggerOpen;
    this.selTriggerClose = params.selTriggerClose;

    this.allDialogs = allDialogs;
    this.allCloseTriggers = document.querySelectorAll(params.selTriggerClose);
    this.dialogTriggersMap = this.createDialogTriggersMap();

    if (this.dialogTriggersMap.size > 0) {
      this.startListening();
    }
  }



  createDialogTriggersMap = () => {
    const dialogTriggersMap = new Map();

    this.allDialogs.forEach(dialog => {
      const selTriggers = `${this.selTriggerOpen}[data-target="${dialog.id}"]`;
      const triggers = document.querySelectorAll(selTriggers);
      dialogTriggersMap.set(dialog, [...triggers]);
    })
    
    return dialogTriggersMap;
  }



  startListening = () => {
    document.addEventListener('click', (e) => {
      this.checkClickedOpenTrigger(e);
      this.checkClickedCloseTrigger(e);
    })

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.closeAllDialogs();
    })
  }



  checkClickedOpenTrigger = (e) => {
    const clickedOpen = e.target.closest(this.selTriggerOpen);
    if (!clickedOpen) return;
  
    this.dialogTriggersMap.forEach((triggers, dialog) => {
      if (triggers.includes(clickedOpen)) this.openDialog(dialog, triggers);
    })
  }



  checkClickedCloseTrigger = (e) => {
    const clickedClose = e.target.closest(this.selTriggerClose);
    const clickedBackdrop = [...this.allDialogs].includes(e.target);
  
    if (clickedClose || clickedBackdrop) {
      this.closeAllDialogs();
    }
  }


  
  openDialog = (dialog, triggers) => {
    this.lastFocused = document.activeElement;

    this.isModal(dialog)
      ? dialog.showModal()
      : dialog.show();

    this.setAriaExpanded(triggers, 'true');
    this.handleBodyScroll('lock');

    if (typeof dialog.focus === 'function') dialog.focus();
  }



  closeAllDialogs = () => {
    if (!this.hasOpenDialogs()) return;

    this.dialogTriggersMap.forEach((triggers, dialog) => {
      dialog.close();
      this.setAriaExpanded(triggers, 'false');
    })

    this.handleBodyScroll('unlock');

    if (this.lastFocused) {
      this.lastFocused.focus();
      this.lastFocused = null;
    }
  }



  setAriaExpanded = (triggers, status) => {
    triggers.forEach(trigger => {
      trigger.setAttribute('aria-expanded', status)
    })
  }



  handleBodyScroll = (action) => {
    action === 'lock'
      ? document.body.classList.add('is-scrollLocked')
      : document.body.classList.remove('is-scrollLocked');
  }



  isModal = (dialog) => dialog.dataset.type === 'modal';



  hasOpenDialogs = () => [...this.dialogTriggersMap].some(([dialog, triggers]) => dialog.hasAttribute('open'));
}