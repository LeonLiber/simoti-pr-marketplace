import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import persistedState from 'vuex-persistedstate';

Vue.use(Vuex);

export default new Vuex.Store({
  plugins: [persistedState({
    paths: ['user'],
  })],
  state: {
    user: { },
    articles: [],
    userArticles: [],
    publications: [],
    userPublications: [],
  },
  getters: {
    isUserLoggedin(state) {
      return Object.keys(state.user).length > 0;
    },
    user(state) {
      return state.user;
    },
    articles(state) {
      return state.articles;
    },
    userArticles(state) {
      return state.userArticles;
    },
    publications(state) {
      return state.publications;
    },
    userPublications(state) {
      return state.userPublications;
    },
    opportunitiesWithPropositions(state) {
      const hasCurrentUserPropositions = proposition => proposition.userId === state.user.email;
      const filter = ({ propositions }) => {
        if (propositions) {
          return propositions.filter(hasCurrentUserPropositions).length > 0;
        }
        return false;
      };
      const addType = type => (opportunity) => {
        opportunity.type = type;
        return opportunity;
      };
      const articles = state.articles.filter(filter).map(addType('mention'));
      const publications = state.publications.filter(filter).map(addType('article'));

      return [].concat(articles)
               .concat(publications);
    },
  },
  mutations: {
    SET_USER(state, userData) {
      state.user = userData;
    },
    UNSET_USER(state) {
      state.user = {};
    },
    SET_ARTICLES(state, articles) {
      state.articles = articles;
    },
    SET_USERARTICLES(state, userArticles) {
      state.userArticles = userArticles;
    },
    SET_PUBLICATIONS(state, publications) {
      state.publications = publications;
    },
    SET_USERPUBLICATIONS(state, userPublications) {
      state.userPublications = userPublications;
    },
  },
  actions: {
    setUser({ commit }, userData) {
      commit('SET_USER', userData);
    },
    unsetUser({ commit }) {
      commit('UNSET_USER');
    },
    getArticles({ commit, state }) {
      return axios.get('/api/articles', {
        headers: {
          Authorization: `Bearer ${state.user.token}`,
        },
      }).then((res) => {
        commit('SET_ARTICLES', res.data);
      });
    },
    getUserArticles({ commit, state }) {
      return axios.get('/api/articles/me', {
        headers: {
          Authorization: `Bearer ${state.user.token}`,
        },
      }).then((res) => {
        commit('SET_USERARTICLES', res.data);
      });
    },
    addArticleProposition({ state }, payload) {
      return axios.post(`/api/articles/${payload.articleId}/propositions`, payload.data, {
        headers: {
          Authorization: `Bearer ${state.user.token}`,
        },
      });
    },
    getPublications({ commit, state }) {
      return axios.get('/api/publications', {
        headers: {
          Authorization: `Bearer ${state.user.token}`,
        },
      }).then((res) => {
        commit('SET_PUBLICATIONS', res.data);
      });
    },
    getUserPublications({ commit, state }) {
      return axios.get('/api/publications/me', {
        headers: {
          Authorization: `Bearer ${state.user.token}`,
        },
      }).then((res) => {
        commit('SET_USERPUBLICATIONS', res.data);
      });
    },
    addPublicationProposition({ state }, payload) {
      return axios.post(`/api/publications/${payload.publicationId}/propositions`, payload.data, {
        headers: {
          Authorization: `Bearer ${state.user.token}`,
        },
      });
    },
    updatePropositionStatus({ dispatch, state }, payload) {
      const { status } = payload;
      return axios.post(`/api/${payload.type}/${payload.itemId}/propositions/${payload.userId}`, { status }, {
        headers: {
          Authorization: `Bearer ${state.user.token}`,
        },
      }).then(() => {
        if (payload.type === 'publications') {
          return Promise.all([dispatch('getPublications'), dispatch('getUserPublications')]);
        } else {
          return Promise.all([dispatch('getArticles'), dispatch('getUserArticles')]);
        }
      });
    },
  },
});
