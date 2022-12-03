<template>
    <div>
        <button v-if="this.playlist.liked" @click="removePlaylist">
            Click to unlike
        </button>
        <button v-else @click="addPlaylist">Click to like</button>
    </div>
</template>

<script>
export default {
    name: "LikeButton",
    props: ["playlist"],
    methods: {
        addPlaylist() {
            // api call PUT /api/playlists/:spotifyId
            this.$store.commit("addMyLikedPlaylists", this.playlist);
        },
        removePlaylist() {
            // api call PUT /api/playlists/:spotifyId
            this.$store.commit("removeMyLikedPlaylists", this.playlist);
        },
    },
};
</script>

<style></style>
