<template>
    <div>
        <img :src="this.track.album.images[0].url" height="100" width="100" />
        <div>{{ this.track.name }}</div>
        <div>{{ this.track.album.name }}</div>
        <div>{{ this.track.artists.map((artist) => artist.name) }}</div>
        <div>{{ this.track.duration_ms }}</div>
    </div>
</template>

<script>
export default {
    name: "TrackItem",
    props: ["track"],
};
</script>

<style></style>
