<template>
    <nav>
        <div class="left">
            <router-link to="/" class="wh20b">
                adorify
            </router-link>
        </div>
        <div class="right">
            <router-link to="/playlists" class="wh20b"> playlists </router-link>
            <router-link to="/leaderboard" class="wh20b"> leaderboard </router-link>
            <router-link to="/profile" class="wh20b"> profile </router-link>
        </div>
    </nav>
</template>

<script>
export default {
    name: "NavBar",
};
</script>

<style scoped>
nav {
    /* line-height: 1.2; */
    padding: 30px 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.right {
    display: flex;
    gap: 30px;
    align-items: center;
}

</style>