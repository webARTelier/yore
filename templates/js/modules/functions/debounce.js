


export const debounceThenExecute = (func, delay) => {
  let timerId;

  return function () {
    const context = this;
    const args = arguments;

    clearTimeout(timerId);

    timerId = setTimeout(function () {
      func.apply(context, args);
    }, delay)
  }
}



export const executeThenDebounce = (func, delay) => {
  let timerId;

  return function () {
    const context = this;
    const args = arguments;

    if (timerId) {
      clearTimeout(timerId);
      return;
    }

    func.apply(context, args);

    timerId = setTimeout(function () {
      timerId = null;
    }, delay)
  }
}
