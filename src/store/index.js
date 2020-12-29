import { createStore } from 'vuex'

export default createStore({
  state: {
    user: {
      username:""
    },
    playlist: [],
    isPlaying: false,
    playing: null, // The <audio> tag associated w/ the song playing
    dataOfPlaying: {},
    playingTime: 0,
    referenceToClassName: {
      classList: []
    },
    loginRedirect: "/ijams/",
    cart: [],
    checkoutItems: [],
    upNext: [],
    toasts: []
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
    setIsPlaying(state, isPlaying) {
      if (state.isPlaying !== isPlaying) {
        state.isPlaying = isPlaying;
      }
    },
    setReferenceToClassNameOfPlaying(state, el) {
      state.referenceToClassName = el;
    },
    setDataOfPlaying(state, playing) {
      state.dataOfPlaying = playing;
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
    setPlayingTime(state, time) {
      state.playingTime = time;
    },
    setCurrentTimeOfPlaying(state, time) {
      state.playing.currentTime = time;
    },
    addToUpNext(state, song) {
      state.upNext.push(song);
    },
    removeFromUpNext(state, song) {
      const index = state.upNext.indexOf(song);
      state.upNext.splice(index, 1);
    },
    addToast(state, toast) {
      state.toasts.push(toast);
    },
    removeToast(state, index) {
      state.toasts.splice(index, 1);
    }
  },
  actions: {
    updatePlayingTime(context, data) {
      context.commit("setPlayingTime", data);
    },
    setPlaylist(context, data) {
      context.commit("setPlaylist", data);
    },
    setPlaying(context, data) {
      try {
        context.commit("setPlaying", data);
      } catch (error) {
        return error.message;
      }
    },
    setIsPlaying(context, isPlaying) {
      context.commit("setIsPlaying", isPlaying)
    },
    setReferenceToClassNameOfPlaying(context, data) {
      try {
        context.commit("setReferenceToClassNameOfPlaying", data);
      } catch (error) {
        return error.message;
      }
    },
    setCurrentTimeOfPlaying(context, time) {
      context.commit("setCurrentTimeOfPlaying", time);
    },
    setDataOfPlaying(context, data) {
      try {
        context.commit("setDataOfPlaying", data);
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
    },
    addToUpNext(context, song) {
      context.commit("addToUpNext", song);
    },
    removeFromUpNext(context, song) {
      context.commit("removeFromUpNext", song);
    },
    addToast(context, toast) {
      context.commit("addToast", toast);
    },
    removeToast(context, indexOfToast) {
      context.commit("removeToast", indexOfToast);
    }
  },
  modules: {}
});
