(function setUserPreferredTheme() {
  const themeSetting = localStorage.getItem('theme');
  let theme;
  // no dark setting, get it from browser
  if (!themeSetting) {
    const wantsDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    theme = wantsDark ? 'dark' : 'light';
  } else {
    theme = themeSetting;
  }

  document.documentElement.classList.toggle('dark', theme === 'dark');
  localStorage.setItem('theme', theme);
})();
