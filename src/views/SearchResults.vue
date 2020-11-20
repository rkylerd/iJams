<template>
    <div>
        <section class="sectionInfo">
            <h3>Search Results: {{searchTerm}}</h3>
            <MediaSorter @sortMedia="handleSort('songResults')" v-bind:media="songResults" type="song"/>     
        </section> 
        <div class="container-normal">
            <div class="flex-col-wrap">
                <SongTile @play="playSong" class="flex-row-wrap"  v-bind:song="song" v-for="(song, idx) in songResults" :ref="idx" v-bind:idx="idx" :key="idx"/>   
            </div>
        </div>

        <section class="sectionInfo">
            <MediaSorter @sortMedia="handleSort('mvideoResults')" v-bind:media="mvideoResults" type="mvideo"/>
        </section>
        <div class="container-normal">
            <div class="flex-row-wrap flex-space-inbetween">
                <MVideoTile v-for="(mvid, idx) in mvideoResults" :mvid="mvid" class="mvideo-card" :key="idx"/>
            </div>
        </div>
        <hr>
    </div>
</template>

<style lang="scss" scoped>
    @import '@/shared/styles/global.scss';

    div:not([class]) {
        width: 90%;
        margin: auto;

        .sectionInfo {
            text-align: left;
        }
        
        .container-normal {
            margin: unset auto;
            /* height: 400px; */
            flex-direction: row;
            overflow-x: auto;
        }

        .flex-space-inbetween {
            justify-content: space-evenly;
        }

        & > * {
            margin-top: 1rem;
        }
    }

    .explicit {
        border: 0 .5px .5px .5px red solid;
        min-width: 9px;
    }

    .flex-col-wrap {
        height: 427px;
        margin-left: 25px;
    }

    .mvideo-card {
        width: 200px;
    }

    .mvideo-info {
        text-align: left;
    }

</style>


<script>
    import App from '@/App.vue'
    import router from '@/router'
    import SongTile from '@/components/SongTile.vue'
    import MVideoTile from '@/components/MVideoTile.vue'
    import MediaSorter from '@/components/MediaSorter.vue'

    import { addToPlaylist, playSound, cutLength, updateMusicIcon, search } from '@/shared/logic'
    import { goToAlbum, filterArtist } from '@/shared/navigation'



    export default {
        name: 'Results',
        data() {
            return {
                user: {},
                playing: {},
                playingSong: '',
                isPlaying: { isPlaying: false, index: '' },
                songResults: [],
                mvideoResults: []
            }
        },
        components: {
            SongTile,
            MediaSorter,
            MVideoTile
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
                        this.mvideoResults =  mvideos;
                    }).catch(error => {
                        console.log("error from results.vue", error);
                    })
            },
            handleSort(mediaKey = "songResults") {
                return function (sortedMedia = []) {
                    this[mediaKey] = sortedMedia;
                }
            },
            playSong({sound = {}, idx = 0}) {
                // The fragile second paramter is to access the img tag within the SongTile component
                playSound(sound, this.$refs[idx][0].$el.children.item("a").children.item("img"));
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
            searchTerm: function() {
                return (this.$route.query.search).replace(/\b\+\b/g, ' '); 
            }
        },
        watch: {
            '$route.query.search': function (search) {
              this.search()
            }
          },
    }
</script>