<template>
  <div id="app">
    <header v-if="$store.state.displayName">
      <NavBar />
    </header>
    <header v-else-if="$route.name === 'Privacy Policy'">
      <PrivacyNavBar />
    </header>
    <div id="remainingContent">
      <router-view />
    </div>
    <div id="snackbar" class="center">{{ errorText }}</div>
  </div>
</template>

<script>
import NavBar from "@/components/common/NavBar.vue";
import PrivacyNavBar from "@/components/PrivacyNavBar.vue";
import SpotifyWebApi from "spotify-web-api-node";
export default {
  name: "App",
  components: { NavBar, PrivacyNavBar },
  data() {
    return {
      errorText: '',
    };
  },
  methods: {
    async displayError() {
      const x = document.getElementById("snackbar");
      x.className = "show";
      setTimeout(function () {
        x.className = x.className.replace("show", "");
        this.errorText = "";
      }, 3000);
    },
  },
  async beforeCreate() {
    this.$store.commit("setConnected", false);
    const myData = this.$route.query.code
      ? await fetch(
        `/api/spotify/initializeAuth?code=${this.$route.query.code}`
      )
      : await fetch("/api/spotify/getMe");
    const allDataJson = await myData.json();
    if (myData.ok) {
      const myDataJson = allDataJson.me;
      this.$store.commit("setDisplayName", myDataJson.display_name);
      this.$store.commit("setImgURL", myDataJson.images[0]?.url);
      this.$store.commit("setAccessToken", allDataJson.accessToken);
      this.$store.commit("setExpiryTime", allDataJson.expiryTime);
      this.$store.commit("scheduleRefresh");
      this.$store.commit("refreshLikedPlaylists");
      const spotifyApi = new SpotifyWebApi({
        clientId: process.env.ID,
      });
      spotifyApi.setAccessToken(allDataJson.accessToken);
      this.$store.commit("setSpotifyApi", spotifyApi);
      const script = document.createElement("script");
      script.src = "https://sdk.scdn.co/spotify-player.js";
      script.async = true;
      document.body.appendChild(script);
      window.onSpotifyWebPlaybackSDKReady = async () => {
        const player = await new window.Spotify.Player({
          name: "Web Playback SDK",
          getOAuthToken: async (cb) => {
            cb(this.$store.state.accessToken);
          },
          volume: 0.5,
        });
        player.addListener("ready", async ({ device_id }) => {
          this.$store.commit("setSpotifyPlayer", player);
          this.$store.commit("setDeviceId", device_id);
          this.$store.commit("setConnected", true);
          console.log("Ready with Device ID", device_id);
        });
        player.addListener("not_ready", ({ device_id }) => {
          console.log("Device ID has gone offline", device_id);
          this.$store.commit("setConnected", false);
        });
        player.connect();
      };
      if (this.$route.query.code) this.$router.push({ name: "Home" });
    } else {
      if (this.$route.query.code) {
        this.errorText = "Login failed. Please ensure you have a Spotify Premium account.";
        this.displayError();
      }
      await fetch(`/api/spotify/logout`);
      this.$store.commit("resetStore");
      if (this.$router.history.current.name !== "Login" && this.$router.history.current.name !== "Privacy Policy")
        this.$router.push({ name: "Login" });
    }
  },
};
</script>
<style>

#footer {
  position: fixed;
  bottom: 14px;
  left: 18px;
  display: flex;
  gap: 8px;
  padding: 4px 8px;
  border-radius: 10px;
  background-color: #373544;
  z-index: 1;
}

/* @font-face {
    font-family: "AdorifyF";
    src: url("./public/fonts/AdorifyF/AvenirNextLTPro-UltLt.otf");
    font-weight: 100;
    font-style: normal;
} */
@font-face {
  font-family: "AdorifyF";
  src: url("./public/fonts/AdorifyF/AvenirNextLTPro-Regular.otf");
  font-weight: normal;
  font-style: normal;
}

@font-face {
  font-family: "AdorifyF";
  src: url("./public/fonts/AdorifyF/AvenirNextLTPro-Medium.otf");
  font-weight: medium;
  font-style: normal;
}

@font-face {
  font-family: "AdorifyF";
  src: url("./public/fonts/AdorifyF/AvenirNextLTPro-Bold.otf");
  font-weight: bold;
  font-style: normal;
}

* {
  box-sizing: border-box;
  font-family: "AdorifyF";
}

#app {
  color: white;
  background: #1f1b2e;
  /* width: 100vw; */
  height: 100vh;
}

::-webkit-scrollbar {
  width: 0;
  background: transparent;
}

.scrollable {
  height: 100%;
  overflow: auto;
  visibility: hidden;

  /* margin-right: -10px; */
}

.scrollable-content,
.scrollable:hover,
.scrollable:focus {
  visibility: visible;
}

