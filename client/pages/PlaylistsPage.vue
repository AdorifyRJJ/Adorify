<template>
    <div class="page">
        <MyLikedPlaylists />
        <ExplorePlaylists @tooManyLiked="displayLikedError" />
        <div id="snackbar" class="center">{{ errorText }}</div>
    </div>
</template>

<script>
import MyLikedPlaylists from "../components/MyLikedPlaylists.vue";
import ExplorePlaylists from "../components/ExplorePlaylists.vue";

export default {
    components: { MyLikedPlaylists, ExplorePlaylists },
    name: "PlaylistsPage",
    data() {
        return {
            errorText: '',
        }
    },
    methods: {
        displayLikedError() {
            if (this.errorText) return;
                this.errorText = 'Sorry, you are limited to 15 liked playlists.';
                this.displayError();
        },
        displayError() {
            const x = document.getElementById("snackbar");
            x.className = "show";
            setTimeout(() => {
                x.className = x.className.replace("show", "");
                this.errorText = "";
            }, 3000);
        },
    },
    async mounted() {
        if (!this.$store.state.displayName) {
            this.$router.push({ name: "Login" });
        }
    },
    async beforeCreate() {
        if (this.$store.state.connected) {
            this.$store.commit("forceDisconnect");
        }
    },
};
</script>

<style scoped>
.page {
    height: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
}
</style>
