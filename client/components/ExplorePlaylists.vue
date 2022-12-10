<template>
    <div class="section">
        <div class="wh40b">Find playlists</div>

        <div class="btn-div">
            <div class="btn-group">
                <button
                    class="btn-group-button btn-width-210"
                    @click="getMyPlaylists"
                >
                    <span class="wh20n">My Spotify Library</span>
                </button>
                <button
                    class="btn-group-button btn-width-210"
                    @click="getPublicPlaylists"
                >
                    <span class="wh20n">Public Library</span>
                </button>
            </div>

            <div v-if="!loading && !viewingMine" class="bgroup2">
                <button class="dropdown" @click="getMostLiked">
                    Most liked
                </button>
                <button class="dropdown" @click="getMostUsed">Most Used</button>
                <button class="dropdown" @click="getMostProductive">
                    Most Productive
                </button>
            </div>
        </div>
        <div v-if="loading" class="lds-ring">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>
        <div v-else>
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
            loading: true,
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
        setLoading(loading) {
            this.loading = loading;
        },
        async prevPage() {
            this.setLoading(true);
            const newOffset = this.offset - this.limit;
            const url = `/api/playlists/${this.currPlaylistsName}?offset=${newOffset}`;
            const res = await fetch(url).then(async (r) => r.json());
            this.currPlaylists = res;
            this.setLoading(false);
        },
        async nextPage() {
            this.setLoading(true);
            const newOffset = this.offset + this.limit;
            const url = `/api/playlists/${this.currPlaylistsName}?offset=${newOffset}`;
            const res = await fetch(url).then(async (r) => r.json());
            this.currPlaylists = res;
            this.setLoading(false);
        },
        async getMyPlaylists() {
            this.setLoading(true);
            const url = `/api/playlists/mine?offset=0`;
            const res = await fetch(url).then(async (r) => r.json());
            this.currPlaylists = res;
            this.currPlaylistsName = "mine";
            console.log("my spotify playlists", this.currPlaylists);
            this.setLoading(false);
        },
        async getPublicPlaylists() {
            if (this.viewingMine) {
                await this.getMostLiked();
            }
        },
        async getMostLiked() {
            this.setLoading(true);
            const url = `/api/playlists/mostLiked?offset=0`;
            const res = await fetch(url).then(async (r) => r.json());
            this.currPlaylists = res;
            this.currPlaylistsName = "mostLiked";
            this.setLoading(false);
        },
        async getMostUsed() {
            this.setLoading(true);
            const url = `/api/playlists/mostUsed?offset=0`;
            const res = await fetch(url).then(async (r) => r.json());
            this.currPlaylists = res;
            this.currPlaylistsName = "mostUsed";
            this.setLoading(false);
        },
        async getMostProductive() {
            this.setLoading(true);
            const url = `/api/playlists/mostProductive?offset=0`;
            const res = await fetch(url).then(async (r) => r.json());
            this.currPlaylists = res;
            this.currPlaylistsName = "mostProductive";
            this.setLoading(false);
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

.section {
    display: flex;
    flex-direction: column;
    width: 520px;
}

.playlists {
    margin-top: 40px;
    display: flex;
    flex-wrap: wrap;
    justify-content: start;
    column-gap: 40px;
    row-gap: 32px;
    max-height: 65vh;
    overflow-y: scroll;
}

@media (min-width: 1500px) {
    .section {
        width: 800px;
    }
}

@media (min-width: 1800px) {
    .section {
        width: 1080px;
    }
}

@media (min-width: 2100px) {
    .section {
        width: 1360px;
    }
}

.selectPlaylists {
    display: flex;
    justify-content: space-between;
}

.btn-div {
    display: flex;
    justify-content: space-between;
}

.btn-width-210 {
    width: 210px;
}

.bgroup2 {
    display: flex;
}

.dropdown {
    padding: 10px;
    border: solid;
    cursor: pointer;
}
</style>
