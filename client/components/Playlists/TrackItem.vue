<template>
    <div class="item">
        <img :src="this.track.album.images[0]?.url" height="40" width="40" />
        <div class="content">
            <div>
                <div class="wh16b">{{ this.track.name }}</div>
                <div class="gr16">
                    {{ this.track.artists.map((artist) => artist.name) }}
                </div>
            </div>
            <div class="gr16">{{ this.track.album.name }}</div>
            <div class="gr16">{{ this.track.duration_ms }}</div>
        </div>
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
    outline: auto;
    display: flex;
    height: 40px;
    align-items: center;
    /* justify-content: space-between; */
}

.content {
    display: flex;
    justify-content: space-between;
}
</style>
