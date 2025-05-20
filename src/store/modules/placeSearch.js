export default {
  namespaced: true,
  state: {
    placeQuery: "",
    topicType: "Chapelle",
    currentPage: 1,
    itemsPerPage: 50,
    totalResults: 0,
    places: [],
  },
  mutations: {
    SET_PLACE_QUERY(state, query) {
      state.placeQuery = query;
    },
    SET_TOPIC_TYPE(state, topic) {
      state.topicType = topic;
    },
    SET_CURRENT_PAGE(state, page) {
      state.currentPage = page;
    },
    SET_ITEMS_PER_PAGE(state, limit) {
      state.itemsPerPage = limit;
    },
    SET_TOTAL_RESULTS(state, total) {
      state.totalResults = total;
    },
    SET_PLACES(state, places) {
      state.places = places;
    },
  },
  actions: {
    updateQuery({ commit }, { query }) {
      commit("SET_PLACE_QUERY", query);
    },
    updateTopic({ commit }, { topic }) {
      commit("SET_TOPIC_TYPE", topic);
    },
    updatePagination({ commit }, { page, limit }) {
      commit("SET_CURRENT_PAGE", page);
      commit("SET_ITEMS_PER_PAGE", limit);
    },
    updateResults({ commit }, { places, total }) {
      commit("SET_PLACES", places);
      commit("SET_TOTAL_RESULTS", total);
    },
  },
};
