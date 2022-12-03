import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

/**
 * Storage for data that needs to be accessed from various compoentns.
 */
const store = new Vuex.Store({
  state: {
    filter: null, // Username to filter shown freets by (null = show all)
    freets: [], // All freets created in the app
    username: null, // Username of the logged in user
    alerts: {}, // global success/error messages encountered during submissions to non-visible forms

    myLikedPlaylists: [],
    mySpotifyPlaylists: [],
    publicPlaylists: [],

  },
  getters: {
    getPlaylistById: (state) => (spotifyId) => {
      return state.mySpotifyPlaylists.find((playlist) => playlist.id === spotifyId) ?? state.publicPlaylists.find((playlist) => playlist.id === spotifyId);
    }
  },
  mutations: {
    alert(state, payload) {
      /**
       * Add a new message to the global alerts.
       */
      Vue.set(state.alerts, payload.message, payload.status);
      setTimeout(() => {
        Vue.delete(state.alerts, payload.message);
      }, 3000);
    },
    setUsername(state, username) {
      /**
       * Update the stored username to the specified one.
       * @param username - new username to set
       */
      state.username = username;
    },
    updateFilter(state, filter) {
      /**
       * Update the stored freets filter to the specified one.
       * @param filter - Username of the user to fitler freets by
       */
      state.filter = filter;
    },
    updateFreets(state, freets) {
      /**
       * Update the stored freets to the provided freets.
       * @param freets - Freets to store
       */
      state.freets = freets;
    },
    async refreshFreets(state) {
      /**
       * Request the server for the currently available freets.
       */
      const url = state.filter ? `/api/users/${state.filter}/freets` : '/api/freets';
      const res = await fetch(url).then(async r => r.json());
      state.freets = res;
    },
    addMyLikedPlaylists(state, playlist) {
      const objIdx = state.myLikedPlaylists.findIndex(
          (obj) => obj.id === playlist.id
      );
      if (objIdx <= -1) {
        state.myLikedPlaylists.push(playlist)
        if (playlist.username === 'jerrya') {
                  // find in mySpotifyPlaylists
        const objIdx2 = state.mySpotifyPlaylists.findIndex(
            (obj) => obj.id === playlist.id
        );
        state.mySpotifyPlaylists[objIdx2].liked = true;
        }
        // find in publicPlaylists
        const objIdx3 = state.publicPlaylists.findIndex(
          (obj) => obj.id === playlist.id
        );
        state.publicPlaylists[objIdx3].liked = true;
      }
    },
    removeMyLikedPlaylists(state, playlist) {
      const objIdx = state.myLikedPlaylists.findIndex(
          (obj) => obj.id === playlist.id
      );
      if (objIdx > -1) {
        state.myLikedPlaylists.splice(objIdx, 1);
        if (playlist.username === 'jerrya') {
                  // find in mySpotifyPlaylists
        const objIdx2 = state.mySpotifyPlaylists.findIndex(
          (obj) => obj.id === playlist.id
        );
        state.mySpotifyPlaylists[objIdx2].liked = false;
        }
        // find in publicPlaylists
        const objIdx3 = state.publicPlaylists.findIndex(
          (obj) => obj.id === playlist.id
        );
        state.publicPlaylists[objIdx3].liked = false;
      }
    },
    setMyLikedPlaylists(state, playlists) {
      state.myLikedPlaylists = playlists
    },
    setMySpotifyPlaylists(state, playlists) {
      state.mySpotifyPlaylists = playlists
    },
    setPublicPlaylists(state, playlists) {
      state.publicPlaylists = playlists
    },
    
  },

  // Store data across page refreshes, only discard on browser close
  plugins: [createPersistedState()]
});

export default store;
