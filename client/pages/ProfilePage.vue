<template>
    <div>
        <h1>Profile Page</h1>
        <!-- api call DELETE /api/users/session -->
        <router-link to="/login">
            <button>Log Out</button>
        </router-link>
        <div v-if="$store.state.username">
            <img :src="image_url" />
            <h2>{{ display_name }}</h2>
            <!-- total session time -->
            <div>125hr 34 min</div>
            <!-- session copmletion rate -->
            <div>250/277 (90.2%)</div>
        </div>

        <div>
            <button @click="getThisWeek">This Week</button>
            <button @click="getThisMonth">This Month</button>
            <button @click="getAllTime">All Time</button>
        </div>

        <h3>Most Played</h3>
        <div :key="i" v-for="(playlist, i) in $store.state.myLikedPlaylists">
            {{ playlist.playlistName }}
        </div>

        <h3>Productivity</h3>
        <div>{{ this.stats }}</div>
    </div>
</template>

<script>
export default {
    name: "ProfilePage",
    data() {
        return {
            display_name: null,
            image_url: null,
            stats: "graph1 uwu",
        };
    },
    methods: {
        // api call GET /api/adorifySession/stats
        getThisWeek() {
            this.stats = "graph1 uwu";
        },
        getThisMonth() {
            this.stats = "graph2 UWU";
        },
        getAllTime() {
            this.stats = "graph3 .w.";
        },
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
