import Vue from 'vue';

const store = Vue.observable({
  currentDoc: null,
  theme: 'light',
});

export function initStore() {
  const themeSetting = localStorage.getItem('theme');
  let theme;
  // no dark setting, get it from browser
  if (!themeSetting) {
    const wantsDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    theme = wantsDark ? 'dark' : 'light';
  } else {
    theme = themeSetting;
  }

  document.body.classList.toggle('is-dark', theme === 'dark');
  store.theme = theme;
}

export { store };
