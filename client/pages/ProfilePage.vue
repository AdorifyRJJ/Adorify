<template>
    <div v-if="!deleting" class="page">
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
                    <button class="button delete" @click="deleteScreen">
                        <span class="wh20b">Delete</span>
                    </button>
                </div>
                <div class="bottomDiv">
                    <div class="wh40b margin-b-8">
                        {{ $store.state.displayName }}
                    </div>
                    <div class="completionInfo">
                        <div class="pill wh20n">
                            <div v-if="loading" class="lds-ring">
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                            </div>
                            <div v-else class="pillInfo">
                                {{ this.totalTime }}
                                <img src="../public/images/studyTime.svg" />
                            </div>
                        </div>
                        <div class="pill wh20n">
                            <div v-if="loading" class="lds-ring">
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                            </div>
                            <div v-else class="pillInfo">
                                {{ this.sessionInfo }}
                                <img src="../public/images/completed.svg" />
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
            class="btn-width-140 margin-b-30 margin-t-18"
        />
        <div class="bottomUserStats">
            <div class="mostPlayed">
                <div class="wh30b margin-b-10">Most Played</div>
                <div class="">
                    <div
                        :key="i"
                        v-for="(playlist, i) in mostPlayed"
                        class="item gr20 truncate1line"
                    >
                        {{ playlist.name }}
                    </div>
                </div>
            </div>
            <div class="productivity">
                <div class="wh30b margin-b-14 padding-l-10">Productivity</div>
                <LineChartGenerator
                    class="chart"
                    :chart-options="options"
                    :chart-data="chartData"
                />
            </div>
        </div>
    </div>
    <div v-else class="deleteModal center">
        <div class="modalText">
            Are you sure? This action will delete all data associated with your
            account.
        </div>
        <div class="modalButtons">
            <button class="button" @click="noDelete">
                <span class="wh20b">No, don't delete</span>
            </button>
            <button class="button delete" @click="yesDelete">
                <span class="wh20b">Yes, delete permanently</span>
            </button>
        </div>
    </div>
</template>

<script>
import ButtonGroup from "../components/common/ButtonGroup.vue";
import { formatHrFromSec, formatMinFromSec, getLastXDates } from "../utils.js";

import { Line as LineChartGenerator } from "vue-chartjs";
import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    LineElement,
    LinearScale,
    CategoryScale,
    PointElement,
} from "chart.js";

ChartJS.register(
    Title,
    Tooltip,
    Legend,
    LineElement,
    LinearScale,
    CategoryScale,
    PointElement
);

export default {
    components: { ButtonGroup, LineChartGenerator },
    name: "ProfilePage",
    data() {
        return {
            btnGroupTitles: ["This Week", "This Month"],
            selectIdx: 0,
            mostPlayed: [],
            _mostPlayedWeek: [],
            _mostPlayedMonth: [],
            studyTime: [],
            sessionInfo: null,
            totalTime: null,
            loading: true,
            deleting: false,

            chartData: {},
            options: {
                layout: {
                    padding: { right: 10 },
                },
                plugins: {
                    tooltip: {
                        // callbacks: {
                        //     label: function (context) {
                        //         return context.dataset.data + " hr";
                        //     },
                        // },
                    },
                    legend: { display: false },
                },
                scales: {
                    y: {
                        ticks: {
                            maxTicksLimit: 5,
                            font: {
                                size: 18,
                                weight: "normal",
                            },
                            padding: 10,
                            color: "#a9a9a9",
                            callback: function (value, index, ticks) {
                                return value + "hr";
                            },
                        },
                        grid: {
                            display: false,
                        },
                        border: {
                            display: false,
                        },
                    },

                    x: {
                        display: false,
                        grid: {
                            display: false,
                        },
                        border: {
                            display: false,
                        },
                    },
                },
                responsive: true,
                maintainAspectRatio: false,
            },
        };
    },
    computed: {},
    methods: {
        updateContent(i) {
            this.selectIdx = i;
            if (i === 0) {
                this.mostPlayed = this._mostPlayedWeek;
                const labels = getLastXDates(7);
                this.chartData = {
                    labels: labels,
                    datasets: [
                        {
                            label: "Focus Time",
                            data: this.studyTime.slice(-7),
                            fill: true,
                            borderColor: "#664EFF",
                            backgroundColor: "#664EFF",
                            borderWidth: 2,
                            pointRadius: 10,
                        },
                    ],
                };
            } else if (i === 1) {
                this.mostPlayed = this._mostPlayedMonth;
                const labels = getLastXDates(28);
                this.chartData = {
                    labels: labels,
                    datasets: [
                        {
                            label: "Focus Time",
                            data: this.studyTime,
                            fill: true,
                            borderColor: "#664EFF",
                            backgroundColor: "#664EFF",
                            borderWidth: 2,
                            pointRadius: 4,
                        },
                    ],
                };
            }
        },
        async logout() {
            await fetch(`/api/spotify/logout`);
            this.$store.commit("resetStore");
            this.$router.push({ name: "Login" });
        },
        deleteScreen() {
            this.deleting = true;
        },
        noDelete() {
            this.deleting = false;
        },
        async yesDelete() {
            await fetch(`/api/users`, {
                headers: { "Content-Type": "application/json" },
                method: "DELETE",
            });
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
        // console.log(res)
        // calculate total time
        const _totalTime_sec = res.totalTime * 60;
        const min = formatMinFromSec(_totalTime_sec, true);
        const hr = formatHrFromSec(_totalTime_sec);
        this.totalTime = `${hr}hr ${min}min`;

        // calculate session info
        const completedSessions = res.completed;
        const totalSessions = res.totalSessions;
        this.sessionInfo =
            totalSessions === 0
                ? "0%"
                : `${completedSessions}/${totalSessions}
                (${((completedSessions / totalSessions) * 100).toFixed(1)}%)`;

        this._mostPlayedWeek = res.mostPlayed.week;
        this._mostPlayedMonth = res.mostPlayed.month;
        this.studyTime = res.studyTime.map(
            (val) => Math.round((val / 60 + Number.EPSILON) * 1000) / 1000
        );
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

.bottomUserStats {
    display: flex;
    flex-direction: row;
    width: 900px;
    height: 300px;
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
    justify-content: flex-end;
    gap: 10px;
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

.margin-b-14 {
    margin-bottom: 14px;
}

.margin-b-30 {
    margin-bottom: 30px;
}

.margin-t-18 {
    margin-top: 18px;
}

.padding-l-10 {
    padding-left: 10px;
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

.pillInfo {
    display: flex;
    gap: 10px;
    align-items: center;
}

.btn-width-140::v-deep .btn-group-button {
    width: 140px;
}

.mostPlayed {
    padding-left: 28px;
    width: 280px;
}

.item {
    padding: 8px 0;
}

.delete {
    background-color: transparent;
    border: 3px solid #6c4eb3;
}

.modalText {
    margin-bottom: 20px;
}

.modalButtons {
    display: flex;
    gap: 10px;
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
    border: 3px solid #fff;
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
.productivity {
    display: flex;
    flex-direction: column;
    /* border: solid; */

    width: 580px;
}

.chart {
    /* border: solid; */
    height: 100%;
    width: 100%;
}
</style>
