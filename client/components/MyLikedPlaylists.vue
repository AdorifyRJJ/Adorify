<template>
    <div>
        <h3>Liked</h3>
        <p>isjf{{ myLikedPlaylists }}</p>
        <div v-if="myLikedPlaylists">
            <div :key="playlist.id" v-for="playlist in myLikedPlaylists">
                {{ playlist.playlistName }}
            </div>
        </div>
        <div v-else>Like to add playlists!</div>
    </div>
</template>

<script>
// import { myLikedPlaylists } from "../dummyData.js";
export default {
    name: "MyLikedPlaylists",
    computed: {
        myLikedPlaylists() {
            return $store.state.myLikedPlaylists;
        },
    },
};
</script>

<style></style>
