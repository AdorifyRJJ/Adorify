<template>
  <div id="app">
    <header v-if="$store.state.displayName">
      <NavBar />
    </header>
    <router-view />
  </div>
</template>

<script>
import NavBar from "@/components/common/NavBar.vue";

export default {
  name: "App",
  components: { NavBar },
  async beforeCreate() {
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
          console.log("Ready with Device ID", device_id);
          await fetch(`/api/spotify/transfer?deviceId=${device_id}`);
          await fetch(`/api/spotify/pause?deviceId=${device_id}`);
          this.$store.commit("setSpotifyPlayer", player);
          this.$store.commit("setDeviceId", device_id);
          this.$store.commit("setConnected", true);
        });

        player.addListener("not_ready", ({ device_id }) => {
          console.log("Device ID has gone offline", device_id);
          this.$store.commit("setConnected", false);
        });

        player.connect();
      };
      if (this.$router.history.current.name !== "Home")
        this.$router.push({ name: "Home" });
    } else {
      await fetch(`/api/spotify/logout`);
      this.$store.commit("resetStore");
      if (this.$router.history.current.name !== "Login")
        this.$router.push({ name: "Login" });
    }
  },
};
</script>

<style>
li {
  display: block;
}

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
  width: 0; /* Remove scrollbar space */
  background: transparent; /* Optional: just make scrollbar invisible */
}

body {
  height: 100vh;
  flex-direction: column;
  display: flex;
  padding: 0;
  margin: 0;
  font-size: 1.2em;
}

main {
  padding: 0 5em 5em;
}

.wh16b {
  color: #ffffff;
  font-size: 16px;
  font-weight: bold;
}

.wh20b {
  color: #ffffff;
  font-size: 20px;
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

.gr16 {
  color: #a9a9a9;
  font-size: 16px;
}

.gr20 {
  color: #a9a9a9;
  font-size: 20px;
}

.gr30 {
  color: #a9a9a9;
  font-size: 30px;
}

.center {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.button {
  color: #ffffff;
  background-color: #6c4eb3;
  height: 50px;
  border-radius: 20px;
  border-width: 0;
  padding: 0px 30px;
}

.button:hover {
  background-color: #5a4193;
}

a:link {
  text-decoration: none;
}

a:visited {
  text-decoration: none;
}
</style>
