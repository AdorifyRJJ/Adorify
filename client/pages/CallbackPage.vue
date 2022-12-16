<template>
  <main></main>
</template>

<script>
export default {
  name: "CallbackPage",
  async beforeCreate() {
    this.$store.commit("setConnected", false);
    if (this.$route.query.code) {
      console.log(this.$route.query.code);
      const myData = await fetch(
        `/api/spotify/initializeAuth?code=${this.$route.query.code}`
      );
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
      }
      this.$router.push("/");
    } else {
      this.$router.push({ name: "Login" });
    }
  },
};
</script>

<style></style>
