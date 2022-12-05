<template>
    <div class="page">
        <MyLikedPlaylists class="likedSection" />
        <ExplorePlaylists class="exploreSection" />
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
    color: white;
    background: #1f1b2e;
}

.likedSection {
    display: flex;
    flex-direction: column;
    width: 35%;
    align-items: end;
}

.exploreSection {
    display: flex;
    flex-direction: column;
    width: 65%;
}
</style>
