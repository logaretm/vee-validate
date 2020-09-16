export const state = () => ({
  doc: null,
  theme: 'light',
});

export const mutations = {
  SET_THEME(state, theme) {
    state.theme = theme;
  },
  SET_DOC(state, doc) {
    state.doc = doc;
  },
};
