<template>
    <div>
        <div @click="$emit('select', spotifyId)">
            <img :src="image" height="100" width="100" />
            <div>playlist name: {{ playlistName }}</div>
            <div>owner: {{ owner }}</div>
            <div>id: {{ spotifyId }}</div>
        </div>
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
            return this.playlist.owner.display_name;
        },
        spotifyId() {
            return this.playlist.id;
        },
    },
};
</script>

<style></style>
