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
                            <a class="song-name purple-text small-font" @click.prevent="getAlbum(songs)" href="" ><strong>{{songs.trackName_short}}</strong></a><br>
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
    const axios = require('axios');
    import router from '@/router'
    import { getAlbum, addToPlaylist, playSound, filterArtist, cutLength } from '@/shared/logic'

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
            
            this.user = this.$store.state.user;
            this.playing = null;
        },
        methods: {
            search() {
                this.$store.dispatch("search",this.$route.query.search).then(itunesResponse => {
                    this.songResults = [];
                    console.log('itunesResponse', itunesResponse);
                    let results = itunesResponse.data.results;
                    const artistResults = [];
                    const songNames = [];
                    for (var i =0; i < results.length; i++ ) {
                        if (results[i].kind === "song") {
                            results[i].className = "play";
                            if (!artistResults.includes(results[i].artistId)) {
                                artistResults.push(results[i].artistId);
                            }    
    
                            if (!songNames.includes(results[i].trackName)) {
                                songNames.push(results[i].trackName);
                                
                                results[i].trackName_short = cutLength(results[i].trackName, 12);
                                results[i].artistName_short = cutLength(results[i].artistName, 20);
                                
                                this.songResults.push(results[i]);
                            } 
                        } 
    
                    }
                })
                
                
            },
            playSong(sound, index) {
                console.log("ref", this.$refs[index][0]);
                playSound(sound, this.$refs[index][0]);
            },
            async addToPlaylist(song) {
                song.className = "play";
                song.username = this.user.username;
                await this.$store.dispatch("addToPlaylist", song);
            },
            async logout() {
                try {
                    this.error = await this.$store.dispatch("logout");
                }
                catch (error) {
                    console.log(error);
                }
            },
            getAlbum: getAlbum,
            cutLength: cutLength
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