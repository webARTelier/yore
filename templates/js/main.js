


import { initOnEvent } from './core/initonevent.js';

// init namespace
window.yoreJS = window.yoreJS || {};
window.yoreJS.initOnEvent = initOnEvent;
window.yoreJS.events = [
  'DOMContentLoaded',
  'load',
  'resize',
  'yoreAjaxSuccess'
]

// init functions & classes
window.yoreJS.events.forEach((eventType) => {
  let target;

  if (eventType.startsWith('yore')) {
    target = window;
  }

  if (eventType === 'DOMContentLoaded') {
    target = document;
  }

  if (!target) {
    target = window;
  }
  
  target.addEventListener(eventType, initOnEvent);
});