<template>
    <div class="page">
        <!-- api call DELETE /api/users/session -->
        <!-- <router-link to="/login">
            <button>Log Out</button>
        </router-link> -->
        <!-- <button @click="logout">Log Out</button>
        <div v-if="$store.state.displayName">
            <img
                :src="
                    $store.state.imgURL ??
                    'https://www.computerhope.com/jargon/g/guest-user.png'
                "
            />
            <h2>{{ $store.state.displayName }}</h2>
            <div>125hr 34 min</div>
            <div>250/277 (90.2%)</div>
        </div> -->
        <div class="topUserStats">
            <img
                :src="
                    $store.state.imgURL ??
                    'https://www.computerhope.com/jargon/g/guest-user.png'
                "
                class="image"
                height="260"
                width="260"
            />
            <div class="rightContainer">
                <div class="topDiv">
                    <button class="button" @click="logout">
                        <span class="wh20b">Logout</span>
                    </button>
                    <button class="button">
                        <span class="wh20b">Delete</span>
                    </button>
                </div>
                <div class="bottomDiv">
                    <div class="wh40b">{{ $store.state.displayName }}</div>
                    <div class="completionInfo">
                        <div class="pill wh20n">
                            <div v-if="loading" class="lds-ring">
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                            </div>
                            <div v-else>
                                {{ this.totalTime }}
                            </div>
                        </div>
                        <div class="pill wh20n">
                            <div v-if="loading" class="lds-ring">
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                            </div>
                            <div v-else>
                                {{ this.sessionInfo }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <ButtonGroup
            :titles="btnGroupTitles"
            :initIdx="selectIdx"
            @selectIdx="updateContent"
            class="btn-width-150 marginy-32"
        />
        <div class="bottomUserStats">
            <div class="mostPlayed">
                <div class="wh30b marginb-14">Most Played</div>
                <div class="">
                    <div
                        :key="i"
                        v-for="(playlist, i) in mostPlayed"
                        class="item wh20n truncate1line"
                    >
                        {{ playlist.name }}
                    </div>
                </div>
            </div>
            <div>
                <div class="wh30b marginb-14">Productivity</div>
                <div>{{ this.graph }}</div>
            </div>
        </div>
    </div>
</template>

<script>
import ButtonGroup from "../components/common/ButtonGroup.vue";
import { formatHrFromSec, formatMinFromSec } from "../utils.js";

export default {
    components: { ButtonGroup },
    name: "ProfilePage",
    data() {
        return {
            btnGroupTitles: ["This Week", "This Month"],
            selectIdx: 0,
            mostPlayed: [],
            _mostPlayedWeek: [],
            _mostPlayedMonth: [],
            sessionInfo: null,
            totalTime: null,
            graph: "graph1 uwu",
            loading: true,
        };
    },
    computed: {},
    // watch: {
    //     selectIdx: {
    //         immediate: true,
    //         handler(newIdx, oldIdx) {
    //             console.log(newIdx);
    //             if (newIdx === 0) {
    //                 this.graph = "graph1 uwu";
    //                 this.mostPlayed = this._mostPlayedWeek;
    //             } else if (newIdx === 1) {
    //                 this.graph = "graph2 UWU";
    //                 this.mostPlayed = this._mostPlayedMonth;
    //             }
    //         },
    //     },
    // },
    methods: {
        updateContent(i) {
            this.selectIdx = i;
            if (i === 0) {
                this.graph = "graph1 uwu";
                this.mostPlayed = this._mostPlayedWeek;
            } else if (i === 1) {
                this.graph = "graph2 UWU";
                this.mostPlayed = this._mostPlayedMonth;
            }
        },
        async logout() {
            await fetch(`/api/spotify/logout`);
            this.$store.commit("resetStore");
            this.$router.push({ name: "Login" });
        },
    },
    async beforeCreate() {
        this.loading = true;
        if (this.$store.state.connected) {
            this.$store.commit("forceDisconnect");
        }
        const res = await fetch("/api/adorifySession/stats").then(async (r) =>
            r.json()
        );

        // calculate total time
        const _totalTime = res.totalTime;
        const min = formatMinFromSec(_totalTime, true);
        const hr = formatHrFromSec(_totalTime);
        this.totalTime = `${hr}hr ${min}min`;

        // calculate session info
        const completedSessions = res.completed;
        const totalSessions = res.totalSessions;
        this.sessionInfo =
            totalSessions === 0
                ? "0%"
                : `${completedSessions}/${totalSessions} 
                (${(completedSessions / totalSessions).toFixed(1) * 100}%)`;

        this._mostPlayedWeek = res.mostPlayed.week;
        this._mostPlayedMonth = res.mostPlayed.month;
        this.updateContent(this.selectIdx);
        this.loading = false;
        console.log("stats", res);
    },
};
</script>

<style scoped>
.page {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.image {
    object-fit: cover;
    border: 5px solid #664eff;
    border-radius: 100%;
    box-shadow: 0px 4px 10px 4px rgba(0, 0, 0, 0.25);
    z-index: 1;
}
.topUserStats {
    display: flex;
    flex-direction: row;
    height: 260px;
    width: 900px;
}

.marginy-32 {
    margin: 32px 0;
}

.bottomUserStats {
    display: flex;
    flex-direction: row;
    width: 900px;
    gap: 40px;
}

.rightContainer {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 100%;
}

.topDiv {
    display: flex;
    justify-content: end;
}

.bottomDiv {
    display: flex;
    /* border: solid; */
    flex-direction: column;

    /* justify-content: space-between; */
    background: rgba(255, 255, 255, 0.05);
    border-radius: 25px;
    padding: 38px 30px 28px 180px;
    margin-left: -150px;
    z-index: 2;
}

.marginb-14 {
    margin-bottom: 14px;
}

.completionInfo {
    display: flex;
    flex-direction: row;
    gap: 14px;
}

.pill {
    background-color: #373544;
    border-radius: 25px;
    padding: 11px 16px;
    height: 44px;
}

.btn-width-150::v-deep .btn-group-button {
    width: 150px;
}

.mostPlayed {
    padding-left: 28px;
    width: 280px;
}

.item {
    padding: 8px 0;
    /* width: 280px; */
}

.lds-ring {
    display: flex;
    align-self: center;
    /* padding-top: 10%; */
    position: relative;
    width: 20px;
    height: 20px;
}
.lds-ring div {
    box-sizing: border-box;
    display: block;
    position: absolute;
    width: 16px;
    height: 16px;
    margin: 2px;
    border: 8px solid #fff;
    border-radius: 80%;
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
