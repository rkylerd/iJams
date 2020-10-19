import router from '@/router'
import $store from '@/store'

const getSongs = async () => {
          
    try {
      this.error = await $store.dispatch("getSongs");
    } catch (error) {
      console.log(error);
    }
};

const getAlbum = async ({ collectionId = "", ...rest} = {}) => {
    console.log(rest);
    router.push({path:"album", query: {"album": collectionId}});
};

const searchAlbum = async (album) => {
    const response = await $store.dispatch("getAlbum", album);
                console.log('album.vue', response.data);
                this.album = response.data.results[0];
                
                response.data.results = response.data.results.slice(1);
                for (var i = 0; i < response.data.results.length; i++) {
                    response.data.results[i].className = "play";
                    response.data.results[i].trackName_short = cutLength(response.data.results[i].trackName, 75);
                    response.data.results[i].artistName_short = cutLength(response.data.results[i].artistName, 35);
                    response.data.results[i].trackTimeMillis = millisToMinutesAndSeconds(response.data.results[i].trackTimeMillis);
                }
                this.albumSongs = response.data.results;
                this.loading = false;
};

const addToPlaylist = async (song) => {
    song.className = "play";
    song.username = this.user.username;
    console.log("song.username: ", song.username);  
    await $store.dispatch("addToPlaylist", song);
};

const playSound = ({ trackTimeMillis = 0, trackId = "", previewUrl = ""} = {}, el) => {

    if(trackId) {
        // Is the user trying to stop the currently playing song?
        if ($store.state.playing) {
            $store.state.playing.pause();
            $store.state.referenceToClassName.classList = ["play"]; 
            if ($store.state.idOfPlaying === trackId) {
                $store.dispatch("passPlayingSong", null);
                $store.dispatch("setIdOfPlaying", "");
                return;
            };
        }

        let playing = new Audio(previewUrl);

        $store.dispatch("passPlayingSong", playing);
        $store.dispatch("setIdOfPlaying", trackId);
        $store.dispatch("setReferenceToClassNameOfPlaying", el);
        el.classList = ["stop"];
        playing.play();
        setTimeout(() => {
            if ($store.state.playing.trackId === trackId) {
                $store.dispatch("passPlayingSong", null);
                $store.dispatch("setIdOfPlaying", "");
                el.classList = ["play"];
                
            }
        }, trackTimeMillis);
        
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

export {
    getSongs,
    getSongInfo,
    getAlbum,
    searchAlbum,
    addToPlaylist,
    playSound,
    filterArtist,
    cutLength,
    millisToMinutesAndSeconds
};