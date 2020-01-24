import Vue from "vue";
import Vuex from "vuex";
const axios = require('axios');
Vue.use(Vuex);
import router from '@/router'

export default new Vuex.Store({
  state: {
    user: null,
    searchTerm: null,
    playlist: [],
    results: [],
    album: null,
    artistAlbums: null,
    artist: null,
    playing: null
  },
  mutations: {
    setUser(state, user) {
      console.log("store mutation, setUser: ", user);
      state.user = user;
    },
    setSearchTerm(state, term) {
      state.searchTerm = term;
    },
    setPlaylist(state, playlist) {
      playlist.sort((a, b) => {
        return a.index - b.index;
      });
      state.playlist = playlist;
    },
    setResults(state, results) {
      
      console.log("setting results inside store");
      if (state.results.length > 1) {
        console.log(
          "more recent results",
          state.results[state.results.length - 1]
        );
      }
      state.results.splice(0, 1);
      state.results.push(results);
      console.log("first results from search", state.results[0]);
      
    },
    setAlbum(state, album) {
      state.album = album;
    },
    setArtist(state, artist) {
      state.artist = artist;
    },
    setArtistAlbums(state, artistAlbums) {
      state.artistAlbums = artistAlbums;
    },
    setArtistSongs(state, artist) {
      state.artist = artist;
    },
    setPlaying(state, playing) {
      state.playing = playing;
    },
    getLastSearch(state) {
      state.results.pop();
    },
    getResults(state) {
      return state.results;
    },
    getUser(state) {
      console.log("getUser mutation method; state.user: ", state.user);
      return !state.user ? this.dispatch('getUser') : state.user; 
    }
  },
  actions: {
    async getLastSearch(context, data) {
      try {
        context.commit("getLastSearch", data);
        return;
      } catch (error) {
        return error.message;
      }
    },
    async getResults(context, data) {
      try {
        return context.commit("getResults", data);
        
      } catch (error) {
        return error.message;
      }
    },
    async defineAlbumInfo(context, data) {
      console.log("the album being set: ", data);
      try {
        context.commit("setAlbum", data);
        return;
      } catch (error) {
        return error.message;
      }
    },
    async defineArtist(context, data) {
      try {
        context.commit("setArtist", data);
        return;
      } catch (error) {
        return error.message;
      }
    },
    async defineArtistAlbums(context, data) {
      try {
        context.commit("setArtistAlbums", data);
        return;
      } catch (error) {
        return error.message;
      }
    },
    async defineArtistSongs(context, data) {
      try {
        context.commit("setArtistSongs", data);
        return;
      } catch (error) {
        return error.message;
      }
    },
    async search(context, data) {
      try {
        context.commit("setResults", data);
        return "";
      } catch (error) {
        alert(error.message);
      }
    },
    passPlayingSong(context, data) {
      try {
        context.commit("setPlaying", data);
        return "";
      } catch (error) {
        return error.message;
      }
    },
    async addToPlaylist(context, data) {
      console.log("from addToPlaylist store method", data);
      try {
        return await axios.post('/api/library', {       
                        song: data, 
                    });
      } catch (error) {
        return error.message;
      }
    },
    async getAlbum(context, data) {
    console.log("from getAlbum store method", data);
      try {
        return await axios.get('/api/search/album/' + data);
      } catch (error) {
        return error.message;
      }
    },
    async getArtist(context, data) {
    console.log("from getArtist store method", data);
      try {
        return await axios.get('/api/search/artist/' + data);
      } catch (error) {
        return error.message;
      }
    },
    async getArtistAlbums(context, data) {

      try {
        return await axios.get('/api/search/artistalbums/' + data);
      } catch (error) {
        return error.message;
      }
    },
    async login(context, data) {

      try {
        return await axios.post('/api/users/login', {user: data});
      } catch (error) {
        return error.message;
      }
    },
    async register(context, data) {

      try {
        return await axios.post('/api/users/register', {user: data});
      } catch (error) {
        throw new Error(error);
      }
    },
    async getUser(context, data) {
      console.log("getUser store method");
      try {
        let currentUser = await axios.get('/api/users/');
        console.log("getUser VueX Action method", currentUser);
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
        console.log("store logout method");
        context.commit("setUser", null);
        let logoutResult = await axios.delete('/api/users');
        console.log("logoutResult", logoutResult);
        
      } catch (error) {
        return error.message;
      }
    }
  },
  modules: {}
});
