    <template>
        <div>
        <section class="outmost-container">
          
          <template v-if="!loading">
            <h3 style="margin-top: 2%; margin-left: 5%; color: whitesmoke;">{{artistAlbums[0].artistName}}</h3>
          <br>
            <div id="container-songs" class="container-normal">
              <div class="second-layer-container">
                                  
                      <div class="albums-container flex" style="min-height: 175px;" v-for="album in artistAlbums.slice(1,artistAlbums.length-1)">
                        <!--{{album}}-->
                        <span class="flex">
                            <a class="album-art" :style="{ 'background-image': 'url(' + album.artworkUrl100 + ')' }" @click.prevent="getAlbum(album)">
                                <img width="100" height="100">
                            </a>
                            
                            <span v-if="album.collectionExplicitness.toLowerCase() == 'explicit'" class="explicit explicitness-container">Explicit</span>
                            <span v-else-if="album.collectionExplicitness.toLowerCase() == 'cleaned'" class="clean explicitness-container">Clean</span>
                        </span>
                              
                              
                              <!-- class makes the song info a flex row. makes sense. -->
                              <div class="song-info">
                                  <div class="name-artist">
                                      <a class="song-name purple-text small-font" @click.prevent="getAlbum(album)" href="" >
                                        <strong>{{ (cutLength(album.collectionCensoredName, 60)) }}</strong>
                                        
                                      </a>
                                      <!--<a  class="artist-name white-text small-font" href="">{{album.artistName}}</a><br>-->
                                  </div>
                              </div>
                      </div>                        
                  </div>
                    </div>
                    </template>
    </section>
    
    <hr>
    
    </div>
    
    
    
    </template>

<style scoped>
body {background-color: black;}
.second-layer-container {
    display: flex; 
    flex-direction: column; 
    flex-wrap: wrap; 
    background: black; 
    height: 100%; 
    margin-left: 25px;
}

.album-art {
    background: no-repeat;
    cursor: pointer;
}

.play:hover {
    
    /* background: url(https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Ei-play.svg/120px-Ei-play.svg.png) center no-repeat; */
    background: url(https://www.wisc-online.com/asset-repository/getfile?id=414&getType=view
    ) center no-repeat;
    background-size: 40px 40px;
}

.stop:hover {
    background: url(https://amnell9891.files.wordpress.com/2013/08/stop-normal-red-icon.png?w=150&h=150) center no-repeat;
    background-size: 35px 35px; 
}

.purple-text {
    color: #990099;
}

.song-info {
    display: flex;
    flex-direction: row;
    padding-left: 3px;
    text-align: left;
}

.song-name {
    
    color: white; 
    font-size: small;
    
}

.artist-name {
    color:white; 
    font-size: x-small;
}

.name-artist {
    min-height: 50px;
    min-width: 122px;
    
}

.white-text {
    color: white;
}

.purchase-button {
    float: right;
    font-size: x-small;
    padding: 3px 3px 3px 3px;
    max-width: 35px;
    border: 1px solid transparent;
    border-radius: .25rem;
}

.explicit {    
    color: red;
    border-color: red;
}

.clean {    
    color: silver;
    border-color: silver;
}

.explicitness-container {
  /*font-weight: bold;*/
  letter-spacing: 1px;
    font-size: x-small;
    border-style: solid;
    border-width: 1px;
    display: inline-block;
    text-align: center;
    padding: 1px;
    height: 13px;
    line-height: normal;
}

.flex {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
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

.outmost-container {
    display: flex; 
    flex-wrap: wrap;
}
</style>


<script>
import App from '@/App.vue'
import { db } from '@/main'
const axios = require('axios');
import router from '@/router'

export default {
  name: 'mypage',
  data(){
    return {
   playing: {      
        },
          playingSong: '',
          isPlaying: {isPlaying: false, index: ''},
          artistAlbums: [],
          loading: true,
        }
    },
  async created() {
    
    this.getArtistAlbums();
  },
  methods: {
    getArtistAlbums() {
      
      this.$store.dispatch("getArtistAlbums", this.$route.query.artist).then(results => {
        this.artistAlbums = [];
        console.log('results', results)
        this.artistAlbums = results.data.results;
        this.loading = false;
      });
    },
    async addToPlaylist(song) {
      song.className = "play";
      await this.$store.dispatch("addSong", song);
    },
    async logout() {
      try {
        this.error = await this.$store.dispatch("logout");
      } catch (error) {
        console.log(error);
      }
    },
    playSound (sound) {
            console.log("My sounds: ", sound.previewUrl);
            if(sound) {

              let index = this.$store.state.results.indexOf(sound);
              if (this.isPlaying.index === index) {
                  
                this.playing.pause(); 

                
                    this.$store.state.results[this.isPlaying.index].className = "play";
                
                this.isPlaying.isPlaying = false;
                this.isPlaying.index = '';
                return;
              }

              this.playingSong = sound.previewUrl;

              if (this.playing != undefined && this.isPlaying.isPlaying) {
                this.playing.pause(); 
                
                
                   this.$store.state.results[this.isPlaying.index].className = "play";
                
              }

              this.playing = new Audio(sound.previewUrl);

              //Are we on the home page or the search page?
              
                this.$store.state.results[index].className = "stop";
            
              
            //   this.controlPlayer = this.controlPlayer;
            //   this.controlPlayer.visibility = "visible";

              this.isPlaying.isPlaying = true;
              this.isPlaying.index = index;
              this.playing.play();
            //   audio.play();
            }
          },
          async getAlbum(album) {
            // console.log("album to send ", album);
      
            // try {
            //   const response = await this.$store.dispatch("getAlbum", album.collectionId);
            //   response.data.results.splice(0, 1);
            
            //   for (var i = 0; i < response.data.results.length; i++) {
            //     response.data.results[i].className = "play";
            //     response.data.results[i].trackName_short = this.cutLength(response.data.results[i].trackName, 75);
            //     response.data.results[i].artistName_short = this.cutLength(response.data.results[i].artistName, 35);
            //     response.data.results[i].trackTimeMillis = millisToMinutesAndSeconds(response.data.results[i].trackTimeMillis);
            //   }
            
            //   album.songs = response.data.results;
            //   await this.$store.dispatch("defineAlbumInfo", album);
            
            //   router.push("Album");
            // }
            // catch (err) {
            
            //   console.log(err);
            
            // }
            router.push({path:"album", query: {"album":album.collectionId}});
        },
        async filterArtist(artistId) {
            this.rightArrow = false;
            this.filterArt = true;

            let ls = JSON.parse(window.localStorage.getItem("savedState"));
            ls.push({'songs': this.songResults, 'class':this.containerClass});

            window.localStorage.setItem("savedState", JSON.stringify(ls));

            this.containerClass = "container-normal";
            this.artistResults = [];
            this.artistResults.push(artistId);
            await this.getSongInfo();
            this.leftArrow = true;
        },
        cutLength(inputWord, length) {
            if (inputWord.length > length) {
                inputWord = inputWord.substring(0, length).trim() + "...";
            }
            return inputWord;
        }
  },
  watch: {
    '$route.query.artist': function (search) {
      this.getArtistAlbums()
    }
  },
}

function millisToMinutesAndSeconds(millis) {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
  }
</script>