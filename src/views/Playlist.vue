<template>
  <div v-if="computedUser">
      <h2 class="page-title">Playlist</h2>
    <section id="flex-box-column">
        <div v-if="playlist"  class="playlist-normal">
            <div class="playlist-single-track search-display" style="border-right: 1px solid white;" draggable="true"  v-for="(songs, i) in playlist" :key="songs.trackId" v-on:dragstart="dragItem(songs)" v-on:dragover.prevent v-on:drop="dropItem(songs)">
                <div class="fav-num-container">
                    <p class="fav-num white-text small-font">{{i+1}}</p>
                </div>
                <div class="price-explicitness">
                    <button @click.prevent="deleteFromPlaylist(songs)" class="purchase-button btn-outline-success my-2 my-sm-0" type="button">Delete</button>
                </div>

                <a class="playlist-indent album-art" :style="{ 'background-image': 'url(' + songs.artworkUrl60 + ')' }" @click.prevent="playSound(songs)">
                    <img width="60" height="60" :class="songs.className">
                </a>

                 <!--class makes the song info a flex row. makes sense. -->
                <div class="my-songs-info playlist-indent">
                    <div class="name-artist">
                        
                        <a class="white-text song-name" @click.prevent="goToAlbum(songs)" href=""><strong>{{songs.trackName}}</strong></a><br>
                        <a  class=" white-text artist-name link" @click.prevent="filterArtist(songs.artistId)">{{songs.artistName}}</a><br>
                    </div>
                </div>
            </div>
        
        </div>

        <h4 v-else class="center-text white-text">Retrieving your playlist...</h4>
                
    </section>
    <router-view/>

  </div>
</template>

<style scoped>
    
    .purchase-button {
        margin-top: 0px !important; 
    }

    .name-artist {
        text-align: left;
    }


    a.song-name:link {
        color: white;
    }

    .fav-num-container {
        width: 70%;
        height: 20px;
        text-align: center;
    }

    .fav-num {
        /* padding: .25rem .5rem 0 .5rem; */
        width: 20px;
        border: solid 1px white;

        border-radius: .3rem;
    }

    .playlist-indent {
        margin-left: 1rem;
    }

    .playlist-single-track {
        border-top: white 1px solid;
        width: 180px;
    }

    .playlist-normal {
        margin: 3rem;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        overflow-x: auto;
        
        margin: auto;
    }

    #flex-box-column {
        background-color: black;
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
        margin: 3%;
    }
</style>

<script>
    import { db } from '@/main'
    const axios = require('axios');
    import router from '@/router'
    import store from '@/store'
    export default {
        name: "playlist",
        data() {
            return {
                user: {},
                loading: true,
                playing: {},
                playlist: [],
                isPlaying: { isPlaying: false, index: '' },
                drag: {},

            }
        },
        async beforeMount() {
            // this.user = this.$store.state.user;
            // this.getPlaylist();
            this.playing = this.$store.state.playing;
        },
        computed: {
          computedUser() {
              this.user = store.state.user;
              if (this.user) this.getPlaylist();
              return store.state.user;
          }  
        },
        methods: {
            async getPlaylist() {
                this.playlist = (await axios.get("api/library/" + this.user.username)).data.sort((a, b) => {
                    return a.index - b.index;
                });
            },
            dragItem(song) {
                this.drag = song;
            },
            async dropItem(song) {

                const indexItem = this.playlist.indexOf(this.drag);
                const indexTarget = this.playlist.indexOf(song);

                this.playlist.splice(indexItem, 1);
                this.playlist.splice(indexTarget, 0, this.drag);

                this.playlist[indexTarget].index = indexTarget;

                var playlistCounter = 0;

                for (var i = indexTarget < indexItem ? indexTarget : indexItem; i < this.playlist.length; i++) {
                    this.playlist[i].index = i;
                    // this.playlist[i].num = i+1;  
                    axios.put("api/library/" + this.user.username, { song: this.playlist[i] })
                        .then(results => {
                            console.log("successfully updated song with index: " + playlistCounter++, results);
                        })
                        .catch(error => {
                            console.log("error while updating the order of your playlist.");
                        });
                }
            },
            goToAlbum: (song) => goToAlbum(song),
            async deleteFromPlaylist(song) {

                try {
                    song.username = this.user.username;
                    let deleteResult = await axios.delete("api/library/" + song.username + "." + song.trackId);
                    await this.getPlaylist();
                    return "";

                }
                catch (error) {
                    console.log(error);
                }
            },
            playSound(sound) {
                if (sound) {

                    let index = this.playlist.indexOf(sound);
                    //If the same song on same page is "stopped"
                    if (this.isPlaying.index === index) {
                        this.playing.pause();

                        this.playlist[this.isPlaying.index].className = "play";

                        this.isPlaying.isPlaying = false;
                        this.isPlaying.index = '';
                        return;
                    }

                    //if a song is made to play while another is already playing
                    if (this.playing != undefined && this.isPlaying.isPlaying) { //ensures multiples songs don't play at the same time
                        this.playing.pause();
                        this.playlist[this.isPlaying.index].className = "play";
                    }

                    //if a song from another page is playing
                    if (this.$store.state.playing !== null) {
                        this.$store.state.playing.pause();
                        this.$store.dispatch("setPlaying", null);
                    }

                    this.playing = new Audio(sound.previewUrl);

                    this.playlist[index].className = "stop";

                    this.isPlaying.isPlaying = true;
                    this.isPlaying.index = index;
                    this.playing.trackId = sound.trackId;
                    this.$store.dispatch("setPlaying", this.playing);
                    this.playing.play();
                    setTimeout(() => {
                        if (this.playing.trackId === sound.trackId) {
                            this.$store.dispatch("setPlaying", null);
                        }
                        this.playlist[this.isPlaying.index].className = "play";
                    }, 30000);
                }
            },
            async filterArtist(artistId) {
                router.push({path:"artist", query: {"artist":artistId}});
            }
        }
    }

    function cutLength(inputWord, length) {
        if (inputWord.length > length) {
            inputWord = inputWord.substring(0, length) + "...";
        }
        return inputWord;
    }

    function millisToMinutesAndSeconds(millis) {
        var minutes = Math.floor(millis / 60000);
        var seconds = ((millis % 60000) / 1000).toFixed(0);
        return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
    }
</script>