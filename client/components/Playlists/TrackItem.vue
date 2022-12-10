<template>
    <div class="item">
        <img :src="this.track.album.images[0].url" height="100" width="100" />
        <div>
            <div>{{ this.track.name }}</div>
            <div>{{ this.track.artists.map((artist) => artist.name) }}</div>
        </div>
        <div>{{ this.track.album.name }}</div>
        <div>{{ this.track.duration_ms }}</div>
    </div>
</template>

<script>
export default {
    name: "TrackItem",
    props: ["track"],
};
</script>

<style scoped>
.item {
    display: flex;
    align-items: center;
    justify-content: space-between;
}
</style>
