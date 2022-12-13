<template>
  <div @click="toggleLike">
    <img v-if="isLiked" src="../../public/images/filledHeart.svg" />
    <img v-else src="../../public/images/heart.svg" />
  </div>
</template>

<script>
export default {
  name: "LikeButton",
  props: ["spotifyId", "image", "name", "owner", "isLiked"],
  data() {
    return {
      loading: false,
    };
  },
  methods: {
    async toggleLike() {
      if (this.loading) return;
      this.loading = true;
      this.$store.commit("toggleLike", {
        id: this.spotifyId,
        image: this.image,
        name: this.name,
        owner: this.owner,
        isLiked: this.isLiked,
      });

      //this.isLiked = !this.isLiked;

      // api call PUT /api/playlists/:spotifyId
      const options = {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin", // Sends express-session credentials with request
      };
      const res = await fetch(`/api/playlists/${this.spotifyId}`, options).then(
        async (r) => r.json()
      );
      this.isLiked = res.isLiked;
      this.loading = false;
    },
  },
};
</script>

<style scoped>
.lds-ring {
  display: flex;
  align-self: center;
  /* padding-top: 10%; */
  position: relative;
  width: 20px;
  height: 20px;
  left: 25%;
}
.lds-ring div {
  box-sizing: border-box;
  display: block;
  position: absolute;
  width: 16px;
  height: 16px;
  margin: 2px;
  border: 3px solid #fff;
  border-radius: 80%;
  animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  border-color: #fff transparent transparent transparent;
}
.lds-ring div:nth-child(1) {
  animation-delay: -0.45s;
}
.lds-ring div:nth-child(2) {
  animation-delay: -0.3s;
}
.lds-ring div:nth-child(3) {
  animation-delay: -0.15s;
}
@keyframes lds-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
