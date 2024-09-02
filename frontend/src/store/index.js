// src/store/index.js
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    username: sessionStorage.getItem('username') || ''
  },
  mutations: {
    setUsername(state, username) {
      state.username = username;
      sessionStorage.setItem('username', username);
    }
  },
  actions: {
    updateUsername({ commit }, username) {
      commit('setUsername', username);
    }
  },
  getters: {
    username: state => state.username
  }
});
