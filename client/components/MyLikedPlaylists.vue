<template>
    <div class="section">
        <div class="wh40b titleText">Liked</div>
        <div class="scrollable">
            <div class="scrollable-content">
                <div v-if="$store.state.myLikedPlaylists.length">
                    <div
                        class="item gr20 truncate1line"
                        @click="openPlaylist(playlist)"
                        :key="i"
                        v-for="(playlist, i) in $store.state.myLikedPlaylists"
                    >
                        {{ playlist.name }}
                    </div>
                </div>
                <div v-else class="item wh20n">Like to add playlists!</div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "MyLikedPlaylists",
    methods: {
        openPlaylist(playlist) {
            this.$router.push({
                name: "PlaylistInfoPage",
                params: {
                    spotifyId: playlist.id,
                    name: playlist.name,
                    owner: playlist.owner,
                    image: playlist.image,
                    isLiked: playlist.isLiked,
                },
            });
        },
    },
    async beforeMount() {
        this.$store.commit("refreshLikedPlaylists");
    },
};
</script>

<style scoped>
.section {
    display: flex;
    flex-direction: column;
    margin-right: 60px;
    align-items: flex-end;
}

.item {
    text-align: right;
    padding: 8px 0;
    cursor: pointer;
    width: 200px;
}

.item:hover {
    color: white;
}

.titleText {
    margin-bottom: 10px;
}

@media (min-width: 1200px) {
    .item {
        width: 200px;
    }
}

@media (min-width: 1500px) {
}

@media (min-width: 1800px) {
}

@media (min-width: 2100px) {
}
</style>
