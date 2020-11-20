<template>
  <div>
      <video width="200px" height="auto" controls>
          <source :src="mvid.previewUrl" type=""/>
      </video>
      <div class="mvideo-info">
          <span>{{mvid.trackCensoredName}}</span><br>
          <span>{{mvid.artistName}}</span>
      </div>
  </div>  
</template>

<script>

import { addToPlaylist, cutLength, updateMusicIcon } from '@/shared/logic'
import { goToAlbum, filterArtist } from '@/shared/navigation'
import App from '@/App.vue'
import router from '@/router'
export default {
  name: "MVideoTile",
  props: {
    mvid: Object
  }, 
  methods: {
      addToPlaylist: addToPlaylist,
      goToAlbum: goToAlbum,
      cutLength: cutLength,
      filterArtist: filterArtist
  }
};
</script>

<style scoped>

</style>
