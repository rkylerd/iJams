<template>
  <div>
      <Loading v-if="loading" :msg="`Retrieving your playlist`" />
      <div class="page-title-container">
        <div class="page-title">Playlist</div>
      </div>
      <section>
        <div style="text-align: right;">
            Selected songs: ({{mediaForCheckout.length}})
            <button 
                class="btn btn-success" 
                :disabled="!mediaForCheckout.length" 
                @click="goToCheckout">
                    Go to checkout
            </button>
        </div>
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

<style scoped lang="scss">

    section {
        margin: 0 3rem;
        > * {
            margin-bottom: .5em;
            .btn-success {
                background-color: #292b2c;
                border-color: transparent;
                &:hover {
                    background-color: #42b983;
                }
            }
            .btn {
                opacity: 1;
            }
        }
        > div {
            > button {
                font-size: small;
            }
        }
        .playlist-normal {
            display: flex;
            flex-wrap: wrap;
            justify-content: flex-start;
            overflow-x: auto;
            @media (max-width: 652px) {
                justify-content: center;
            }
        }
    }

</style>

<script>
    import { onBeforeMount, reactive, toRefs, computed } from 'vue'
    import { playSound, getPlaylist, updatePlaylist } from '@/shared/logic'
    import SongCard from '@/components/SongCard.vue'
    import Loading from '@/components/Loading.vue'
    import { goToAlbum, filterArtist, goToCheckout } from '@/shared/navigation'
    import { useStore } from 'vuex'

    export default {
        name: "playlist",
        components: {
            SongCard,
            Loading
        },
        setup() {
            const store = useStore();
            let playlistData = reactive({
                loading: true,
                playlist: computed(() => store.state.playlist),
                mediaForCheckout: [],
                playSound,
                goToAlbum,
                dragDropItem: {},
                goToCheckout: async () => {
                    await store.dispatch('setCheckoutItems', playlistData.mediaForCheckout);
                    goToCheckout();
                },
                removeCheckout: ({ trackId: id = ""} = {}) => {
                    let i = playlistData.mediaForCheckout.findIndex(({trackId}={}) => trackId === id); 
                    playlistData.mediaForCheckout.splice(i,1);
                },
                addCheckout: (song) => { playlistData.mediaForCheckout.unshift(song) },
                dropItem: (item) => {
                    
                    // Remove the moved song from its original index
                    const indexOfDragItem = playlistData.playlist.indexOf(playlistData.dragDropItem);
                    playlistData.playlist.splice(indexOfDragItem, 1);

                    // Add the moved song to the desired location and update its index to update the db
                    const indexOfDestination = playlistData.playlist.indexOf(item);
                    playlistData.playlist.splice(indexOfDestination, 0, playlistData.dragDropItem);
                    playlistData.playlist[indexOfDestination].index = indexOfDestination;

                    const indexUpdatePromises = [];
                    // Only update the song indeces that were effected
                    let i = indexOfDestination < indexOfDragItem ? indexOfDestination : indexOfDragItem;
                    let end = indexOfDestination < indexOfDragItem ? indexOfDragItem : indexOfDestination;
                    for (i; i <= end; i++) {
                        // re-sync the indeces of each song for db update
                        playlistData.playlist[i].index = i; 
                        indexUpdatePromises.push(
                            updatePlaylist(store.state.user.username, { song: playlistData.playlist[i] })
                        );
                    }
                    Promise.all(indexUpdatePromises)
                        .catch(err => {
                            console.log('error', err);
                        })
                },
                setDragItem: (item) => { playlistData.dragDropItem = item },
                filterArtist
            });
            
            onBeforeMount(async () => {
                try {
                    await getPlaylist();
                    playlistData.loading = false;
                    if (!playlistData.playlist.length) {
                        store.dispatch("addToast", { key: "playlist-alert", msg: "This page will be empty until you add songs to your playlist"});
                    }
                    
                } catch (err) {
                    console.log('Failed getting playlist', err);
                }

            });

            return {
                ...toRefs(playlistData)
            }
        }
    }
</script>