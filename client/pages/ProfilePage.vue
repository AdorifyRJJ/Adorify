<template>
  <div class="scrollable">
    <div class="scrollable-content">
      <div v-if="!deleting" class="page">
        <div class="topUserStats">
          <div class="imageBox">
            <img
              :src="
                $store.state.imgURL ??
                'https://www.computerhope.com/jargon/g/guest-user.png'
              "
              class="image"
              height="260"
              width="260"
            />
          </div>
          <div class="rightContainer">
            <div class="topDiv">
              <button class="button" @click="logout">
                <span class="wh18b">Logout</span>
              </button>
              <button class="button delete" @click="deleteScreen">
                <span class="wh18b">Delete</span>
              </button>
            </div>
            <div class="bottomDiv">
              <div class="wh40b margin-b-10 truncate1line">
                {{ $store.state.displayName }}
              </div>
              <div class="completionInfo">
                <div class="pill wh20n">
                  <div v-if="loading" class="lds-ring-sm">
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
                  <div v-if="loading" class="lds-ring-sm">
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
          class="btn-width-140 margin-y-30"
        />
        <div v-if="loading" class="lds-ring">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <div v-else class="bottomUserStats">
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
          Adorify account and disconnect it from your Spotify account.
        </div>
        <div class="modalButtons">
          <button class="button" @click="noDelete">
            <span class="wh18b">No, don't delete</span>
          </button>
          <button class="button delete" @click="yesDelete">
            <span class="wh18b">Yes, delete permanently</span>
          </button>
        </div>
      </div>
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

      inCreated: true,
      executeLogout: false,
      executeDelete: false,

      chartData: {},
      options: {
        layout: {
          padding: { right: 10 },
        },
        plugins: {
          legend: { display: false },
        },
        scales: {
          y: {
            beginAtZero: true,
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
      if (this.inCreated) {
        this.executeLogout = true;
        return;
      }
      this.executeLogout = false;
      const data = await fetch(`/api/spotify/logout`);
      // console.log(await data.json());

      this.$store.commit("resetStore");
      this.$router.push({ name: "Login" });
    },
    deleteScreen() {
      if (this.inCreated) {
        this.executeDelete = true;
        return;
      }
      this.executeDelete = false;
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
  async created() {
    this.loading = true;
    if (this.$store.state.connected) {
      this.$store.commit("forceDisconnect");
    }
    const resp = await fetch("/api/adorifySession/stats");
    const res = await resp.json();
    if (!resp.ok) {
      await fetch(`/api/spotify/logout`);
      this.$store.commit("resetStore");
      if (this.$router.history.current.name !== "Login")
        this.$router.push({ name: "Login" });
    }
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
        ? "0/0 (0%)"
        : `${completedSessions}/${totalSessions}
                (${((completedSessions / totalSessions) * 100).toFixed(1)}%)`;

    this._mostPlayedWeek = res.mostPlayed.week;
    this._mostPlayedMonth = res.mostPlayed.month;
    this.studyTime = res.studyTime.map(
      (val) => Math.round((val / 60 + Number.EPSILON) * 100) / 100
    );
    this.updateContent(this.selectIdx);
    this.loading = false;
    this.inCreated = false;
    if (this.executeLogout) {
      await this.logout();
      return;
    }
    if (this.executeDelete) {
      this.deleteScreen();
      return;
    }
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

/** Top section */

.image {
  object-fit: cover;
  border: 6px solid #664eff;
  border-radius: 100%;
  box-shadow: 0px 4px 10px 4px rgba(0, 0, 0, 0.25);
  z-index: 1;
}

.imageBox {
  width: 260px;
  height: 260px;
}

.topUserStats {
  display: flex;
  flex-direction: row;
  height: 260px;
  width: 600px;
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
  flex-direction: column;

  background: rgba(255, 255, 255, 0.05);
  border-radius: 25px;
  padding: 20px 30px 20px 180px;
  margin-left: -150px;
  z-index: 2;
}

.padding-l-10 {
  padding-left: 10px;
}

.completionInfo {
  display: flex;
  flex-direction: column;
  gap: 6px;
  align-items: flex-start;
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
  /* flex-grow: 0; */
}

.btn-width-140::v-deep .btn-group-button {
  width: 140px;
}

/** Bottom section */

.bottomUserStats {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 600px;
  height: 300px;
  margin-bottom: 8px;
}

.productivity {
  display: flex;
  flex-direction: column;
  width: 370px;
}

.chart {
  height: 100%;
  width: 100%;
}

.mostPlayed {
  padding-left: 20px;
  width: 220px;
}

.item {
  padding: 8px 0;
}

/** Delete page */

.delete {
  background-color: transparent;
  border: 3px solid #6c4eb3;
}

.modalText {
  width: 600px;
  margin: 20px 0;
}

.modalButtons {
  display: flex;
  gap: 10px;
}

@media (min-width: 1100px) {
  .topUserStats {
    width: 900px;
  }
  .bottomUserStats {
    width: 900px;
  }
  .mostPlayed {
    width: 280px;
  }
  .productivity {
    width: 600px;
  }
  .completionInfo {
    flex-direction: row;
    gap: 14px;
  }
  .bottomDiv {
    padding: 38px 30px 28px 180px;
  }
  .modalText {
    width: 900px;
  }
}

/** Loading animations */

.lds-ring-sm {
  display: flex;
  align-self: center;
  /* padding-top: 10%; */
  position: relative;
  width: 20px;
  height: 20px;
}
.lds-ring-sm div {
  box-sizing: border-box;
  display: block;
  position: absolute;
  width: 16px;
  height: 16px;
  margin: 2px;
  border: 3px solid #fff;
  border-radius: 80%;
  animation: lds-ring-sm 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  border-color: #fff transparent transparent transparent;
}
.lds-ring-sm div:nth-child(1) {
  animation-delay: -0.45s;
}
.lds-ring-sm div:nth-child(2) {
  animation-delay: -0.3s;
}
.lds-ring-sm div:nth-child(3) {
  animation-delay: -0.15s;
}
@keyframes lds-ring-sm {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.lds-ring {
  display: flex;
  align-self: center;
  padding-top: 5%;
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
