<template>
    <div>
        ProfilePage
        <div v-if="$store.state.username">
            <img :src="image_url" />
            <h2>{{ display_name }}</h2>
            <!-- total session time -->
            <div>125hr 34 min</div>
            <!-- session copmletion rate -->
            <div>250/277 (90.2%)</div>
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
            console.log(this.image_url);
        }
    },
};
</script>

<style></style>
