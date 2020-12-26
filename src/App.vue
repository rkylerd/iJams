/* eslint-disable */
<template>
  <div id="app">
    <section v-if="user.username"> 
        <div id="nav">
            <div class="page-title">iJams</div>
            <div id="form-data">
                <form v-on:submit.prevent="search" v-on:keyup.enter="search" id="search-bar" class="form-inline">
                    <div class="search-container">
                        <button v-if="searchInputOpen" @click="searchInputOpen = false" id="close-btn" class="btn btn-outline-success">
                            <fa icon="times" prefix="fas" class="menu-icon block"></fa>
                        </button>
                        <input v-model="searchTerm" 
                            :class="{'closed': !searchInputOpen}" 
                            id="search-input" 
                            class="narrow form-control" 
                            type="search" 
                            placeholder="Song, artist or album name" 
                            aria-label="Search"
                            v-on:keyup.enter="$event.target.blur()">
                        <button v-if="searchInputOpen" class="btn btn-outline-success closed" id="search-button" type="submit">
                            <fa icon="search" prefix="fas" class="menu-icon block"></fa>
                        </button>
                        <button v-else @click="searchInputOpen = true" class="btn btn-outline-success" id="search-button">
                            <fa icon="search" prefix="fas" class="menu-icon block"></fa>
                        </button>
                    </div>
                </form>
            </div>
        
            <div class="flex-row" id="nav-links" v-if="!searchInputOpen || screenWidth > 400">
                <router-link to="/ijams" class="nav-link"><span>iJams</span><fa icon="home" prefix="fas" class="menu-icon distance-left"></fa></router-link>
                <router-link to="/ijams/playlist" class="nav-link"><span>Playlist</span><fa icon="compact-disc" prefix="fas" class="menu-icon distance-left"></fa></router-link>
                <!-- <router-link to="/ijams/playlist" class="nav-link">
                <span class="flex-row">
                    <span>Cart</span>
                    <span class="x-small-font">
                        <fa icon="shopping-cart" prefix="fas" class="menu-icon distance-left"></fa> <span v-if="cartSize">({{cartSize}})</span>
                    </span>
                </span>
                </router-link> -->
                <a class="nav-link" @click="logout"><span>Log out</span><fa icon="sign-out-alt" prefix="fas" class="menu-icon distance-left"></fa></a>            
            </div>
        
        </div>
    </section>
    <section v-else>
        <div class="page-title">iJams</div>
    </section>
  <div id="music-player-container" v-if="playing">
    <div class="flex-row" id="music-player">
        <div class="flex-row" id="buttons">
            <fa v-if="playing && isPlaying" @click="()=>globalPausePlay()" icon="pause" prefix="fas" class="menu-icon block"></fa>
            <fa v-else @click="()=>globalPausePlay(false)" icon="play" prefix="fas" class="menu-icon block"></fa>
            <fa icon="backward" prefix="fas" class="menu-icon block"></fa>
            <fa icon="forward" prefix="fas" class="menu-icon block"></fa>
        </div>
        <div id="slider">
            <span>
                {{ millisToMinutesAndSeconds( currentTime * 1000 ).timeStr }} / {{ millisToMinutesAndSeconds( (dataOfPlaying.trackLengthSeconds || 30) * 1000 ).timeStr }}
            </span>
            <input type="range" 
                min="0" 
                @change="updateCurrentTime"
                :value="currentTime" 
                :max="dataOfPlaying.trackLengthSeconds || 30"/>
        </div>
    </div>
  </div>
    <router-view/>
  </div>
</template>

