import { createStore } from 'vuex'
const axios = require('axios');

export default createStore({
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
    async setUser(context, data) {
      try {
        context.commit("setUser", data);
      } catch (error) {
        return error.message;
      }
    },
    async logout(context) {
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
