<template>
    <div class="page">
        <MyLikedPlaylists />
        <div class="infoSection">
            <div class="playlistInfo">
                <img :src="image" height="186" width="186" />
                <div class="rightContainer">
                    <div class="btnContainer">
                        <button class="backBtn" @click="exit">Back</button>
                    </div>
                    <div class="namesAndLike">
                        <div class="names">
                            <div class="playlistName">{{ this.name }}</div>
                            <div class="owner">{{ this.owner }}</div>
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
        const url = `/api/playlists/info/${this.spotifyId}`;
        const res = await fetch(url).then(async (r) => r.json());
        console.log("playlist info", res);
        this.name = res.playlistInfo.name;
        this.owner = res.playlistInfo.owner.display_name;
        this.isLiked = res.isLiked;
        this.tracks = res.playlistInfo.tracks;
        this.image = res.playlistInfo.images[0].url;
        console.log("init playlist info", res);
    },

    async beforeCreate() {
        if (!this.$store.state.displayName) {
            this.$router.push({ name: "Login" });
        }
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
    color: white;
}

.infoSection {
    display: flex;
    flex-direction: column;
    padding-right: 350px;
    width: 65%;
}

.playlistInfo {
    display: flex;
    flex-direction: row;
    width: 100%;
}

.rightContainer {
    display: flex;
    flex-direction: column;
    width: auto;
}

.btnContainer {
    display: flex;
    justify-content: right;
}

.backBtn {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 50px;
    width: 100px;
    background-color: #6c4eb3;
    border-radius: 20px;
    color: white;
    font-size: 20px;
    font-weight: 700;
}
.namesAndLike {
    display: flex;

    flex-direction: row;
}

.names {
    display: flex;
    flex-direction: column;
    /* border: solid; */
}
.playlistName {
    display: flex;
    font-size: 30px;
    font-weight: 700;
    line-height: 36px;
}

.owner {
    display: flex;
    color: #a9a9a9;
    font-size: 16px;
    font-weight: 400;
}

.likeBtn {
    display: flex;
    align-items: right;
    width: 29px;
    height: auto;
}

.tracks {
    border: solid;
    margin-top: 50px;
    display: grid;
    grid-template-columns: 1fr;
    column-gap: 40px;
    row-gap: 32px;
    min-height: 200px;
    max-height: 580px;
    overflow-y: scroll;
}
</style>
