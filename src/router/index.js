import {createRouter, createWebHistory } from 'vue-router'
// import Home from '../views/Home.vue'
import store from '../store/index'
import Results from '../views/SearchResults.vue'

const routes = [
  {
    path: '/iJams',
    name: 'home',
    component: function () { 
      return import('../views/Home.vue')
    },
    // meta: {
    //     requiresAuth: true
    // }
  },
  {
    path: '/iJams/playlist',
    name: 'playlist',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: function () { 
      return import(/* webpackChunkName: "playlist" */ '../views/Playlist.vue')
    },
    // meta: {
    //     requiresAuth: true
    // }
  },
  {
    path: '/iJams/artist',
    name: 'artist',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: function () { 
      return import(/* webpackChunkName: "artist" */ '../views/Artist.vue')
    },
    // meta: {
    //     requiresAuth: true
    // }
  },
  {
    path: '/iJams/album',
    name: 'album',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: function () { 
      return import(/* webpackChunkName: "album" */ '../views/Album.vue')
    },
    // meta: {
    //     requiresAuth: true
    // }
  },
  {
    path: '/iJams/results',
    name: 'results',
    component: Results,
    // meta: {
    //     requiresAuth: true
    // }
  },
  {
    path: '/iJams/checkout',
    name: 'checkout',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: function () { 
      return import(/* webpackChunkName: "purchase" */ '../views/Purchase.vue')
    }
  },
  {
    path: '/iJams/account',
    name: 'account',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: function () { 
      return import(/* webpackChunkName: "account" */ '../views/Account.vue')
    }
  },
];

const router = new createRouter({
  history: createWebHistory(),
  routes
  
});

router.beforeEach(async (to, from, next) => {
    if(to.matched.some(record => record.meta.requiresAuth)) {
      
      if (JSON.parse(localStorage.getItem('user')) === null) {
        
        store.dispatch("setLoginRedirect", to.fullPath);
          next({
              path: '/account',
          })
      } else {
          next();
      }
    } else {
        next();
    }
})

export default router;
