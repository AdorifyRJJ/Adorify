<template>
    <div class="item">
        <img
            :src="this.track.album.images[0]?.url"
            class="image"
            height="48"
            width="48"
        />
        <div class="content">
            <div class="oneHalf">
                <div class="wh16b">{{ this.track.name }}</div>
                <div class="gr16">
                    {{
                        this.track.artists
                            .map((artist) => artist.name)
                            .join(", ")
                    }}
                </div>
            </div>
            <div class="gr16 oneFourth">{{ this.track.album.name }}</div>
            <div class="gr16 oneFourth end">{{ this.track.duration_ms }}</div>
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
    display: flex;
    height: 48px;
}

.content {
    display: flex;
    margin-left: 16px;
    align-items: center;
    width: 100%;
    justify-content: space-between;
}

.oneHalf {
    width: 50%;
}
.oneFourth {
    width: 25%;
}

.end {
    display: flex;
    justify-content: end;
}
.image {
    object-fit: cover;
}
</style>
