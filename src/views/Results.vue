<template>
<div>
<section class="outmost-container">
<h3 style="margin-top: 2%; margin-left: 5%; color: whitesmoke;">Search Results:</h3>
  <div id="container-songs" class="container-normal">
    <div class="second-layer-container">
                 
            <div class="single-track album-tracks" v-for="(songs, idx) in songResults" :key="idx">
                    <a class="album-art" :style="{ 'background-image': 'url(' + songs.artworkUrl60 + ')' }" @click.prevent="playSong(songs, idx)">
                        <img width="60" height="60" :class="songs.className" :ref="idx">
                    </a>
                    
                    <!-- class makes the song info a flex row. makes sense. -->
                    <div class="song-info">
                        <div class="name-artist">
                            <a class="song-name purple-text small-font" @click.prevent="goToAlbum(songs)" href="" ><strong>{{songs.trackName_short}}</strong></a><br>
                            <a  class="artist-name white-text small-font" @click.prevent="filterArtist(songs.artistId)" href="">{{songs.artistName_short}}</a><br>
                        </div>
                        
                        <div class="stick-right">
                            
                                    <button class="purchase-button btn-outline-success my-2 my-sm-0" type="button" @click.prevent="addToPlaylist(songs)"> Add</button>
                            <p class="explicit" v-if="songs.trackExplicitness == 'explicit'">{{songs.trackExplicitness}}</p>
                        </div>
                        
                    </div>
            </div>   
            
        </div>
          </div>
        </section>
        
        <hr>
        
</div>

</template>

<style scoped>
    body {
        background-color: black;
    }

    .second-layer-container {
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
        background: black;
        height: 427px;
        margin-left: 25px;
    }

    .album-art {
        background: no-repeat;
        height: 60;
    }

    .play:hover {

        /* background: url(https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Ei-play.svg/120px-Ei-play.svg.png) center no-repeat; */
        background: url(https://www.wisc-online.com/asset-repository/getfile?id=414&getType=view
) center no-repeat;
        background-size: 40px 40px;
    }

    .stop {
        background: url(https://amnell9891.files.wordpress.com/2013/08/stop-normal-red-icon.png?w=150&h=150) center no-repeat;
        background-size: 35px 35px;
    }

    .purple-text {
        color: #990099;
    }

    .stick-right {
        margin-left: auto;
    }

    .song-info {
        display: flex;
        flex-direction: row;
        padding-left: 3px;
        text-align: left;
    }

    .single-track {
        border-top: white 1px solid;
        max-width: 220px;
    }

    .song-name {

        color: white;
        font-size: small;

    }

    .artist-name {
        color: unset;
        color: white;
        font-size: x-small;
    }

    .name-artist {

        min-width: 122px;

    }

    .white-text {
        color: white;
    }

    .purchase-button {

        /* color: purple;
    border: purple 1px solid; */
        /* margin-top: 10px; */
        float: right;
        font-size: x-small;
        padding: 3px 3px 3px 3px;
        max-width: 35px;
        border: 1px solid transparent;
        border-radius: .25rem;
    }

    .explicit {
        font-size: x-small;
        color: red;

        border: 0 .5px .5px .5px red solid;
        min-width: 9px;
    }

    .stick-right {
        margin-left: auto;
    }

    #container-songs {
        display: flex;
        /* flex-direction: column; */
        flex-wrap: wrap;
        overflow-y: hidden;
    }

    .album-tracks {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        /* background: purple; */
    }

    .container-normal {
        margin: auto;
        width: 90%;
        /* height: 400px; */
        flex-direction: row;
        overflow-x: auto;
        margin-top: 2%;
    }

    .outmost-container {
        display: flex;
        flex-wrap: wrap;
        background-color: black;
    }
</style>


<script>
    import App from '@/App.vue'
    import router from '@/router'
    import { goToAlbum, addToPlaylist, playSound, filterArtist, cutLength, updateMusicIcon, search } from '@/shared/logic'

    export default {
        name: 'mypage',
        data() {
            return {
                user: {},
                playing: {},
                playingSong: '',
                isPlaying: { isPlaying: false, index: '' },
                songResults: []
            }
        },
        async created() {
            this.search();
            this.user = this.$store.state.user || {};
        },
        methods: {
            search() {
                if (this.$store.state.referenceToClassName && this.$store.state.referenceToClassName.classList.length) {
                    updateMusicIcon(this.$store.state.referenceToClassName, false);
                }
                
                search(this.$route.query.search)
                    .then(({songs = [], mvideos=[]}={}) => {
                        this.songResults = songs.map(song => {
                            return {
                                ...song, 
                                className: "play",
                                trackName_short: cutLength(song.trackName, 12),
                                artistName_short: cutLength(song.artistName, 20)
                            };
                        });
                    }).catch(error => {
                        console.log("error from results.vue", error);
                    })
            },
            playSong(sound, index) {
                playSound(sound, this.$refs[index][0]);
            },
            addToPlaylist: addToPlaylist,
            async logout() {
                try {
                    this.error = await this.$store.dispatch("logout");
                }
                catch (error) {
                    console.log(error);
                }
            },
            goToAlbum: goToAlbum,
            cutLength: cutLength,
            filterArtist: filterArtist
        },
        computed: {
            
        },
        watch: {
            '$route.query.search': function (search) {
              this.search()
            }
          },
    }
</script>