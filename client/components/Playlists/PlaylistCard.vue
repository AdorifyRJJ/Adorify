<template>
    <div>
        Card: {{ this.playlist }}
        <button v-if="this.playlist.liked" @click="removePlaylist">
            Click to unlike
        </button>
        <button v-else @click="addPlaylist">Click to like</button>
    </div>
</template>

<script>
export default {
    name: "PlaylistCard",
    props: ["playlist"],
    methods: {
        addPlaylist() {
            // api call
            this.$store.commit("addMyLikedPlaylists", this.playlist);
        },
        removePlaylist() {
            // api call
            this.$store.commit("removeMyLikedPlaylists", this.playlist);
        },
    },
};
</script>

<style></style>
