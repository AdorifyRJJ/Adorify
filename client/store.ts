import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

const BUFFER_TIME = 30;

/**
 * Storage for data that needs to be accessed from various compoentns.
 */
const store = new Vuex.Store({
  state: {
    displayName: null, // Username of the logged in user
    refreshTimeout: null,
    deviceId: null,
    myLikedPlaylists: [],
    // mySpotifyPlaylists: [],
    // publicPlaylists: [],
    spotifyPlayer: null,
    connected: false,
  },
  // getters: {
  //   getPlaylistById: (state) => (spotifyId) => {
  //     return state.mySpotifyPlaylists.find((playlist) => playlist.id === spotifyId) ?? state.publicPlaylists.find((playlist) => playlist.id === spotifyId);
  //   }
  // },
  mutations: {
    setDisplayName(state, displayName) {
      /**
       * Update the stored username to the specified one.
       * @param username - new username to set
       */
      state.displayName = displayName;
    },
    setConnected(state, connected) {
      state.connected = connected;
    },
    setDeviceId(state, deviceId) {
      state.deviceId = deviceId;
    },
    setSpotifyPlayer(state, player) {
      state.spotifyPlayer = player;
    },
    forceDisconnect(state) {
      if (state.spotifyPlayer) state.spotifyPlayer.disconnect();
      state.connected = false;
    },
    deleteRefreshTimeout(state) {
      if (state.refreshTimeout) { 
        clearTimeout(state.refreshTimeout);
        state.refreshTimeout = null;
      }
    },
    async scheduleRefresh(state) {
      if (state.displayName) {
        const expiryTime = (await (await fetch('/api/spotify/getExpiryTime')).json()).expiryTime;
        // Everything is in seconds
        const timeFromNow = expiryTime - (new Date().getTime() / 1000) - BUFFER_TIME;
        // Convert to MS for setTimeout
        const timeFromNowMS = timeFromNow * 1000;
        if (state.refreshTimeout) clearTimeout(state.refreshTimeout);
        if (timeFromNowMS < 0) {
          await fetch('/api/spotify/refreshAccessToken');
          store.commit("scheduleRefresh");
        } else {
          state.refreshTimeout = setTimeout(async () => {
            await fetch('/api/spotify/refreshAccessToken');
            store.commit("scheduleRefresh");
          }, timeFromNowMS)
        }
      }
    },
    // addMyLikedPlaylists(state, playlist) {
    //   const objIdx = state.myLikedPlaylists.findIndex(
    //       (obj) => obj.id === playlist.id
    //   );
    //   if (objIdx <= -1) {
    //     state.myLikedPlaylists.push(playlist)
    //     if (playlist.username === 'jerrya') {
    //               // find in mySpotifyPlaylists
    //     const objIdx2 = state.mySpotifyPlaylists.findIndex(
    //         (obj) => obj.id === playlist.id
    //     );
    //     state.mySpotifyPlaylists[objIdx2].liked = true;
    //     }
    //     // find in publicPlaylists
    //     const objIdx3 = state.publicPlaylists.findIndex(
    //       (obj) => obj.id === playlist.id
    //     );
    //     state.publicPlaylists[objIdx3].liked = true;
    //   }
    // },
    // removeMyLikedPlaylists(state, playlist) {
    //   const objIdx = state.myLikedPlaylists.findIndex(
    //       (obj) => obj.id === playlist.id
    //   );
    //   if (objIdx > -1) {
    //     state.myLikedPlaylists.splice(objIdx, 1);
    //     if (playlist.username === 'jerrya') {
    //               // find in mySpotifyPlaylists
    //     const objIdx2 = state.mySpotifyPlaylists.findIndex(
    //       (obj) => obj.id === playlist.id
    //     );
    //     state.mySpotifyPlaylists[objIdx2].liked = false;
    //     }
    //     // find in publicPlaylists
    //     const objIdx3 = state.publicPlaylists.findIndex(
    //       (obj) => obj.id === playlist.id
    //     );
    //     state.publicPlaylists[objIdx3].liked = false;
    //   }
    // },
    async refreshLikedPlaylists(state) {
      const playlists = (await fetch(`/api/users`).then(async r => r.json())).playlists;
      console.log('playlists', playlists)
      state.myLikedPlaylists = playlists.map((playlist) => ({
        id: playlist.id,
        image: playlist.images[0],
        name: playlist.name,
        owner: playlist.owner.display_name
      })
      )
    },
    setMyLikedPlaylists(state, playlists) {
      state.myLikedPlaylists = [...playlists]
    },
    // setMySpotifyPlaylists(state, playlists) {
    //   state.mySpotifyPlaylists = [...playlists]
    // },
    // setPublicPlaylists(state, playlists) {
    //   state.publicPlaylists = [...playlists]
    // },

  },

  // Store data across page refreshes, only discard on browser close
  plugins: [createPersistedState()]
});

export default store;
