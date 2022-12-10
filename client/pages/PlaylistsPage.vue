<template>
    <div class="page">
        <MyLikedPlaylists />
        <ExplorePlaylists />
    </div>
</template>

<script>
import MyLikedPlaylists from "../components/MyLikedPlaylists.vue";
import ExplorePlaylists from "../components/ExplorePlaylists.vue";

export default {
    components: { MyLikedPlaylists, ExplorePlaylists },
    name: "PlaylistsPage",
    async beforeCreate() {
        if (!this.$store.state.displayName) {
            this.$router.push({ name: "Login" });
        }
        if (this.$store.state.connected) {
            this.$store.commit("forceDisconnect");
        }
    },
};
</script>

<style scoped>
.page {
    display: flex;
    flex-direction: row;
    /* align-content: space-between; */
    /* gap: 80px; */
    color: white;
}
</style>
