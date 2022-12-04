<!-- Default page that also displays freets

<template>
  <main>
    <section v-if="$store.state.username">
      <header>
        <h2>Welcome @{{ $store.state.username }}</h2>
      </header>
    </section>
    <section v-else>
      <header>
        <h2>Welcome to Fritter!</h2>
      </header>
      <article>
        <h3>
          <router-link to="/login"> Sign in </router-link>
          to create, edit, and delete freets.
        </h3>
      </article>
    </section>
    <button @click="playMusic">Play Music</button>
    <button @click="pauseMusic">Pause Music</button>
    <section>
      <header>
        <div class="left">
          <h2>
            Viewing all freets
            <span v-if="$store.state.filter">
              by @{{ $store.state.filter }}
            </span>
          </h2>
        </div>
        <div class="right">
          <GetFreetsForm
            ref="getFreetsForm"
            value="author"
            placeholder="🔍 Filter by author (optional)"
            button="🔄 Get freets"
          />
        </div>
      </header>
      <section v-if="$store.state.freets.length">
        <FreetComponent
          v-for="freet in $store.state.freets"
          :key="freet.id"
          :freet="freet"
        />
      </section>
      <article v-else>
        <h3>No freets found.</h3>
      </article>
    </section>
  </main>
</template>

<script>
import FreetComponent from "@/components/Freet/FreetComponent.vue";
import CreateFreetForm from "@/components/Freet/CreateFreetForm.vue";
import GetFreetsForm from "@/components/Freet/GetFreetsForm.vue";

export default {
  name: "FreetPage",
  components: { FreetComponent, GetFreetsForm, CreateFreetForm },
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

<style scoped>
section {
  display: flex;
  flex-direction: column;
}

header,
header > * {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

button {
  margin-right: 10px;
}

section .scrollbox {
  flex: 1 0 50vh;
  padding: 3%;
  overflow-y: scroll;
}
</style> -->
