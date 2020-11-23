import $store from '@/store';
import { goToAccount } from '@/shared/navigation'; 

const axios = require('axios');
const play = "play",
    stop = "stop";

const search = async (term = "") => {
    if (!term) return {};

    try {
      const {data: { results: mvideos = []} = {}} = await axios.get(`api/search/mvideo/${term}`);
      const {data: { results: songs = []} = {}} = await axios.get(`api/search/song/${term}`);
      console.log(mvideos);
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

const addToPlaylist = async (song = {}) => {
    
    try {
      await axios.post('/api/library', {       
        song: {
            ...song, 
            username: $store.state.user.username, 
            className: play}, 
        });
    } catch (error) {
        throw Error("error encountered while adding song to playlist");
    }
};

const getAlbum = async (term = "") => {
    try {
      const { data: { results = [] } = {} } = await axios.get(`/api/search/album/${term}`);
      return results;
    } catch (error) {
      throw Error("error encountered while getting album");
    }
};

const getArtist = async (term = "") => {
    try {
      const { data: { results = [] } = {} } = await axios.get(`/api/search/artist/${term}`);
      return results;
    } catch (error) {
        throw Error("error encountered while getting artist");
    }
};

const getArtistAlbums = async (term = "") => {
    try {
        const { data: { results = [] } = {} } = await axios.get(`/api/search/artistalbums/${term}`);
        return results;
    } catch (error) {
          throw Error("error encountered while getting artist albums");
    }
};

const getUser = async () => {
    try {
        const { data = {} } = await axios.get('/api/users/');
        return data;
      } catch (error) {
        goToAccount();
        throw Error(error.message);
      }
}

const login = async (user = {}) => {
  try {
    const { data = {} } = await axios.post("api/users/login", {user});
    this.$store.dispatch("setUser", data);
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

const register = async (user = {}) => {
  try {
    const { data = {}} = await axios.post('/api/users/register', {user});
    $store.dispatch("setUser", data);
    return data;
  } catch (error) {
    throw new Error(error.message);
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
    addToPlaylist, 
    login,
    register
};
export {createPaymentIntent} from './stripe';