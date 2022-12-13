<template>
    <div class="item" :class="user.displayName === $store.state.username ? 'me' : ''">
        <div class="gr26b margin-r-46">{{ this.rank }}</div>
        <img :src="this.user.imgURL" class="image" width="50" height="50" />
        <div class="rightDiv">
            <div class="wh20n">{{ this.user.displayName }}</div>
            <div class="wh20n">{{ this.focusTime }}</div>
        </div>
    </div>
</template>

<script>
import { formatHrFromSec, formatMinFromSec } from "../../utils.js";
export default {
    name: "UserItem",
    props: ["rank", "user"],
    computed: {
        focusTime() {
            const focusTime_sec = this.user.focusTime * 60;
            return (
                formatHrFromSec(focusTime_sec) +
                "hr " +
                formatMinFromSec(focusTime_sec, true) +
                "min"
            );
        },
    },
};
</script>

<style scoped>
.item {
    display: flex;
    align-items: center;
    padding: 4px 8px;
}

.image {
    object-fit: cover;
    border: 3px solid #664eff;
    border-radius: 100%;
    margin: 0 24px;
}

.margin-r-46 {
    margin-right: 46px;
}

.rightDiv {
    display: flex;
    /* border: solid; */
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
}

.me {
    background-color: rgba(255, 255, 255, 0.05);
    border-radius: 5px;
}
</style>
