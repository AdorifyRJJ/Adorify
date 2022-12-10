<template>
    <main class="center">
        <div class="wh50b">{{ $store.state.displayName }},</div>
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

            <div class="carousel">
                <div v-if="$store.state.myLikedPlaylists.length === 0" class="placeholder center">
                    <router-link to="playlists" class="placeholderInner center">
                        <img src="../public/add.svg">
                        <div class="gr16 placeholderText">
                            Add playlists to start session
                        </div>
                    </router-link>
                </div>

                <Splide v-else-if="$store.state.myLikedPlaylists.length === 1" @splide:active="onActive"
                    @splide:click="onClick"
                    :options="{ arrows: false, perPage: 1, padding: '40px', speed: 100, slideFocus: true, cloneStatus: false, drag: false, }">
                    <SplideSlide :key="i" v-for="(playlist, i) in $store.state.myLikedPlaylists">
                        <HomePlaylistCard :id="i" :playlist="playlist" :isSelected="i === selectedIndex">
                        </HomePlaylistCard>
                    </SplideSlide>
                </Splide>

                <Splide v-else-if="$store.state.myLikedPlaylists.length === 2" @splide:active="onActive"
                    @splide:click="onClick"
                    :options="{ arrows: false, perPage: 2, padding: '40px', speed: 100, slideFocus: true, focus: 0, cloneStatus: false, drag: false, }">
                    <SplideSlide :key="i" v-for="(playlist, i) in $store.state.myLikedPlaylists">
                        <HomePlaylistCard :id="i" :playlist="playlist" :isSelected="i === selectedIndex">
                        </HomePlaylistCard>
                    </SplideSlide>
                </Splide>

                <Splide v-else-if="$store.state.myLikedPlaylists.length === 3" @splide:active="onActive"
                    @splide:click="onClick"
                    :options="{ arrows: false, perPage: 3, padding: '40px', speed: 100, slideFocus: true, focus: 0, cloneStatus: false, drag: false, }">
                    <SplideSlide :key="i" v-for="(playlist, i) in $store.state.myLikedPlaylists">
                        <HomePlaylistCard :id="i" :playlist="playlist" :isSelected="i === selectedIndex">
                        </HomePlaylistCard>
                    </SplideSlide>
                </Splide>

                <Splide v-else @splide:active="onActive"
                    :options="{ type: 'loop', rewind: true, perPage: 3, padding: '40px', speed: 100, slideFocus: true, focus: 'center', cloneStatus: false, }">
                    <SplideSlide :key="i" v-for="(playlist, i) in $store.state.myLikedPlaylists">
                        <HomePlaylistCard :id="i" :playlist="playlist" :isSelected="i === selectedIndex">
                        </HomePlaylistCard>
                    </SplideSlide>
                    <!-- <SplideSlide>
                        <div class="placeholder center">
                            <div class="placeholderInner center">
                                <img src="../public/play.svg">
                                <div class="placeholderText">
                                    Like playlists to start session.
                                </div>
                            </div>
                        </div>
                    </SplideSlide> -->
                </Splide>
            </div>

            <div class="bottomDiv">
                <button @click="startSession" class="controlButton pButton">
                    <img src="../public/play.svg">
                </button>
            </div>
        </div>
        <div class="center" v-else>
            <div class="wh100b time">{{ getTime }}</div>
            <div class="wh20b intervals">{{ currInterval }} / {{ intervals }}</div>
            <button class="button" @click="endSession">
                <span class="wh20b">End Session</span>
            </button>

            <div class="bottomDiv">
                <div class="center trackInfo">
                    <div class="wh20b">{{ currTrackTitle }}</div>
                    <div class="gr20">{{ currTrackArtist }}</div>
                </div>

                <div class="controls">
                    <button v-if="timerActive" @click="playPrev" class="controlButton prevButton">
                        <img src="../public/prev.svg">
                    </button>
                    <button @click="togglePlay" class="controlButton pButton">
                        <img v-if="timerActive" src="../public/pause.svg">
                        <img v-else src="../public/play.svg">
                    </button>
                    <button v-if="timerActive" @click="playNext" class="controlButton nextButton">
                        <img src="../public/forward.svg">
                    </button>
                </div>
            </div>
        </div>
    </main>
