<template>
    <div v-if="!loading" id="container-songs" class="container-album">
        <div class="album-display">
            <img  width="100" height="100" :src="album.artworkUrl100">
            <div style="margin-top: 5px; display: flex; flex-wrap: wrap;">
                <h3 style="width: 100%" class="white-text">{{album.collectionName}}</h3>
                <h5 style="width: 100%" class="stick-left white-text link" @click.prevent="filterArtist(album.artistId)">{{album.artistName}}</h5>
                <h6 style="width: 100%" class="stick-left white-text">{{album.releaseDate}}</h6>
                <h6 style="width: 100%" class="stick-left white-text">{{album.genre}}</h6>
                <span v-if="album.collectionExplicitness.toLowerCase() == 'explicit'" class="explicit explicitness-container">Explicit</span>
                <span v-else-if="album.collectionExplicitness.toLowerCase() == 'cleaned'" class="clean explicitness-container">Clean</span>
            </div>
        </div>
        <table class="album-songs">
            <tr class="white-text">
                <th class="center-text">#</th>
                <th>Name</th>
                <th>Artist</th>
                <th>Time</th>
                <th></th>
            </tr>
            <tr v-for="songs in albumSongs" :key="songs.trackId">
                <td class="trackNumber-cell small-album-info" :class="songs.className" @click.prevent="playSound(songs)"><a class="inner-track-num">{{songs.trackNumber}}</a></td>
                <td class="name-cell"><a class=" song-name white-text small-font" ><strong>{{songs.trackName_short}}</strong></a></td>
                <td class="artist-cell"><div @click.prevent="filterArtist(songs.artistId)" class="small-font artistNameP white-text link">{{songs.artistName_short}}</div></td>
                <td class="time-cell"><div class="small-album-info">{{songs.trackTimeMillis}}</div></td>
                <td><button class="purchase-button btn-outline-success my-2 my-sm-0" type="submit"  @click.prevent="addToPlaylist(songs)">Add</button></td>
                <td v-if="songs.trackExplicitness.toLowerCase() == 'explicit'" class="explicit explicitness-container">
                    Explicit
                </td>
                <td v-else-if="songs.trackExplicitness.toLowerCase() == 'cleaned'" class="clean explicitness-container">
                    Clean
                </td>
            </tr>
        </table>
    </div>
</template>

<style>
    .link {
        cursor: pointer;
        text-decoration: underline;
    }

    .play:hover {

        /* background: url(https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Ei-play.svg/120px-Ei-play.svg.png) center no-repeat; */
        background: url(https://www.wisc-online.com/asset-repository/getfile?id=414&getType=view) center no-repeat;
        background-size: 35px 35px;
        cursor: pointer;
    }

    .stop {
        background: url(https://amnell9891.files.wordpress.com/2013/08/stop-normal-red-icon.png?w=150&h=150) center no-repeat;
        background-size: 25px 25px;
        cursor: pointer;
    }

    th {
        font-size: small;
        color: white;
        text-align: left;
    }

    td {
        border-top: white 1px solid;
    }

    .song-name {
        color: unset;
        color: white;
        font-size: small;
        text-align: left;
    }

    a.song-name:not([href]) {
        color: white;
        text-align: left;
    }

    .container-album {

        margin: auto;
        margin-top: 5%;
        width: 90%;
        height: 100%;
        /* overflow: visible; */
    }

    .center-text {
        text-align: center;
    }

    .white-text {
        color: white;
    }

    .outmost-container {
        display: flex;
        flex-wrap: wrap;
    }

    .name-artist {

        min-width: 122px;

    }

    .explicit {
        color: red;
        border-color: red;
    }

    .clean {
        color: silver;
        border-color: silver;
    }

    .explicitness-container {
        vertical-align: bottom;
        letter-spacing: 1px;
        font-size: x-small;
        border-style: solid;
        border-width: 1px;
        display: inline-block;
        text-align: center;
        padding: 1px;
        height: 13px;
        line-height: normal;
    }

    .explicit-border {
        /* margin-top: 15px; */
        border: red solid 1px;
        vertical-align: middle;
        text-anchor: middle;
        border-radius: .1rem;
    }

    .artistNameP {
        text-align: left;
        font-size: small;
        color: white;
    }

    .play-button-album {
        background: white;
    }

    .stick-right {
        margin-left: auto;
    }

    .album-info {
        flex: 1;
    }

    .additional-song-info {
        margin-left: auto;

        font-size: x-small;
    }

    .trackNumber-cell {
        min-width: 20px;
        font-size: small;
        color: white;
        width: 35px;
        height: 35px;
        text-align: center;
        /* background: red; */
    }

    .inner-track-num {
        width: 100%;
    }

    /*.name-cell {*/

    /*    min-width: 500px;*/

    /*    text-align: left;*/

    /*}*/

    /*.artist-cell {*/

    /*    min-width: 300px;*/

    /*}*/

    .name-cell {
        text-align: left;
        min-width: 130px;
        max-width: 20%;
    }

    .artist-cell {
        min-width: 130px;
        max-width: 10%;
    }

    .time-cell {
        min-width: 30px;
        text-align: left;
    }

    .small-album-info {
        color: white;
        font-size: x-small;

    }

    .extra-small-font {
        font-size: x-small;
    }

    .not-explicit {
        font-size: x-small;
        color: silver;
        min-width: 8px;
    }

    .album-tracks {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        /* background: purple; */
    }

    #container-songs {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;

    }

    .album-display {
        text-align: left;
        max-width: 30%;
        /* background-color: yellow; */
    }

    .album-songs {
        width: 60%;
        margin: auto;
        /* background: green;  */
        margin-bottom: 4em;
    }

    @media only screen and (max-width: 950px) {

        .album-display {
            text-align: left;
            min-width: 40%;
            max-width: 100%;
        }

    }

    @media only screen and (max-width: 1000px) {

        .album-songs {

            width: 100%;
            /* background-color: brown; */
        }

        .name-cell {
            min-width: 130px;
            max-width: 20%;
        }

        .artist-cell {
            min-width: 130px;
            max-width: 10%;
        }


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
</style>

<script>
    import router from '@/router'
    const axios = require('axios');
    import { getSongs, addToPlaylist, playSound, filterArtist, cutLength, millisToMinutesAndSeconds } from '@/shared/logic'
    export default {
        name: "playlist",
        data() {
            return {
                user: {},
                loading: true,
                playing: {},
                isPlaying: { isPlaying: false, index: '' },
                drag: {},
                albumSongs: '',
                album: {}
            }
        },
        async created() {
            // this.user = this.$store.state.user;
            this.getAlbum();
        },
        methods: {
            async getAlbum() {
                
                const response = await this.$store.dispatch("getAlbum", this.$route.query.album);
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
            },
            playSound: playSound,
            cutLength: cutLength,
            millisToMinutesAndSeconds: millisToMinutesAndSeconds,
            async addToPlaylist(song) {
                song.className = "play";
                
                song.username = this.user.username;
                await this.$store.dispatch("addToPlaylist", song);
            }
        },
        watch: {
            '$route.query.album': function(album) {
                this.getAlbum()
            }
      },
      computed: {
          computedUser() {
              this.user = this.$store.state.user;
              console.log('computedUser', this.user);
              if (this.user) this.getAlbum();
              return this.$store.state.user;
          } 
      }
    }
</script>