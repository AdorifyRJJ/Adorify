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
            <div v-if="loading" class="lds-ring">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
            <div v-else>
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
                    <button v-if="tracks.next" @click="nextPage">
                        next page
                    </button>
                </div>
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
    props: ["name", "owner", "image", "isLiked"],
    data() {
        return {
            spotifyId: this.$route.params.spotifyId,
            tracks: [],
            loading: true,
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
    watch: {
        async "$route.params.spotifyId"(newId, oldId) {
            console.log("new id", newId);
            await this.getTracks(newId);
        },
    },
    methods: {
        setLoading(loading) {
            this.loading = loading;
        },
        async prevPage() {
            this.setLoading(true);
            const newOffset = this.offset - this.limit;
            const url = `/api/playlists/info/${this.spotifyId}/tracks?offset=${newOffset}`;
            const res = await fetch(url).then(async (r) => r.json());
            this.tracks = res.tracks;
            this.setLoading(false);
        },
        async nextPage() {
            this.setLoading(true);
            const newOffset = this.offset + this.limit;
            console.log(newOffset);
            const url = `/api/playlists/info/${this.spotifyId}/tracks?offset=${newOffset}`;
            const res = await fetch(url).then(async (r) => r.json());
            console.log("next page playlist info", res);
            this.tracks = res.tracks;
            this.setLoading(false);
        },
        async getTracks(spotifyId) {
            this.setLoading(true);
            const url = `/api/playlists/info/${spotifyId}`;
            const res = await fetch(url).then(async (r) => r.json());
            // console.log("playlist info", res);
            this.tracks = res.playlistInfo.tracks;
            // console.log("init playlist info", res);
            this.setLoading(false);
        },
        exit() {
            this.$router.back();
        },
    },
    async mounted() {
        if (!this.$store.state.displayName) {
            this.$router.push({ name: "Login" });
        }

        await this.getTracks(this.spotifyId);
    },
    async beforeCreate() {
        if (this.$store.state.connected) {
            this.$store.commit("forceDisconnect");
        }
    },
};
</script>

<style scoped>
.lds-ring {
    display: flex;
    align-self: center;
    padding-top: 30%;
    position: relative;
    width: 80px;
    height: 80px;
}
.lds-ring div {
    box-sizing: border-box;
    display: block;
    position: absolute;
    width: 64px;
    height: 64px;
    margin: 8px;
    border: 8px solid #fff;
    border-radius: 50%;
    animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
    border-color: #fff transparent transparent transparent;
}
.lds-ring div:nth-child(1) {
    animation-delay: -0.45s;
}
.lds-ring div:nth-child(2) {
    animation-delay: -0.3s;
}
.lds-ring div:nth-child(3) {
    animation-delay: -0.15s;
}
@keyframes lds-ring {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}
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
    margin-left: 30px;
}

.image {
    border-radius: 10px;
    object-fit: cover;
    box-shadow: 0px 4px 10px 4px rgba(0, 0, 0, 0.25);
    z-index: 1;
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
