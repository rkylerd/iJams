/* eslint-disable */
<template>
  <div id="app">
    <section> <!--  v-if="computedUser" -->
        <div id="nav" @mouseover="inputBoxGrow = true" @mouseleave="cutInputLength">
            
            <div id="form-data">
                <form v-on:submit.prevent="query" id="search-bar" class="form-inline my-2 my-lg-0">
                    <div class="front-center">
                        <transition name="fade">
                            <input v-show="inputBoxGrow" v-model="queryStr" id="search-input"  class="narrow form-control" type="search" placeholder="Song, artist or album name" aria-label="Search">
                        </transition>
                        <button class="btn btn-outline-success" id="search-button" type="submit"></button>
                    </div>
                </form>
            </div>
            <div id="nav-links">
                <router-link to="/" class="nav-link-text">iJams</router-link>
                <img class="menu-icons" src="https://cdn1.iconfinder.com/data/icons/assorted-gadgets-and-items-1/144/headphones-512.png">
                <router-link to="/playlist" class="nav-link-text">Playlist</router-link>
            </div>
            <!-- <div id="empty-space" @mouseleave="()=>{isShown = false;}">
                <div @click="()=>{if (computedUser) {isShown = !isShown;}}" class="dropdown">
                    <span class="menu-btn">
                        <font-awesome-icon style="color: black; font-size: 2em; cursor: pointer;" :icon="['fas', 'ellipsis-h']"/>
                    </span>
                    <div class="dropdown-content" :class="{block: isShown && user != null}">
                        <span @click="logout"><span>Log Out</span></span>
                        <span><span>Another option</span></span>
                    </div>
                </div>
            </div> -->
      
        </div>
    </section>
    <!-- <template v-else>
        <h2 class="page-title">iJams</h2>
    </template> -->
    <router-view/>
  </div>
</template>

<style lang='scss'>

.fade-enter-active,
.fade-leave-active {
  transition: width 5s;
}

.fade-enter,
.fade-leave-to {
  width: 50% !important;
}

.fade-enter-to,
.fade-leave {
  width: 100% !important;
}

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

@import '~bootstrap/dist/css/bootstrap.css'

</style>


<script>
    // import { getUser } from '@/shared/logic';
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
        isPlaying: {isPlaying: false, index: ''},
        inputBoxGrow: false,
      }
    },
    async beforeMount() {
        try {
            // this.user = this.$store.state.user; // might get rid of

            // const user = await getUser();
            // this.user = user;
            // await this.$store.dispatch("setUser", user);
        } catch (error) {
            // let user know something
        }
    },
    methods: {
        cutInputLength(){
           setTimeout(()=>{this.inputBoxGrow = false},2000)   
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
                this.$store.dispatch("setPlaying", null);
            }
            // this.user = null;
            this.$store.dispatch("logout");  
            this.$router.replace("Account");
        },
        query() {
            let query = this.queryStr.toLowerCase();

            let terms = query.split(" ");
            query = terms.join('+');
            
            this.itunes(query);
        },
        async itunes(queryStr) {
            try {
            
                this.songResults = [];
                this.artistResults = [];
                this.songNames = [];
                this.filterSearch = true;
                if (queryStr === '') return;
                
                /* axios.put("api/history/", {username: this.$store.user, term: queryStr})
                .then(results => {
                    // console.log("results of search history update: ", results);
                })
                .catch(error => {
                    console.log(error);
                }); */
               
                router.push({path:"results", query: {"search":queryStr}})
                
            } catch (err) {
                console.log(err);
            }
        }
    }, 
    computed: {
        computedUser() {
              return this.$store.state.user;
          }
    }
    
}

</script>