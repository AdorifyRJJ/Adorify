import Vue from 'vue';
import VueRouter from 'vue-router';
// import FreetsPage from './components/Freet/FreetsPage.vue';
// import AccountPage from './components/Account/AccountPage.vue';
// import LoginPage from './components/Login/LoginPage.vue';
// import NotFound from './NotFound.vue';

import HomePage from './pages/HomePage.vue'
import LoginPage from './pages/LoginPage.vue'
import ProfilePage from './pages/ProfilePage.vue'
import LeaderboardPage from './pages/LeaderboardPage.vue'
import PlaylistsPage from './pages/PlaylistsPage.vue'
import CallbackPage from './pages/CallbackPage.vue'
import NotFound from './NotFound.vue';

Vue.use(VueRouter);

const routes = [
  {path: '/', name: 'Home', component: HomePage},
  {path: '/login', name: 'Login', component: LoginPage},
  {path: '/profile', name: 'Profile', component: ProfilePage},
  {path: '/leaderboard', name: 'Leaderboard', component: LeaderboardPage},
  {path: '/playlists', name: 'Playlists', component: PlaylistsPage},
  {path: '/callback', name: 'Callback', component: CallbackPage},
  {path: '*', name: 'Not Found', component: NotFound}
];

const router = new VueRouter({ mode: 'history', routes });

/**
 * Navigation guards to prevent user from accessing wrong pages.
 */
router.beforeEach((to, from, next) => {
  // if (router.app.$store) {
  //   if (to.name === 'Login' && router.app.$store.state.username) {
  //     next({ name: 'Account' }); // Go to Account page if user navigates to Login and are signed in
  //     return;
  //   }

  //   if (to.name === 'Account' && !router.app.$store.state.username) {
  //     next({ name: 'Login' }); // Go to Login page if user navigates to Account and are not signed in
  //     return;
  //   }
  // }

  next();
});

export default router;
