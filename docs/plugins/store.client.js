export default function StorePlugin({ store }) {
  window.onNuxtReady(() => {
    const themeSetting = localStorage.getItem('theme');
    let theme;
    // no dark setting, get it from browser
    if (!themeSetting) {
      const wantsDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      theme = wantsDark ? 'dark' : 'light';
    } else {
      theme = themeSetting;
    }

    document.body.classList.toggle('dark', theme === 'dark');
    store.commit('SET_THEME', theme);
  });
}
