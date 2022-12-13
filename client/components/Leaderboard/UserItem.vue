<template>
    <div class="item">
        <div class="gr26b margin-r-46">{{ this.rank }}</div>
        <img :src="this.user.imgURL" class="image" width="60" height="60" />
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
    /* border: solid; */
    align-items: center;
    height: 60px;
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
</style>
