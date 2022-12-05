<template>
    <div class="section">
        <div class="title">Find playlists</div>
        <div class="selectPlaylists">
            <div class="bgroup1">
                <button class="btn" @click="getMyPlaylists">
                    My Spotify Library
                </button>
                <button class="btn" @click="getPublicPlaylists">
                    Public Library
                </button>
            </div>
            <div v-if="!viewingMine" class="bgroup2">
                <button class="dropdown" @click="getMostLiked">
                    Most liked
                </button>
                <button class="dropdown" @click="getMostUsed">Most Used</button>
                <button class="dropdown" @click="getMostProductive">
                    Most Productive
                </button>
            </div>
        </div>
        <div class="playlists">
            <PlaylistCard
                :key="i"
                v-for="(playlist, i) in currPlaylists.items"
                :playlist="playlist"
            ></PlaylistCard>
        </div>
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
import PlaylistCard from "../components/Playlists/PlaylistCard.vue";

export default {
    components: { PlaylistCard },
    name: "ExplorePlaylists",
    data() {
        return {
            currPlaylists: [],
            currPlaylistsName: null,
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
        async getMyPlaylists() {
            const url = `/api/playlists/mine?offset=0`;
            const res = await fetch(url).then(async (r) => r.json());
            this.currPlaylists = res;
            this.currPlaylistsName = "mine";
            console.log("my spotify playlists", this.currPlaylists);
        },
        async getPublicPlaylists() {
            await this.getMostLiked();
        },
        async getMostLiked() {
            const url = `/api/playlists/mostLiked?offset=0`;
            const res = await fetch(url).then(async (r) => r.json());
            this.currPlaylists = res;
            this.currPlaylistsName = "mostLiked";
        },
        async getMostUsed() {
            const url = `/api/playlists/mostUsed?offset=0`;
            const res = await fetch(url).then(async (r) => r.json());
            this.currPlaylists = res;
            this.currPlaylistsName = "mostUsed";
        },
        async getMostProductive() {
            const url = `/api/playlists/mostProductive?offset=0`;
            const res = await fetch(url).then(async (r) => r.json());
            this.currPlaylists = res;
            this.currPlaylistsName = "mostProductive";
        },
    },
    async mounted() {
        // initial api call GET public playlists by likes
        await this.getMyPlaylists();
        console.log("public playlists by likes", this.currPlaylists);

        // this.$store.commit("setMySpotifyPlaylists", mySpotifyPlaylists);
        // this.$store.commit("setPublicPlaylists", publicPlaylists);
    },
};
</script>

<style scoped>
.section {
    display: flex;
    padding-right: 350px;
}

.title {
    display: flex;
    font-size: 40px;
    font-weight: 700;
    line-height: 48px;
    padding-bottom: 16px;
}
.playlists {
    /* border: solid; */
    margin-top: 50px;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    column-gap: 40px;
    row-gap: 32px;
    min-height: 200px;
    max-height: 680px;
    overflow-y: scroll;
}

.selectPlaylists {
    display: flex;
    justify-content: space-between;
}

.bgroup1 {
    display: flex;
    justify-content: left;
}
.bgroup2 {
    display: flex;
    justify-self: center;
}

.btn {
    padding: 10px;
    border: solid;
    width: 185px;
    height: 44px;
}

.dropdown {
    padding: 10px;
    border: solid;
    width: 134px;
    height: 44px;
}
</style>
