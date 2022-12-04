<template>
    <div>
        <h3>Liked</h3>
        <!-- <div>{{ this.$store.state.myLikedPlaylists }}</div> -->
        <div v-if="$store.state.myLikedPlaylists.length">
            <div
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
        // programmatic navigation
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
        this.$store.commit("refreshLikedPlaylists");
    },
};
</script>

<style></style>
