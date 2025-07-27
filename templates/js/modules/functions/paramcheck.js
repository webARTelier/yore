


export const getValueByPath = (obj, path) => {
  return path.split('.').reduce((acc, key) => acc?.[key], obj);
}



export const getMissingParams = (params, requiredKeys) => {
  return requiredKeys.filter(key => getValueByPath(params, key) === undefined);
}