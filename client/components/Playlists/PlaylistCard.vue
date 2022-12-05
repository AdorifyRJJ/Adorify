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
                :src="this.playlist.images[0].url"
                height="100"
                width="100"
            />
            <div class="playlistName">{{ this.playlist.name }}</div>
            <div class="owner">{{ this.playlist.owner.display_name }}</div>
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
    /* border: solid; */
    align-self: center;
    position: relative;
    min-height: 340px;
}

.cardContent {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.image {
    filter: brightness(80%);
    border-radius: 10px;
    width: 100%;
    height: auto;
}

.image:hover {
    filter: brightness(90%);
}

.likeBtn {
    display: flex;
    margin: 16px;
    position: absolute;
    z-index: 1;
}

.playlistName {
    font-size: 16px;
    font-weight: 700;
    color: white;
    padding-top: 15px;
}

.owner {
    font-size: 16px;
    font-weight: 400;
    color: #a9a9a9;
    padding-top: 2px;
}
</style>
