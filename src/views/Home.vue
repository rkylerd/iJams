<template>
  <div class="home">
    <h2 class="page-title">Home</h2>
    <div id="my-clean-songs">
      <SongTile class="flex-row flex-wrap song-tile" v-bind:song="song" v-for="(song, idx) in myEdits" :key="idx"/>   
    </div>
  </div>
</template>

<style>

.purchase-button {
    margin-top: 0px !important; 
}

.not-explicit {
    font-size: x-small;
    color: silver;
    min-width: 8px; 
}

#my-clean-songs {
    width: 90%;
    justify-content: center;
    margin: auto;
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    text-align: left;
}

.name-artist { 
    min-width: 100px;  
}

@media (max-width: 400px) {
  .song-tile {
    background-color: pink;
    min-width: 100%;
  }
}

</style>

<script>
import { reactive } from 'vue';
import { addToPlaylist } from '@/shared/logic'
import { goToAlbum, filterArtist } from '@/shared/navigation'
import myEdits from '@/shared/my-edits'
import SongTile from '@/components/SongTile.vue'

export default {
  name: 'Home',
  setup() {
    const homePage = reactive({
      myEdits,
      addToPlaylist,
      goToAlbum,  
      filterArtist
    });

    return {
      ...homePage
    }
  },
  components: {
      SongTile
  }
}
</script>
