<template>
    <div>
        <h1>Playlists Page</h1>
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
};
</script>

<style></style>
