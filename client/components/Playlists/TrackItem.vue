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
                <div class="wh16b truncate1line">{{ this.track.name }}</div>
                <div class="gr16 truncate1line">
                    {{
                        this.track.artists
                            .map((artist) => artist.name)
                            .join(", ")
                    }}
                </div>
            </div>
            <div class="truncate2lines gr16 oneFourth">{{ this.track.album.name }}</div>
            <div class="truncate2lines gr16 oneFourth end">{{ this.duration }}</div>
        </div>
    </div>
</template>

<script>
export default {
    name: "TrackItem",
    props: ["track"],
    computed: {
        getSec() {
            const sec = Math.floor((this.track.duration_ms / 1000) % 60);
            return sec < 10 ? `0${sec}` : `${sec}`;
        },
        getMin() {
            const min = Math.floor((this.track.duration_ms / 60 / 1000) % 60);
            return min < 10 ? `0${min}` : `${min}`;
        },
        getHr() {
            const hr = Math.floor((this.track.duration_ms / 3600 / 1000) % 24);
            return hr < 10 ? `0${hr}` : `${hr}`;
        },
        duration() {
            return this.getHr === "00"
                ? this.getMin + ":" + this.getSec
                : this.getHr + ":" + this.getMin + ":" + this.getSec;
        },
    },
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
