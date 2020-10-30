<template>
  <div class="home">
    <!--<img alt="Vue logo" src="../assets/logo.png">-->
    <h2 class="page-title">Home</h2>
   
    <div id="my-clean-songs">
      <div class="single-track search-display" v-for="(songs, idx) in myEdits" :key="songs.trackId">
              
              <a class="album-art" :style="{ 'background-image': 'url(' + songs.artworkUrl60 + ')' }" @click.prevent="playSong(songs, idx)">
                  <img width="60" height="60" :class="songs.className" :ref="idx">
              </a>
              
              <!-- class makes the song info a flex row. makes sense. -->
              <div class="my-songs-info">
                  <div class="name-artist">
                      <a @click.prevent="getAlbum(songs)" href="" class="song-name "><strong>{{songs.trackName}}</strong></a><br>
                      <a @click.prevent="filterArtist(songs.artistId)" href="" class=" white-text artist-name">{{songs.artistName}}</a><br>
                  </div>
                  
                  <div class="price-explicitness">
                  
                      <button class="purchase-button small-text btn-outline-success my-sm-0" type="button" @click.prevent="addToPlaylist(songs)">Add</button>
                      <div class="not-explicit">{{songs.trackExplicitness}}</div>
                  </div>
                  
              </div>
      </div>

      
      
  </div>
  
  </div>
</template>

<style>

.page-title {
  text-align: center;
  margin: 2vh auto 4vh auto;
  font-family: 'Fredoka One', cursive;
  font-weight: bold;
  font-size: 40px;
  -ms-transform: skewY(-5deg); /* IE 9 */
  -webkit-transform: skewY(-5deg); /* Safari 3-8 */
  transform: skewY(-5deg);
  text-shadow: 3px 3px white;
  color: #42b983 !important;

}

.purchase-button {
    margin-top: 0px !important; 
    float: right;
    font-size: x-small;
    padding: 3px 3px 3px 3px;
    max-width: 35px;
    border: 1px solid transparent;
    border-radius: .25rem;
}

.not-explicit {
    font-size: x-small;
    color: silver;
    min-width: 8px; 
}

.price-explicitness {
    margin-left: auto;
}

  .single-track {
      border-top: white 1px solid; 
      max-width: 220px;
  }

  .search-display {
      display: flex; 
      flex-direction: row; 
      flex-wrap: wrap;
  }

  .album-art {
      background: no-repeat;
      height: 60;
  }

  .play {
    border-color: transparent;
  }
  .play:hover {
    
    /* background: url(https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Ei-play.svg/120px-Ei-play.svg.png) center no-repeat; */
    background: url(https://www.wisc-online.com/asset-repository/getfile?id=414&getType=view
    ) center no-repeat;
    background-size: 40px 40px;
}

.stop {
    background: url(https://amnell9891.files.wordpress.com/2013/08/stop-normal-red-icon.png?w=150&h=150) center no-repeat;
    background-size: 35px 35px; 
}

#my-clean-songs {
    width: 90%;
    flex: 1;
    justify-content: center;
    margin: auto;
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    text-align: left;
}

.my-songs-info {
    margin-left: 3px;
    display: flex;
    flex-direction: row;
}

.song-name {
    
    color: white; 
    font-size: small;
}

.artist-name {
    color: unset;
    color:white; 
    font-size: x-small;
}

.name-artist { 
    min-width: 100px;  
}

.small-font {
    font-size: small;
}

.white-text {
    color: white;
}

body {
  background-color: black;
}
</style>

<script>
// @ is an alias to /src

import router from '@/router'
import { getSongs, getAlbum, addToPlaylist, playSound, filterArtist } from '@/shared/logic'
import myEdits from '@/shared/my-edits'

export default {
  name: 'home',
  data(){
    return {
      user: {},
      myEdits: myEdits,
      playing: {
                  
      },
      playingSong: "",
      // components: {
      // HelloWorld
      // }
    }
    
  },
  async beforeMount() {
    // this.user = this.$store.state.user;
    
    this.playing = this.$store.state.playing;
  },
  methods: {
    playSong(sound, index) {
          playSound(sound, this.$refs[index][0]);
      },
      addToPlaylist: addToPlaylist,
      getSongs: getSongs, 
      getAlbum: getAlbum,  
      filterArtist: filterArtist 
  },
  computed: {
    computedUser() {
        this.user = this.$store.state.user;
        return this.$store.state.user;
    }  
  },
}
</script>
