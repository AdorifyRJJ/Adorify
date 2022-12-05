<template>
    <main class="center">
        <!-- <div>
      <p v-if="!this.$store.state.connected">
        Device is not ready, so music playback will not work. Either wait for
        connection or please log in. (Click "Profile" -> "Logout" -> "Login")
      </p>
      <p v-else>Device ready!</p>
    </div>
    <div>
      <p v-if="!playing">Not playing music.</p>
      <p v-else>Playing music! Turn it up!</p>
    </div> -->

        <!-- fetch username -->
        <div class="wh50b">{{ this.$store.state.displayName }},</div>
        <div class="gr30">
            <span v-if="!sessionStarted">Start a focus session</span>
            <span v-else-if="focusing">You're doing great!</span>
            <span v-else>Take a break!</span>
        </div>

        <div class="center" v-if="!sessionStarted">
            <div class="selector">
                <div class="selectorItem">
                    <div class="left gr20">Focus Time</div>
                    <div class="right gr20">
                        <input v-model="focusTime" /> min
                    </div>
                </div>
                <div class="selectorItem">
                    <div class="left gr20">Break Time</div>
                    <div class="right gr20">
                        <input v-model="breakTime" /> min
                    </div>
                </div>
                <div class="selectorItem">
                    <div class="left gr20">Intervals</div>
                    <div class="right gr20">
                        <input v-model="intervals" /> times
                    </div>
                </div>
            </div>
            <HomePlaylistCard
                :key="i"
                v-for="(playlist, i) in this.$store.state.myLikedPlaylists"
                :playlist="playlist"
                @select="toggleSelected"
            ></HomePlaylistCard>
            <div class="bottomDiv">
                <button @click="startSession" class="pButton">
                    <img src="../public/play.svg" />
                </button>
            </div>
        </div>
        <div class="center" v-else>
            <div class="wh100b">{{ this.getTime }}</div>
            <div>{{ this.currInterval }} / {{ this.intervals }}</div>
            <button class="button" @click="endSession">
                <span class="wh20b">End Session</span>
            </button>
            <div class="bottomDiv">
                <div class="center trackInfo">
                    <div class="wh20b">{{ this.currTrackTitle }}</div>
                    <div class="gr20">{{ this.currTrackArtist }}</div>
                </div>
                <div class="controls">
                    <button
                        v-if="timerActive"
                        @click="playPrev"
                        class="prevButton"
                    >
                        <img src="../public/prev.svg" />
                    </button>
                    <button @click="togglePlay" class="pButton">
                        <img v-if="timerActive" src="../public/pause.svg" />
                        <img v-else src="../public/play.svg" />
                    </button>
                    <button
                        v-if="timerActive"
                        @click="playNext"
                        class="nextButton"
                    >
                        <img src="../public/forward.svg" />
                    </button>
                </div>
            </div>
        </div>
    </main>
</template>

<script>
import HomePlaylistCard from "../components/Playlists/HomePlaylistCard.vue";

