<template>
    <div>UserItem: {{ this.rank }} {{ this.user }}</div>
</template>

<script>
export default {
    name: "UserItem",
    props: ["rank", "user"],
};
</script>

<style></style>
