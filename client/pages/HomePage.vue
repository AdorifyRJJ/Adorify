<template>
  <main>
    <h1>Home Page</h1>
    <!-- <div>
      <button @click="playMusic">Play Music</button>
      <button @click="pauseMusic">Pause Music</button>
    </div> -->
    <div>
      <p v-if="!this.$store.state.connected">
        Device is not ready, so music playback will not work. Either wait for
        connection or please log in. (Click "Profile" -> "Logout" -> "Login")
      </p>
      <p v-else>Device ready!</p>
    </div>
    <div>
      <p v-if="!playing">Not playing music.</p>
      <p v-else>Playing music! Turn it up!</p>
    </div>

    <!-- fetch username -->
    <div>{{ this.$store.state.displayName }}</div>

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
      <div>Carousel: {{ this.$store.state.myLikedPlaylists }}</div>

      <!-- start focus session and play selected playlist -->
      <button @click="startSession">[Play button]</button>
    </div>
    <div v-else>
      <!-- !TODO: user refreshes page-->
      <div>You're doing great!</div>
      <div>
        <h2>{{ this.getTime }}</h2>
      </div>
      <div>{{ this.currInterval }} / {{ this.intervals }}</div>
      <button @click="endSession">End Session</button>
      <div>{{ this.currTrackTitle }}</div>
      <div>{{ this.currTrackArtist }}</div>
      <div>
        <button @click="playPrev">[prev]</button>
        <button @click="togglePlay">[pause/play]</button>
        <button @click="playNext">[next]</button>
      </div>
    </div>
  </main>
</template>

<script>
export default {
  name: "HomePage",
  data() {
    return {
      // player: undefined,
      // player_device_id: undefined,
      playing: false,
      focusTime: 25,
      breakTime: 5,
      intervals: 2,
      selectedPlaylistId: "sd23c98efc293",
      sessionStarted: false,
      focusing: false,
      currInterval: 1,
      timerActive: false,
      timestamp: null,
      timerId: null,
      currTrackTitle: "",
      currTrackArtist: "",
      trackTimerId: null,
      playlistTracks: null,
      playlistIndex: 0,
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
      if (this.$store.state.deviceId) {
        const playback = await fetch(
          `/api/spotify/play?deviceId=${this.$store.state.deviceId}`
        );
        if (playback.ok) {
          this.playing = true;
        }
      }
    },
    async pauseMusic() {
      if (this.$store.state.deviceId) {
        const playback = await fetch(
          `/api/spotify/pause?deviceId=${this.$store.state.deviceId}`
        );
        if (playback.ok) {
          this.playing = false;
        }
      }
    },
    clearTimer() {
      if (this.timerId) {
        clearInterval(this.timerId);
      }
    },
    clearTrackTimer() {
      if (this.trackTimerId) {
        clearInterval(this.trackTimerId);
      }
    },
    async startTimer() {
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
              this.playMusic();
            } else {
              this.pauseMusic();
            }
            this.focusing = !this.focusing;
            this.startTimer();
          }
        }
      }, 1000);
      if (this.focusing) await this.playMusic();
      await this.getCurrTrack();
    },
    async pauseTimer() {
      this.timerActive = false;
      this.clearTimer();
      this.clearTrackTimer();
      await this.pauseMusic();
    },
    async startSession() {
      // api call POST /api/adorifySession
      this.focusing = true;
      this.sessionStarted = true;
      console.log("session started");
      // console.log(await fetch(`/api/playlists/mine?offset=0`).then(async r => r.json()));
      console.log(
        await fetch(`/api/playlists/info/2E97C5dfeyPyCgTr6ntCpA`).then(
          async (r) => r.json()
        )
      );
      await fetch(
        `/api/spotify/addToQueue/spotify:track:2g0LdZQce9xlcHb1mBJyuz`,
        { method: "POST" }
      );
      // await fetch(`/api/spotify/addToQueue/spotify:playlist:2E97C5dfeyPyCgTr6ntCpA`, {method: 'POST'});

      await this.startTimer();
      // start playlist
    },
    async endSession() {
      // api call PUT /api/adorifySession/:asID
      await this.pauseTimer();
      this.timestamp = null;
      this.focusing = false;
      this.currInterval = 1;
      this.sessionStarted = false;
      console.log("session ended");
      // end timer
      // end playlist
    },
    async playPrev() {
      if (this.timerActive) {
        console.log("play prev song");
        await fetch(`/api/spotify/previous`, { method: "POST" });
        await new Promise((f) => setTimeout(f, 200));
        await this.getCurrTrack();
      }
    },
    async playNext() {
      if (this.timerActive) {
        console.log("play next song");
        await fetch(`/api/spotify/next`, { method: "POST" });
        await new Promise((f) => setTimeout(f, 200));
        await this.getCurrTrack();
      }
    },
    async togglePlay() {
      console.log("toggle timer and song");
      if (this.timerActive) {
        await this.pauseTimer();
      } else {
        await this.startTimer();
      }
    },
    async getCurrTrack() {
      this.clearTrackTimer();
      const res = await fetch(`/api/spotify/getCurrentTrack`).then(async (r) =>
        r.json()
      );
      this.currTrackTitle = res.track.item.name;
      this.currTrackArtist = res.track.item.artists
        .map((a) => a.name)
        .join(" ");
      const timeout = res.track.item.duration_ms - res.track.progress_ms;
      // const timeout = res.track.item.duration_ms - (new Date().getTime() - res.track.timestamp + res.track.progress_ms) + 1000;
      console.log(timeout);
      // console.log(res.track.item.duration_ms, new Date().getTime(), res.track.timestamp, res.track.progress_ms)
      this.trackTimerId = setTimeout(async () => {
        await this.getCurrTrack();
      }, timeout);
    },
  },
  async beforeCreate() {
    if (this.$store.state.displayName) {
      this.$store.commit("refreshLikedPlaylists");
    } else {
      this.$router.push({ name: "Login" });
    }
  },
};
</script>

<style></style>
