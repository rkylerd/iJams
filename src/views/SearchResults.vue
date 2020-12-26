<template>
    <div>
        <section class="sectionInfo">
            <h3>Search Results: {{searchTerm}}</h3>
            <MediaSorter @sort-media="handleSort('songResults')" v-bind:media="songResults" type="song"/>     
        </section> 
        <div class="container-normal">
            <div class="flex-col-wrap">
                <SongTile class="flex-row flex-wrap" :song="song" v-for="(song, idx) in songResults" :idx="idx" :key="idx"/>   
            </div>
        </div>

        <section class="sectionInfo">
            <MediaSorter @sort-media="handleSort('mvideoResults')" v-bind:media="mvideoResults" type="mvideo"/>
        </section>
        <div class="container-normal">
            <div class="flex-row flex-wrap space-evenly">
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

</style>

<script>
    import SongTile from '@/components/SongTile.vue'
    import MVideoTile from '@/components/MVideoTile.vue'
    import MediaSorter from '@/components/MediaSorter.vue'
    import { cutLength, updateMusicIcon, search } from '@/shared/logic'

    export default {
        name: 'Results',
        data() {
            return {
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
                                trackName: cutLength(song.trackName, 12),
                                artistName: cutLength(song.artistName, 20)
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
            async logout() {
                try {
                    this.error = await this.$store.dispatch("logout");
                }
                catch (error) {
                    console.log(error);
                }
            }
        },
        computed: {
            searchTerm: function() {
                return (this.$route.query.search || "").replace(/\b\+\b/g, ' '); 
            }
        },
        watch: {
            '$route.query.search': function () {
              this.search()
            }
          },
    }
</script>