import { createStore } from 'vuex'

export default createStore({
  state: {
    user: {
      username:""
    },
    playlist: [],
    playing: null, // The <audio> tag associated w/ the song playing
    idOfPlaying: '', // trackId of the current song
    referenceToClassName: {
      classList: []
    },
    loginRedirect: "/ijams/",
    cart: [],
    checkoutItems: []
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
    },
    addToCart(state, item) {
      state.cart.push(item);
    },
    setCheckoutItems(state, items) {
      state.checkoutItems = items;
    },
    setPlaylist(state, playlist) {
      state.playlist = playlist;
    },
  },
  actions: {
    setPlaylist(context, data) {
      context.commit("setPlaylist", data)
    },
    setPlaying(context, data) {
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
    setUser(context, data) {
      try {
        context.commit("setUser", data);
      } catch (error) {
        return error.message;
      }
    },
    setLoginRedirect(context, data) {
      context.commit("setLoginRedirect", data);
    },
    addToCart(context, item) {
      context.commit("addToCart", item);
    },
    setCheckoutItems(context, items) {
      context.commit("setCheckoutItems", items);
    }
  },
  modules: {}
});
