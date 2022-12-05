<template>
    <div @click="toggleLike">
        <img v-if="isLiked" src="../../public/filledHeart.svg" />
        <img v-else src="../../public/heart.svg" />
    </div>
</template>

<script>
export default {
    name: "LikeButton",
    props: ["spotifyId", "isLiked"],
    methods: {
        async toggleLike() {
            // api call PUT /api/playlists/:spotifyId
            const options = {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "same-origin", // Sends express-session credentials with request
            };
            const res = await fetch(
                `/api/playlists/${this.spotifyId}`,
                options
            ).then(async (r) => r.json());
            console.log("liking", res);
            this.isLiked = res.isLiked;
            this.$store.commit("refreshLikedPlaylists");
        },
    },
};
</script>

<style></style>
