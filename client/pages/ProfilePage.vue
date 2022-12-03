<template>
  <div>
    <h1>Profile Page</h1>
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
    <div :key="i" v-for="(playlist, i) in this.myMostPlayedPlaylists">
      {{ playlist }}
    </div>

    <h3>Productivity</h3>
    <div>{{ this.stats }}</div>
  </div>
</template>

<script>
import { myMostPlayedPlaylists } from "../dummyData.js";
export default {
  name: "ProfilePage",
  data() {
    return {
      display_name: null,
      image_url: null,
      stats: "graph1 uwu",
      myMostPlayedPlaylists: myMostPlayedPlaylists,
    };
  },
  methods: {
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
      if (me.ok) {
        const meJson = await me.json();
        this.display_name = meJson.data.body.display_name;
        this.image_url = meJson.data.body.images[0].url;
      }
    }
  },
};
</script>

<style></style>
