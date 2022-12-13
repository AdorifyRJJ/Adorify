<template>
    <nav>
        <div class="left">
            <router-link to="/">
                <img src="images/adorify_logo_full.svg">
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
    line-height: 1.5;
    padding: 18px 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.left {
    display: flex;
    align-items: center;
}

a {
    display: flex;
    align-items: center;
}

.right {
    display: flex;
    gap: 30px;
    align-items: center;
}

a:hover {
}

.right > .router-link-active {
    box-shadow: 0 3px #664EFF;
}


</style>