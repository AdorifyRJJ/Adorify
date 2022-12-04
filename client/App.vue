<template>
  <div id="app">
    <header>
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
* {
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
}

.alerts {
  position: absolute;
  z-index: 99;
  bottom: 0;
  top: 100%;
  left: 50%;
  transform: translate(-50%, 10%);
  width: 100%;
  text-align: center;
}

.alerts article {
  border-radius: 5px;
  padding: 10px 20px;
  color: #fff;
}

.alerts p {
  margin: 0;
}

.alerts .error {
  background-color: rgb(166, 23, 33);
}

.alerts .success {
  background-color: rgb(45, 135, 87);
}
</style>
