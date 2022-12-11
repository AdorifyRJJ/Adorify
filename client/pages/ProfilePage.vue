<template>
  <div>
    <h1>Profile Page</h1>
    <!-- api call DELETE /api/users/session -->
    <!-- <router-link to="/login">
            <button>Log Out</button>
        </router-link> -->

    <button @click="test">test</button>
    <button @click="testadd">testadd</button>
    <button @click="logout">Log Out</button>
    <div v-if="$store.state.displayName">
      <img
        :src="
          $store.state.imgURL ??
          'https://www.computerhope.com/jargon/g/guest-user.png'
        "
      />
      <h2>{{ $store.state.displayName }}</h2>
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
      {{ playlist.name }}
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
      this.$store.commit("resetStore");
      this.$router.push({ name: "Login" });
    },
    async test() {
      const data = await fetch("/api/adorifySession/leaderboard");
      const dataJson = await data.json();
      console.log(dataJson);
    },
    async testadd() {
      const lastYear = new Date();
      lastYear.setFullYear(lastYear.getFullYear() - 1);
      const lastWeek = new Date();
      lastWeek.setDate(lastWeek.getDate() - 7);
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      lastMonth.setDate(lastMonth.getDate() + 2);
      const today = new Date();

      const testDate = new Date();
      testDate.setDate(testDate.getDate() - 5);

      const data = await fetch("/api/adorifySession/testadd", {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify({
          length: 3,
          spotifyId: "monthanOtherUser",
          startTime: lastMonth,
          completed: 20,
          initializedSessions: 4,
        }),
      });
      const dataJson = await data.json();
      console.log(dataJson);
    },
  },
  async beforeCreate() {
    if (this.$store.state.connected) {
      this.$store.commit("forceDisconnect");
    }
  },
};
</script>

<style></style>
