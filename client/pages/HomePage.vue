<template>
  <main>
    <h1>HomePage</h1>
    <button @click="playMusic">Play Music</button>
    <button @click="pauseMusic">Pause Music</button>
  </main>
</template>

<script>
export default {
  name: "HomePage",
  data() {
    return {
      player: undefined,
      player_device_id: undefined,
    };
  },
  async beforeCreate() {
    if (this.$route.query.code) {
      const token = await fetch(
        `/api/spotify/getToken?code=${this.$route.query.code}`
      );
      const tokenjson = await token.json();
      window.history.pushState({}, document.title, "/");
      const myData = await fetch("/api/spotify/getMe");
      const ans = await myData.json();
      console.log(ans);

      const script = document.createElement("script");
      script.src = "https://sdk.scdn.co/spotify-player.js";
      script.async = true;

      document.body.appendChild(script);

      window.onSpotifyWebPlaybackSDKReady = () => {
        const player = new window.Spotify.Player({
          name: "Web Playback SDK",
          getOAuthToken: (cb) => {
            cb(tokenjson.token);
          },
          volume: 0.5,
        });
        console.log(player);
        this.player = player;

        player.addListener("ready", async ({ device_id }) => {
          console.log("Ready with Device ID", device_id);
          const playback = await fetch(
            `/api/spotify/transfer?deviceId=${device_id}`
          );
          const playbackRes = await playback.json();
          console.log(playbackRes);
          this.player_device_id = device_id;
        });

        player.addListener("not_ready", ({ device_id }) => {
          console.log("Device ID has gone offline", device_id);
        });

        player.addListener("player_state_changed", (state) => {
          if (!state) {
            return;
          }

          setTrack(state.track_window.current_track);
          setPaused(state.paused);

          player.getCurrentState().then((state) => {
            !state ? setActive(false) : setActive(true);
          });
        });

        player.connect();
      };
    }
  },
  methods: {
    async playMusic() {
      console.log("toggle music");
      if (this.player_device_id) {
        const playback = await fetch(
          `/api/spotify/play?deviceId=${this.player_device_id}`
        );
        const playbackRes = await playback.json();
        console.log(playbackRes);
      }
    },
    async pauseMusic() {
      console.log("toggle music");
      if (this.player_device_id) {
        const playback = await fetch(
          `/api/spotify/pause?deviceId=${this.player_device_id}`
        );
        const playbackRes = await playback.json();
        console.log(playbackRes);
      }
    },
  },
};
</script>

<style></style>
