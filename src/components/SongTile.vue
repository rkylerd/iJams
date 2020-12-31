<template>
  <div class="single-track">
        <div class="album-art" :style="{ 'background-image': 'url(' + song.artworkUrl60 + ')' }" @click.prevent="({ srcElement } = {}) => playSound(song, srcElement)">
            <img width="60" height="60" :class="{ 'play' : !isPlaying(song.trackId), 'stop' : isPlaying(song.trackId) }">
        </div>
        
        <div class="song-info">
            <div class="name-artist">
                <span class="song-name small-font" @click.prevent="goToAlbum(song)"><strong>{{song.trackName}}</strong></span><br>
                <span class="artist-name small-font" @click.prevent="filterArtist(song.artistId)">{{song.artistName}}</span><br>
            </div>
            
            <div>
                <Options :media="song" type="song"/> <!-- <button class="purchase-button btn-outline-success my-2 my-sm-0" type="button" @click.prevent="addToPlaylist(song)">Add</button> -->
                <span class="explicit" v-if="song.trackExplicitness === 'explicit'">{{song.trackExplicitness}}</span>
            </div>
            
        </div>
  </div> 
</template>

<script>
import { reactive, toRefs, computed } from 'vue'
import { useStore } from 'vuex'
import { addToPlaylist, cutLength, playSound } from '@/shared/logic'
import { goToAlbum, filterArtist } from '@/shared/navigation'
import Options from '@/components/ContentOptions.vue'

export default {
  name: "SongTile",
  props: {
    song: Object
  },
  components: {
      Options
  },
  setup(props) {
    const store = useStore();
    const data = reactive({
      song: props.song,
      playSound,
      addToPlaylist,
      goToAlbum,
      cutLength,
      filterArtist,
      trackIsPlaying: computed(() => store.state.isPlaying),
      isPlaying: id => data.trackIsPlaying && id === store.state.dataOfPlaying.trackId
    });

    return { ...toRefs(data) };
  }
};
</script>

<style scoped>

</style>
