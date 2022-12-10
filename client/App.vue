<template>
    <div id="app">
        <header v-if="$store.state.displayName">
            <NavBar />
        </header>
        <router-view />
    </div>
</template>

<script>
import NavBar from "@/components/common/NavBar.vue";

export default {
    name: "App",
    components: { NavBar },
    async beforeCreate() {
        //this.$store.commit('setSpotifyPlayer', null)
        //this.$store.commit('setDeviceId', null)
        //this.$store.commit('setConnected', false)
        const myData = await fetch("/api/spotify/getMe");
        if (myData.ok) {
            const myDataJson = await myData.json();
            this.$store.commit("setDisplayName", myDataJson.display_name);
            this.$store.commit("scheduleRefresh");
            this.$store.commit("refreshLikedPlaylists");

            const script = document.createElement("script");

            script.src = "https://sdk.scdn.co/spotify-player.js";
            script.async = true;
            document.body.appendChild(script);

            window.onSpotifyWebPlaybackSDKReady = async () => {
                const player = await new window.Spotify.Player({
                    name: "Web Playback SDK",
                    getOAuthToken: async (cb) => {
                        cb(
                            (
                                await (
                                    await fetch(`/api/spotify/getAccessToken`)
                                ).json()
                            ).token
                        );
                    },
                    volume: 0.5,
                });

                player.addListener("ready", async ({ device_id }) => {
                    console.log("Ready with Device ID", device_id);
                    await fetch(`/api/spotify/transfer?deviceId=${device_id}`);
                    await fetch(`/api/spotify/pause?deviceId=${device_id}`);
                    this.$store.commit("setSpotifyPlayer", player);
                    this.$store.commit("setDeviceId", device_id);
                    this.$store.commit("setConnected", true);
                });

                player.addListener("not_ready", ({ device_id }) => {
                    console.log("Device ID has gone offline", device_id);
                    this.$store.commit("setConnected", false);
                });

                player.connect();
            };
        }
    },
};
</script>

<style>
li {
    display: block;
}

@font-face {
    font-family: "AdorifyF";
    src: url("./public/fonts/AdorifyF/AvenirNextLTPro-Regular.otf");
    font-weight: normal;
    font-style: normal;
}

@font-face {
    font-family: "AdorifyF";
    src: url("./public/fonts/AdorifyF/AvenirNextLTPro-Medium.otf");
    font-weight: medium;
    font-style: normal;
}

@font-face {
    font-family: "AdorifyF";
    src: url("./public/fonts/AdorifyF/AvenirNextLTPro-Bold.otf");
    font-weight: bold;
    font-style: normal;
}

* {
    box-sizing: border-box;
    font-family: "AdorifyF";
}

#app {
    color: white;
    background: #1f1b2e;
    width: 100vw;
    height: 100vh;
}

::-webkit-scrollbar {
    width: 0; /* Remove scrollbar space */
    background: transparent; /* Optional: just make scrollbar invisible */
}

body {
    height: 100vh;
    flex-direction: column;
    display: flex;
    padding: 0;
    margin: 0;
    font-size: 1.2em;
}

main {
    padding: 0 5em 5em;
}

.wh16b {
    color: #ffffff;
    font-size: 16px;
    font-weight: bold;
}

.wh20b {
    color: #ffffff;
    font-size: 20px;
    font-weight: bold;
}

.wh40b {
    color: #ffffff;
    font-size: 40px;
    font-weight: bold;
}

.wh50b {
    color: #ffffff;
    font-size: 50px;
    font-weight: bold;
}

.wh100b {
    color: #ffffff;
    font-size: 100px;
    font-weight: bold;
}

.wh20n {
    color: #ffffff;
    font-size: 20px;
    font-weight: normal;
}

.wh40n {
    color: #ffffff;
    font-size: 40px;
    font-weight: normal;
}

.gr16 {
    color: #a9a9a9;
    font-size: 16px;
}

.gr20 {
    color: #a9a9a9;
    font-size: 20px;
}

.gr30 {
    color: #a9a9a9;
    font-size: 30px;
}

.center {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.button {
    color: #ffffff;
    background-color: #6c4eb3;
    height: 50px;
    border-radius: 20px;
    border-width: 0;
    padding: 0px 30px;
}

.button:hover {
    background-color: #5a4193;
}

.dimButton {
    color: #ffffff;
    background-color: #373544;
    height: 50px;
    border-radius: 0px;
    border-width: 0;
    /* border-right: 10px, solid, #6c4eb3; */
    padding: 0px 30px;
}
.btn-group {
    margin: 18px 0;
}

.btn-group > .dimButton {
    border-right: 2px solid #6c4eb3;
}
.btn-group > *:last-child {
    border-radius: 0 20px 20px 0;
    border-right: 0;
}

.btn-group > *:first-child {
    border-radius: 20px 0 0 20px;
}

.truncate1line {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.truncate2lines {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}

a:link {
    text-decoration: none;
}

a:visited {
    text-decoration: none;
}
</style>
