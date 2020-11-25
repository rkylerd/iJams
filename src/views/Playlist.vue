<template>
  <div v-if="computedUser">
      <h2 class="page-title">Playlist</h2>
      <section>
        <div class="playlist-normal">
            <SongCard draggable="true"  v-for="(song, i) in playlist" :key="i" v-on:dragstart="setDragItem(song)" v-on:dragover.prevent v-on:drop="dropItem(song)" :song="song" :displayNum="i+1"/>
        </div>  
      </section>
    <!-- <router-view/> -->
  </div>
</template>

<style scoped>

    

    .playlist-normal {
        margin: 3rem;
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
        overflow-x: auto;
    }


</style>

<script>
    // const axios = require('axios');
    import { onBeforeMount, reactive, toRefs } from 'vue'
    import store from '@/store'
    import { playSound } from '@/shared/logic'
    import SongCard from '@/components/SongCard.vue'
    import { goToAlbum, filterArtist } from '@/shared/navigation'

    export default {
        name: "playlist",
        components: {
            SongCard
        },
        setup() {
            
            // const getPlaylist = () => {
            //     this.playlist = (await axios.get("api/library/" + this.user.username)).data.sort((a, b) => {
            //         return a.index - b.index;
            //     });
            // };

            let playlistData = reactive({
                user: {},
                loading: true,
                playlist: [],
                playSound,
                goToAlbum,
                dragDropItem: {},
                dropItem: (item) => {
                        const indexOfDragItem = playlistData.playlist.indexOf(playlistData.dragDropItem);
                        const indexOfDestination = playlistData.playlist.indexOf(item);
                        
                        playlistData.playlist.splice(indexOfDragItem, 1);
                        playlistData.playlist.splice(indexOfDestination, 0, playlistData.dragDropItem);

                        playlistData.playlist[indexOfDestination].index = indexOfDestination;

                        for (let i = indexOfDestination < indexOfDragItem ? indexOfDestination : indexOfDragItem; i < playlistData.playlist.length; i++) {
                            playlistData.playlist[i].index = i; 
                            // axios.put("api/library/" + this.user.username, { song: this.playlist[i] })
                            //     .then(results => {
                            //         console.log("successfully updated song with index: ", results);
                            //     })
                            //     .catch(error => {
                            //         console.log("error while updating the order of your playlist.", error);
                            //     });
                        }
                },
                setDragItem: (item) => { playlistData.dragDropItem = item },
                filterArtist,
                isPlaying: (id) => id === store.state.idOfPlaying
            });
            
            onBeforeMount(async () => {
                playlistData.user = store.state.user;
                // if (this.user) getPlaylist();
                playlistData.playlist = store.state.cart;
            });

            return {
                ...toRefs(playlistData)
            }
        },
        computed: {
          computedUser() {
              return store.state.user;
          }  
        }
    }
</script>