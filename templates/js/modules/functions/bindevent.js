


export const bindEvent = (eventNames, selector, handler) => {
  eventNames.split(' ').forEach((eventName) => {
    document.addEventListener(eventName, function (event) {
      if (event.target.matches(selector + ', ' + selector + ' *')) {
        handler.apply(event.target.closest(selector), arguments)
      }
    }, false)
  })
}