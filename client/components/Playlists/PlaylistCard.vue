<template>
    <div class="card">
        <LikeButton
            class="likeBtn"
            :spotifyId="this.playlist.id"
            :isLiked="this.playlist.isLiked"
        />
        <div class="cardContent" @click="openPlaylist">
            <img
                class="image"
                :src="this.playlist.images[0]?.url"
                height="240"
                width="240"
            />
            <div class="truncate2lines">
                <div class="wh16b">{{ this.playlist.name }}</div>
            </div>
            <div class="gr16">{{ this.playlist.owner.display_name }}</div>
        </div>
    </div>
</template>

<script>
import LikeButton from "../common/LikeButton.vue";
export default {
    components: { LikeButton },
    name: "PlaylistCard",
    props: ["playlist"],
    methods: {
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

<style scoped>
.card {
    display: flex;
    flex-direction: column;
    align-self: center;
    position: relative;
    width: 240px;
    height: 320px;
}

.card:hover {
    cursor: pointer;
}

.cardContent {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    filter: brightness(90%);
}

.cardContent:hover {
    filter: brightness(100%);
}

.image {
    border-radius: 10px;
    object-fit: cover;
}

.likeBtn {
    margin: 16px;
    position: absolute;
    z-index: 1;
}
</style>