/* ::-webkit-scrollbar {
    width: 10px;
}

::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.2); 
}
 
::-webkit-scrollbar-thumb {
  background: #888; 
}

::-webkit-scrollbar-thumb:hover {
  background: #555; 
} */

body {
  padding: 0;
  margin: 0;
  font-size: 1.2em;
}

#remainingContent {
  width: 100%;
  position: absolute;
  top: 72px;
  bottom: 0;
}

/* main {
  padding: 0 30px;
} */

.wh12b {
  color: #ffffff;
  font-size: 12px;
  font-weight: bold;
}

.wh16b {
  color: #ffffff;
  font-size: 16px;
  font-weight: bold;
}

.wh18b {
  color: #ffffff;
  font-size: 18px;
  font-weight: bold;
}

.wh20b {
  color: #ffffff;
  font-size: 20px;
  font-weight: bold;
}

.wh30b {
  color: #ffffff;
  font-size: 30px;
  font-weight: bold;
}

.wh36b {
  color: #ffffff;
  font-size: 36px;
  font-weight: bold;
}

.wh40b {
  color: #ffffff;
  font-size: 40px;
  font-weight: bold;
}

.wh50b {
  color: #ffffff;
  font-size: 50px;
  font-weight: bold;
}

.wh100b {
  color: #ffffff;
  font-size: 100px;
  font-weight: bold;
}

.wh16n {
  color: #ffffff;
  font-size: 16px;
  font-weight: normal;
}

.wh18n {
  color: #ffffff;
  font-size: 18px;
  font-weight: normal;
}

.wh20n {
  color: #ffffff;
  font-size: 20px;
  font-weight: normal;
}

.wh36n {
  color: #ffffff;
  font-size: 36px;
  font-weight: normal;
}

.wh40n {
  color: #ffffff;
  font-size: 40px;
  font-weight: normal;
}

.gr12 {
  color: #a9a9a9;
  font-size: 12px;
}

.gr16 {
  color: #a9a9a9;
  font-size: 16px;
}

.gr20 {
  color: #a9a9a9;
  font-size: 20px;
}

.gr24 {
  color: #a9a9a9;
  font-size: 24px;
}

.gr30 {
  color: #a9a9a9;
  font-size: 30px;
}

.gr26b {
  color: #a9a9a9;
  font-size: 26px;
  font-weight: bold;
}

.margin-t-40 {
  margin-top: 40px;
}

.margin-t-50 {
  margin-top: 50px;
}

.margin-b-4 {
  margin-bottom: 4px;
}

.margin-b-8 {
  margin-bottom: 8px;
}

.margin-b-10 {
  margin-bottom: 10px;
}

.margin-b-14 {
  margin-bottom: 14px;
}

.margin-b-18 {
  margin-bottom: 18px;
}

.margin-b-30 {
  margin-bottom: 30px;
}

.margin-b-60 {
  margin-bottom: 60px;
}

.margin-r-30 {
  margin-right: 30px;
}

.margin-y-30 {
  margin: 30px 0;
}

.center {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.button {
  color: #ffffff;
  background-color: #6c4eb3;
  height: 44px;
  border-radius: 20px;
  border-width: 0;
  padding: 0px 30px;
  cursor: pointer;
}

.button:hover {
  filter: brightness(80%);
}

.btn-group-button {
  color: #ffffff;
  background-color: #373544;
  height: 44px;
  border-radius: 0px;
  border-width: 0;
  white-space: nowrap;
  text-align: center;
  cursor: pointer;
}

.btn-group {
  display: flex;
}

.btn-group>.btn-group-button {
  border-right: 2px solid #6c4eb3;
}

.btn-group>*:last-child {
  border-radius: 0 20px 20px 0;
  border-right: 0;
}

.btn-group>*:first-child {
  border-radius: 20px 0 0 20px;
}

.truncate1line {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.truncate2lines {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

a:link {
  text-decoration: none;
}

a:visited {
  text-decoration: none;
}


/* The snackbar - position it at the bottom and in the middle of the screen */
#snackbar {
  visibility: hidden;
  /* Hidden by default. Visible on click */
  min-width: 250px;
  background-color: #333;
  /* Black background color */
  color: #fff;
  /* White text color */
  text-align: center;
  /* Centered text */
  border-radius: 2px;
  /* Rounded borders */
  padding: 16px;
  /* Padding */
  position: fixed;
  /* Sit on top of the screen */
  z-index: 1;
  /* Add a z-index if needed */
  left: 50%;
  transform: translateX(-50%);
  bottom: 30px;
  /* 30px from the bottom */
}

/* Show the snackbar when clicking on a button (class added with JavaScript) */
#snackbar.show {
  visibility: visible;
  /* Show the snackbar */
  /* Add animation: Take 0.5 seconds to fade in and out the snackbar.
  However, delay the fade out process for 2.5 seconds */
  -webkit-animation: fadein 0.5s, fadeout 0.5s 2.5s;
  animation: fadein 0.5s, fadeout 0.5s 2.5s;
}
</style>
