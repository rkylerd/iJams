<template>
    <div>
        <section class="flex-row-wrap">
            <h3 style="margin-top: 2%; margin-left: 5%; color: whitesmoke;">Search Results:</h3>
                <div id="container-songs" class="container-normal">
                    <div class="flex-col-wrap">
                        <SongTile @play="playSong" class="flex-row-wrap"  v-bind:song="song" v-for="(song, idx) in songResults" :ref="idx" v-bind:idx="idx" :key="idx"/>   
                    </div>
                </div>
        </section> 
        <hr>
    </div>
</template>

<style lang="scss" scoped>
    @import '@/shared/styles/global.scss';

    .explicit {
        border: 0 .5px .5px .5px red solid;
        min-width: 9px;
    }

    .flex-col-wrap {
        height: 427px;
        margin-left: 25px;
    }

    #container-songs {
        display: flex;
        flex-wrap: wrap;
        overflow-y: hidden;
    }

    .container-normal {
        margin: auto;
        width: 90%;
        /* height: 400px; */
        flex-direction: row;
        overflow-x: auto;
        margin-top: 2%;
    }

</style>


<script>
    import App from '@/App.vue'
    import router from '@/router'
    import SongTile from '@/components/SongTile.vue'
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
                songResults: []
            }
        },
        components: {
            SongTile
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
            
        },
        watch: {
            '$route.query.search': function (search) {
              this.search()
            }
          },
    }
</script>