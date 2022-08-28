(function setUserPreferredTheme() {
  const themeSetting = localStorage.getItem('theme');
  // no dark setting, get it from browser
  const theme = themeSetting || 'dark';

  document.documentElement.classList.toggle('dark', theme === 'dark');
  localStorage.setItem('theme', theme);
})();
