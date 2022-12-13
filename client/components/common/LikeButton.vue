<template>
    <div @click="toggleLike">
        <img v-if="isLiked" src="images/filledHeart.svg" />
        <img v-else src="images/heart.svg" />
    </div>
</template>

<script>
export default {
    name: "LikeButton",
    props: ["spotifyId", "image", "name", "owner", "isLiked"],
    methods: {
        async toggleLike() {
            this.$store.commit("toggleLike", {
                id: this.spotifyId,
                image: this.image,
                name: this.name,
                owner: this.owner,
                isLiked: this.isLiked,
            });

            this.isLiked = !this.isLiked;
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
            this.isLiked = res.isLiked;
        },
    },
};
</script>

<style></style>
