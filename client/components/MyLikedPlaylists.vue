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
    width: 160px;
}

.item:hover {
    color: white;
}

.titleText {
    margin-bottom: 10px;
}

.scrollable-content {
    margin-bottom: 12px;
}
</style>
