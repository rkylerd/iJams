<template>
    <div v-if="album" class="flex-row flex-wrap container-album">
        <div class="album-display">
            <img :src="album.artworkUrl100">
            <div class="flex-row flex-wrap">
                <h3>{{album.collectionName}}</h3>
                <span>
                    <h5 class="link" @click.prevent="filterArtist(album.artistId)">{{album.artistName}}</h5>
                </span>
                <h6>{{album.releaseDate}}</h6>
                <h6>{{album.genre}}</h6>
                <span v-if="album.collectionExplicitness.toLowerCase() === 'explicit' || album.collectionExplicitness.toLowerCase() === 'cleaned'" class="explicitness-container"
                :class="{'explicit': album.collectionExplicitness.toLowerCase() === 'explicit', 
                                'clean': album.collectionExplicitness.toLowerCase() === 'cleaned' }">{{album.collectionExplicitness}}</span>
            </div>
        </div>
        <table class="album-songs">
            <thead>
                <tr>
                    <th class="center-text">#</th>
                    <th>Name</th>
                    <th>Artist</th>
                    <th>Time</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(song, idx) in albumSongs" :key="idx">
                    <td class="trackNumber-cell small-album-info" :class="{ 'play' : !isPlaying(song.trackId), 'stop' : isPlaying(song.trackId) }" @click.prevent="({ target } = {}) => playSound(song, target)">{{song.trackNumber}}</td>
                    <td class="name-cell"><span class="song-name"><strong>{{song.trackName}}</strong></span></td>
                    <td class="artist-cell"><div @click.prevent="filterArtist(song.artistId)" class="x-small-font link">{{song.artistName}}</div></td>
                    <td class="time-cell"><div class="small-album-info">{{song.trackTimeMillis}}</div></td>
                    <td><Options type="song" :media="song"/></td>
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

<script>
    import { addToPlaylist, playSound, cutLength, millisToMinutesAndSeconds, getAlbum } from '@/shared/logic'
    import { filterArtist } from '@/shared/navigation'
    import { onBeforeMount, reactive, ref, computed } from 'vue'
    import { useStore } from 'vuex'
    import router from '@/router'
    import Options from '@/components/ContentOptions'

    export default {
        name: "Album",
        components: {
            Options
        },
        setup() {
            const store = useStore();
            const album = ref(undefined);
            const albumSongs = ref([]);

            onBeforeMount(async () => {
                const { album: albumId = "" } = router.currentRoute.value.query || {}; 
                const results = await getAlbum(albumId);
                
                album.value = results[0],
                albumSongs.value = results.slice(1).map(song => {
                    return {
                        ...song,
                        trackName: cutLength(song.trackName, 75),
                        artistName: cutLength(song.artistName, 35),
                        trackTimeMillis: millisToMinutesAndSeconds(song.trackTimeMillis).timeStr
                    }
                })
            });
            
            const data = reactive({
                user: {},
                playSound,
                cutLength,
                addToPlaylist,
                filterArtist,
                trackIsPlaying: computed(() => store.state.isPlaying),
                isPlaying: id => data.trackIsPlaying && id === store.state.dataOfPlaying.trackId
            });

            return { ...data, album, albumSongs };
        }
    }
</script>

<style scoped lang="scss">

    .play:hover {
        background-size: 100% auto;
        font-size: 0 !important;
        cursor: pointer;
    }

    .stop {
        background-size: 100% auto;
        font-size: 0 !important;
        cursor: pointer;
    }

    .container-album {
        margin: auto;
        margin-top: 5%;
        width: 90%;
        height: 100%;
        /* overflow: visible; */

        .album-display {
            text-align: left;
            max-width: 30%;
            @media only screen and (max-width: 950px) {
                text-align: left;
                min-width: 40%;
                max-width: 100%;
            }
            img {
                width: 100px; 
                height: 100px; 
            }

            div {
                margin-top: 5px;

                h3, h5, h6 {
                    width: 100%
                }
            }
        }

        table.album-songs {
            width: 60%;
            margin: auto;
            margin-bottom: 4em;
            @media only screen and (max-width: 1000px) {
                width: 100%;
            }

            th {
                font-size: small;
                color: white;
                text-align: left;
            }

            td {
                border-top: white 1px solid;
                .small-album-info {
                    color: white;
                    font-size: x-small;
                }
            }

            td.trackNumber-cell {
                min-width: 20px;
                font-size: small;
                color: white;
                max-width: 25px;
                height: 25px;
                text-align: center;
                span {
                    width: 100%;
                }
            }

            td.name-cell {
                text-align: left;
                min-width: 130px;
                max-width: 20%;
            }

            td.artist-cell {
                min-width: 130px;
                max-width: 10%;
                text-align: left;
            }

            td.time-cell {
                min-width: 30px;
                text-align: left;
            }
        }
    }
</style>
