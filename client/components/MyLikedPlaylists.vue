<template>
    <div class="section">
        <div class="wh40b">Liked</div>
        <div v-if="$store.state.myLikedPlaylists.length">
            <div
                class="item wh20n truncate1line"
                @click="openPlaylist(playlist)"
                :key="i"
                v-for="(playlist, i) in $store.state.myLikedPlaylists"
            >
                {{ playlist.name }}
            </div>
        </div>
        <div v-else class="item wh20n">Like to add playlists!</div>
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
    padding: 0 60px 0 60px;
    align-items: end;
    max-height: 80vh;
    overflow-y: scroll;
}
.item {
    text-align: right;
    padding: 8px 0;
    cursor: pointer;
    width: 300px;
}

@media (min-width: 1200px) {
    .section {
        padding: 0 80px 0 80px;
    }
    .item {
        width: 400px;
    }
}

@media (min-width: 1500px) {
    .section {
        padding: 0 80px 0 100px;
    }
}

@media (min-width: 1800px) {
    .section {
        padding: 0 80px 0 120px;
    }
}

@media (min-width: 2100px) {
    .section {
        padding: 0 80px 0 140px;
    }
}
</style>
