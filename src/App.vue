/* eslint-disable */
<template>
  <div id="app">
    <div id="nav">
        <div id="form-data">
            <form v-on:submit.prevent="query" id="search-bar" class="form-inline my-2 my-lg-0">
                <div class="front-center">
                    <input v-model="queryStr" id="search-input" class="form-control" type="search" placeholder="Song, artist or album name" aria-label="Search">
                    <button class="btn btn-outline-success" id="search-button" type="submit"></button>
                </div>
            </form>
        </div>
        <div id="nav-links">
            <router-link to="/" class="nav-link-text">iJams</router-link>
            <img class="menu-icons" src="https://cdn1.iconfinder.com/data/icons/assorted-gadgets-and-items-1/144/headphones-512.png">
            <router-link to="/playlist" class="nav-link-text">Playlist</router-link>
        </div>
        <div id="empty-space">
            <!--<div v-if="user">-->
            <div @click="()=>{getUserInfo(); if (user != null) {isShown = !isShown;}}" class="dropdown">
                
                <span class="menu-btn"><img class="menu-icon" src="data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Ctitle%3Edown-arrow%3C%2Ftitle%3E%3Cg%20fill%3D%22%23000000%22%3E%3Cpath%20d%3D%22M10.293%2C3.293%2C6%2C7.586%2C1.707%2C3.293A1%2C1%2C0%2C0%2C0%2C.293%2C4.707l5%2C5a1%2C1%2C0%2C0%2C0%2C1.414%2C0l5-5a1%2C1%2C0%2C1%2C0-1.414-1.414Z%22%20fill%3D%22%23000000%22%3E%3C%2Fpath%3E%3C%2Fg%3E%3C%2Fsvg%3E"></span>
                <div class="dropdown-content" :class="{block: isShown && user != null}">
                    <span @click="logout"><span>Sign Out</span></span>
                    <span><span>Another option</span></span>
                </div>
            </div>
                <!--<button class="nav-link-text" @click="logout">Logout</button>-->
                <!--<span class="nav-link-text">Welcome {{user.data.username}}</span>-->
            <!--</div>-->
            <!--<div v-else>-->
            <!--    <router-link to="/Account" class="nav-link-text">iJams Account</router-link>-->
            <!--</div>-->
        </div>
      
    </div>
    
          
      
    <router-view/>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css?family=Cabin|Fredoka+One|Fjalla+One|Fredoka+One|Inconsolata|Josefin+Sans|Luckiest+Guy|Manjari|Modak&display=swap|Fruktur&display=swap');

/* Dropdown */

.menu-btn {
    display: inline-block;
    
    vertical-align: sub;

    height: 100%;
    width: 40px;
}

.menu-icon {
    vertical-align: middle;
}

.dropdown {
    cursor: default;
    position: relative;
    display: inline-block;
}

.block {
    display: block !important;
    z-index: 5;
}

/*.dropdown:hover .dropdown-content {*/
/*  display: block;*/
/*}*/

.dropdown-content {
  cursor: pointer;
  display: none;
  position: absolute;
  /*left: -10px;*/
  font-size: smaller;
  background-color: #2c3e50;
  color: whitesmoke;
  margin-top: 1px;
  min-width: 150px;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  padding: 6px 0 6px 0;
  min-height: 35px;
  border-radius: 5px;
  z-index: 5;
}

.dropdown-content > span {
    text-align: left;
    width: 100%; 
    line-height: 2;
    min-height: 30px;
    font-size: 14px;
    display: block;
    
}

.dropdown-content > span > span {
    padding : 3px 0 3px 4px;
}

.dropdown-content > span:hover {
    width: 100%;
    color: whitesmoke;
    background-color: #42b983 !important;
    /*background-color: #2c3e50;*/
}

.nav-link-text {
  font-family: 'Fredoka One', cursive;
  font-weight: bold;
  font-size: 3vh;
  color: #2c3e50 !important;
  max-width: 100px;
}

.menu-icons {
    max-width: 50px;
}

#search-button {
    height: 25px;
    min-width: 40px;
    background: url(https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Magnifying_glass_icon.svg/768px-Magnifying_glass_icon.svg.png) no-repeat center;
    background-size:contain; 
    
    flex: .5;
}

#search-input {

    height: 25px;
    flex: 5;
    
}

.front-center {
    display: flex;
    flex-wrap: nowrap;
    
}


#app {
    

  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  /* color: #2c3e50;
   */
   color: whitesmoke;
  background-color: black;
}
#nav {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
  padding: 5px;
  background-color: whitesmoke;
}

#form-data {
    margin-right: auto; 
    display: flex; 
    flex-wrap: nowrap;
}

@media only screen and (max-width: 700px) {

    #nav {
        display: grid;
        grid-template-columns: auto; 
        
        
    }

    #form-data {
        margin: auto; 
    }

}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

/*#nav a.router-link-exact-active {*/
/*  color: #42b983;*/
/*}*/

