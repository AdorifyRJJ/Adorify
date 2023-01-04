<template>
    <main class="center">
        <div class="scrollable">
            <div class="scrollable-content center mainContent">
                <div class="wh40b">{{ $store.state.displayName }},</div>
                <div class="gr24">
                    <span v-if="sessionState === SessionState.BEFORE">Start a focus session</span>
                    <span v-else-if="sessionState === SessionState.FOCUS">You're doing great!</span>
                    <span v-else-if="sessionState === SessionState.BREAK">Take a break!</span>
                    <span v-else>Study session complete!</span>
                </div>

                <div v-if="sessionState === SessionState.BEFORE" class="center">
                    <div class="selector">
                        <div class="selectorItem">
                            <div class="siNormal">
                                <div class="left gr20">Focus Time</div>
                                <div class="right gr20">
                                    <input v-model.number="focusTime" /> min
                                </div>
                            </div>
                            <div class="badInput gr12" v-if="!focusTimeIsValid">
                                Please enter a number between 0-999.
                            </div>
                        </div>
                        <div class="selectorItem">
                            <div class="siNormal">
                                <div class="left gr20">Break Time</div>
                                <div class="right gr20">
                                    <input v-model.number="breakTime" /> min
                                </div>
                            </div>
                            <div class="badInput gr12" v-if="!breakTimeIsValid">
                                Please enter a number between 0-999.
                            </div>
                        </div>
                        <div class="selectorItem">
                            <div class="siNormal">
                                <div class="left gr20">Intervals</div>
                                <div class="right gr20">
                                    <input v-model.number="intervals" /> times
                                </div>
                            </div>
                            <div class="badInput gr12" v-if="!intervalsIsValid">
                                Please enter an integer between 1-20.
                            </div>
                        </div>
                    </div>
                    
                    <div v-if="$store.state.myLikedPlaylists.length === 0" class="placeholder center">
                        <router-link to="playlists" class="placeholderInner center">
                            <img src="../public/images/add.svg">
                            <div class="gr16 placeholderText">
                                Add playlists to start session
                            </div>
                        </router-link>
                    </div>

                    <Splide v-else-if="$store.state.myLikedPlaylists.length === 1" @splide:active="onActive"
                        @splide:click="onClick"
                        :options="{ arrows: false, fixedWidth: '120px', padding: '20px', speed: 100, slideFocus: true, cloneStatus: false, drag: false, width: '160px' }">
                        <SplideSlide :key="i" v-for="(playlist, i) in $store.state.myLikedPlaylists">
                            <HomePlaylistCard :id="i" :playlist="playlist" :isSelected="i === selectedIndex">
                            </HomePlaylistCard>
                        </SplideSlide>
                    </Splide>

                    <Splide v-else-if="$store.state.myLikedPlaylists.length === 2" @splide:active="onActive"
                        @splide:click="onClick"
                        :options="{ arrows: false, fixedWidth: '120px', gap: '40px', padding: '20px', speed: 100, slideFocus: true, focus: 0, cloneStatus: false, drag: false, width: '320px' }">
                        <SplideSlide :key="i" v-for="(playlist, i) in $store.state.myLikedPlaylists">
                            <HomePlaylistCard :id="i" :playlist="playlist" :isSelected="i === selectedIndex">
                            </HomePlaylistCard>
                        </SplideSlide>
                    </Splide>

                    <Splide v-else-if="$store.state.myLikedPlaylists.length === 3" @splide:active="onActive"
                        @splide:click="onClick"
                        :options="{ arrows: false, fixedWidth: '120px', gap: '40px', padding: '20px', speed: 100, slideFocus: true, focus: 0, cloneStatus: false, drag: false, width: '480px' }">
                        <SplideSlide :key="i" v-for="(playlist, i) in $store.state.myLikedPlaylists">
                            <HomePlaylistCard :id="i" :playlist="playlist" :isSelected="i === selectedIndex">
                            </HomePlaylistCard>
                        </SplideSlide>
                    </Splide>

                    <Splide v-else @splide:active="onActive"
                        @splide:click="onClick"
                        :options="{ type: 'loop', fixedWidth: '120px', gap: '40px', padding: '20px', speed: 100, slideFocus: true, focus: 'center', cloneStatus: false, width: '600px' }">
                        <SplideSlide :key="i" v-for="(playlist, i) in $store.state.myLikedPlaylists">
                            <HomePlaylistCard :id="i" :playlist="playlist" :isSelected="i === selectedIndex">
                            </HomePlaylistCard>
                        </SplideSlide>
                    </Splide>
                </div>

                <div v-else-if="sessionState !== SessionState.AFTER" class="center" >
                    <div class="wh100b margin-t-40">{{ getTime }}</div>
                    <div class="progressbar">
                        <div class="pbItem" v-for="i in (currInterval - 1)"></div>
                        <div class="pbItem pbActive" v-if="sessionState === SessionState.FOCUS"></div>
                        <div class="pbItem pbNotDone" v-else></div>
                        <div class="pbItem pbNotDone" v-for="i in (intervals - currInterval)"></div>
                    </div>
                    <button class="button" @click="endSession">
                        <span class="wh18b">End Session</span>
                    </button>
                </div>

                <div v-else class="center">
                    <div class="gr20 margin-t-40 margin-b-30">
                        You completed <span class="wh20b">{{ currInterval - 1}}</span> interval<span v-if="currInterval !== 2">s</span> of <span class="wh20b">{{ focusTime }}</span> minutes each.
                    </div>
                    <div class="timeDisplay">
                        <span v-if="getCompletedFocusTimeHr !== '0'" class="wh100b focusTimeText">{{ getCompletedFocusTimeHr }}</span>
                        <span v-if="getCompletedFocusTimeHr !== '0'" class="gr20 margin-r-30">hr</span>
                        <span class="wh100b focusTimeText">{{ getCompletedFocusTimeMin }}</span>
                        <span class="gr20">min</span>
                    </div>
                    <div class="gr20 margin-b-60">of focus time.</div>
                    <button class="button" @click="backToHome">
                        <span class="wh18b">Back To Home</span>
                    </button>
                </div>
                <div id="snackbar" class="center">{{ errorText }}</div>
            </div>
        </div>

        <div v-if="sessionState === SessionState.BEFORE" class="bottomContent">
            <button @click="startSession" class="controlButton pButton" :disabled="$store.state.myLikedPlaylists.length === 0 || !submitIsValid || !$store.state.connected || $store.state.spoitfyPlayer === null">
                <img src="../public/images/play.svg">
            </button>
        </div>

        <div v-else-if="sessionState !== SessionState.AFTER" class="bottomContent">
            <div>
                <img src="../public/images/Spotify_Icon_RGB_White.png" height="22" width="22">
            </div>

            <div class="center trackInfo">
                <div class="wh20b">{{ currTrackTitle }}</div>
                <div class="gr20">{{ currTrackArtist }}</div>
            </div>

            <div class="controls">
                <button v-if="timerActive && sessionState !== SessionState.BREAK" @click="playPrev" class="controlButton prevButton">
                    <img src="../public/images/prev.svg">
                </button>
                <button @click="togglePlay" class="controlButton pButton" :disabled="sessionState === SessionState.BREAK">
                    <img v-if="timerActive && sessionState !== SessionState.BREAK" src="../public/images/pause.svg">
                    <img v-else src="../public/images/play.svg">
                </button>
                <button v-if="timerActive && sessionState !== SessionState.BREAK" @click="playNext" class="controlButton nextButton">
                    <img src="../public/images/forward.svg">
                </button>
            </div>
        </div>
        
        <div v-if="sessionState === SessionState.BEFORE" id="footer">
            <router-link to="/privacy" class="gr12">Privacy Policy</router-link>
            <span class="gr12">|</span>
            <span class="gr12">©2023 Adorify</span>
        </div>
    </main>
