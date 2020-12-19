<template>
  <div v-if="computedUser">
      <div class="page-title">Playlist</div>
      <section>
          <div><button v-if="mediaForCheckout.length" @click="goToCheckout">Go to checkout with selected songs ({{mediaForCheckout.length}})</button></div>
        <div class="playlist-normal">
            <!-- @remove-checkout="removeCheckout(song)"  -->
            <SongCard 
                v-for="(song, idx) in playlist" 
                @add-checkout="addCheckout(song)" 
                @remove-checkout="deleteFromPlaylist(song)" 
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
    import { playSound, getPlaylist, updatePlaylist, deleteFromPlaylist } from '@/shared/logic'
    import SongCard from '@/components/SongCard.vue'
    import { goToAlbum, filterArtist, goToCheckout } from '@/shared/navigation'

    export default {
        name: "playlist",
        components: {
            SongCard
        },
        setup() {

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
                removeCheckout: ({ trackId: id = ""} = {}) => {
                    console.log('removing');
                    let i = playlistData.mediaForCheckout.findIndex(({trackId}={}) => trackId === id); 
                    playlistData.mediaForCheckout.splice(i,1);
                },
                deleteFromPlaylist,
                addCheckout: (song) => {console.log('adding'); playlistData.mediaForCheckout.unshift(song)},
                dropItem: (item) => {
                        const indexOfDragItem = playlistData.playlist.indexOf(playlistData.dragDropItem);
                        const indexOfDestination = playlistData.playlist.indexOf(item);
                        
                        playlistData.playlist.splice(indexOfDragItem, 1);
                        playlistData.playlist.splice(indexOfDestination, 0, playlistData.dragDropItem);

                        playlistData.playlist[indexOfDestination].index = indexOfDestination;

                        for (let i = indexOfDestination < indexOfDragItem ? indexOfDestination : indexOfDragItem; i < playlistData.playlist.length; i++) {
                            playlistData.playlist[i].index = i; 
                            
                            try {
                                updatePlaylist(store.user.username, { song: playlistData.playlist[i] })
                            } catch (err) {
                                console.log("error while updating the order of your playlist.", err);
                            }
                        }
                },
                setDragItem: (item) => { playlistData.dragDropItem = item },
                filterArtist,
                isPlaying: (id) => id === store.state.idOfPlaying
            });
            
            onBeforeMount(async () => {
                try {
                    playlistData.playlist = await getPlaylist(store.state.user.username)
                } catch (err) {
                    console.log('Failed getting playlist', err);
                }

                playlistData.user = store.state.user;
                // if (playlistData.user) getPlaylist();
                // playlistData.playlist = store.state.cart;
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