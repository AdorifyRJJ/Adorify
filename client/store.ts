import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import router from './router';


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
    imgURL: null,
    // mySpotifyPlaylists: [],
    // publicPlaylists: [],
    spotifyPlayer: null,
    connected: false,
    accessToken: null,
    expiryTime: null,
    spotifyApi: null,
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
    setImgURL(state, imgURL) {
      state.imgURL = imgURL;
    },
    setAccessToken(state, accessToken) {
      state.accessToken = accessToken;
    },
    setConnected(state, connected) {
      state.connected = connected;
    },
    setDeviceId(state, deviceId) {
      state.deviceId = deviceId;
    },
    setExpiryTime(state, expiryTime) {
      state.expiryTime = expiryTime;
    },
    setSpotifyPlayer(state, player) {
      state.spotifyPlayer = player;
    },
    setSpotifyApi(state, spotifyApi) {
      state.spotifyApi = spotifyApi;
    },
    forceDisconnect(state) {
      try {
        if (state.spotifyPlayer) state.spotifyPlayer.disconnect();
        state.connected = false;
      } catch (e) {
        console.log(e)
      }
    },
    deleteRefreshTimeout(state) {
      if (state.refreshTimeout) {
        clearTimeout(state.refreshTimeout);
        state.refreshTimeout = null;
      }
    },
    resetStore(state) {
      store.commit("forceDisconnect");
      store.commit("setDisplayName", null);
      store.commit("setImgURL", null);
      store.commit("setAccessToken", null);
      store.commit("deleteRefreshTimeout");
      store.commit("setMyLikedPlaylists", []);
      store.commit("setSpotifyPlayer", null);
      store.commit("setExpiryTime", null);
      store.commit("setDeviceId", null);
      store.commit("setSpotifyApi", null);
    },
    async scheduleRefresh(state) {
      console.log('in refresh')
      if (state.displayName) {
        // Everything is in seconds
        const timeFromNow = state.expiryTime - (new Date().getTime() / 1000) - BUFFER_TIME;
        // Convert to MS for setTimeout
        const timeFromNowMS = timeFromNow * 1000;
        if (state.refreshTimeout) clearTimeout(state.refreshTimeout);
        if (timeFromNowMS < 0) {
          const accessTokenResponse = await fetch('/api/spotify/refreshAccessToken');
          const accessTokenJson = await accessTokenResponse.json();
          if (accessTokenResponse.ok) {
            store.commit("setAccessToken", accessTokenJson.accessToken);
            store.commit("setExpiryTime", accessTokenJson.expiryTime);
            await state.spotifyApi.setAccessToken(accessTokenJson.accessToken);
            store.commit("scheduleRefresh");
            return;
          } else {
            console.log(accessTokenJson.error)
            await fetch(`/api/spotify/logout`);
            store.commit("resetStore");
            if (router.history.current.name !== 'Login') router.push({ name: 'Login' });
            return;
          }
        } else {
          state.refreshTimeout = setTimeout(async () => {
            store.commit("scheduleRefresh");
          }, timeFromNowMS);
          return;
        }
      } else {
        await fetch(`/api/spotify/logout`);
        store.commit("resetStore");
        if (router.history.current.name !== 'Login') router.push({ name: 'Login' });
        return;
      }
    },
    toggleLike(state, {id, image, name, owner, isLiked}) {
      const objIdx = state.myLikedPlaylists.findIndex(
          (obj) => obj.id === id
      );
      if (objIdx >= 0) { // will remove from myLikedPlaylists
        state.myLikedPlaylists.splice(objIdx, 1); 
      } else { // will add to in myLikedPlaylists
        state.myLikedPlaylists.push({
          id: id,
          image: image,
          name: name,
          owner: owner,
          isLiked: isLiked,
        })
      }
    },
    // addToLikedPlaylists(state, playlist) {
    //   const objIdx = state.myLikedPlaylists.findIndex(
    //       (obj) => obj.id === playlist.id
    //   );
    //   if (objIdx <= -1) {
    //     state.myLikedPlaylists.push(playlist)
        // if (playlist.username === 'jerrya') {
        //           // find in mySpotifyPlaylists
        // const objIdx2 = state.mySpotifyPlaylists.findIndex(
        //     (obj) => obj.id === playlist.id
        // );
        // state.mySpotifyPlaylists[objIdx2].liked = true;
        // }
        // // find in publicPlaylists
        // const objIdx3 = state.publicPlaylists.findIndex(
        //   (obj) => obj.id === playlist.id
        // );
        // state.publicPlaylists[objIdx3].liked = true;
    //   }
    // },
    // removeFromLikedPlaylists(state, playlist) {
    //   const objIdx = state.myLikedPlaylists.findIndex(
    //       (obj) => obj.id === playlist.id
    //   );
    //   if (objIdx > -1) {
    //     state.myLikedPlaylists.splice(objIdx, 1);
        // if (playlist.username === 'jerrya') {
        //           // find in mySpotifyPlaylists
        // const objIdx2 = state.mySpotifyPlaylists.findIndex(
        //   (obj) => obj.id === playlist.id
        // );
        // state.mySpotifyPlaylists[objIdx2].liked = false;
        // }
        // // find in publicPlaylists
        // const objIdx3 = state.publicPlaylists.findIndex(
        //   (obj) => obj.id === playlist.id
        // );
        // state.publicPlaylists[objIdx3].liked = false;
    //   }
    // },
    async refreshLikedPlaylists(state) {
      const playlists = (await fetch(`/api/users`).then(async r => r.json())).playlists;
      state.myLikedPlaylists = playlists.map((playlist) => ({
        id: playlist.id,
        image: playlist.images[0]?.url,
        name: playlist.name,
        owner: playlist.owner.display_name,
        isLiked: playlist.isLiked,
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
