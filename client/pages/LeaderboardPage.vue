<template>
    <div>
        <div>Focus Time Leaderboard</div>
        <div>[Pill Tab]</div>
        <UserItem :rank="1" :user="'userinfo'" />
        <UserItem :rank="2" :user="'userinfo'" />
    </div>
</template>

<script>
import UserItem from "../components/Leaderboard/UserItem.vue";

export default {
    components: { UserItem },
    name: "LeaderboardPage",
};
</script>

<style></style>
