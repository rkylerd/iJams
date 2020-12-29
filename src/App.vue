/* eslint-disable */
<template>
  <div id="app">
    <section v-if="user.username"> 
        <div id="nav">
            <div class="app-logo">iJams</div>
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
                <a class="nav-link" @click="logout"><span>Log out</span><fa icon="sign-out-alt" prefix="fas" class="menu-icon distance-left"></fa></a>            
            </div>
            <div v-else>
                <a class="nav-link" @click="mobileOptionsShown = !mobileOptionsShown"><fa icon="bars" prefix="fas" class="menu-icon distance-left"></fa></a>
                <div id="mobile-nav" v-if="mobileOptionsShown" @click="mobileOptionsShown = false">
                    <router-link to="/ijams" class="nav-link"><span>iJams</span><fa icon="home" prefix="fas" class="menu-icon distance-left"></fa></router-link>
                    <router-link to="/ijams/playlist" class="nav-link"><span>Playlist</span><fa icon="compact-disc" prefix="fas" class="menu-icon distance-left"></fa></router-link>
                    <a class="nav-link" @click="logout"><span>Log out</span><fa icon="sign-out-alt" prefix="fas" class="menu-icon distance-left"></fa></a>            
                </div>
            </div>
        
        </div>
    </section>
    <section v-else>
        <div class="app-logo">iJams</div>
    </section>
    <div id="toasts" v-for="(toast, idx) in toasts" v-bind:key="idx">
        <Toast :msg="toast.msg" :timeoutSeconds="4" :idx="idx"/>
    </div>
    <div id="music-player-container" v-if="playing">
        <div class="flex-row" id="music-player">
            <div class="flex-row" id="buttons">
                <fa v-if="playing && isPlaying" @click="()=>globalPausePlay()" icon="pause" prefix="fas" class="menu-icon block"></fa>
                <fa v-else @click="()=>globalPausePlay(false)" icon="play" prefix="fas" class="menu-icon block"></fa>
                <fa icon="backward" @click="updateCurrentTime" prefix="fas" class="menu-icon block"></fa>
                <fa icon="forward" @click="playNextSound" prefix="fas" class="menu-icon block"></fa>
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
    import { getUser, logout, playSound, globalPausePlay, millisToMinutesAndSeconds, playNextSound } from '@/shared/logic'
    import { goToRequestedPage, goToLogin } from '@/shared/navigation'
    import router from '@/router'
    import Toast from '@/components/Toast.vue'

    export default {
    name: "playlist",
    components: {
        Toast
    },
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
            toasts: computed(() => store.state.toasts),
            search,
            logout,
            playSound,
            globalPausePlay,
            millisToMinutesAndSeconds,
            mobileOptionsShown: false,
            playNextSound: () => { 
                if (!playNextSound())
                    store.dispatch("addToast", {msg: "Add a song to the 'up next' list first."});
            },
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

#mobile-nav {
    position: absolute;
    top: 45px;
    width: 90vw;
    height: 90vh;
    right: 0;
    background-color: whitesmoke;
    z-index: 30;
    text-align: right;
    .nav-link {
        background-color: #2c3e50;
        color: whitesmoke;
        &:hover {
            background-color: #42b983;
        }
    }
}

.nav-link {
    cursor: pointer;
}
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
                > * {
                    cursor: pointer;
                }
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

.app-logo {
    display: inline-block;
    text-align: center;
    font-family: 'Fredoka One', cursive;
    font-weight: bold;
    -ms-transform: skewY(-5deg); /* IE 9 */
    -webkit-transform: skewY(-5deg); /* Safari 3-8 */
    transform: skewY(-5deg);
    text-shadow: 3px 3px white;
    color: #42b983;
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

.block {
    display: block !important;
    z-index: 5;
}

#nav-links {
    align-items: center;
    
    .nav-link {
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

// *********Global Time Slider********
input[type=range] {
  width: 100%;
  margin: 6.6px 0;
  background-color: transparent;
  -webkit-appearance: none;
}
input[type=range]:focus {
  outline: none;
}
input[type=range]::-webkit-slider-runnable-track {
  background: white;
  border-radius: 1.3px;
  width: 100%;
  height: 3.8px;
  cursor: pointer;
}
input[type=range]::-webkit-slider-thumb {
  margin-top: -6.8px;
  width: 6px;
  height: 17px;
  background: #2c3e50;
  border-radius: 2px;
  cursor: pointer;
  -webkit-appearance: none;
}
// input[type=range]:focus::-webkit-slider-runnable-track {
//   background: white;
// }
input[type=range]::-moz-range-track {
  background: #2c3e50;
  border-radius: 1.3px;
  width: 100%;
  height: 3.8px;
  cursor: pointer;
}
input[type=range]::-moz-range-thumb {
  width: 6px;
  height: 17px;
  background: #2c3e50;
  cursor: pointer;
}
input[type=range]::-ms-track {
  background: transparent;
  border-color: transparent;
  border-width: 18.4px 0;
  color: transparent;
  width: 100%;
  height: 3.8px;
  cursor: pointer;
}

// input[type=range]::-ms-fill-upper {
//   background: rgba(0, 0, 94, 0.1);
//   border: 0.2px solid #010101;
//   border-radius: 2.6px;
// }
input[type=range]::-ms-thumb {
  width: 6px;
  height: 17px;
  background: #2c3e50;
  border-radius: 22px;
  cursor: pointer;
  margin-top: 0px;
  /*Needed to keep the Edge thumb centred*/
}
</style>