<template>
  <div class="home">
    <h2 class="page-title">Home</h2>
   
    <div id="my-clean-songs">
      <SongTile @play="playSong" class="flex-row-wrap"  v-bind:song="song" v-for="(song, idx) in myEdits" :ref="idx" v-bind:idx="idx" :key="idx"/>   
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
    /* flex: 1; */
    justify-content: flex-start;
    margin: auto;
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    text-align: left;
}

.name-artist { 
    min-width: 100px;  
}

</style>

<script>
import { addToPlaylist, playSound } from '@/shared/logic'
import { goToAlbum, filterArtist } from '@/shared/navigation'
import myEdits from '@/shared/my-edits'
import SongTile from '@/components/SongTile.vue'

export default {
  name: 'Home',
  data(){
    return {
      user: {},
      myEdits: myEdits
    }
  },
  components: {
      SongTile
  },
  async beforeMount() {
    // this.user = this.$store.state.user;
    this.playing = this.$store.state.playing;
  },
  methods: {
    playSong({sound = {}, idx = 0}) {
          playSound(sound, this.$refs[idx][0].$el.children.item("a").children.item("img"));
      },
      addToPlaylist: addToPlaylist,
      goToAlbum: goToAlbum,  
      filterArtist: filterArtist 
  },
  computed: {
    computedUser() {
        return this.$store.state.user;
    }  
  },
}
</script>
