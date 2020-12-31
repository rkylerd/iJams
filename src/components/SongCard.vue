<template>
  <div class="playlist-single-track">
      <div class="fav-num-container">
        <div v-if="!selected" @click.prevent="(e)=>{setSelected(e); emitCheckout(selected);}" class="fav-num small-font" style="cursor: pointer;">
          <span>{{displayNum}}</span>
        </div>
        <div v-else>
          <input type="checkbox" :checked="selected" @click.prevent="(e)=>{setSelected(e); emitCheckout(selected);}" class="fav-num small-font"/>
        </div>
          <Options :media="song" type="song-cart"/>  
      </div>

      <div class="album-art" :style="{ 'background-image': 'url(' + song.artworkUrl60 + ')' }" @click.prevent="(e)=>{playSound(song, e.srcElement)}">
          <img width="60" height="60" style="display: block;" :class="{ 'play' : !isPlaying(song.trackId), 'stop' : isPlaying(song.trackId) }">
      </div>

      <div class="name-artist">
          <span class="song-name" @click.prevent="goToAlbum(song)"><strong>{{song.trackName}}</strong></span><br>
          <span class="artist-name link" @click.prevent="filterArtist(song.artistId)">{{song.artistName}}</span><br>
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
    const store = useStore();
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
      trackIsPlaying: computed(() => store.state.isPlaying),
      isPlaying: id => data.trackIsPlaying && id === store.state.dataOfPlaying.trackId
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
        background-color: #292b2c;
        color: #f7f7f7;
        border-radius: .3rem;
    }
    .name-artist {
        text-align: left;
        padding: 1em;
    }

    .playlist-single-track {
        border-top: 1px solid #292b2c;
        border-right: 1px solid #292b2c;
        width: 180px;
    }
    .album-art {
        margin: auto;
        width: 60px;
    }
</style>
