<template>
    <div class="card">
        <LikeButton
            class="likeBtn"
            :spotifyId="this.playlist.id"
            :image="this.playlist.image"
            :name="this.playlist.name"
            :owner="this.playlist.owner.display_name"
            :isLiked="this.playlist.isLiked"
            @tooManyLiked="tooManyLiked"
        />
        <div class="cardContent" @click="openPlaylist">
            <img
                class="image"
                :src="this.playlist.image"
                height="200"
                width="200"
            />
            <div class="truncate1line wh16b playlistName">{{ this.playlist.name }}</div>
            <div class="truncate1line gr16 ownerName">{{ this.playlist.owner.display_name }}</div>
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
                    name: this.playlist.name,
                    owner: this.playlist.owner.display_name,
                    image: this.playlist.image,
                    isLiked: this.playlist.isLiked,
                },
            });
        },
        tooManyLiked() {
            this.$emit("tooManyLiked");
        }
    },
};
</script>

<style scoped>
.card {
    display: flex;
    flex-direction: column;
    align-self: center;
    position: relative;
    width: 200px;
}

.card:hover {
    cursor: pointer;
}

.cardContent {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.cardContent > img {
    filter: brightness(80%);
}

.cardContent:hover > img{
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
    filter: drop-shadow(0px 0px 3px rgba(0,0,0,0.3));
}

.likeBtn:hover + .cardContent > img {
    filter: brightness(100%);
}

.playlistName {
    margin-top: 16px;
    margin-bottom: 3px;
    max-width: 200px;
}

.ownerName {
    max-width: 200px;
}
</style>