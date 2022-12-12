<template>
    <div class="btn-group">
        <button
            :key="i"
            v-for="(title, i) in titles"
            :class="{
                selectedBtn: idx === i,
                unselectedBtn: idx !== i,
            }"
            class="btn-group-button"
            @click="handleSelect(i)"
        >
            <span class="wh20n">{{ title }}</span>
        </button>
    </div>
</template>

<script>
export default {
    name: "ButtonGroup",
    props: ["titles", "initIdx"],
    data() {
        return {
            idx: this.initIdx,
        };
    },
    methods: {
        handleSelect(i) {
            this.idx = i;
            this.$emit("selectIdx", i);
        },
    },
};
</script>

<style scoped>
.selectedBtn {
    background-color: #6c4eb3;
}

.unselectedBtn {
    background-color: #373544;
}
</style>
