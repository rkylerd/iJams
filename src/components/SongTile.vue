<template>
  <div class="single-track">
        <a class="album-art" :style="{ 'background-image': 'url(' + song.artworkUrl60 + ')' }" @click.prevent="({ srcElement } = {}) => playSound(song, srcElement)">
            <img width="60" height="60" :class="{ 'play' : !isPlaying(song.trackId), 'stop' : isPlaying(song.trackId) }">
        </a>
        
        <div class="song-info">
            <div class="name-artist">
                <a class="song-name small-font" @click.prevent="goToAlbum(song)"><strong>{{song.trackName_short}}</strong></a><br>
                <a class="artist-name white-text small-font" @click.prevent="filterArtist(song.artistId)">{{song.artistName_short}}</a><br>
            </div>
            
            <div class="stick-right">
                <button class="purchase-button btn-outline-success my-2 my-sm-0" type="button" @click.prevent="addToPlaylist(song)">Add</button>
                <span class="explicit" v-if="song.trackExplicitness === 'explicit'">{{song.trackExplicitness}}</span>
            </div>
            
        </div>
  </div> 
</template>

<script>
import { reactive } from 'vue'
import store from '@/store'
import { addToPlaylist, cutLength, playSound } from '@/shared/logic'
import { goToAlbum, filterArtist } from '@/shared/navigation'

export default {
  name: "SongTile",
  props: {
    song: Object
  },
  setup(props) {
    
    const data = reactive({
      song: props.song,
      playSound,
      addToPlaylist,
      goToAlbum,
      cutLength,
      filterArtist,
      isPlaying: (id) => id === store.state.idOfPlaying
    });

    return { ...data };
  }
};
</script>

<style scoped>

</style>
