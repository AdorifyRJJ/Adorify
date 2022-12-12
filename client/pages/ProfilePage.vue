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
                        <div class="pill wh20n">xxxhr xxmin</div>
                        <div class="pill wh20n">xxx/xxx (xx.x%)</div>
                    </div>
                </div>
            </div>
        </div>

        <div class="btn-group marginy-32">
            <button
                :class="{ selectedBtn: isSelected, unselectedBtn: !isSelected }"
                class="btn-group-button btn-width-150"
                @click="getThisWeek"
            >
                <span class="wh20n">This Week</span>
            </button>
            <button
                :class="{ selectedBtn: isSelected, unselectedBtn: !isSelected }"
                class="btn-group-button btn-width-150"
                @click="getThisMonth"
            >
                <span class="wh20n">This Month</span>
            </button>
        </div>
        <div class="bottomUserStats">
            <div class="mostPlayed">
                <div class="wh30b marginb-14">Most Played</div>
                <div class="">
                    <div
                        :key="i"
                        v-for="(playlist, i) in $store.state.myLikedPlaylists"
                        class="item wh20n truncate1line"
                    >
                        {{ playlist.name }}
                    </div>
                </div>
            </div>
            <div>
                <div class="wh30b marginb-14">Productivity</div>
                <div>{{ this.stats }}</div>
            </div>
        </div>
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
    },
    async beforeCreate() {
        if (this.$store.state.connected) {
            this.$store.commit("forceDisconnect");
        }
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
}
.btn-width-150 {
    width: 150px;
}
.selectedBtn {
    background-color: #6c4eb3;
}

.unselectedBtn {
    background-color: #373544;
}

.mostPlayed {
    padding-left: 28px;
}

.item {
    padding: 8px 0;
    width: 280px;
}
</style>
