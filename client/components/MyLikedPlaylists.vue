<template>
    <div class="section">
        <div class="wh40b">Liked</div>
        <div v-if="$store.state.myLikedPlaylists.length">
            <div class="">
                <div
                    class="item wh20n"
                    @click="openPlaylist(playlist.id)"
                    :key="i"
                    v-for="(playlist, i) in $store.state.myLikedPlaylists"
                >
                    {{ playlist.name }}
                </div>
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
    flex-direction: column;
    width: 25%;
    align-items: end;
}
.item {
    display: flex;
    justify-content: end;
    padding-top: 8px;
    padding-bottom: 8px;
    cursor: pointer;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
</style>
