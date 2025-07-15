


export const generateRandomString = (length) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charsLength = chars.length;
  const randomStringArray = new Array(length);
  const randomValues = new Uint32Array(length);

  window.crypto.getRandomValues(randomValues);

  for (let i = 0; i < length; i++) {
    randomStringArray[i] = chars.charAt(randomValues[i] % charsLength);
  }

  return randomStringArray.join('');
}
