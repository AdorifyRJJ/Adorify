import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

Vue.mixin({
  methods: {
    async handleSpotifyResponse(spotifyResponse) {
      try {
        return {
          data: await spotifyResponse,
          expected: true,
        }
      } catch (e) {
        return {
          data: e.body,
          expected: false,
        }
      }
    },
  }
})

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
