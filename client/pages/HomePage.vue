<template>
  <main>
    <h1>Home Page</h1>
    <div>
      <button @click="playMusic">Play Music</button>
      <button @click="pauseMusic">Pause Music</button>
    </div>
    <div>
      <p v-if="!player_device_id">
        Device is not ready, so music playback will not work. Please log in.
        (Click "Profile" -> "Logout" -> "Login")
      </p>
      <p v-else>Device ready!</p>
    </div>
    <div>
      <p v-if="!playing">Not playing music.</p>
      <p v-else>Playing music! Turn it up!</p>
    </div>

    <!-- fetch username -->
    <div>[username]</div>

    <div v-if="!sessionStarted">
      <div>Start a focus session</div>
      <div>
        <div>
          Focus Time
          <input v-model="focusTime" placeholder="25" /> min
        </div>
        <div>Break Time <input v-model="breakTime" placeholder="5" /> min</div>
        <div>
          Intervals
          <input v-model="intervals" placeholder="4" /> times
        </div>
      </div>
      <!-- fetch likedPlaylists -->
      <div>Carousel: {{ this.myLikedPlaylists }}</div>

      <!-- start focus session and play selected playlist -->
      <button @click="startSession">[Play button]</button>
    </div>
    <div v-else>
      <!-- !TODO: user refreshes page-->
      <div>You're doing great!</div>
      <!-- <CountDownTimer :time="time" /> -->
      <div>
        <div>{{ this.getTime }}</div>
        {{ this.currInterval }} {{ this.timerId }}
      </div>
      <div>[Progress thingy]</div>
      <button @click="endSession">End Session</button>
      <div>[song info]</div>
      <div>
        <button @click="playPrev">[prev]</button>
        <button @click="togglePlay">[pause/play]</button>
        <button @click="playNext">[next]</button>
      </div>
    </div>
  </main>
</template>

<script>
import { myLikedPlaylists } from "../dummyData.js";
import CountDownTimer from "../components/CountDownTimer.vue";
export default {
  components: { CountDownTimer },
  name: "HomePage",
  data() {
    return {
      player: undefined,
      player_device_id: undefined,
      myLikedPlaylists: myLikedPlaylists,
      playing: false,
      focusTime: 1 / 12,
      breakTime: 1 / 30,
      intervals: 2,
      selectedPlaylistId: "sd23c98efc293",
      sessionStarted: false,
      focusing: false,
      currInterval: 1,
      timerActive: false,
      timestamp: null,
      timerId: null,
    };
  },
  computed: {
    getTime() {
      return this.getMin + ":" + this.getSec;
    },
    getMin() {
      const min = Math.floor(this.timestamp / 60);
      return min < 10 ? `0${min}` : `${min}`;
    },
    getSec() {
      const sec = this.timestamp % 60;
      return sec < 10 ? `0${sec}` : `${sec}`;
    },
  },
  methods: {
    async playMusic() {
      if (this.player_device_id) {
        const playback = await fetch(
          `/api/spotify/play?deviceId=${this.player_device_id}`
        );
        if (playback.ok) {
          this.playing = true;
        }
      }
    },
    async pauseMusic() {
      if (this.player_device_id) {
        const playback = await fetch(
          `/api/spotify/pause?deviceId=${this.player_device_id}`
        );
        if (playback.ok) {
          this.playing = false;
        }
      }
    },
    clearTimer() {
      if (this.timerId) clearInterval(this.timerId);
    },
    startTimer() {
      this.timerActive = true;
      this.timestamp =
        this.timestamp ??
        (this.focusing ? this.focusTime * 60 : this.breakTime * 60);
      this.timerId = setInterval(() => {
        if (this.timerActive) {
          this.timestamp--;
          if (this.timestamp <= 0) {
            this.clearTimer();
            this.timestamp = null;
            if (this.currInterval >= this.intervals) {
              this.endSession();
              return;
            }
            if (!this.focusing) {
              this.currInterval++;
            }
            this.focusing = !this.focusing;
            this.startTimer();
          }
        }
      }, 1000);
    },
    pauseTimer() {
      this.timerActive = false;
      this.clearTimer();
    },
    startSession() {
      this.focusing = true;
      this.sessionStarted = true;
      console.log("session started");

      this.startTimer();
      // start playlist
    },
    endSession() {
      this.pauseTimer();
      this.timerActive = false;
      this.timestamp = null;
      this.clearTimer();
      this.timerId = null;
      this.focusing = false;
      this.currInterval = 1;
      this.sessionStarted = false;
      console.log("session ended");
      // end timer
      // end playlist
      // api call
    },
    playPrev() {
      console.log("play prev song");
    },
    playNext() {
      console.log("play next song");
    },
    togglePlay() {
      console.log("toggle timer and song");
      if (this.timerActive) {
        this.pauseTimer();
      } else {
        // if (this.focusing) {
        this.startTimer();
        // } else {
        //     this.startBreakTimer();
        // }
      }
    },
  },
  async beforeCreate() {
    const myData = await fetch("/api/spotify/getMe");
    if (myData.ok) {
      const myDataJson = await myData.json();
      this.$store.commit("setUsername", myDataJson.data.body.id);

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

          this.player_device_id = device_id;
        });

        player.addListener("not_ready", ({ device_id }) => {
          console.log("Device ID has gone offline", device_id);
        });

        player.connect();
      };
    }
  },
};
</script>

<style></style>
