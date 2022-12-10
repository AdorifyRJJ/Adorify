<template>
    <div class="page">
        <MyLikedPlaylists />
        <div class="infoSection">
            <div class="playlistInfo">
                <img :src="image" class="image" height="186" width="186" />
                <div class="rightContainer">
                    <div class="topDiv">
                        <button class="backBtn wh20b" @click="exit">
                            Back
                        </button>
                    </div>
                    <div class="bottomDiv">
                        <div>
                            <div class="wh30b">{{ this.name }}</div>
                            <div class="gr16">{{ this.owner }}</div>
                        </div>
                        <LikeButton
                            class="likeBtn"
                            :spotifyId="spotifyId"
                            :isLiked="isLiked"
                        />
                    </div>
                </div>
            </div>
            <div class="tracks">
                <TrackItem
                    :key="i"
                    v-for="(track, i) in tracks.items"
                    :track="track.track"
                />
            </div>
            <div>
                <button v-if="tracks.previous" @click="prevPage">
                    prev page
                </button>
                <button v-if="tracks.next" @click="nextPage">next page</button>
            </div>
        </div>
    </div>
</template>

<script>
import MyLikedPlaylists from "../components/MyLikedPlaylists.vue";
import TrackItem from "../components/Playlists/TrackItem.vue";
import LikeButton from "../components/common/LikeButton.vue";
export default {
    components: { MyLikedPlaylists, TrackItem, LikeButton },
    name: "PlaylistInfoPage",
    data() {
        return {
            spotifyId: this.$route.params.spotifyId,
            name: null,
            owner: null,
            image: null,
            isLiked: null,
            tracks: [],
        };
    },
    computed: {
        limit() {
            return this.tracks.limit;
        },
        offset() {
            return this.tracks.offset;
        },
    },
    methods: {
        async prevPage() {
            const newOffset = this.offset - this.limit;
            const url = `/api/playlists/info/${this.spotifyId}/tracks?offset=${newOffset}`;
            const res = await fetch(url).then(async (r) => r.json());
            this.tracks = res.tracks;
        },
        async nextPage() {
            const newOffset = this.offset + this.limit;
            console.log(newOffset);
            const url = `/api/playlists/info/${this.spotifyId}/tracks?offset=${newOffset}`;
            const res = await fetch(url).then(async (r) => r.json());
            console.log("next page playlist info", res);
            this.tracks = res.tracks;
        },
        exit() {
            this.$router.back();
        },
    },
    async mounted() {
        if (!this.$store.state.displayName) {
            this.$router.push({ name: "Login" });
        }
        const url = `/api/playlists/info/${this.spotifyId}`;
        const res = await fetch(url).then(async (r) => r.json());
        console.log("playlist info", res);
        this.name = res.playlistInfo.name;
        this.owner = res.playlistInfo.owner.display_name;
        this.isLiked = res.isLiked;
        this.tracks = res.playlistInfo.tracks;
        this.image = res.playlistInfo.images[0]?.url;
        console.log("init playlist info", res);
    },
    async beforeCreate() {
        if (this.$store.state.connected) {
            this.$store.commit("forceDisconnect");
        }
    },
};
</script>

<style scoped>
.page {
    display: flex;
    flex-direction: row;
}

.infoSection {
    display: flex;
    flex-direction: column;
    width: 520px;
}

@media (min-width: 1500px) {
    .infoSection {
        width: 800px;
    }
}

@media (min-width: 1800px) {
    .infoSection {
        width: 1080px;
    }
}

@media (min-width: 2100px) {
    .infoSection {
        width: 1360px;
    }
}

.playlistInfo {
    display: flex;
    /* outline: auto; */
    flex-direction: row;
    height: 186px;
}

.rightContainer {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 100%;
}

.topDiv {
    display: flex;
    justify-content: end;
}

.backBtn {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 50px;
    width: 100px;
    border: 0;
    background-color: #6c4eb3;
    border-radius: 20px;
}
.bottomDiv {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 25px;
    padding: 18px 30px 18px 55px;
    margin-left: -40px;
}

.likeBtn {
    display: flex;
    align-self: center;
    width: 29px;
    height: 29px;
}

.image {
    border-radius: 10px;
    object-fit: cover;
    box-shadow: 0px 4px 10px 4px rgba(0, 0, 0, 0.25);
}

.tracks {
    margin-top: 50px;
    display: flex;
    flex-direction: column;
    row-gap: 16px;
    height: 60vh;
    overflow-y: scroll;
}
</style>
