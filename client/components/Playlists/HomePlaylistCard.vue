<template>
    <div class="card center" @click="$emit('select', spotifyId)">
        <img :src="image" height="120" width="120" />
        <div class="wh16b">{{ playlistName }}</div>
        <div class="gr16">{{ owner }}</div>
    </div>
</template>

<script>
export default {
    name: "HomePlaylistCard",
    props: ["playlist"],
    computed: {
        image() {
            return this.playlist.image.url;
        },
        playlistName() {
            return this.playlist.name;
        },
        owner() {
            return this.playlist.owner;
        },
        spotifyId() {
            return this.playlist.id;
        },
    },
};
</script>

<style scoped>
.card {}
</style>
