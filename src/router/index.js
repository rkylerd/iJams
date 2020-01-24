import Vue from 'vue'
import Router from 'vue-router'
import Home from '../views/Home.vue'
import store from '../store/index'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: function () { 
        return import(/* webpackChunkName: "playlist" */ '../views/Home.vue')
      }, 
      meta: { requiresAuth: true }
    },
    {
      path: '/playlist',
      name: 'playlist',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: function () { 
        return import(/* webpackChunkName: "playlist" */ '../views/Playlist.vue')
      }
    },
    {
      path: '/artist',
      name: 'artist',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: function () { 
        return import(/* webpackChunkName: "artist" */ '../views/Artist.vue')
      }
    },
    {
      path: '/album',
      name: 'album',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: function () { 
        return import(/* webpackChunkName: "album" */ '../views/Album.vue')
      }
    },
    {
      path: '/results',
      name: 'results',
      component: function () { 
        return import(/* webpackChunkName: "results" */ '../views/Results.vue')
      }
    },
    {
      path: '/account',
      name: 'account',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: function () { 
        return import(/* webpackChunkName: "account" */ '../views/Account.vue')
      }
    },
  ]
});

router.beforeEach(async (to, from, next) => {
    console.log("to", to);
    // let userResponse = await store.dispatch("getUser");
    // if (userResponse.message) {
    //   console.log("Must log in", userResponse)
      
    //     next("/Account");
    // } else {
    //   next();
    // }
    next();
})

export default router;
