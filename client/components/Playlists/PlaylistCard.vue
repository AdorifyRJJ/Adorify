<template>
    <div>
        <div @click="openPlaylist">
            <img :src="this.playlist.images[0].url" height="100" width="100" />
            <div>playlist name: {{ this.playlist.name }}</div>
            <div>owner: {{ this.playlist.owner.display_name }}</div>
            <div>id: {{ this.playlist.id }}</div>
        </div>
        <LikeButton
            :spotifyId="this.playlist.id"
            :isLiked="this.playlist.isLiked"
        />
    </div>
</template>

<script>
import LikeButton from "../common/LikeButton.vue";
export default {
    components: { LikeButton },
    name: "PlaylistCard",
    props: ["playlist"],
    methods: {
        // programmatic navigation
        openPlaylist() {
            this.$router.push({
                name: "PlaylistInfoPage",
                params: {
                    spotifyId: this.playlist.id,
                },
            });
        },
    },
};
</script>

<style></style>
