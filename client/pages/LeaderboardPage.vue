<template>
    <div class="page">
        <div class="wh40b margin-b-16">Focus Time Leaderboard</div>
        <!-- <button @click="testadd">test add</button> -->
        <ButtonGroup
            :titles="btnGroupTitles"
            :initIdx="selectIdx"
            @selectIdx="updateContent"
        />
        <!-- <div>{{ this.content }}</div> -->
        <!-- <div v-if="leaderboard"> -->
        <!-- <div>
                <button @click="getThisWeek">This Week</button>
                <button @click="getThisMonth">This Month</button>
                <button @click="getAllTime">All Time</button>
            </div> -->
        <div class="leaderboard">
            <UserItem
                :key="i"
                v-for="(user, i) in leaderboard"
                :rank="i + 1"
                :user="user"
            ></UserItem>
        </div>
        <!-- </div> -->
    </div>
</template>

<script>
import UserItem from "../components/Leaderboard/UserItem.vue";
import ButtonGroup from "../components/common/ButtonGroup.vue";

export default {
    components: { UserItem, ButtonGroup },
    name: "LeaderboardPage",
    data() {
        return {
            btnGroupTitles: ["This Week", "This Month", "All Time"],
            selectIdx: 0,
            leaderboard: [],
            _allTimeLB: [],
            _monthLB: [],
            _weekLB: [],

            // leaderboard: undefined,
            // allLeaderboards: undefined,
            // userRank: undefined,
            // allUserRanks: undefined,
            // content: null,
        };
    },
    methods: {
        updateContent(i) {
            this.selectIdx = i;
            if (i === 0) {
                this.leaderboard = this._weekLB;
            } else if (i === 1) {
                this.leaderboard = this._monthLB;
            } else if (i === 2) {
                this.leaderboard = this._allTimeLB;
            }
        },
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

        // getThisWeek() {
        //     this.leaderboard = this.allLeaderboards?.week;
        //     this.userRank = this.allUserRanks?.week;
        // },
        // getThisMonth() {
        //     this.leaderboard = this.allLeaderboards?.month;
        //     this.userRank = this.allUserRanks?.month;
        // },
        // getAllTime() {
        //     this.leaderboard = this.allLeaderboards?.allTime;
        //     this.userRank = this.allUserRanks?.allTime;
        // },
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
        const res = await fetch("/api/adorifySession/leaderboard").then(
            async (r) => r.json()
        );
        console.log(res);

        this._weekLB = res.topUsers.week;
        this._monthLB = res.topUsers.month;
        this._allTimeLB = res.topUsers.allTime;
        // this.allUserRanks = res.userRank;
        // this.getThisWeek();

        this.updateContent(this.selectIdx);
    },
};
</script>

<style scoped>
.page {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.margin-b-16 {
    margin-bottom: 16px;
}
.leaderboard {
    margin-top: 50px;
    display: flex;
    flex-direction: column;
    row-gap: 16px;
    height: 60vh;
    width: 700px;
    overflow-y: scroll;
}
</style>
