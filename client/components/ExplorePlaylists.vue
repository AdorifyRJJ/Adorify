<template>
    <div>
        <h3>Find playlists</h3>
        <div>
            <button @click="getMyPlaylists">My Spotify Library</button>
            <button @click="getPublicPlaylists">Public Library</button>
            <div v-show="!viewingMine">
                <button @click="getMostLiked">Most liked</button>
                <button @click="getMostUsed">Most Used</button>
                <button @click="getMostProductive">Most Productive</button>
            </div>
        </div>
        <PlaylistCard
            :key="i"
            v-for="(playlist, i) in currPlaylists.items"
            :playlist="playlist"
        ></PlaylistCard>
        <div>
            <button v-if="currPlaylists.previous" @click="prevPage">
                prev page
            </button>
            <button v-if="currPlaylists.next" @click="nextPage">
                next page
            </button>
        </div>
    </div>
</template>

<script>
// import { mySpotifyPlaylists, publicPlaylists } from "../dummyData.js";
import PlaylistCard from "../components/Playlists/PlaylistCard.vue";

export default {
    components: { PlaylistCard },
    name: "ExplorePlaylists",
    data() {
        return {
            currPlaylists: [],
            currPlaylistsName: null,
            // limit: null,
            // offset: null,
        };
    },
    computed: {
        limit() {
            return this.currPlaylists.limit;
        },
        offset() {
            return this.currPlaylists.offset;
        },
        viewingMine() {
            return this.currPlaylistsName === "mine";
        },
    },
    methods: {
        async prevPage() {
            const newOffset = this.offset - this.limit;
            const url = `/api/playlists/${this.currPlaylistsName}?offset=${newOffset}`;
            const res = await fetch(url).then(async (r) => r.json());
            this.currPlaylists = res;
        },
        async nextPage() {
            const newOffset = this.offset + this.limit;
            const url = `/api/playlists/${this.currPlaylistsName}?offset=${newOffset}`;
            const res = await fetch(url).then(async (r) => r.json());
            this.currPlaylists = res;
        },
        // api call GET my spotify playlists
        async getMyPlaylists() {
            const url = `/api/playlists/mine?offset=0`;
            const res = await fetch(url).then(async (r) => r.json());
            this.currPlaylists = res;
            this.currPlaylistsName = "mine";
            console.log("my spotify playlists", this.currPlaylists);
        },
        async getPublicPlaylists() {
            await this.getMostLiked(0);
        },
        // api call GET public playlists by likes
        async getMostLiked() {
            const url = `/api/playlists/mostLiked?offset=0`;
            const res = await fetch(url).then(async (r) => r.json());
            this.currPlaylists = res;
            this.currPlaylistsName = "mostLiked";
        },
        // api call GET public playlists by usage
        async getMostUsed() {
            const url = `/api/playlists/mostUsed?offset=0`;
            const res = await fetch(url).then(async (r) => r.json());
            this.currPlaylists = res;
            this.currPlaylistsName = "mostUsed";
        },
        // api call GET public playlists by productiveness
        async getMostProductive() {
            const url = `/api/playlists/mostProductive?offset=0`;
            const res = await fetch(url).then(async (r) => r.json());
            this.currPlaylists = res;
            this.currPlaylistsName = "mostProductive";
        },
    },
    async mounted() {
        // initial api call GET public playlists by likes
        await this.getMostLiked();
        console.log("public playlists by likes", this.currPlaylists);

        // this.$store.commit("setMySpotifyPlaylists", mySpotifyPlaylists);
        // this.$store.commit("setPublicPlaylists", publicPlaylists);
    },
};
</script>

<style></style>
