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
    //this.$store.commit('setSpotifyPlayer', null)
    //this.$store.commit('setDeviceId', null)
    //this.$store.commit('setConnected', false)
    const myData = await fetch("/api/spotify/getMe");
    if (myData.ok) {
      const myDataJson = await myData.json();
      this.$store.commit("setDisplayName", myDataJson.display_name);
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
            cb(
              (await (await fetch(`/api/spotify/getAccessToken`)).json()).token
            );
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
    }
  },
};
</script>

<style>
/* * {
  box-sizing: border-box;
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
} */
* {
  box-sizing: border-box;
  font-family: "Leelawadee UI";
}

.wh20b {
  color: #FFFFFF;
  font-size: 20px;
  font-weight: bold;
}

.wh50b {
  color: #FFFFFF;
  font-size: 50px;
  font-weight: bold;
}

.wh100b {
  color: #FFFFFF;
  font-size: 100px;
  font-weight: bold;
}

.gr20 {
  color: #A9A9A9;
  font-size: 20px;
}

.gr30 {
  color: #A9A9A9;
  font-size: 30px;
}

body {
  height: 100vh;
  padding: 0;
  margin: 0;
  background-color: #1F1B2E;
}

.center {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.button {
  color: #FFFFFF;
  background-color: #6C4EB3;
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
