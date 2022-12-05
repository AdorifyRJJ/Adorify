<template>
    <div class="section">
        <div class="title">Liked</div>
        <div v-if="$store.state.myLikedPlaylists.length">
            <div
                class="item"
                @click="openPlaylist(playlist.id)"
                :key="i"
                v-for="(playlist, i) in $store.state.myLikedPlaylists"
            >
                {{ playlist.name }}
            </div>
        </div>
        <div v-else>Like to add playlists!</div>
    </div>
</template>

<script>
export default {
    name: "MyLikedPlaylists",
    methods: {
        openPlaylist(id) {
            this.$router.push({
                name: "PlaylistInfoPage",
                params: {
                    spotifyId: id,
                },
            });
        },
    },
    async mounted() {
        // this.$store.commit("refreshLikedPlaylists");
    },
};
</script>

<style scoped>
.section {
    display: flex;
    padding-right: 80px;
}
.title {
    display: flex;
    font-size: 40px;
    font-weight: 700;
    line-height: 48px;
    padding-bottom: 8px;
}
.item {
    display: flex;
    font-size: 20px;
    font-weight: 400;
    line-height: 24px;
    align-items: center;
    justify-content: end;
    padding-top: 8px;
    padding-bottom: 8px;
}
</style>
