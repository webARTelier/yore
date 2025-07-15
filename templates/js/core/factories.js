


export const initFunctions = (functionParams) => {
  for (const [object, params] of Object.entries(functionParams)) {
    [object](params);
  }
}



export const initClasses = (classParams, event) => {
  for (const [className, data] of Object.entries(classParams)) {
    if (data.event !== event) continue;
    const Class = data.ref;
    if (!Class || typeof Class.init !== 'function') continue;
    Class.init(data.params || {});
  }
}



export const initListeners = (listenerParams) => {
  for (const [object, params] of Object.entries(listenerParams)) {
    bindEvent(params['event'], params['selector'], object);
  }
}