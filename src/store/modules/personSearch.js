// store/modules/personSearch.js
export default {
    namespaced: true,
    state: {
        personQuery: "", // Défaut : chaîne vide
        searchType: "exact",
        showCanon: false,
        currentPage: 1,
        itemsPerPage: 50,
        totalResults: 0,
        persons: [],
    },
    mutations: {
        SET_PERSON_QUERY(state, query) {
            state.personQuery = query;
        },
        SET_SEARCH_TYPE(state, type) {
            state.searchType = type;
        },
        SET_SHOW_CANON(state, value) {
            state.showCanon = value;
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
        SET_PERSONS(state, persons) {
            state.persons = persons;
        },
    },
    actions: {
        updateQuery({commit}, {query, searchType}) {
            commit("SET_PERSON_QUERY", query);
            commit("SET_SEARCH_TYPE", searchType);
        },
        updateCanonFilter({commit}, {value}) {
            commit("SET_SHOW_CANON", value);
        },
        updatePagination({commit}, {page, limit}) {
            commit("SET_CURRENT_PAGE", page);
            commit("SET_ITEMS_PER_PAGE", limit);
        },
        updateResults({commit}, {persons, total}) {
            commit("SET_PERSONS", persons);
            commit("SET_TOTAL_RESULTS", total);
        },
    },
};