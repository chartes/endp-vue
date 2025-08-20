export default {
  namespaced: true,
  state: () => ({
    focus: null,
  }),
  mutations: {
    setFocus(state, payload) {
      state.focus = payload; // { focusDate, focusEventId }
    },
    clearFocus(state) {
      state.focus = null;
    },
  },
}