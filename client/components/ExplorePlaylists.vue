<template>
    <div>
        <h3>Find playlists</h3>
        <div>
            <button @click="getMyPlaylists">My Spotify Library</button>
            <button @click="getPublicPlaylists">Public Library</button>
        </div>
        <PlaylistCard
            :key="i"
            v-for="(playlist, i) in playlists"
            :playlist="playlist"
        ></PlaylistCard>
    </div>
</template>

<script>
import { mySpotifyPlaylists, publicPlaylists } from "../dummyData.js";
import PlaylistCard from "../components/Playlists/PlaylistCard.vue";
export default {
    components: { PlaylistCard },
    name: "ExplorePlaylists",
    data() {
        return {
            playlists: publicPlaylists,
        };
    },
    methods: {
        getMyPlaylists() {
            // api call GET /api/playlists/mine?offset=
            this.playlists = mySpotifyPlaylists;
        },
        getPublicPlaylists() {
            // api calls
            // GET /api/playlists/mostLikes?offset=
            // GET /api/playlists/mostUsed?offset=
            // GET /api/playlists/mostProductive?offset=
            this.playlists = publicPlaylists;
        },
    },
    mounted() {
        this.$store.commit("setMySpotifyPlaylists", mySpotifyPlaylists);
        this.$store.commit("setPublicPlaylists", publicPlaylists);
    },
};
</script>

<style></style>
