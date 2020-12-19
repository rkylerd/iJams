<template>
    <div>
        <span class="flex-row flex-wrap">
            <span class="album-art link" :style="{ 'background-image': 'url(' + album.artworkUrl100 + ')' }" @click.prevent="goToAlbum(album)">
                <img width="100" height="100">
            </span>
            
            <span v-if="album.collectionExplicitness.toLowerCase() == 'explicit'" class="explicit explicitness-container">Explicit</span>
            <span v-else-if="album.collectionExplicitness.toLowerCase() == 'cleaned'" class="clean explicitness-container">Clean</span>
        </span>

        <div class="song-info">
            <div class="name-artist">
                <span class="song-name small-font link" @click.prevent="goToAlbum(album)">
                    <strong>{{ (cutLength(album.collectionCensoredName, 60)) }}</strong>
                </span>
            </div>
        </div>
    </div> 
</template>

<script>
import { goToAlbum } from '@/shared/navigation'
import { cutLength } from '@/shared/logic'

export default {
  name: "AlbumCard",
  props: {
    album: {}
  }, 
  methods: {
      goToAlbum: goToAlbum,
      cutLength: cutLength
  }
};
</script>