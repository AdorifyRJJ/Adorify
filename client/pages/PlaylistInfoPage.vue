<template>
    <div>
        <h1>Playlist Info Page</h1>
        <MyLikedPlaylists />
        <div>{{ this.image }}</div>
        <div>{{ this.name }}</div>
        <div>{{ this.owner }}</div>
        <!-- <div>{{ this.isLiked }}</div> -->
        <LikeButton :spotifyId="spotifyId" :isLiked="isLiked" />

        <button @click="exit">Back</button>

        <TrackItem :key="i" v-for="(track, i) in this.tracks" :track="track" />
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
    computed: {},
    methods: {
        exit() {
            this.$router.back();
        },
    },
    async mounted() {
        //api calls
        // GET /api/playlists/info/:spotifyId/tracks?offset=
        // GET /api/playlists/info/:spotifyId
        const url = `/api/playlists/info/${this.spotifyId}`;
        const res = await fetch(url).then(async (r) => r.json());
        console.log("playlist info", res);
        this.image = res.playlistInfo.images[0].url;
        this.name = res.playlistInfo.name;
        this.owner = res.playlistInfo.owner.display_name;
        this.isLiked = res.isLiked;

        // this.playlist = this.$store.getters.getPlaylistById(this.spotifyId);
        // this.tracks = [
        //     this.playlist.playlistName + "_1",
        //     this.playlist.playlistName + "_2",
        //     this.playlist.playlistName + "_3",
        //     this.playlist.playlistName + "_4",
        // ];
    },
};
</script>

<style></style>
