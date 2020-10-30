import Vue from "vue";
import Vuex from "vuex";
const axios = require('axios');
Vue.use(Vuex);
import router from '@/router'

export default new Vuex.Store({
  state: {
    user: {},
    playlist: [],
    playing: null, // The <audio> tag associated w/ the song playing
    idOfPlaying: '', // trackId of the current song
    referenceToClassName: {
      classList: []
    },
    loginRedirect: null
  },
  mutations: {
    setLoginRedirect(state, redirect) {
      state.loginRedirect = redirect;
    },
    setUser(state, user) {
      state.user = user;
    },
    setPlaying(state, playing) {
      state.playing = playing;
    },
    setReferenceToClassNameOfPlaying(state, el) {
      state.referenceToClassName = el;
    },
    setIdOfPlaying(state, id) {
      state.idOfPlaying = id;
    }
  },
  actions: {
    async setPlaying(context, data) {
      try {
        context.commit("setPlaying", data);
        return;
      } catch (error) {
        return error.message;
      }
    },
    setReferenceToClassNameOfPlaying(context, data) {
      try {
        context.commit("setReferenceToClassNameOfPlaying", data);
      } catch (error) {
        return error.message;
      }
    },
    setIdOfPlaying(context, data) {
      try {
        context.commit("setIdOfPlaying", data);
      } catch (error) {
        return error.message;
      }
    },
    async login(context, data) {
      try {
        let currentUser = await axios.post("api/users/login", {user: data});
        context.commit("setUser", currentUser.data);
        return currentUser.data;
      } catch (error) {
        return error.message;
      }
    },
    async register(context, data) {
      try {
        const currentUser = await axios.post('/api/users/register', {user: data});
        context.commit("setUser", currentUser.data);
        return currentUser.data;
      } catch (error) {
        throw new Error(error);
      }
    },
    async getUser(context, data) {
      try {
        const currentUser = await axios.get('/api/users/');
        context.commit("setUser", currentUser.data);
        return currentUser;
      } catch (error) {
        router.replace("Account");
        return {error: error.message};
      }
    },
    async setUser(context, data) {
      try {
        context.commit("setUser", data);
      } catch (error) {
        return error.message;
      }
    },
    async logout(context, data) {
      try {
        context.commit("setUser", null);
        await axios.delete('/api/users');
        window.localStorage.setItem('user', null);
      } catch (error) {
        return error.message;
      }
    },
    setLoginRedirect(context, data) {
      context.commit("setLoginRedirect", data);
    }
  },
  modules: {}
});
