import router from '@/router'
import $store from '@/store'
const axios = require('axios');

const play = "play",
    stop = "stop",
    waitTime = 30000; // 30 seconds

const getSongs = async () => {
          
    try {
      this.error = await $store.dispatch("getSongs");
    } catch (error) {
      console.log(error);
    }
};

const goToAlbum = async ({ collectionId = ""} = {}) => {
    router.push({path:"album", query: {"album": collectionId}});
};

const search = async (term = "") => {
    if (!term) return {};

    try {
      const {data: { results: mvideos = []} = {}} = await axios.get(`api/search/mvideo/${term}`);
      const {data: { results: songs = []} = {}} = await axios.get(`api/search/song/${term}`);
      console.log("songs",mvideos);
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

const playSound = ({ trackTimeMillis = 0, trackId = "", previewUrl = ""} = {}, el) => {

    if(trackId) {
        // Is the user trying to stop the currently playing song?
        if ($store.state.playing) {
            $store.state.playing.pause();
            updateMusicIcon($store.state.referenceToClassName, false);
             
            if ($store.state.idOfPlaying === trackId) {
                $store.dispatch("setPlaying", null);
                $store.dispatch("setIdOfPlaying", "");
                return;
            };
        }

        let playing = new Audio(previewUrl);

        $store.dispatch("setPlaying", playing);
        $store.dispatch("setIdOfPlaying", trackId);
        $store.dispatch("setReferenceToClassNameOfPlaying", el);
        updateMusicIcon(el, true);
        playing.play();

        setTimeout(() => {
            if ($store.state.idOfPlaying === trackId) {
                $store.dispatch("setPlaying", null);
                $store.dispatch("setIdOfPlaying", "");
                updateMusicIcon(el, false);
                
            }
        }, waitTime);
        
    }
};

const filterArtist = async (artistId) => {
    router.push({path:"artist", query: {"artist":artistId}});
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

const getSongInfo = async (artistId) => {
    router.push({path:"artist", query: {"artist":artistId}});
};

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
      console.log(results);
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

export {
    getSongs,
    getSongInfo,
    getAlbum,
    // searchAlbum,
    playSound,
    filterArtist,
    cutLength,
    millisToMinutesAndSeconds,
    updateMusicIcon, 
    search,
    getArtist,
    getArtistAlbums,
    addToPlaylist,
    goToAlbum
};