<script>
    import { onBeforeMount, onBeforeUnmount, reactive, computed, toRefs } from 'vue'
    import { useStore } from 'vuex'
    import { getUser, logout, playSound, globalPausePlay, millisToMinutesAndSeconds } from '@/shared/logic'
    import { goToRequestedPage, goToLogin } from '@/shared/navigation'
    import router from '@/router'

    export default {
    name: "playlist",
    setup() {
        const store = useStore()
        const search = () => {
            const cleanedTerm = appData.searchTerm
                        .trim()
                        .toLowerCase()
                        .replace(/[\s]+/g, '+');
            
            if (cleanedTerm)
                router.push({name:"results", query: {"search": cleanedTerm } })
        };

        const appData = reactive({
            user: computed(() => store.state.user),
            searchTerm: '',
            searchInputOpen: true,
            screenWidth: window.innerWidth,
            onResize: () => appData.screenWidth = window.innerWidth,
            cartSize: computed(() => store.state.cart.length),
            playing: computed(() => store.state.playing),
            isPlaying: computed(() => store.state.isPlaying),
            currentTime: computed(() => parseInt(store.state.playingTime) ),
            dataOfPlaying: computed(() => store.state.dataOfPlaying),
            search,
            logout,
            playSound,
            globalPausePlay,
            millisToMinutesAndSeconds,
            updateCurrentTime: 
                ({ currentTarget: { value = 0 } = {} } = {}) =>
                    { if (appData.playing) store.dispatch('setCurrentTimeOfPlaying', value)} 
        });

        onBeforeUnmount(() => {
            window.removeEventListener('resize', appData.onResize);
        })

        onBeforeMount(async () => {
            window.addEventListener('resize', appData.onResize);
            try {
                const dbUser = await getUser();
                if (dbUser) {
                    goToRequestedPage();
                } else goToLogin();
            } catch (error) {
                console.log('error while getting user', error)
            }
        });

        return {
            ...toRefs(appData)
        };
    }
}
</script>

<style lang='scss' scoped>
$width-desktop: 1600px;
$width-tablet: 1024px;
$width-phone: 400px;

#music-player-container {
    position: absolute;
    right: 0;
    z-index: 10;
    transition: height .3s;
    #music-player {
        @media (max-width: $width-desktop) {
            background-color: #00c5ff;
            border-bottom-left-radius: 8px;
            min-height: 3em;
            width: 50vw;
            #slider {
                display: flex;
                width: 100%;
                input {
                    flex-grow: 1;
                }
            }
        }
        @media (max-width: $width-tablet) {
            border-bottom-right-radius: 2px;
            width: 90vw;
        }
        
        > div {
            padding: 0 .5em;
            margin: auto 0;
            &#buttons {
                > svg {
                    margin: 0 .3em;
                }
            }
            &#slider {
                > span {
                    font-size: small;
                    margin-right: .3em;
                    @media (max-width: $width-tablet) {
                        font-size: x-small;     
                    }
                }
            }
        }
    }
}


.page-title {
    margin: auto .4em;
    font-size: 20px;
}

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

#nav-links {
    align-items: center;
    
    .nav-link {
        cursor: pointer;
        margin-right: .2em;
        display: flex;
        font-family: 'Fredoka One', cursive;
        font-weight: bold;
        font-size: 3vh;
        color: #2c3e50;
        max-width: 100px;
        padding: 4px;
        transition-duration: 1s;
        border: transparent 1px;
        border-radius: 8px; 
        &:hover {
            box-shadow: 1px 1px #444;
        }
        > span:not(.flex-row), span.flex-row > span:first-of-type {
            @media (max-width: 700px) {
                display: none;
            }
        }
    }
}


.menu-icons {
    max-width: 50px;
}

#close-btn {
    width: 25px;
    height: 25px;
    margin: auto;
    padding: 0px;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
}

#search-button {
    height: 25px;
    min-width: 40px;    
    &.closed {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
    }
}

#search-input {
    height: 25px;
    width: 100%;
    transition: width .3s;
}

#search-input.closed {
    width: 0;
    padding: 0;
    border: none;
}

.search-container {
    display: flex;
    height: 25px;
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
    display: flex;
    flex-wrap: nowrap;
    background-color: whitesmoke;
    min-height: 45px;
}

#form-data {
    margin-right: auto; 
    display: flex; 
    flex-wrap: nowrap;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

@import '~bootstrap/dist/css/bootstrap.css';
.form-control {
    border-radius: 0;
    padding: 0 .25em;
}
</style>