<template>
  <div>
    <section class="flex-row flex-wrap">
      <template v-if="!loading">
        <h3 v-if="artistAlbums.length" style="margin-top: 2%; margin-left: 5%; color: whitesmoke;">{{artistAlbums[0].artistName}}</h3>
        <br>
        <div class="container-normal">
          <div class="flex-col-wrap">            
            <AlbumCard class="albums-container flex-row flex-wrap" 
                style="min-height: 175px;" 
                v-for="(album, idx) in artistAlbums.slice(1,artistAlbums.length-1)" 
                v-bind:key="idx"
                v-bind:album="album"/>                
          </div>
        </div>
      </template>
    </section>
    <hr>
  </div>
</template>

<style scoped>

.flex-col-wrap {
    height: 100%; 
    margin-left: 25px;
}

.album-art {
    cursor: pointer;
}

.name-artist {
    min-height: 50px;
}

.albums-container {
    border-top: white 1px solid; 
    max-width: 175px;
}

.container-normal {
    display: flex;
    flex-wrap: wrap;
    margin: auto;
    width: 90%;
    height: 75vh; 
    flex-direction: row;
    overflow-x: auto;
    margin-top: 2%;
}
</style>


<script>
import { addToPlaylist, getArtistAlbums } from '@/shared/logic'
import AlbumCard from '@/components/AlbumCard'

export default {
  name: 'Artist',
  data(){
    return {
   playing: {      
        },
          artistAlbums: [],
          loading: true,
        }
  },
  components: {
    AlbumCard
  },
  async created() {
    await this.getArtistAlbums();
  },
  methods: {
    getArtistAlbums() {
      getArtistAlbums(this.$route.query.artist).then(albums => {
        this.artistAlbums = albums;
        this.loading = false;
      });
    },
    async logout() {
      try {
        this.error = await this.$store.dispatch("logout");
      } catch (error) {
        console.log(error);
      }
    },
    addToPlaylist: addToPlaylist
  }
}
</script>