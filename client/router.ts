import Vue from 'vue';
import VueRouter from 'vue-router';

import HomePage from './pages/HomePage.vue'
import LoginPage from './pages/LoginPage.vue'
import ProfilePage from './pages/ProfilePage.vue'
import LeaderboardPage from './pages/LeaderboardPage.vue'
import PlaylistsPage from './pages/PlaylistsPage.vue'
import CallbackPage from './pages/CallbackPage.vue'
import NotFound from './NotFound.vue';
import PlaylistInfoPage from './pages/PlaylistInfoPage.vue';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage.vue';

Vue.use(VueRouter);

const routes = [
  { path: '/', name: 'Home', component: HomePage },
  { path: '/login', name: 'Login', component: LoginPage },
  { path: '/profile', name: 'Profile', component: ProfilePage },
  { path: '/leaderboard', name: 'Leaderboard', component: LeaderboardPage },
  { path: '/playlists', name: 'Playlists', component: PlaylistsPage },
  { path: '/playlists/info/:spotifyId', name: 'PlaylistInfoPage', component: PlaylistInfoPage, props: true},
  { path: '/privacy', name: 'Privacy Policy', component: PrivacyPolicyPage },
  { path: '/callback', name: 'Callback', component: CallbackPage },
  { path: '*', name: 'Not Found', component: NotFound }
];

const router = new VueRouter({ mode: 'history', routes });

/**
 * Navigation guards to prevent user from accessing wrong pages.
 */
router.beforeEach((to, from, next) => {
  if (router.app.$store) {
    // if (router.app.$store.state.deviceId && router.app.$store.state.displayName) {
    //   if (to.name === 'Home' && router.app.$store.state.spotifyPlayer) {
    //     try {
    //       router.app.$store.state.spotifyPlayer.connect();
    //     } catch (e) {
    //       console.log(e)
    //     }
    //   }
    //   if (from.name === 'Home' && router.app.$store.state.spotifyPlayer) {
    //     try {
    //       router.app.$store.commit('forceDisconnect');
    //     } catch (e) {
    //       console.log(e)
    //     }
    //   }
    // }
    if (router.app.$store.state.displayName && to.name === 'Login') {
      next({ name: 'Profile' });
      return;
    }
    if (!router.app.$store.state.displayName &&
      (to.name === 'Home' ||
        to.name === 'Profile' ||
        to.name === 'Leaderboard' ||
        to.name === 'Playlists' ||
        to.name === 'PlaylistInfoPage'
      )) {
      next({ name: 'Login' });
      return;
    }

  }

  next();
});

export default router;
