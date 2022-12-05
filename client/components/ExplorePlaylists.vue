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
    padding-right: 20rem;
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
    /* min-height: 200px; */
    max-height: 65vh;
    overflow-y: scroll;
}

.selectPlaylists {
    display: flex;
    justify-content: space-between;
}

.bgroup1 {
    display: flex;
}
.bgroup2 {
    display: flex;
}

.btn {
    padding: 10px;
    border: solid;
    width: 185px;
    height: 44px;
    cursor: pointer;
}

.dropdown {
    padding: 10px;
    border: solid;
    width: 134px;
    height: 44px;
    cursor: pointer;
}
</style>
