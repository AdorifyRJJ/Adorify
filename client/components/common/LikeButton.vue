<template>
    <div>
        <button @click="toggleLike">
            <img v-if="isLiked" src="../../public/filledHeart.svg" />
            <img v-else src="../../public/heart.svg" />
        </button>
    </div>
</template>

<script>
export default {
    name: "LikeButton",
    props: ["spotifyId", "isLiked"],
    // computed: {
    //     like: {
    //         get() {
    //             return this.isLiked;
    //         },
    //         set(newLike) {
    //             return newLike;
    //         },
    //     },
    // },
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

            // this.$store.commit("addMyLikedPlaylists", this.playlist);
        },
    },
};
</script>

<style></style>
