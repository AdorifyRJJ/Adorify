<template>
    <div v-if="isSelected" class="card center selected" @click="$emit('select', spotifyId)">
        <img :src="image" height="120" width="120" />
        <div class="playlistInfo center">
            <div class="wh16b">{{ playlistName }}</div>
            <div class="gr16">{{ owner }}</div>
        </div>
    </div>
    <div v-else class="card center" @click="$emit('select', spotifyId)">
        <img :src="image" height="120" width="120" />
        <div class="playlistInfo center">
            <div class="wh16b">{{ playlistName }}</div>
            <div class="gr16">{{ owner }}</div>
        </div>
    </div>
</template>

<script>
export default {
    name: "HomePlaylistCard",
    props: ["playlist", "isSelected"],
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
.card {
    padding: 20px 0px;
}
.playlistInfo {
    margin-top: 8px;
    
}

.selected {
    filter: drop-shadow(0px 0px 10px rgba(255,255,255,0.75));
}
</style>
