import $store from '@/store';
import { goToLogin, goToRequestedPage } from '@/shared/navigation'; 

const api = `${
  process.env.VUE_APP_NODE_ENV === 'local' ? 
  'http://localhost:3000/' : 
  'https://ijams-server.herokuapp.com/'
}api`;
const axios = require('axios');
axios.defaults.withCredentials = true;

const play = "play",
    stop = "stop";

const search = async (term = "") => {
    if (!term) return {};

    try {
      const {data: { results: mvideos = []} = {}} = await axios.get(`${api}/search/mvideo/${term}`);
      const {data: { results: songs = []} = {}} = await axios.get(`${api}/search/song/${term}`);

      return {
        mvideos,
        songs
      };
    } catch (error) {
        console.log("error from results.vue", error);
      throw Error("Error encountered while performing search");
    }
};

const updateMusicIcon = (el, isStart = true) => {
    if (!el) return;
    
    el.classList.remove( isStart ? play : stop);
    el.classList.add(isStart ? stop : play);
}

const playSound = ({trackId = "", previewUrl = ""} = {}, el) => {
    if(trackId) {
        // Is the user trying to stop the currently playing song?
        if ($store.state.playing) {
            $store.state.playing.pause();
            updateMusicIcon($store.state.referenceToClassName, false);
             
            if ($store.state.idOfPlaying === trackId) {
                $store.dispatch("setPlaying", null);
                $store.dispatch("setIdOfPlaying", "");
                return;
            }
        }

        let playing = new Audio(previewUrl);
        
        // When the song stops on its own, reset state 
        playing.addEventListener('ended', () => {
          $store.dispatch("setPlaying", null);
          $store.dispatch("setIdOfPlaying", "");
        });
        // anytime song is paused, update it's play/stop icons
        playing.addEventListener('pause', () => updateMusicIcon(el, false));
        playing.play();
        updateMusicIcon(el, true);

        $store.dispatch("setPlaying", playing);
        $store.dispatch("setIdOfPlaying", trackId);
        $store.dispatch("setReferenceToClassNameOfPlaying", el);
    }
};

const cutLength = (inputWord, length) => {
    if (inputWord.length > length) {
        inputWord = inputWord.substring(0, length) + "...";
    }
    return inputWord;
}

const millisToMinutesAndSeconds = (millis) => {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}

const getPlaylist = async () => {
  try {
      const playlist = (await axios.get(`${api}/playlist/${$store.state.user.username}`)).data
      .sort((a, b) => {
          return a.index - b.index;
      });
      await $store.dispatch('setPlaylist', playlist);
  } catch (err) {
      console.log('Failed getting playlist', err);
  }
}

const updatePlaylist = async (username = "", song) => {
  try {
      await axios.put(`${api}/playlist/${username}`, { song });
  } catch (err) {
      console.log('Failed updating your playlist', err);
  }
}

const deleteFromPlaylist = async ({trackId = ""} = {}) => {
  try {
    if (trackId) {
      await axios.delete(`${api}/playlist/${$store.state.user.username}/${trackId}`);
      await getPlaylist();
    }
  }
  catch (error) {
      console.log(error);
  }
};

const addToPlaylist = async (song = {}) => {
    
    try {
      await axios.post(`${api}/playlist`, {       
        song: {
            ...song, 
            username: $store.state.user.username
          }, 
        });
    } catch (error) {
        throw Error("error encountered while adding song to playlist");
    }
};

const getAlbum = async (term = "") => {
    try {
      const { data: { results = [] } = {} } = await axios.get(`${api}/search/album/${term}`);
      return results;
    } catch (error) {
      throw Error("error encountered while getting album");
    }
};

const getArtist = async (term = "") => {
    try {
      const { data: { results = [] } = {} } = await axios.get(`${api}/search/artist/${term}`);
      return results;
    } catch (error) {
      throw Error("error encountered while getting artist");
    }
  };
  
  const getArtistAlbums = async (term = "") => {
    try {
      if (term) {
        const { data: { results = [] } = {} } = await axios.get(`${api}/search/artistalbums/${term}`);
        return results;
      }
    } catch (error) {
      console.log(error);
      // throw Error("error encountered while getting artist albums");
    }
    return [];
};

const getUser = async () => {
    try {
      const { data = {}} = await axios.get(`${api}/users/`, { withCredentials: true });

      if (!data) throw new Error("No user logged in");
      await $store.dispatch("setUser", data);
      
      return data;
    } catch (error) {
      return undefined;
    }
}

const login = async (user = {}) => {
  try {
    const { data = {} } = await axios.post(`${api}/users/login`, { user }, { withCredentials: true});

    await $store.dispatch("setUser", data);    
    goToRequestedPage();
    return true;
  } catch (error) {
    return false;
  }
};

const register = async (user = {}) => {
  try {
    const { data = {}} = await axios.post(`${api}/users/register`, {user}, { withCredentials: true});
    $store.dispatch("setUser", data);
    return data;
  } catch (error) {
    return error;
  }
};

const logout = async () => {
  try {
    if ($store.state.playing) {
      $store.dispatch("setPlaying", null);
      $store.dispatch("setIdOfPlaying", "");
    }
    
    $store.dispatch("setUser", {});
    await axios.delete(`${api}/users`, { withCredentials: true});
    
    goToLogin();
  } catch (error) {
    console.log('Error while logging out', error);
  }
};

export {
    getAlbum,
    getUser,
    playSound,
    cutLength,
    millisToMinutesAndSeconds,
    updateMusicIcon, 
    search,
    getArtist,
    getArtistAlbums,
    getPlaylist,
    updatePlaylist,
    addToPlaylist,
    deleteFromPlaylist, 
    login,
    register,
    logout
};
export {createPaymentIntent} from './stripe';