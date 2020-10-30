<template>
    <div v-if="!loading" id="container-songs" class="container-album">
        <div class="album-display">
            <img  width="100" height="100" :src="album.artworkUrl100">
            <div style="margin-top: 5px; display: flex; flex-wrap: wrap;">
                <h3 style="width: 100%" class="white-text">{{album.collectionName}}</h3>
                <h5 style="width: 100%" class="stick-left white-text link" @click.prevent="filterArtist(album.artistId)">{{album.artistName}}</h5>
                <h6 style="width: 100%" class="stick-left white-text">{{album.releaseDate}}</h6>
                <h6 style="width: 100%" class="stick-left white-text">{{album.genre}}</h6>
                <span v-if="album.collectionExplicitness.toLowerCase() === 'explicit' || album.collectionExplicitness.toLowerCase() === 'cleaned'" class="explicitness-container"
                :class="{'explicit': album.collectionExplicitness.toLowerCase() === 'explicit', 
                                'clean': album.collectionExplicitness.toLowerCase() === 'cleaned' }">{{album.collectionExplicitness}}</span>
            </div>
        </div>
        <table class="album-songs">
            <thead>
                <tr class="white-text">
                    <th class="center-text">#</th>
                    <th>Name</th>
                    <th>Artist</th>
                    <th>Time</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(song, idx) in albumSongs" :key="song.trackId">
                    <td class="trackNumber-cell small-album-info" :class="song.className" @click.prevent="playSong(song, idx)" :ref="idx"><a class="inner-track-num">{{song.trackNumber}}</a></td>
                    <td class="name-cell"><a class=" song-name white-text small-font" ><strong>{{song.trackName_short}}</strong></a></td>
                    <td class="artist-cell"><div @click.prevent="filterArtist(song.artistId)" class="small-font artistNameP white-text link">{{song.artistName_short}}</div></td>
                    <td class="time-cell"><div class="small-album-info">{{song.trackTimeMillis}}</div></td>
                    <td><button class="purchase-button btn-outline-success my-2 my-sm-0" type="submit"  @click.prevent="addToPlaylist(song)">Add</button></td>
                    <td v-if="song.trackExplicitness.toLowerCase() === 'explicit' || song.trackExplicitness.toLowerCase() === 'cleaned'" class="explicitness-container"
                        :class="{'explicit': song.trackExplicitness.toLowerCase() === 'explicit', 
                                'clean': song.trackExplicitness.toLowerCase() === 'cleaned' }">
                                {{song.collectionExplicitness}}
                    </td>
                    
                </tr>
            </tbody>
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
    import { getSongs, addToPlaylist, playSound, filterArtist, cutLength, millisToMinutesAndSeconds, getAlbum } from '@/shared/logic'
    export default {
        name: "Album",
        data() {
            return {
                user: {},
                loading: true,
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
                const results = await getAlbum(this.$route.query.album);
                
                this.album = results[0];
                this.albumSongs = results.slice(1).map(song => {
                    return {
                        ...song,
                        className: "play",
                        trackName_short: cutLength(song.trackName, 75),
                        artistName_short: cutLength(song.artistName, 35),
                        trackTimeMillis: millisToMinutesAndSeconds(song.trackTimeMillis)
                    }
                });
                this.loading = false;
            },
            playSong(sound, index) {
                playSound(sound, this.$refs[index][0]);
            },
            cutLength: cutLength,
            millisToMinutesAndSeconds: millisToMinutesAndSeconds,
            addToPlaylist: addToPlaylist,
            filterArtist: filterArtist
        },
        watch: {
            '$route.query.album': function() {
                this.getAlbum()
            }
      },
      computed: {
          computedUser() {
              this.user = this.$store.state.user;
              if (this.user) this.getAlbum();
              return this.$store.state.user;
          } 
      }
    }
</script>