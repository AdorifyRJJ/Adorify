<template>
    <div class="page">
        <div class="wh40b margin-b-18">Focus Time Leaderboard</div>
        <!-- <button @click="testadd">test add</button> -->
        <ButtonGroup
            :titles="btnGroupTitles"
            :initIdx="selectIdx"
            @selectIdx="updateContent"
            class="btn-width-140 margin-b-30"
        />
        <div v-if="loading" class="lds-ring">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>
        <div v-else class="scrollable">
            <div class="scrollable-content leaderboard">
                <UserItem
                    :key="i"
                    v-for="(user, i) in leaderboard"
                    :rank="i + 1"
                    :user="user"
                    :isMe="user._id === username"
                ></UserItem>
                <div v-if="userRank.rank + 1 > 10">
                    <div class="sep"></div>
                    <UserItem
                        :rank="userRank.rank + 1"
                        :user="{imgURL: $store.state.imgURL, displayName: $store.state.displayName, focusTime: userRank.focusTime}"
                        :isMe="true"
                    ></UserItem>
                </div>
            </div>
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
            loading: true,

            userRank: null,
            allUserRanks: null,
            username: '',

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
                this.userRank = this.allUserRanks.week;
            } else if (i === 1) {
                this.leaderboard = this._monthLB;
                this.userRank = this.allUserRanks.month;
            } else if (i === 2) {
                this.leaderboard = this._allTimeLB;
                this.userRank = this.allUserRanks.allTime;
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
        this.loading = true;
        if (this.$store.state.connected) {
            this.$store.commit("forceDisconnect");
        }
        // const test = await fetch("/api/adorifySession/stats");
        // const testJson = await test.json();
        // console.log(testJson)
        const res = await fetch("/api/adorifySession/leaderboard").then(
            async (r) => r.json()
        );
        // console.log(res);

        this._weekLB = res.topUsers.week;
        this._monthLB = res.topUsers.month;
        this._allTimeLB = res.topUsers.allTime;
        
        this.allUserRanks = res.userRanks;
        this.username = res._id;

        this.updateContent(this.selectIdx);
        this.loading = false;
    },
};
</script>

<style scoped>
.page {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
}

.leaderboard {
    display: flex;
    flex-direction: column;
    width: 700px;
    overflow-y: scroll;
    padding-bottom: 20px;
}

.btn-width-140::v-deep .btn-group-button {
    width: 140px;
}

.sep {
    width: 100%;
    height: 2px;
    margin: 4px 0;
    background-color: white;
}

.lds-ring {
    display: flex;
    align-self: center;
    padding-top: 10%;
    position: relative;
    width: 80px;
    height: 80px;
}
.lds-ring div {
    box-sizing: border-box;
    display: block;
    position: absolute;
    width: 64px;
    height: 64px;
    margin: 8px;
    border: 8px solid #fff;
    border-radius: 50%;
    animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
    border-color: #fff transparent transparent transparent;
}
.lds-ring div:nth-child(1) {
    animation-delay: -0.45s;
}
.lds-ring div:nth-child(2) {
    animation-delay: -0.3s;
}
.lds-ring div:nth-child(3) {
    animation-delay: -0.15s;
}
@keyframes lds-ring {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}
</style>
