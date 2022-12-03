<template>
    <div>
        <div @click="openPlaylist">
            <!-- <router-link
            style="text-decoration: none"
            :to="{
                name: 'PlaylistInfoPage',
                params: {
                    spotifyId: this.playlist.id,
                },
            }"
        > -->
            <div>Card: {{ this.playlist }}</div>
            <!-- </router-link> -->
        </div>
        <LikeButton :playlist="playlist" />
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
