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
    <div id="music-player-container" v-if="playing" :class="{'hidden': !musicPlayerShowing}">
        <div class="flex-row" id="music-player">
            <div id="caret">
                <fa v-if="musicPlayerShowing" icon="caret-right" @click="musicPlayerShowing = false" prefix="fas" class="block"></fa>
                <fa v-else icon="caret-left" @click="musicPlayerShowing = true" prefix="fas" class="block"></fa>
            </div>
            <div class="flex-row" id="buttons">
                <div>
                    <fa icon="backward" @click="updateCurrentTime" prefix="fas" class="block"></fa>
                </div>
                <div v-if="playing && isPlaying">
                    <fa @click="()=>globalPausePlay()" icon="pause" prefix="fas" class="menu-icon block"></fa>
                </div>
                <div v-else id="play">
                    <fa @click="()=>globalPausePlay(false)" icon="play" prefix="fas" class="menu-icon block"></fa>
                </div>
                <div>
                    <fa icon="forward" @click="playNextSound" prefix="fas" class="menu-icon block"></fa>
                </div>
            </div>
            <div id="slider">
                <span>
                    {{ millisToMinutesAndSeconds( currentTime * 1000 ).timeStr }}
                </span>
                <input 
                    type="range" 
                    min="0" 
                    @change="updateCurrentTime"
                    :value="currentTime" 
                    :max="dataOfPlaying.trackLengthSeconds || 30"/>
                <span>
                    {{ millisToMinutesAndSeconds( (dataOfPlaying.trackLengthSeconds || 30) * 1000 ).timeStr }}
                </span>
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
            musicPlayerShowing: true,
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
    background-color: #f7f7f7;
    z-index: 30;
    text-align: right;
    .nav-link {
        background-color: #292b2c;
        color: #f7f7f7;
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
    overflow-x: hidden;
    z-index: 10;
    transition: width .3s;
    @media (max-width: $width-desktop) {
        width: 50vw;
    }
    @media (max-width: $width-tablet) {
        width: 90vw;
    }
    #music-player {
        transition: width .3s;
        border-left: solid .25em #292b2c;
        border-bottom: solid .25em #292b2c;
        background-color: rgb(247, 247, 247);
        @media (max-width: $width-desktop) {
            border-bottom-left-radius: 8px;
            min-height: 3em;
            width: 50vw;
            #slider {
                display: flex;
                width: 100%;
                input {
                    flex-grow: 1;
                    margin: auto .5em;
                }
            }
        }
        @media (max-width: $width-tablet) {
            border-bottom-right-radius: 2px;
            width: 90vw;
        }
        
        > div {
            margin: auto 0;
            &#caret {
                background-color: #292b2c;
                color: rgb(247, 247, 247);
                margin: auto .1em auto 0;
                width: 2em;
                height: 2em;
                min-width: 20px;
                border-bottom-right-radius: 4px;
                border-top-right-radius: 4px;
                cursor: pointer;
                transition: box-shadow .3s;
                > svg {
                    width: 100%;
                    height: 100%;
                }
            }
            &#buttons {
                > div {
                    &#play {
                        padding-left: 2px;
                    }
                    margin: auto .1em;
                    width: 2em;
                    height: 2em;
                    &:nth-child(1) {
                        padding-right: 2px;
                    }
                    &:nth-child(3) {
                        padding-left: 2px;
                    }
                    &:nth-child(2) {
                        width: 2.5em;
                        height: 2.5em;    
                    }
                    border-radius: 50%;
                    background-color: rgb(247, 247, 247);
                    cursor: pointer;
                    transition: box-shadow .3s;
                    > svg {
                        width: 50%;
                        height: 100%;
                        margin: auto;
                    }
                    &:hover {
                        -webkit-box-shadow: 0 0 10px #1f2b38;
                        box-shadow: 0 0 10px #1f2b38;
                    }
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
    &.hidden {
       width: 40px;
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
    text-shadow: 3px 3px #f7f7f7;
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
    > button {
        background-color: rgb(247, 247, 247);
        &:hover {
            background-color: #28a745;
        }
    }
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #292b2c;
  background-color: rgb(247, 247, 247, .9);
}

#nav {
    display: flex;
    flex-wrap: nowrap;
    background-color: #292b2c;
    color: #f7f7f7;
    min-height: 12vh;
}

#form-data {
    flex-grow: 1; 
    display: flex; 
    flex-wrap: nowrap;
}

#nav a {
  font-weight: bold;
  color: rgb(247, 247, 247);
}

@import '~bootstrap/dist/css/bootstrap.css';
.form-control {
    border-radius: 0;
    border-left: none;
    border-right: none;
    padding: 0 .25em;
    border-color: #28a745;
    background-color: rgb(247, 247, 247);
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
  background: #292b2c;
  border-radius: 1.3px;
  width: 100%;
  height: 3.8px;
  cursor: pointer;
}
input[type=range]::-webkit-slider-thumb {
  margin-top: -6.8px;
  width: 6px;
  height: 17px;
  background: #292b2c;
  border-radius: 2px;
  cursor: pointer;
  -webkit-appearance: none;
}
// input[type=range]:focus::-webkit-slider-runnable-track {
//   background: white;
// }
input[type=range]::-moz-range-track {
  background: #292b2c;
  border-radius: 1.3px;
  width: 100%;
  height: 3.8px;
  cursor: pointer;
}
input[type=range]::-moz-range-thumb {
  width: 6px;
  height: 17px;
  background: #292b2c;
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
  background: #292b2c;
  border-radius: 22px;
  cursor: pointer;
  margin-top: 0px;
  /*Needed to keep the Edge thumb centred*/
}
</style>