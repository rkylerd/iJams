<template>
  <div class="single-track">
        <a class="album-art" :style="{ 'background-image': 'url(' + song.artworkUrl60 + ')' }" @click.prevent="playSong(song, idx)">
            <img width="60" height="60" :class="song.className">
        </a>
        
        <div class="song-info">
            <div class="name-artist">
                <a class="song-name small-font" @click.prevent="goToAlbum(song)" href="" ><strong>{{song.trackName_short}}</strong></a><br>
                <a class="artist-name white-text small-font" @click.prevent="filterArtist(song.artistId)" href="">{{song.artistName_short}}</a><br>
            </div>
            
            <div class="stick-right">
                <button class="purchase-button btn-outline-success my-2 my-sm-0" type="button" @click.prevent="addToPlaylist(song)">Add</button>
                <p class="explicit" v-if="song.trackExplicitness == 'explicit'">{{song.trackExplicitness}}</p>
            </div>
            
        </div>
  </div> 
</template>

<script>

import { addToPlaylist, cutLength, updateMusicIcon } from '@/shared/logic'
import { goToAlbum, filterArtist } from '@/shared/navigation'
import App from '@/App.vue'
import router from '@/router'
export default {
  name: "SongTile",
  props: {
    song: Object,
    idx: Number
  }, 
  methods: {
      playSong(sound, idx) {
          this.$emit('play', {sound, idx})
      },
      addToPlaylist: addToPlaylist,
      goToAlbum: goToAlbum,
      cutLength: cutLength,
      filterArtist: filterArtist
  }
};
</script>

<style scoped>

</style>