export default {
    components: { HomePlaylistCard },
    name: "HomePage",
    data() {
        return {
            // player: undefined,
            // player_device_id: undefined,
            playing: false,
            focusTime: 25,
            breakTime: 5,
            intervals: 2,
            selectedPlaylistId: null,
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
            totalPlaylistTracks: 1,
            playlistIndex: 0,
            playlistLimit: 100,
        };
    },
    computed: {
        getTime() {
            return this.getMin + ":" + this.getSec;
        },
        getMin() {
            const min = Math.round(Math.floor(this.timestamp / 60));
            return min < 10 ? `0${min}` : `${min}`;
        },
        getSec() {
            const sec = Math.round(this.timestamp % 60);
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
                // console.log('cleared')
                clearTimeout(this.trackTimerId);
                // console.log(this.trackTimerId)
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
            if (this.selectedPlaylistId && this.$store.state.connected) {
                this.focusing = true;
                this.sessionStarted = true;
                this.playlistIndex = 0;
                console.log("session started");
                // console.log(await fetch(`/api/playlists/mine?offset=0`).then(async r => r.json()));
                // console.log(await fetch(`/api/playlists/info/2E97C5dfeyPyCgTr6ntCpA`).then(async r=> r.json()))
                // await fetch(`/api/spotify/skipQueue`, {method: 'POST'});
                await this.getPlaylistTracks();
                await fetch(
                    `/api/spotify/addToQueue/spotify:track:${
                        this.playlistTracks[this.playlistIndex]
                    }`,
                    { method: "POST" }
                );
                await fetch(`/api/spotify/next`, { method: "POST" });
                // await fetch(`/api/spotify/addToQueue/spotify:playlist:2E97C5dfeyPyCgTr6ntCpA`, {method: 'POST'});

                await this.startTimer();
            }
        },
        async endSession() {
            // api call PUT /api/adorifySession/:asID
            await this.pauseTimer();
            this.timestamp = null;
            this.focusing = false;
            this.currInterval = 1;
            this.sessionStarted = false;
            this.selected = null;
            console.log("session ended");
            // end timer
            // end playlist
        },
        async playPrev() {
            if (this.timerActive) {
                console.log("play prev song");
                await fetch(`/api/spotify/previous`, { method: "POST" });
                await new Promise((f) => setTimeout(f, 500));
                await this.getCurrTrack();
            }
        },
        async playNext() {
            if (this.timerActive) {
                console.log("play next song");
                await this.addNextTrackToQueue();
                await new Promise((f) => setTimeout(f, 200));
                await fetch(`/api/spotify/next`, { method: "POST" });
                await new Promise((f) => setTimeout(f, 500));
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
        toggleSelected(spotifyId) {
            console.log("re");
            this.selectedPlaylistId = spotifyId;
            console.log(this.selectedPlaylistId);
        },
        async getCurrTrack() {
            this.clearTrackTimer();
            const res = await fetch(`/api/spotify/getCurrentTrack`).then(
                async (r) => r.json()
            );
            this.currTrackTitle = res.track.item.name;
            this.currTrackArtist = res.track.item.artists
                .map((a) => a.name)
                .join(" ");
            const timeout = res.track.item.duration_ms - res.track.progress_ms;
            console.log(timeout);
            // const timeout = res.track.item.duration_ms - (new Date().getTime() - res.track.timestamp + res.track.progress_ms) + 1000;
            // console.log(res.track.item.duration_ms, new Date().getTime(), res.track.timestamp, res.track.progress_ms)
            if (timeout > 5000) {
                this.clearTrackTimer();
                this.trackTimerId = setTimeout(async () => {
                    await this.addNextTrackToQueue();
                    await new Promise((f) => setTimeout(f, 500));
                    await this.getCurrTrack();
                }, timeout - 500);
            } else {
                this.clearTrackTimer();
                this.trackTimerId = setTimeout(async () => {
                    await this.getCurrTrack();
                }, timeout);
            }
        },
        async addNextTrackToQueue() {
            console.log(
                this.playlistIndex + 1,
                this.playlistTracks.length,
                this.playlistLimit
            );
            this.playlistIndex++;
            if (
                this.playlistIndex % this.playlistLimit === 0 ||
                this.playlistIndex >= this.totalPlaylistTracks
            )
                await this.getPlaylistTracks();
            await fetch(
                `/api/spotify/addToQueue/spotify:track:${
                    this.playlistTracks[this.playlistIndex % this.playlistLimit]
                }`,
                { method: "POST" }
            );
        },
        async getPlaylistTracks() {
            console.log("getting more tracks");
            const offset =
                this.playlistIndex >= this.totalPlaylistTracks
                    ? 0
                    : this.playlistIndex;
            const res = await fetch(
                `/api/playlists/info/${this.selectedPlaylistId}/tracks?offset=${offset}`
            ).then(async (r) => r.json());
            this.playlistTracks = res.tracks.items.map((r) => r.track.id);
            this.playlistIndex = offset;
            this.totalPlaylistTracks = res.tracks.total;
            this.playlistLimit = res.tracks.limit;
        },
    },
    async beforeCreate() {
        if (this.$store.state.displayName) {
            // this.$store.commit("refreshLikedPlaylists");
            this.$store.commit("scheduleRefresh");
        } else {
            this.$router.push({ name: "Login" });
        }
    },
};
</script>

<style scoped>
main {
    justify-content: center;
}

.selector {
    display: grid;
    gap: 8px;
    padding-top: 10%;
    padding-bottom: 10%;
}

.selectorItem {
    height: 60px;
    width: 360px;
    /* padding: 15px; */
    padding: 0px 20px;
    background-color: #373544;
    border-radius: 25px;

    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
}

.right {
    width: 140px;
}

.right > input {
    height: 36px;
    width: 80px;
    background-color: #1f1b2e;
    border-radius: 5px;
    text-align: right;
    color: #ffffff;
    font-size: 20px;
    border-style: none;
    padding: 0px 4px;
}

.bottomDiv {
    width: 100vw;
    position: fixed;
    bottom: 0;
    padding: 20px 0px;

    display: flex;
    flex-direction: column;
    align-items: center;
}

.controls {
    display: flex;
    flex-direction: row;
    align-items: center;
}

.pButton {
    height: 80px;
    width: 80px;
    border-radius: 40px;
    border-width: 0;
    background-color: #664eff;
    filter: drop-shadow(0px 0px 10px #664eff);
}

.prevButton {
    height: 80px;
    width: 80px;
    margin-right: 20px;
    border-radius: 40px;
    border-width: 0;
    background-color: transparent;
}

.nextButton {
    height: 80px;
    width: 80px;
    margin-left: 20px;
    border-radius: 40px;
    border-width: 0;
    background-color: transparent;
}

.pButton:hover > img {
    filter: brightness(0) saturate(100%) invert(94%) sepia(1%) saturate(41%)
        hue-rotate(314deg) brightness(91%) contrast(101%);
}

.pButton:hover {
    background-color: #5742d0;
}

.prevButton:hover {
    background-color: #3f3b4c;
}

.nextButton:hover {
    background-color: #3f3b4c;
}

.trackInfo {
    padding: 20px;
}
</style>
