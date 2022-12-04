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
            <img :src="image" height="100" width="100" />
            <div>playlist name: {{ playlistName }}</div>
            <div>owner: {{ owner }}</div>
            <div>id: {{ spotifyId }}</div>
            <!-- </router-link> -->
        </div>
        <LikeButton :spotifyId="spotifyId" :isLiked="isLiked" />
    </div>
</template>

<script>
import LikeButton from "../common/LikeButton.vue";
export default {
    components: { LikeButton },
    name: "PlaylistCard",
    props: ["playlist"],
    computed: {
        image() {
            return this.playlist.images[0].url;
        },
        playlistName() {
            return this.playlist.name;
        },
        owner() {
            return this.playlist.owner.display_name;
        },
        spotifyId() {
            return this.playlist.id;
        },
        isLiked() {
            return this.playlist.isLiked;
        },
    },
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
