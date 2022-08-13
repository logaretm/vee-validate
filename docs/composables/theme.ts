export const useAppTheme = () => {
  const theme = useState<'dark' | 'light'>('theme', getUserPreferredTheme);

  onBeforeMount(() => {
    theme.value = getUserPreferredTheme();
    document.documentElement.classList.toggle('dark', theme.value === 'dark');
  });

  return theme;
};

function getUserPreferredTheme() {
  if (typeof window === 'undefined') {
    return 'light';
  }

  const themeSetting = localStorage.getItem('theme');
  let theme;
  // no dark setting, get it from browser
  if (!themeSetting) {
    const wantsDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    theme = wantsDark ? 'dark' : 'light';
  } else {
    theme = themeSetting;
  }

  return theme;
}
