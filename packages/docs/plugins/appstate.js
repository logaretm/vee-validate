import Vue from 'vue';

const store = Vue.observable({
  currentDoc: null,
  theme: 'dark',
});

export function initStore() {
  const themeSetting = localStorage.getItem('theme');
  let theme;
  // no dark setting, get it from browser
  if (!themeSetting) {
    const wantsLight = window.matchMedia('(prefers-color-scheme: light)').matches;
    theme = wantsLight ? 'light' : 'dark';
  } else {
    theme = themeSetting;
  }

  document.body.classList.toggle('is-light', theme === 'light');
  store.theme = theme;
}

export { store };
