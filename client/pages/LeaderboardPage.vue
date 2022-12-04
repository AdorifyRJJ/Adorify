<template>
  <div>
    <h1>Leaderboard Page</h1>
    <h3>Focus Time Leaderboard</h3>
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
</template>

<script>
import UserItem from "../components/Leaderboard/UserItem.vue";
import {
  leaderboardByWeek,
  leaderboardByMonth,
  leaderboardByAllTime,
} from "../dummyData.js";

export default {
  components: { UserItem },
  name: "LeaderboardPage",
  data() {
    return {
      leaderboard: leaderboardByWeek,
    };
  },
  methods: {
    // api call GET /api/adorifySession/leaderboard
    getThisWeek() {
      this.leaderboard = leaderboardByWeek;
    },
    getThisMonth() {
      this.leaderboard = leaderboardByMonth;
    },
    getAllTime() {
      this.leaderboard = leaderboardByAllTime;
    },
  },
  async beforeCreate() {
    if (!this.$store.state.displayName) {
      this.$router.push({ name: "Login" });
    }
    if (this.$store.state.connected) {
      this.$store.commit("forceDisconnect");
    }
  },
};
</script>

<style></style>
