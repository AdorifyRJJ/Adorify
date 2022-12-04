<template>
    <main>

    </main>
</template>

<script>
export default {
  name: "CallbackPage",
  async beforeCreate() {
    if (this.$route.query.code) {
      const myData = await fetch(`/api/spotify/initializeAuth?code=${this.$route.query.code}`);
      if (myData.ok) {
        const myDataJson = await myData.json();
        this.$store.commit("setUsername", myDataJson.id);
        this.$store.commit("scheduleRefresh");

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

          this.player = player;

          player.addListener("ready", async ({ device_id }) => {
            console.log("Ready with Device ID", device_id);
            const playback = await fetch(
              `/api/spotify/transfer?deviceId=${device_id}`
            );
            const playbackRes = await playback.json();

            this.$store.commit('setDeviceId', device_id);
          });

          player.addListener("not_ready", ({ device_id }) => {
            console.log("Device ID has gone offline", device_id);
          });

          player.connect();
        };
      }
      this.$router.push('/');
    }
  },
};
</script>

<style></style>
