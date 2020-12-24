/* eslint-disable */
<template>
  <div id="app">
    <section v-if="user.username"> 
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
                        <fa icon="shopping-cart" prefix="fas" class="menu-icon distance-left"></fa> <span v-if="!searchInputOpen">({{cart}})</span>
                    </span>
                </span>
                </router-link>
                <a class="nav-link" @click="logout"><span>Log out</span><fa icon="compact-disc" prefix="fas" class="menu-icon distance-left"></fa></a>            
            </div>
        </div>
    </section>
    <section v-else>
        <div class="page-title">iJams</div>
    </section>
    <router-view/>
  </div>
</template>

<script>
    import { onBeforeMount, onBeforeUnmount, reactive, computed, toRefs } from 'vue'
    import { useStore } from 'vuex'
    import { getUser, logout } from '@/shared/logic'
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
            searchInputOpen: false,
            screenWidth: window.innerWidth,
            cart: computed(() => store.state.cart.length),
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