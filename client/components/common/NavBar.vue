<!-- A basic navigation bar component -->
<!-- Example of a component which is included on all pages (via App.vue) -->
<!-- This navbar takes advantage of both flex and grid layouts for positioning elements; feel free to redesign as you see fit! -->

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
    padding: 30px 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.left {

}

.right {
    display: grid;
    gap: 30px;
    grid-auto-flow: column;
}

</style>
	Boolean	false	Flag to make the carousel loop around when it reaches the end.
m