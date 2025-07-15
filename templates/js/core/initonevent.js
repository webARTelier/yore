


// functions
import { debounceThenExecute } from '../modules/functions/debounce.js';

// factories
import { initFunctions } from './factories.js';
import { initClasses } from './factories.js';
import { initListeners } from './factories.js';

// config data
import { functionParams } from '../config/config_functions.js';
import { listenerParams } from '../config/config_functions.js';
import { classParams } from '../config/config_classes.js';

let debouncedInitFunctions = debounceThenExecute(initFunctions, 300);



export const initOnEvent = (event) => {

  switch (event.type) {

    case 'DOMContentLoaded':
      initFunctions(functionParams);
      initClasses(classParams, 'dom');
      initListeners(listenerParams);
      break;

    case 'load':
      initFunctions(functionParams);
      initClasses(classParams, 'load');
      break;

    case 'resize':
      debouncedInitFunctions(functionParams);
      break;
  }
}