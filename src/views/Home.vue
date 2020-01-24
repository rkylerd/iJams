<template>
  <div class="home">
    <!--<img alt="Vue logo" src="../assets/logo.png">-->
    <h2 class="page-title">Home</h2>
   
    <div id="my-clean-songs">
      <div class="single-track search-display" v-for="songs in myEdits" :key="songs.trackId">
              
              <a class="album-art" :style="{ 'background-image': 'url(' + songs.artworkUrl60 + ')' }" @click.prevent="playSound(songs)">
                  <img width="60" height="60" :class="songs.className">
              </a>
              
              <!-- class makes the song info a flex row. makes sense. -->
              <div class="my-songs-info">
                  <div class="name-artist">
                      <a @click.prevent="getAlbum(songs)" href="" class="song-name "><strong>{{songs.trackName}}</strong></a><br>
                      <a @click.prevent="filterArtist(songs.artistId)" href="" class=" white-text artist-name">{{songs.artistName}}</a><br>
                  </div>
                  
                  <div class="price-explicitness">
                  
                      <button class="purchase-button small-text btn-outline-success my-2 my-sm-0" type="button" @click.prevent="addToPlaylist(songs)">Add</button>
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
// import { db } from '@/main'
import router from '@/router'

export default {
  name: 'home',
  data(){
    return {
      user: {},
      myEdits: [ 
        {trackName: "Suit & Tie", 
              previewUrl: "./audio/suitandtie.mp3", 
              collectionName: "Suit & Tie (feat. JAY Z) - Single", 
              trackPrice: "1.29", artistName: "Justin Timberlake", 
              trackExplicitness: "clean", 
              artworkUrl60: "https://is4-ssl.mzstatic.com/image/thumb/Music/v4/b2/24/e9/b224e982-9e88-1197-498e-24620de4295a/source/60x60bb.jpg", 
              className: "play", 
              trackId: "9296936513590584", 
              trackTimeMillis: 233000, 
              collectionId: '598779346', 
              artistId: '398128'}, 
        {trackName: "Moonshine", 
              previewUrl: "./audio/Moonshine.mp3", 
              collectionName: "Unorthodox Jukebox", 
              trackPrice: "1.29", 
              artistName: "Bruno Mars", 
              trackExplicitness: "clean", 
              artworkUrl60: "https://is3-ssl.mzstatic.com/image/thumb/Music/v4/35/b8/aa/35b8aab0-d693-e316-4a46-e22eed3126ba/source/60x60bb.jpg", 
              className: "play", 
              trackId: "1154032749685860", 
              trackTimeMillis: 229000, 
              collectionId: '573962245', 
              artistId: '278873078'}, 
        {trackName: "Powerful", 
              previewUrl: "./audio/powerful.mp3", 
              collectionName: "Powerful (Remixes) [feat. Ellie Goulding & Tarrus Riley] - EP", 
              trackPrice: "1.29", 
              artistName: "Major Lazer", 
              trackExplicitness: "clean", 
              artworkUrl60: "https://is3-ssl.mzstatic.com/image/thumb/Music118/v4/b9/00/aa/b900aacd-7772-79e7-2e75-584177b17b17/source/60x60bb.jpg", 
              className: "play", 
              trackId: "1946794068305766", 
              trackTimeMillis: 201000, 
              collectionId: '1445153684', 
              artistId: '315761934'}, 
        {trackName: "Feels", 
              previewUrl: "./audio/feels.mp3", 
              collectionName: "Funk Wav Bounces Vol. 1", 
              trackPrice: "1.29", 
              artistName: "Calvin Harris", 
              trackExplicitness: "clean", 
              artworkUrl60:"https://is3-ssl.mzstatic.com/image/thumb/Music122/v4/4c/60/56/4c6056bf-ef5c-21e1-c330-b30f569a9e28/source/60x60bb.jpg", 
              className: "play", 
              trackId: "3520267229044124", 
              trackTimeMillis: 175000, 
              collectionId: '1233869908', 
              artistId: '201955086'},
        {trackName: "This Love", 
              previewUrl: "./audio/thislove.mp3", 
              collectionName: "Songs About Jane", 
              trackPrice: "1.79", 
              artistName: "Maroon 5", 
              artworkUrl60: "https://is2-ssl.mzstatic.com/image/thumb/Music118/v4/a1/d5/a1/a1d5a133-1e95-3bd4-9274-0632e9b37411/source/60x60bb.jpg", 
              className: "play", 
              trackId: "5990166981513852", 
              trackTimeMillis: 202000, 
              collectionId: '1440851650', 
              artistId: '1798556'}, 
        {trackName: "Weekend", 
              previewUrl: "./audio/weekend.mp3", 
              collectionName: "Weekend - Single", 
              trackPrice: "0.69", 
              artistName: "Louis The Child", 
              trackExplicitness: "clean", 
              artworkUrl60: "https://is1-ssl.mzstatic.com/image/thumb/Music18/v4/3b/98/27/3b9827e7-97d1-c518-87e4-14b6bd9e4525/source/60x60bb.jpg", 
              className: "play", 
              trackId: "1679652519131958", 
              trackTimeMillis: 175000, 
              collectionId: '1127901863', 
              artistId: '666268457'}, 
        {trackName: "Downtown", 
              previewUrl: "./audio/downtown.mp3", 
              collectionName: "This Unruly Mess Ive Made", 
              trackPrice: "1.29", 
              artistName: "Macklemore & Ry...", 
              trackExplicitness: "clean", 
              artworkUrl60: "https://is3-ssl.mzstatic.com/image/thumb/Music69/v4/1b/0f/5f/1b0f5f68-a5fb-c6e2-1a41-ba85f532c147/source/60x60bb.jpg", 
              className: "play", 
              trackId: "3120506748845605", 
              trackTimeMillis: 292000, 
              collectionId: '1083640887', 
              artistId: '543948286'}, 
        {trackName: "I Feel It Coming", 
              previewUrl: "./audio/ifeelitcoming.mp3", 
              collectionName: "Star Boy", 
              trackPrice: "5.00", 
              artistName: "The Weeknd & Daft...", 
              trackExplicitness: "clean", 
              artworkUrl60:"https://is2-ssl.mzstatic.com/image/thumb/Music128/v4/7a/de/61/7ade619b-4d35-0a6a-5b5a-11c3a93988b6/source/60x60bb.jpg", 
              className: "play", 
              trackId: "2451939859110199", 
              trackTimeMillis: 270000, 
              collectionId: '1440871397', 
              artistId: '479756766'},
      ],
      isPlaying: {isPlaying: false, index: ""},
      playing: {
                  
      },
      playingSong: "",
      // components: {
      // HelloWorld
      // }
    }
    
  },
  async beforeMount() {
    let userResponse = await this.$store.dispatch("getUser");
    if (userResponse.message) {
        router.replace("Account");
    }
    this.user = userResponse.data;
    this.playing = this.$store.state.playing;
  },
  methods: {
      async getSongs() {
          
          try {
            console.log("I'm inside the function getSongs()");
            
            this.error = await this.$store.dispatch("getSongs");
            
          } catch (error) {
            console.log(error);
          }
      },
      async getAlbum(song) {
          let album = {artistId: song.artistId, artworkUrl100: '', collectionName: song.collectionName, 
                      artistName: song.artistName, releaseDate: song.releaseDate, genre: song.primaryGenreName, collectionExplicitness: song.trackExplicitness == undefined ? "" : song.trackExplicitness };

          if (song.trackCount == 1) {
              song.trackTimeMillis = millisToMinutesAndSeconds(song.trackTimeMillis);
              song.trackName_short = cutLength(song.trackName, 75);
              song.artistName_short = cutLength(song.artistName, 35);

              album.songs = [song];
              await this.$store.dispatch("defineAlbumInfo", album);
              router.push("Album");

              return;
          }

          try {
              const response = await this.$store.dispatch("getAlbum", song.collectionId);
              album.artworkUrl100 = response.data.results[0].artworkUrl100;
              response.data.results.splice(0, 1);
              
              for (var i = 0; i < response.data.results.length; i++) {
                  response.data.results[i].className = "play";
                  response.data.results[i].trackName_short = cutLength(response.data.results[i].trackName, 75);
                  response.data.results[i].artistName_short = cutLength(response.data.results[i].artistName, 35);
                  response.data.results[i].trackTimeMillis = millisToMinutesAndSeconds(response.data.results[i].trackTimeMillis);
              }

              album.songs = response.data.results;
              await this.$store.dispatch("defineAlbumInfo", album);

              router.push("Album");
          }
          catch (err) {
              console.log(err);
          }
      },
      async addToPlaylist(song) {
          song.className = "play";
          song.username = this.user.username;
          console.log("song.username: ", song.username);  
          await this.$store.dispatch("addToPlaylist", song);
      },
      playSound (sound) {
        // this.$store.dispatch("passPlayingSong", null);
        // return;
            console.log("My sounds: ", sound.previewUrl);
            if(sound) {

              //If the same song on same page is "stopped"
              let index = this.myEdits.indexOf(sound);
              if (this.isPlaying.index === index) {
                  
                
                this.playing.pause(); 

                
                this.myEdits[this.isPlaying.index].className = "play";
                
                this.isPlaying.isPlaying = false;
                this.isPlaying.index = "";
                return;
              }

              //if a song is made to play while another is already playing
              if (this.playing != undefined && this.isPlaying.isPlaying) {
                this.playing.pause(); 
   
                this.myEdits[this.isPlaying.index].className = "play";

              }

               //if a song from another page is playing
                if (this.$store.state.playing !== null) {
                    // this.$store.dispatch("passPlayingSong", null);
                    this.$store.state.playing.pause(); 
                    
                    this.$store.dispatch("passPlayingSong", null);
                    
                }


              this.playing = new Audio(sound.previewUrl);

              
              this.myEdits[index].className = "stop";

              this.isPlaying.isPlaying = true;
              this.isPlaying.index = index;
              this.playing.trackId = sound.trackId;
              this.$store.dispatch("passPlayingSong", this.playing);
              this.playing.play();
              setTimeout(() => {
                  
                  if (this.$store.state.playing.trackId === sound.trackId) {
                      
                      this.$store.dispatch("passPlayingSong", null);
                      this.myEdits[this.isPlaying.index].className = "play";
                  }
              }, sound.trackTimeMillis);
              
            }
          },
          async filterArtist(artistId) {
                this.rightArrow = false;

                let response = await this.$store.dispatch("getArtist", artistId);
                console.log(artistId + " response: ", response.data.results);

                response.data.results.splice(0, 1);
                for (var i = 0; i < response.data.results.length; i++) {
                    response.data.results[i].className = "play";
                    response.data.results[i].trackName_short = cutLength(response.data.results[i].trackName, 12);
                    response.data.results[i].artistName_short = cutLength(response.data.results[i].artistName, 20);
                }

                console.log("Song Results after accounting for length: ", response.data.results);
                this.$store.dispatch("defineArtistSongs", response.data.results);

                response = await this.$store.dispatch("getArtistAlbums", artistId);
                let album = response.data.results;
                album.artistId = artistId;
                console.log("Response about the artist's albums: ", album);

                this.$store.dispatch("defineArtistAlbums", album);
                router.push("Artist");
            },

  }
  
}
window.onbeforeunload = function (evt) {
  var message = "Are you sure you want to leave?";
  if (typeof evt == "undefined") {
    evt = window.event;
  }
  if (evt) {
    evt.returnValue = message;
  }
  return message;
}

// window.onpopstate=function()
// {
//   alert("Back/Forward clicked!");
// }

    function cutLength(inputWord, length) {
        if (inputWord.length > length) {
            inputWord = inputWord.substring(0, length) + "...";
        }
        return inputWord;
    }

    function millisToMinutesAndSeconds(millis) {
        var minutes = Math.floor(millis / 60000);
        var seconds = ((millis % 60000) / 1000).toFixed(0);
        return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
    }
</script>