@import '~bootstrap/dist/css/bootstrap.css'

</style>


<script>

    import App from '@/App'
    const axios = require('axios');
    import router from './router'

    export default {
    name: "playlist",
    data() {
        return {
        user: {},
        queryStr: '',
        isShown: false,
        playing: {
        },
        playingSong: '',
        isPlaying: {isPlaying: false, index: ''}
      }
    },
    async beforeMount() {

        let userResponse = await this.$store.dispatch("getUser");
        if (userResponse.message) {
            router.replace("Account");
            this.user = null;
            return;
        }
        
        if (userResponse.data) {
            this.user = userResponse.data;
        }
    },
    methods: {
        async getUserInfo(){
            let userResponse = await this.$store.dispatch("getUser");
            if (userResponse.message) {
                this.user = null;
                return;
            }
            
            this.user = userResponse.data;
        },
        setQueryTerm(term) {
            this.queryStr = term;
            
            this.query();
            this.getPlaylist();
            
        },
        logout() {
            this.isShown = false;
            if (this.$store.state.playing !== null) {

                this.$store.state.playing.pause();
                this.$store.dispatch("passPlayingSong", null);
            }
            this.user = null;
            this.$store.dispatch("logout");  
            this.$router.replace("Account");
        },
        query() {
            let query = this.queryStr.toLowerCase();
            
            // if (!this.pastQueries.includes(query)) {
            //     this.pastQueries.push(query);
            // }
            
            let terms = query.split(" ");
            query = terms.join('+');
            console.log(query);
            this.itunes(query);
        },
        async itunes(queryStr) {
            try {
                // var pastPages = JSON.parse(localStorage.getItem("savedState"));
                // if (pastPages == undefined || pastPages == null) {
                //     pastPages = [];
                // }
                // pastPages.push({'songs': this.songResults, 'class': this.containerClass});
                // localStorage.setItem("savedState", JSON.stringify(pastPages));

                // this.leftArrow = true;

                this.songResults = [];
                this.artistResults = [];
                this.songNames = [];
                this.filterSearch = true;
                if (queryStr === '') return;
                
                axios.put("api/history/", {username: this.$store.user, term: queryStr})
                .then(results => {
                    console.log("results of search history update: ", results);
                })
                .catch(error => {
                    console.log(error);
                });
                
                const itunesResponse = await axios.get("api/search/" + queryStr);
                this.queryStr = "";
                
                console.log("The itunes search response came back", itunesResponse);
                let results = itunesResponse.data.results;
                
                for (var i =0; i < results.length; i++ ) {
                    if (results[i].kind === "song") {
                        results[i].className = "play";
                        if (!this.artistResults.includes(results[i].artistId)) {
                            this.artistResults.push(results[i].artistId);
                        }    

                        if (!this.songNames.includes(results[i].trackName)) {
                            this.songNames.push(results[i].trackName);
                            
                            results[i].trackName_short = cutLength(results[i].trackName, 12);
                            results[i].artistName_short = cutLength(results[i].artistName, 20);
                            
                            this.songResults.push(results[i]);
                            // console.log(i + "className", results[i].className);
                        } 
                    } 

                }
  
                await this.$store.dispatch("search", this.songResults);
                router.push("Results");
            } catch (err) {
                console.log(err);
            }
        },
        clearLocalStorage() {
            localStorage.clear();
        },
        goBack() {
            var pastPages = JSON.parse(localStorage.getItem("savedState"));
            if (pastPages == undefined || pastPages.length == 1) {
                this.leftArrow = false;
                this.fresh = true;
            }

            if (pastPages != undefined) {
                let topPage = pastPages.pop();
                this.songResults = topPage.songs;
                console.log(
                    "The class list after going back: ",
                    topPage.class
                    );
                this.containerClass = topPage.class;
                localStorage.setItem("savedState", JSON.stringify(pastPages));
            }
        },
        goForward() {
            this.rightArrow = false;
            this.leftArrow = true;
            // localStorage.setItem("savedState", JSON.stringify({'songs':this.songResults, 'class':this.containerClass}));
            this.songResults = JSON.parse(localStorage.getItem("forwardState"));
        },
        millisToMinutesAndSeconds(millis) {
            var minutes = Math.floor(millis / 60000);
            var seconds = ((millis % 60000) / 1000).toFixed(0);
            return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
          }
    }, 
    computed: {
        singleTrack() {
            if (this.containerClass == 'container-normal') {
                return "single-track";
            } 
            // else if (this.containerClass == 'container-album') {
            //     return "album-tracks"
            // }
            else {
                return "album-tracks";
            }
        }
    },
    asyncComputed: {
        // async user() {
            
            
        // }
        
    }
    
}

function cutLength(inputWord, length)  {
    if (inputWord.length > length) {
        inputWord = inputWord.substring(0, length) + "...";
    }
    return inputWord;
}

</script>