</template>

<script>
import HomePlaylistCard from "../components/Playlists/HomePlaylistCard.vue";
import { Splide, SplideSlide } from '@splidejs/vue-splide';
import '@splidejs/splide/dist/css/splide.min.css';
import {
    formatHrFromSec,
    formatMinFromSec,
    formatSecFromSec,
} from "../utils.js";

const SessionState = {
    BEFORE: 0,
    FOCUS: 1,
    BREAK: 2,
    AFTER: 3,
};

export default {
    components: { HomePlaylistCard, Splide, SplideSlide, SessionState },
    name: "HomePage",
    data() {
        return {
            sessionState: SessionState.BEFORE,
            SessionState,
            selectedIndex: null,
            focusTime: 25,
            breakTime: 5,
            intervals: 2,

            currInterval: 1,
            currTrackTitle: "",
            currTrackArtist: "",
            timerActive: false,
            timerId: null,
            timestamp: null,

            asID: null,
            errorText: "",
            
        };
    },
    computed: {
        getCompletedFocusTimeHr() {
            return formatHrFromSec(Math.round((this.currInterval - 1) * this.focusTime * 60));
        },
        getCompletedFocusTimeMin() {
            return formatMinFromSec(Math.round((this.currInterval - 1) * this.focusTime * 60));
        },
        getTime() {
            if (this.getHr)
                return this.getHr + ":" + this.getMin + ":" + this.getSec;
            return this.getMin + ":" + this.getSec;
        },
        getHr() {
            const hr = Math.round(Math.floor(this.timestamp / 60 / 60));
            if (hr === 0)
                return '';
            return hr < 10 ? `0${hr}` : `${hr}`;
        },
        getMin() {
            const min = Math.round(Math.floor((this.timestamp / 60) % 60));
            return min < 10 ? `0${min}` : `${min}`;
        },
        getSec() {
            const sec = Math.round(this.timestamp % 60);
            return sec < 10 ? `0${sec}` : `${sec}`;
        },
        focusTimeIsValid() {
            return typeof this.focusTime === 'number' && this.focusTime > 0 && this.focusTime < 999;
        },
        breakTimeIsValid() {
            return typeof this.breakTime === 'number' && this.breakTime > 0 && this.breakTime < 999;
        },
        intervalsIsValid() {
            return typeof this.intervals === 'number' && Number.isInteger(this.intervals) && this.intervals > 0 && this.intervals < 21;
        },
        submitIsValid() {
            return this.focusTimeIsValid && this.breakTimeIsValid && this.intervalsIsValid;
        }
    },
    methods: {
        async displayError() {
            const x = document.getElementById("snackbar");
            x.className = "show";
            setTimeout(function(){ 
                x.className = x.className.replace("show", "");
                this.errorText = "";
            }, 3000);
        },
        onActive(splide, slide) {
            this.selectedIndex = slide.index;
        },
        onClick(splide, slide, e) {
            splide.go(slide.index);
            this.selectedIndex = slide.index;
        },
        async startSession() {
            if (this.sessionState !== SessionState.BEFORE) return;
            this.currInterval = 1;
            this.sessionState = SessionState.FOCUS;
            this.$store.state.spotifyPlayer.addListener('player_state_changed', async ({
                position,
                duration,
                track_window: { current_track }
            }) => {
                this.currTrackTitle = current_track.name;
                this.currTrackArtist = current_track.artists.map((a) => a.name).join(", ");
                
            });
            const res = await this.handleSpotifyResponse(this.$store.state.spotifyApi.play({
                device_id: this.$store.state.deviceId, 
                context_uri: `spotify:playlist:${this.$store.state.myLikedPlaylists[this.selectedIndex].id}`,
            }));
            if (!res.expected){
                this.errorText = "Spotify Play Error: " + res.data;
                this.displayError();
            }
            await this.handleSpotifyResponse(this.$store.state.spotifyApi.setRepeat("context", {device_id: this.$store.state.deviceId}))
            const as = await fetch("/api/adorifySession/", {
                headers: { "Content-Type": "application/json" },
                method: "POST",
                body: JSON.stringify({
                    length: this.focusTime,
                    spotifyId: this.$store.state.myLikedPlaylists[this.selectedIndex].id,
                    initializedSessions: this.intervals,
                }),
            });
            this.asID = (await as.json()).asID;
            await this.startTimer();
        },
        async endSession() {
            document.title = 'Adorify';
            this.sessionState = SessionState.AFTER;
            this.timestamp = null;
            this.selectedIndex = null;
            this.$store.state.spotifyPlayer.removeListener('player_state_changed');
            await this.pauseTimer();
        },
        async togglePlay() {
            if (this.sessionState === SessionState.FOCUS) {
                this.timerActive ? await this.pauseTimer() : await this.startTimer();
            }
        },
        async startTimer() {
            if (this.timerActive) return;
            this.timerActive = true;
            this.timestamp =
                this.timestamp ??
                (this.sessionState === SessionState.FOCUS ? this.focusTime * 60 : this.breakTime * 60);
            document.title = this.getTime + " • Adorify";
            this.timerId = setInterval(async () => {
                if (this.timerActive) {
                    this.timestamp--;
                    document.title = this.getTime + " • Adorify";
                    if (this.timestamp <= 0) {
                        this.clearTimer();
                        this.timestamp = null;
                        if (this.currInterval >= this.intervals && this.sessionState === SessionState.FOCUS) {
                            this.currInterval++;
                            await fetch(`/api/adorifySession/${this.asID}`, {
                                headers: { "Content-Type": "application/json" },
                                method: "PUT",
                                body: JSON.stringify({
                                    spotifyId: this.$store.state.myLikedPlaylists[this.selectedIndex].id,
                                    completed: this.currInterval-1
                                }),
                            });
                            this.endSession();
                            return;
                        }
                        if (this.sessionState === SessionState.BREAK) {
                            this.startMusic();
                            this.sessionState = SessionState.FOCUS;
                        } 
                        else {
                            this.currInterval++;
                            this.pauseMusic();
                            this.sessionState = SessionState.BREAK;
                            await fetch(`/api/adorifySession/${this.asID}`, {
                                headers: { "Content-Type": "application/json" },
                                method: "PUT",
                                body: JSON.stringify({
                                    spotifyId: this.$store.state.myLikedPlaylists[this.selectedIndex].id,
                                    completed: this.currInterval-1
                                }),
                            });
                        }
                        this.timerActive = false;
                        await this.startTimer();
                    }
                }
            }, 1000);
            if (this.sessionState === SessionState.FOCUS){
                await this.startMusic();
            }
        },
        async pauseTimer() {
            this.timerActive = false;
            this.clearTimer();
            await this.pauseMusic();
        },
        clearTimer() {
            if (this.timerId)
                clearInterval(this.timerId);
        },
        async startMusic() {
            const res = await this.handleSpotifyResponse(this.$store.state.spotifyApi.play({
                device_id: this.$store.state.deviceId, 
            }));
            if (!res.expected){
                // this.errorText = "Spotify Play Error: " + res.data;
                this.errorText = "Spotify Play Error";
                this.displayError();
            }
        },
        async pauseMusic() {
            const res = await this.handleSpotifyResponse(this.$store.state.spotifyApi.pause({
                device_id: this.$store.state.deviceId, 
            }));
            if (!res.expected){
                // this.errorText = "Spotify Pause Error: " + res.data;
                this.errorText = "Spotify Pause Error";
                this.displayError();
            }
        },
        async playPrev() {
            const res = await this.handleSpotifyResponse(this.$store.state.spotifyApi.skipToPrevious({
                device_id: this.$store.state.deviceId, 
            }));
            if (!res.expected){
                this.errorText = "Spotify Previous Error: " + res.data;
                this.errorText = "Spotify Previous Error";
                this.displayError();
            }
        },
        async playNext() {
            const res = await this.handleSpotifyResponse(this.$store.state.spotifyApi.skipToNext({
                device_id: this.$store.state.deviceId, 
            }));
            if (!res.expected){
                // this.errorText = "Spotify Next Error: " + res.data;
                this.errorText = "Spotify Next Error";
                this.displayError();
            }
        },
        async backToHome() {
            this.sessionState = SessionState.BEFORE;
        }
    },
    async mounted() {
        if (!this.$store.state.displayName) {
            this.$router.push({ name: "Login" });
        }
        if (this.$store.state.spotifyPlayer) {
            try {
                this.$store.state.spotifyPlayer.connect();
            } catch (e) {
                //console.log(e);
            }
        }
    },
    // async beforeUnmount() {
    //     console.log('unmounting')
    //     try {
    //         this.$store.commit("forceDisconnect");
    //     } catch (e) {
    //         //console.log(e);
    //     }
    // },
    async beforeRouteLeave(to, from, next) {
        if (this.sessionState === SessionState.FOCUS || this.sessionState === SessionState.BREAK)
            // await this.endSession();
            document.title = 'Adorify';
            this.clearTimer();
        try {
            this.$store.commit("forceDisconnect");
        } catch (e) {
            console.log(e);
        }
        next();
    } 
};
</script>

