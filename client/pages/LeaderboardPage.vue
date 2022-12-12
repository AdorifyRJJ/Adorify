<template>
  <div>
    <h1>Leaderboard Page</h1>
    <h3>Focus Time Leaderboard</h3>
    <!-- <button @click="testadd">test add</button> -->
    <div v-if="leaderboard">
      <div>
        <button @click="getThisWeek">This Week</button>
        <button @click="getThisMonth">This Month</button>
        <button @click="getAllTime">All Time</button>
      </div>
      <UserItem
        :key="i"
        v-for="(user, i) in leaderboard"
        :rank="i + 1"
        :user="user"
      ></UserItem>
    </div>
  </div>
</template>

<script>
import UserItem from "../components/Leaderboard/UserItem.vue";

export default {
  components: { UserItem },
  name: "LeaderboardPage",
  data() {
    return {
      leaderboard: undefined,
      allLeaderboards: undefined,
      userRank: undefined,
      allUserRanks: undefined,
    };
  },
  methods: {
    // api call GET /api/adorifySession/leaderboard

    async testadd() {
      return;
      const lastYear = new Date();
      lastYear.setFullYear(lastYear.getFullYear() - 1);
      const lastWeek = new Date();
      lastWeek.setDate(lastWeek.getDate() - 6);
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
          spotifyId: "this field doesnt mattter",
          startTime: lastYear,
          completed: 50,
          initializedSessions: 400,
        }),
      });
      const dataJson = await data.json();
      console.log(dataJson);
    },

    getThisWeek() {
      this.leaderboard = this.allLeaderboards?.week;
      this.userRank = this.allUserRanks?.week;
    },
    getThisMonth() {
      this.leaderboard = this.allLeaderboards?.month;
      this.userRank = this.allUserRanks?.month;
    },
    getAllTime() {
      this.leaderboard = this.allLeaderboards?.allTime;
      this.userRank = this.allUserRanks?.allTime;
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
    // const test = await fetch("/api/adorifySession/stats");
    // const testJson = await test.json();
    // console.log(testJson)
    const leaderboard = await fetch("/api/adorifySession/leaderboard");
    const leaderboardJson = await leaderboard.json();
    console.log(leaderboardJson.topUsers)
    this.allLeaderboards = leaderboardJson.topUsers;
    this.allUserRanks = leaderboardJson.userRank;
    this.getThisWeek();
  },
};
</script>

<style></style>
