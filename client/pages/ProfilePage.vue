<template>
  <div>
    <h1>Profile Page</h1>
    <!-- api call DELETE /api/users/session -->
    <!-- <router-link to="/login">
            <button>Log Out</button>
        </router-link> -->
    <button @click="logout">Log Out</button>
    <div v-if="$store.state.displayName">
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

    <h3>Most Played</h3>
    <div :key="i" v-for="(playlist, i) in this.myMostPlayedPlaylists">
      {{ playlist }}
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
    async logout() {
      await fetch(`/api/spotify/logout`);

      this.$store.commit("setDeviceId", undefined);
      this.$store.commit("setDisplayName", null);
      this.$store.commit("deleteRefreshTimeout");
      this.$store.commit("setMyLikedPlaylists", []);
      this.$store.commit("setMySpotifyPlaylists", []);
      this.$store.commit("setPublicPlaylists", []);

      if (this.$store.state.spotifyPlayer) {
        try {
          this.$store.state.spotifyPlayer.disconnect();
        } catch (e) {
          console.log(e);
        }
        this.$store.commit("setSpotifyPlayer", null);
      }

      this.$router.push({ name: "Login" });
    },
  },

  async beforeCreate() {
    if (this.$store.state.displayName) {
      const me = await fetch(`/api/spotify/getMe`);
      if (me.ok) {
        const meJson = await me.json();
        this.display_name = meJson.display_name;
        this.image_url = meJson.images[0].url;
      }
    }
  },
};
</script>

<style></style>
