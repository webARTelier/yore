


export const getScrollbarWidth = () => {
  return window.innerWidth - document.documentElement.clientWidth;
}



export const hasVerticalOverflow = (container) => {
  return container.scrollHeight > container.clientHeight;
}



export const isScrolledToBottom = (target) => {
  return Math.abs(target.scrollHeight - target.scrollTop - target.clientHeight) < 3;
}



export const isScrolledToTop = (target) => {
  return target.scrollTop < 3;
}