<style scoped>

main {
    height: 100%;
}

.bottomContent {
    padding: 20px 0px;

    display: flex;
    flex-direction: column;
    align-items: center;
}

/** Selectors */

.selector {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-top: 30px;
    margin-bottom: 20px;
}

.selectorItem {
    width: 360px;
    padding: 10px 20px;
    background-color: #373544;
    border-radius: 25px;
}

.siNormal {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.badInput {
    margin-top: 4px;
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
    padding: 0px 6px;
}

/** Bottom Controls */

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

.pButton:disabled {
    filter: grayscale(80%);
}

.trackInfo {
    padding: 6px 20px 20px 20px;
}

/** Carousel */

/* .carousel {
    display: flex;
    justify-content: center;
} */

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
    background-color: #333243;
}

.placeholderText {
    margin-top: 4px;
    text-align: center;
}

/** Progress bar */

.progressbar {
    position: relative;
    margin: 10px 3px 40px 3px;
}

.pbItem:first-child {
    margin-left: 0;
}

.pbItem:first-child:after {
    content: none;
}

.pbItem {
    float: left;
    position: relative;
    height: 16px;
    width: 16px;
    border-radius: 8px;
    background-color: #664EFF;
    margin-left: 20px;
}

.pbItem:after {
    content: '';
    position: absolute;
    height: 1px;
    width: 20px;
    background: #664EFF;
    top: 8px;
    left: -20px;
}

.pbNotDone {
    background-color: #373544;
}

.pbNotDone:after {
    background: #373544;
}

.pbActive {
    background-color: transparent;
    outline: 3px solid #664EFF;
    z-index: 1;
}

/** End screen */

.focusTimeText {
    animation: glow 2s ease-in-out infinite alternate;
    margin-right: 4px;
}

@keyframes glow {
    from {
        text-shadow: 0 0 20px #664eff;
    }
    to {
        text-shadow: 0 0 30px #7c68ff, 0 0 10px #9281ff;
    }
}

/* Animations to fade the snackbar in and out */
@-webkit-keyframes fadein {
  from {bottom: 0; opacity: 0;}
  to {bottom: 30px; opacity: 1;}
}

@keyframes fadein {
  from {bottom: 0; opacity: 0;}
  to {bottom: 30px; opacity: 1;}
}

@-webkit-keyframes fadeout {
  from {bottom: 30px; opacity: 1;}
  to {bottom: 0; opacity: 0;}
}

@keyframes fadeout {
  from {bottom: 30px; opacity: 1;}
  to {bottom: 0; opacity: 0;}
}
</style>
