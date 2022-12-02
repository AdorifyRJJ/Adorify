<template>
    <div>{{ this.min }}:{{ this.sec }}</div>
</template>

<script>
export default {
    name: "CountDownTimer",
    props: ["time"],
    computed: {
        min() {
            return Math.floor(this.time / 60);
        },
        sec() {
            return this.time % 60;
        },
    },
};
</script>

<style></style>
