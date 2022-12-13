<template>
    <main class="scrollable">
        <div class="scrollable-content center">
            <div class="wh40b">{{ $store.state.displayName }},</div>
            <div class="gr24">
                <span v-if="sessionState === SessionState.BEFORE">Start a focus session</span>
                <span v-else-if="sessionState === SessionState.FOCUS">You're doing great!</span>
                <span v-else-if="sessionState === SessionState.BREAK">Take a break!</span>
                <span v-else>Study session complete!</span>
            </div>

            <div v-if="sessionState === SessionState.BEFORE" class="center" >
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

                <div class="carousel">
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
                        :options="{ arrows: false, perPage: 1, padding: '60px', speed: 100, slideFocus: true, cloneStatus: false, drag: false, }">
                        <SplideSlide :key="i" v-for="(playlist, i) in $store.state.myLikedPlaylists">
                            <HomePlaylistCard :id="i" :playlist="playlist" :isSelected="i === selectedIndex">
                            </HomePlaylistCard>
                        </SplideSlide>
                    </Splide>

                    <Splide v-else-if="$store.state.myLikedPlaylists.length === 2" @splide:active="onActive"
                        @splide:click="onClick"
                        :options="{ arrows: false, perPage: 2, padding: '60px', speed: 100, slideFocus: true, focus: 0, cloneStatus: false, drag: false, }">
                        <SplideSlide :key="i" v-for="(playlist, i) in $store.state.myLikedPlaylists">
                            <HomePlaylistCard :id="i" :playlist="playlist" :isSelected="i === selectedIndex">
                            </HomePlaylistCard>
                        </SplideSlide>
                    </Splide>

                    <Splide v-else-if="$store.state.myLikedPlaylists.length === 3" @splide:active="onActive"
                        @splide:click="onClick"
                        :options="{ arrows: false, perPage: 3, padding: '60px', speed: 100, slideFocus: true, focus: 0, cloneStatus: false, drag: false }">
                        <SplideSlide :key="i" v-for="(playlist, i) in $store.state.myLikedPlaylists">
                            <HomePlaylistCard :id="i" :playlist="playlist" :isSelected="i === selectedIndex">
                            </HomePlaylistCard>
                        </SplideSlide>
                    </Splide>

                    <Splide v-else @splide:active="onActive"
                        @splide:click="onClick"
                        :options="{ type: 'loop', rewind: true, perPage: 3, padding: '60px', speed: 100, slideFocus: true, focus: 'center', cloneStatus: false, }">
                        <SplideSlide :key="i" v-for="(playlist, i) in $store.state.myLikedPlaylists">
                            <HomePlaylistCard :id="i" :playlist="playlist" :isSelected="i === selectedIndex">
                            </HomePlaylistCard>
                        </SplideSlide>
                    </Splide>
                </div>

                <div class="bottomDiv">
                    <button @click="startSession" class="controlButton pButton" :disabled="$store.state.myLikedPlaylists.length === 0 || !submitIsValid || !$store.state.connected || $store.state.spoitfyPlayer === null">
                        <img src="../public/images/play.svg">
                    </button>
                </div>
            </div>

            <div v-else-if="sessionState !== SessionState.AFTER" class="center" >
                <div class="wh100b time">{{ getTime }}</div>
                <div class="progressbar">
                    <!-- don't add key rn as it breaks it -->
                    <div class="pbItem" v-for="i in (currInterval - 1)"></div>
                    <div class="pbItem pbActive" v-if="sessionState === SessionState.FOCUS"></div>
                    <div class="pbItem pbNotDone" v-else></div>
                    <div class="pbItem pbNotDone" v-for="i in (intervals - currInterval)"></div>
                </div>

                <button class="button" @click="endSession">
                    <span class="wh20b">End Session</span>
                </button>

                <div class="bottomDiv">
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
            </div>

            <div v-else class="center">
                <div class="gr20 topStats">
                    You completed <span class="wh20b">{{ currInterval - 1}}</span> interval<span v-if="currInterval !== 2">s</span> of <span class="wh20b">{{ focusTime }}</span> minutes each.
                </div>
                <div class="timeDisplay">
                    <span v-if="getCompletedFocusTimeHr !== '0'" class="wh100b focusTimeText">{{ getCompletedFocusTimeHr }}</span>
                    <span v-if="getCompletedFocusTimeHr !== '0'" class="gr20 hrDisplay">hr</span>
                    <span class="wh100b focusTimeText">{{ getCompletedFocusTimeMin }}</span>
                    <span class="gr20">min</span>
                </div>
                <div class="gr20 bottomStats">of focus time.</div>
                <button class="button" @click="backToHome">
                    <span class="wh20b">Back To Home</span>
                </button>
            </div>
            <div id="snackbar" class="center">{{ errorText }}</div>
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
            this.currInterval = 1;
            this.sessionState = SessionState.FOCUS;
            this.$store.state.spotifyPlayer.addListener('player_state_changed', async ({
                position,
                duration,
                track_window: { current_track }
            }) => {
                this.currTrackTitle = current_track.name;
                this.currTrackArtist = current_track.artists.map((a) => a.name).join(" ");
                console.log('pos', position)
                
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
            this.timerActive = true;
            this.timestamp =
                this.timestamp ??
                (this.sessionState === SessionState.FOCUS ? this.focusTime * 60 : this.breakTime * 60);
            this.timerId = setInterval(async () => {
                if (this.timerActive) {
                    this.timestamp--;
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
                        this.startTimer();
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
                this.errorText = "Spotify Play Error: " + res.data;
                this.displayError();
            }
        },
        async pauseMusic() {
            const res = await this.handleSpotifyResponse(this.$store.state.spotifyApi.pause({
                device_id: this.$store.state.deviceId, 
            }));
            if (!res.expected){
                this.errorText = "Spotify Pause Error: " + res.data;
                this.displayError();
            }
        },
        async playPrev() {
            const res = await this.handleSpotifyResponse(this.$store.state.spotifyApi.skipToPrevious({
                device_id: this.$store.state.deviceId, 
            }));
            if (!res.expected){
                this.errorText = "Spotify Previous Error: " + res.data;
                this.displayError();
            }
        },
        async playNext() {
            const res = await this.handleSpotifyResponse(this.$store.state.spotifyApi.skipToNext({
                device_id: this.$store.state.deviceId, 
            }));
            if (!res.expected){
                this.errorText = "Spotify Next Error: " + res.data;
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
    async beforeUnmount() {
            try {
                this.$store.commit("forceDisconnect");
            } catch (e) {
                //console.log(e);
            }
        },
    };
</script>

<style scoped>

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
    /* animation: buttonGlow 2s ease-in-out infinite alternate; */
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
    padding: 20px;
}

.time {
    margin-top: 40px;
}

/* .intervals {
    padding-top: 20px;
    padding-bottom: 10px;
} */

.progressbar {
    position: relative;
    margin-top: 10px;
    margin-bottom: 40px;
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

.carousel {
    width: 600px;
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
    margin-top: 4px;
    text-align: center;
}

.topStats {
    margin-top: 40px;
    margin-bottom: 30px;
}

.focusTimeText {
    animation: glow 2s ease-in-out infinite alternate;
    margin-right: 4px;
}

.hrDisplay {
    margin-right: 20px;
}

.bottomStats {
    margin-bottom: 60px;
}

@keyframes glow {
    from {
        text-shadow: 0 0 20px #664eff;
    }
    to {
        text-shadow: 0 0 30px #7c68ff, 0 0 10px #9281ff;
    }
}

/* @keyframes buttonGlow {
    from {
        box-shadow: 0 0 10px #664eff;
    }
    to {
        box-shadow: 0 0 20px #7c68ff, 0 0 5px #9281ff;
    }
} */

/* The snackbar - position it at the bottom and in the middle of the screen */
#snackbar {
  visibility: hidden; /* Hidden by default. Visible on click */
  min-width: 250px; 
  margin-left: -125px;
  background-color: #333; /* Black background color */
  color: #fff; /* White text color */
  text-align: center; /* Centered text */
  border-radius: 2px; /* Rounded borders */
  padding: 16px; /* Padding */
  position: fixed; /* Sit on top of the screen */
  z-index: 1; /* Add a z-index if needed */
  margin: 0 auto;
  bottom: 30px; /* 30px from the bottom */
}

/* Show the snackbar when clicking on a button (class added with JavaScript) */
#snackbar.show {
  visibility: visible; /* Show the snackbar */
  /* Add animation: Take 0.5 seconds to fade in and out the snackbar.
  However, delay the fade out process for 2.5 seconds */
  -webkit-animation: fadein 0.5s, fadeout 0.5s 2.5s;
  animation: fadein 0.5s, fadeout 0.5s 2.5s;
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
