<template>
    <div>
        <Loading v-if="loading" msg="Working on it..." />
        <div class="page-title-container" style="align-self: center;">
            <div class="page-title">Search: {{searchTerm}}</div>
        </div>
        <section class="sectionInfo">
            <MediaSorter @sort-media="handleSort('songResults')" v-bind:media="songResults" type="song"/>     
        </section>
        <div class="container-normal flex-row">
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
            flex-direction: row;
            overflow-x: auto;
        }

        & > *:not(.loading-box) {
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
    import Loading from '@/components/Loading.vue'

    export default {
        name: 'Results',
        data() {
            return {
                songResults: [],
                mvideoResults: [],
                loading: true
            }
        },
        components: {
            SongTile,
            MediaSorter,
            MVideoTile,
            Loading
        },
        async created() {
            this.search();
        },
        methods: {
            search() {
                if (this.$store.state.referenceToClassName && this.$store.state.referenceToClassName.classList.length) {
                    updateMusicIcon(this.$store.state.referenceToClassName, false);
                }
                this.loading = true;
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
                        this.loading = false;
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