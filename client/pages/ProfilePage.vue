<template>
    <div>
        ProfilePage
        <div v-if="$store.state.username">
            <h2>{{ display_name }}</h2>
            <img :src="image_url" />
        </div>
        <router-link to="/login">
            <button>Log Out</button>
        </router-link>
    </div>
</template>

<script>
export default {
    name: "ProfilePage",
    data() {
        return {
            display_name: null,
            image_url: null,
        };
    },
    async beforeCreate() {
        if (this.$store.state.username) {
            const me = await fetch(`/api/spotify/getMe`);
            const meJson = await me.json();
            this.display_name = meJson.data.body.display_name;
            this.image_url = meJson.data.body.images[0].url;
            console.log(this.image_url)
        }
    }
};
</script>

<style></style>
