<template>
  <div class="playlist-single-track" style="border-right: 1px solid white;">
      <div class="fav-num-container">
          <span v-if="!selected" @click.prevent="(e)=>{setSelected(e); emitCheckout(selected);}" class="fav-num white-text small-font">{{displayNum}}</span>
          <input v-else type="checkbox" :checked="selected" @click.prevent="(e)=>{setSelected(e); emitCheckout(selected);}" class="fav-num white-text small-font"/>
          <Options :media="song" type="song-cart"/>  
      </div>

      <div class="album-art" :style="{ 'background-image': 'url(' + song.artworkUrl60 + ')' }" @click.prevent="(e)=>{playSound(song, e.srcElement)}">
          <img width="60" height="60" style="display: block;" :class="{ 'play' : !isPlaying(song.trackId), 'stop' : isPlaying(song.trackId) }">
      </div>

      <div class="name-artist">
          <a class="white-text song-name" @click.prevent="goToAlbum(song)" href=""><strong>{{song.trackName || song.trackName_short}}</strong></a><br>
          <a class=" white-text artist-name link" @click.prevent="filterArtist(song.artistId)">{{song.artistName || song.artistName_short}}</a><br>
      </div>
  </div> 
</template>

<script>
import { reactive, toRefs } from 'vue'
import store from '@/store'
import { addToPlaylist, cutLength, playSound } from '@/shared/logic'
import { goToAlbum, filterArtist } from '@/shared/navigation'
import Options from '@/components/ContentOptions.vue'

export default {
  name: "SongCard",
  props: {
    song: Object,
    displayNum: Number
  },
  components: {
      Options
  },
  methods: {
    emitCheckout(selected) {this.$emit(selected ? 'add-checkout' : 'remove-checkout')}
  },
  setup(props) {
    const data = reactive({
      selected: false,
      song: props.song,
      displayNum: props.displayNum,
      playSound,
      addToPlaylist,
      goToAlbum,
      cutLength,
      filterArtist,
      setSelected: (e) => {
        let selected = (e.target.tagName.toLowerCase() !== "input"); 
        data.selected = selected; 
      },
      isPlaying: (id) => id === store.state.idOfPlaying
    });

    return { ...toRefs(data) };
  }
};
</script>

<style scoped>
   .fav-num-container {
        width: 100%;
        height: 20px;
        display: flex;
        justify-content: space-between;
        vertical-align: text-top;
    }

    .fav-num {
        /* padding: .25rem .5rem 0 .5rem; */
        width: 20px;
        border: solid 1px white;

        border-radius: .3rem;
    }
    .name-artist {
        text-align: left;
        padding: 1em;
    }

    .playlist-single-track {
        border-top: white 1px solid;
        width: 180px;
    }
    .album-art {
        margin: auto;
        width: 60px;
    }
</style>
