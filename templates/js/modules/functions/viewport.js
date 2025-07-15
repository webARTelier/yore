


export const getViewport = () => {
  const scope = document.body;
  return getCssCustomProperty(scope, '--viewportName');
}



export const isViewportOrUp = (checkedViewport) => {
  const viewports = [
    'tiny',
    'small',
    'medium',
    'large',
    'xxl'
  ]

  if (!viewports.includes(checkedViewport)) {
    console.warn(`'${checkedViewport}' is not a viewport!`);
    return false;
  }

  const currentViewport = getViewport();
  const currentIndex = viewports.indexOf(currentViewport);
  const checkedViewportIndex = viewports.indexOf(checkedViewport);

  return currentIndex >= checkedViewportIndex;
}
