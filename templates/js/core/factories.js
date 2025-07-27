


import { getValueByPath } from '../modules/functions/paramcheck.js';
import { getMissingParams } from '../modules/functions/paramcheck.js';



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

    const required = Class.requiredParams || [];
    const missing = getMissingParams(data.params || {}, required);

    if (missing.length > 0) {
      console.warn(
        `${className}: Missing required parameter(s): ${missing.join(', ')}`
      );
      console.warn(`${className} could not be initialized`);
      continue;
    }

    Class.init(data.params || {});
  }
}



export const initListeners = (listenerParams) => {
  for (const [object, params] of Object.entries(listenerParams)) {
    bindEvent(params['event'], params['selector'], object);
  }
}