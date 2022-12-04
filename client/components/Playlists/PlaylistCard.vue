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
            <div>username: {{ username }}</div>
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
    computed: {
        image() {
            return this.playlist.images[0].url;
        },
        playlistName() {
            return this.playlist.name;
        },
        username() {
            return this.playlist.owner.display_name;
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
