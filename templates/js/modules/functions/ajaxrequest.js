


export const ajaxRequest = (url, options = {}) => {
  const eventStart =
    new CustomEvent('yoreAjaxStart', { detail: { url, options } });

  window.dispatchEvent(eventStart);

  return fetch(url, options)

    .then(async (response) => {
      const isJSON =
        response.headers.get('content-type')?.includes('application/json');
      const data = isJSON ? await response.json() : await response.text();
      const eventSuccess = new CustomEvent('yoreAjaxSuccess', {
        detail: { url, options, data, status: response.status }
      });

      window.dispatchEvent(eventSuccess);
      return data;
    })

    .catch((error) => {
      const eventError = new CustomEvent('yoreAjaxError', {
        detail: { url, options, error }
      });

      window.dispatchEvent(eventError);
      throw error;
    })
}