</template>

<script>
import HomePlaylistCard from "../components/Playlists/HomePlaylistCard.vue";
import { Splide, SplideSlide } from '@splidejs/vue-splide';
import '@splidejs/splide/dist/css/splide.min.css';

export default {
    components: { HomePlaylistCard, Splide, SplideSlide },
    name: "HomePage",
    data() {
        return {
            // player: undefined,
            // player_device_id: undefined,
            playing: false,
            focusTime: 25,
            breakTime: 5,
            intervals: 2,
            selectedIndex: null,
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
                    `/api/spotify/addToQueue/spotify:track:${this.playlistTracks[this.playlistIndex]
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
            if (this.currInterval >= this.intervals) {
                this.endSession();
                return;
            }
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
        onActive(splide, slide) {
            this.selectedIndex = slide.index;
            console.log(this.selectedIndex);
        },
        onClick(splide, slide, e) {
            splide.go(slide.index);
            this.selectedIndex = slide.index;
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
                `/api/spotify/addToQueue/spotify:track:${this.playlistTracks[this.playlistIndex % this.playlistLimit]
                }`,
                { method: "POST" }
            );
        },
        async getPlaylistTracks() {
            console.log("getting more tracks");
            const offset =
                this.playlistIndex >= this.totalPlaylistTracks ? 0 : this.playlistIndex;
            const res = await fetch(
                `/api/playlists/info/${this.selectedPlaylistId}/tracks?offset=${offset}`
            ).then(async (r) => r.json());
            this.playlistTracks = res.tracks.items.map((r) => r.track.id);
            this.playlistIndex = offset;
            this.totalPlaylistTracks = res.tracks.total;
            this.playlistLimit = res.tracks.limit;
        },
    },
    async mounted() {
        if (!this.$store.state.displayName) {
            this.$router.push({ name: "Login" });
        }
        if (this.$store.state.spotifyPlayer) {
            try {
                this.$store.state.spotifyPlayer.connect();
            } catch (e) {
                console.log(e);
            }
        }
    },
    async beforeUnmount() {
            try {
                this.$store.commit("forceDisconnect");
            } catch (e) {
                console.log(e);
            }
        },
    };
</script>

<style scoped>

.selector {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding-top: 30px;
    padding-bottom: 20px;
}

.selectorItem {
    height: 60px;
    width: 360px;
    padding: 0px 20px;
    background-color: #373544;
    border-radius: 25px;

    display: flex;
    justify-content: space-between;
    align-items: center;
}

.right {
    width: 140px;
}

.right>input {
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
    align-items: center;
}

.controlButton {
    height: 80px;
    width: 80px;
    border-radius: 40px;
    border-width: 0;
}

.pButton {
    background-color: #664eff;
    filter: drop-shadow(0px 0px 10px #664eff);
}

.prevButton {
    margin-right: 20px;
    background-color: transparent;
}

.nextButton {
    margin-left: 20px;
    background-color: transparent;
}

.pButton:hover {
    filter: drop-shadow(0px 0px 10px #664eff) brightness(80%);
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

.time {
    padding-top: 40px;
}

.intervals {
    padding-top: 20px;
    padding-bottom: 10px;
}

.carousel {
    width: 540px;
}

.placeholder {
    padding: 20px 0;
}

.placeholderInner {
    height: 166.4px;
    width: 120px;
    border: 2px dashed white;
    border-radius: 6px;
    padding: 10px;

    justify-content: center;
}

.placeholderInner:hover {
    /* filter: brightness(70%); */
    background-color: #333243;
}

.placeholderText {
    padding-top: 4px;
    text-align: center;
}
</style>
