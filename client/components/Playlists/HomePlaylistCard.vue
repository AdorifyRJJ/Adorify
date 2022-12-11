<template>
    <div
        :class="{ selected: isSelected, unselected: !isSelected }"
        class="card center"
    >
        <img :src="image" height="120" width="120" />
        <div class="playlistInfo center">
            <div class="wh16b trunc">{{ playlistName }}</div>
            <div class="gr16 trunc">{{ owner }}</div>
        </div>
    </div>
</template>

<script>
export default {
    name: "HomePlaylistCard",
    props: ["playlist", "isSelected"],
    computed: {
        image() {
            return this.playlist.image;
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

.card > img {
    border-radius: 6px;
    object-fit: cover;
}

.playlistInfo {
    margin-top: 12px;
    gap: 2px;
}

.trunc {
    max-width: 150px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.selected > img {
    filter: drop-shadow(0px 0px 10px rgba(255, 255, 255, 0.75));
}

.unselected {
    filter: brightness(40%);
}
</style>
