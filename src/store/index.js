import { createStore } from 'vuex';

export default createStore({
  state: {
    canvasId: 0,
    endpVolume: null,
  },
  mutations: {
    setCanvasId(state, id) {
      state.canvasId = id;
    },
    setEndpVolume(state, volume) {
      state.endpVolume = volume;
    },
  }
});