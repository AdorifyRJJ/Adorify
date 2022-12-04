<template>
    <div>
        <h1>Playlist Info Page</h1>
        <MyLikedPlaylists />
        <button @click="exit">Back</button>
        <div>
            <img :src="image" height="100" width="100" />
        </div>
        <div>{{ this.name }}</div>
        <div>{{ this.owner }}</div>
        <LikeButton :spotifyId="spotifyId" :isLiked="isLiked" />
        <TrackItem
            :key="i"
            v-for="(track, i) in tracks.items"
            :track="track.track"
        />
        <div>
            <button v-if="tracks.previous" @click="prevPage">prev page</button>
            <button v-if="tracks.next" @click="nextPage">next page</button>
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
            playlist: null,
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
        this.image = res.playlistInfo.images[0].url;
        this.name = res.playlistInfo.name;
        this.owner = res.playlistInfo.owner.display_name;
        this.isLiked = res.isLiked;
        this.tracks = res.playlistInfo.tracks;
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

<style></style>
