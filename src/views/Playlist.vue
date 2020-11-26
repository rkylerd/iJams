<template>
  <div v-if="computedUser">
      <div class="page-title">Playlist</div>
      <section>
          <div><button v-if="mediaForCheckout.length" @click="goToCheckout">Go to checkout with selected songs ({{mediaForCheckout.length}})</button></div>
        <div class="playlist-normal">
            <SongCard 
                v-for="(song, idx) in playlist" 
                @add-checkout="addCheckout(song)" 
                @remove-checkout="removeCheckout(song)" 
                draggable="true" 
                :key="idx" 
                v-on:dragstart="setDragItem(song)" 
                v-on:dragover.prevent v-on:drop="dropItem(song)" 
                :song="song" 
                :displayNum="idx+1"/>
        </div>  
      </section>
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
    import { goToAlbum, filterArtist, goToCheckout } from '@/shared/navigation'

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
                mediaForCheckout: [],
                playSound,
                goToAlbum,
                dragDropItem: {},
                goToCheckout: async () => {
                    await store.dispatch('setCheckoutItems', playlistData.mediaForCheckout);
                    goToCheckout();
                },
                removeCheckout: (song) => {
                    console.log('removing');
                    let i = playlistData.mediaForCheckout.findIndex(({trackId}={}) => trackId === song.trackId); 
                    playlistData.mediaForCheckout.splice(i,1);
                },
                addCheckout: (song) => {console.log('adding'); playlistData.mediaForCheckout.unshift(song)},
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