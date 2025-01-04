// src/store/index.js
import { createStore } from 'vuex';

const store = createStore({
  state() {
    return {
      username: sessionStorage.getItem('username') || ''
    };
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
    username: (state) => state.username
  }
});

export default store;
