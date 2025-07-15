try {
  const presetTheme = localStorage.getItem('colorTheme');
  const systemPrefersDark =
    window.matchMedia('(prefers-color-scheme: dark)').matches;

  presetTheme === 'dark' || (!presetTheme && systemPrefersDark)
    ? document.documentElement.classList.add('t-velvetDark')
    : document.documentElement.classList.add('t-velvetLight')

} catch (e) {
  document.documentElement.classList.add('t-velvetLight');
}