<template>
    <div>
        <h3>Liked</h3>
        <div v-if="$store.state.myLikedPlaylists.length">
            <div
                :key="playlist.id"
                v-for="playlist in $store.state.myLikedPlaylists"
            >
                {{ playlist.playlistName }}
            </div>
        </div>
        <div v-else>Like to add playlists!</div>
    </div>
</template>

<script>
import { myLikedPlaylists } from "../dummyData.js";
export default {
    name: "MyLikedPlaylists",
    mounted() {
        //api call
        this.$store.commit("setMyLikedPlaylists", myLikedPlaylists);
    },
};
</script>

<style></style>
