/* eslint-disable */
<template>
  <div id="app">
    <section> <!--  v-if="computedUser" -->
        <div id="nav">
            <div class="page-title">iJams</div>
            <div id="form-data">
                <form v-on:submit.prevent="search" v-on:keyup.enter="search" id="search-bar" class="form-inline my-2 my-lg-0">
                    <div class="search-container">
                        <button v-if="searchInputOpen" @click="searchInputOpen = false" id="close-btn" class="btn btn-outline-success">
                            <fa icon="times" prefix="fas" class="menu-icon block"></fa>
                        </button>
                        <input :class="{'closed': !searchInputOpen}" v-model="searchTerm" id="search-input"  class="narrow form-control" type="search" placeholder="Song, artist or album name" aria-label="Search">
                        <button v-if="searchInputOpen" class="btn btn-outline-success closed" id="search-button" type="submit">
                            <fa icon="search" prefix="fas" class="menu-icon block"></fa>
                        </button>
                        <button v-else @click="searchInputOpen = true" class="btn btn-outline-success" id="search-button">
                            <fa icon="search" prefix="fas" class="menu-icon block"></fa>
                        </button>
                    </div>
                </form>
            </div>
            <div class="flex-row" id="nav-links">
                <router-link to="/ijams" class="nav-link"><span>iJams</span><fa icon="home" prefix="fas" class="menu-icon distance-left"></fa></router-link>
                <router-link to="/ijams/playlist" class="nav-link"><span>Playlist</span><fa icon="compact-disc" prefix="fas" class="menu-icon distance-left"></fa></router-link>
                <router-link to="/ijams/playlist" class="nav-link">
                <span class="flex-row">
                    <span>Cart</span>
                    <span class="small-font">
                        <fa icon="shopping-cart" prefix="fas" class="menu-icon distance-left"></fa> <span v-if="!searchInputOpen">({{checkoutItems.length}})</span>
                    </span>
                </span>
                </router-link>            
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
        <h2 class="page-title">ijams</h2>
    </template> -->
    <router-view/>
  </div>
</template>

<script>
    import { onBeforeMount, onBeforeUnmount, reactive, computed, toRefs, watch } from 'vue'
    // import { getUser } from '@/shared/logic';
    import router from '@/router'
    import store from '@/store'

    export default {
    name: "playlist",
    setup() {
        const logout = () => {
            appData.isShown = false;
            if (store.state.playing !== null) {
                store.state.playing.pause();
                store.dispatch("setPlaying", null);
            }
            // appData.user = null;
            store.dispatch("logout");  
            router.replace("Account");
        };

        const search = () => {
            const cleanedTerm = appData.searchTerm
                        .trim()
                        .toLowerCase()
                        .replace(/[\s]+/g, '+');
            
            if (cleanedTerm)
                router.push({name:"results", query: {"search":cleanedTerm}})
        };
        const appData = reactive({
            user: {},
            searchTerm: '',
            isShown: false,
            searchInputOpen: false,
            screenWidth: window.innerWidth,
            computedUser: computed(()=> store.state.user ),
            checkoutItems: computed(()=>store.state.checkoutItems),
            onResize: () => appData.screenWidth = window.innerWidth,
            search,
            logout
        });

        onBeforeUnmount(() => {
            window.removeEventListener('resize', appData.onResize);
        })
        onBeforeMount(async () => {
            window.addEventListener('resize', appData.onResize);
            try {
                // this.user = this.$store.state.user; // might get rid of
                // const user = await getUser();
                // this.user = user;
                // await this.$store.dispatch("setUser", user);
            } catch (error) {
                // let user know something
            }
        });
        
        watch(
            () => appData.checkoutItems,
            (count, prevCount) => {
                console.log(count, prevCount)
            }
        )

        return {
            ...toRefs(appData)
        };
    }
}
</script>

<style lang='scss' scoped>

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
    padding: 5px;
    background-color: whitesmoke;
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
}
</style>