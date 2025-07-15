


export const getCssCustomProperty = (scope, name) => {
  const styles = getComputedStyle(scope);
  return styles.getPropertyValue(name).trim();
}