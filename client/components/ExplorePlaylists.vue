<template>
    <div class="section">
        <div class="wh40b">Find playlists</div>

        <div class="btn-div">
            <ButtonGroup
                :titles="btnGroupTitles"
                :initIdx="selectIdx"
                @selectIdx="updateContent"
                class="btn-width-180"
            />
            <div v-if="!viewingMine" class="dropdown">
                <div>
                    <button class="selected wh16n" @click="toggleChoosing">
                        <div class="selectedText">{{selected}}</div>
                        <img src="../public/dropdown.svg">
                    </button>
                </div>
                <div v-if="choosing" class="expanded">
                    <div v-for="(option, i) in dropdownOptions" @click="toggleChoice(option)" class="choice wh16n">
                        {{option}}
                    </div>
                </div>
            </div>
        </div>
        <div v-if="loading" class="lds-ring">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>
        <div v-else class="scrollable" id="playlistDiv">
            <div class="scrollable-content">
                <div class="playlists">
                    <PlaylistCard
                        :key="i"
                        v-for="(playlist, i) in currPlaylists.items"
                        :playlist="playlist"
                    ></PlaylistCard>
                </div>
                <div class="botButtons">
                    <button class="botButton prev" :disabled="!currPlaylists.previous" @click="prevPage">
                        <img src="pagePrev.svg">
                    </button>
                    <button class="botButton next" :disabled="!currPlaylists.next" @click="nextPage">
                        <img src="pageNext.svg">
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import PlaylistCard from "../components/Playlists/PlaylistCard.vue";
import ButtonGroup from "../components/common/ButtonGroup.vue";

export default {
    components: { PlaylistCard, ButtonGroup },
    name: "ExplorePlaylists",
    data() {
        return {
            btnGroupTitles: ["My Spotify Library", "Public Library"],
            selectIdx: 0,
            currPlaylists: [],
            currPlaylistsName: null,
            loading: true,

            choosing: false,
            selected: 'Most Liked',
            dropdownOptions: ['Most Liked', 'Most Used', 'Most Productive'],

            controller: new AbortController(),
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
        resetController() {
            this.controller.abort();
            this.controller = new AbortController();
        },
        async updateContent(i) {
            this.selectedIdx = i;
            if (i === 0) {
                await this.getMyPlaylists();
            } else if (i === 1) {
                await this.getPublicPlaylists();
            }
        },
        setLoading(loading) {
            this.loading = loading;
        },
        toggleChoosing() {
            this.choosing = !this.choosing;
        },
        async toggleChoice(option) {
            this.selected = option;
            this.choosing = false;
            if (option === 'Most Liked') {
                await this.getMostLiked();
            }
            else if (option === 'Most Used') {
                await this.getMostUsed();
            }
            else {
                await this.getMostProductive();
            }
        },
        async prevPage() {
            const playlistWindow = document.getElementById("playlistDiv")
            playlistWindow.scrollTo(0,0); 
            this.setLoading(true);
            this.resetController();
            const newOffset = this.offset - this.limit;
            const url = `/api/playlists/${this.currPlaylistsName}?offset=${newOffset}`;
            const res = await fetch(url, {signal: this.controller.signal}).then(async (r) => r.json());
            this.currPlaylists = res;
            this.setLoading(false);
        },
        async nextPage() {
            const playlistWindow = document.getElementById("playlistDiv")
            playlistWindow.scrollTo(0,0); 
            this.setLoading(true);
            this.resetController();
            const newOffset = this.offset + this.limit;
            const url = `/api/playlists/${this.currPlaylistsName}?offset=${newOffset}`;
            const res = await fetch(url, {signal: this.controller.signal}).then(async (r) => r.json());
            this.currPlaylists = res;
            this.setLoading(false);
        },
        async getMyPlaylists() {
            this.currPlaylistsName = "mine";
            this.resetController();
            this.setLoading(true);
            const url = `/api/playlists/mine?offset=0`;
            const res = await fetch(url, {signal: this.controller.signal}).then(async (r) => r.json());
            this.currPlaylists = res;
            this.setLoading(false);
        },
        async getPublicPlaylists() {
            if (this.viewingMine) {
                await this.getMostLiked();
            }
        },
        async getMostLiked() {
            this.currPlaylistsName = "mostLiked";
            this.resetController();
            this.setLoading(true);
            const url = `/api/playlists/mostLiked?offset=0`;
            const res = await fetch(url, {signal: this.controller.signal}).then(async (r) => r.json());
            this.currPlaylists = res;

            this.setLoading(false);
        },
        async getMostUsed() {
            this.currPlaylistsName = "mostUsed";
            this.resetController();
            this.setLoading(true);
            const url = `/api/playlists/mostUsed?offset=0`;
            const res = await fetch(url, {signal: this.controller.signal}).then(async (r) => r.json());
            this.currPlaylists = res;

            this.setLoading(false);
        },
        async getMostProductive() {
            this.currPlaylistsName = "mostProductive";
            this.resetController();
            this.setLoading(true);
            const url = `/api/playlists/mostProductive?offset=0`;
            const res = await fetch(url, {signal: this.controller.signal}).then(async (r) => r.json());
            this.currPlaylists = res;

            this.setLoading(false);
        },
    },
    async mounted() {
        // initial api call GET public playlists by likes
        await this.getMyPlaylists();
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
    width: 440px;
}

.playlists {
    display: flex;
    flex-wrap: wrap;
    justify-content: start;
    column-gap: 40px;
    row-gap: 30px;
}

@media (min-width: 1100px) {
    .section {
        width: 680px;
    }
}

@media (min-width: 1340px) {
    .section {
        width: 920px;
    }
}

@media (min-width: 1620px) {
    .section {
        width: 1160px;
    }
}

@media (min-width: 1940px) {
    .section {
        width: 1400px;
    }
}

.botButtons {
    display: flex;
    margin-top: 32px;
    margin-bottom: 10px;
    gap: 16px;
}

.botButton {
    padding: 2px 0 0 0;
    height: 44px;
    width: 44px;
    border-radius: 22px;
    background-color: rgba(0, 0, 0, 0.8);
    border: none;
}

.botButton:hover {
    filter: opacity(70%);
}

.botButton:disabled {
    filter: opacity(30%);
}

.prev {
    padding-right: 4px;
}

.next {
    padding-left: 4px;
}

.dropdown {
    background-color: #373544;
    height: fit-content;
    border-radius: 22px;
}

.selected {
    height: 44px;
    width: 180px;
    border-radius: 22px;
    background-color: #664eff;
    padding: 0 16px;
    border: none;

    z-index: 5;
    position: relative;

    display: flex;
    justify-content: space-between;
    align-items: center;
}

.expanded {
    width: 180px;
    display: flex;
    flex-direction: column;
    position: absolute;
    z-index: 3;
    padding: 50px 0 6px 0;
    cursor: pointer;

    margin-top: -44px;
    border-radius: 22px;
    background-color: #373544;
    box-shadow: 0 0 10px black;
}

.choice {
    padding: 6px 16px;
}

.btn-div {
    margin-top: 18px;
    margin-bottom: 30px;

    display: flex;
    justify-content: space-between;
    align-items: center;
}

.btn-width-210 {
    width: 210px;
}

.btn-width-180::v-deep .btn-group-button {
    width: 180px;
}
</style>
