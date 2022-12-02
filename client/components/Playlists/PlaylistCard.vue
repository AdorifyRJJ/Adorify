<template>
    <div>
        Card: {{ this.playlist }}
        <button
            v-if="this.playlist.liked"
            @click="$emit('unlikePlaylist', playlist.playlistName)"
        >
            Click to unlike
        </button>
        <button v-else @click="$emit('likePlaylist', playlist.playlistName)">
            Click to like
        </button>
    </div>
</template>

<script>
export default {
    name: "PlaylistCard",
    props: ["playlist"],
};
</script>

<style></style>
