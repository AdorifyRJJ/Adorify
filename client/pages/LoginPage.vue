<template>
    <div class="page">
        <div class="cen">
            <div class="shadow-box margin-y-40 width-500">
                <div class="wh40n">Pomodoro</div>
                <div class="wh20n">+</div>
                <div class="wh40n">Spotify</div>
                <div class="wh20n">=</div>
                <img src="images/adorify_logo_full.svg" height="72" width="auto" />
            </div>
            <button class="button margin-y-14 width-500" @click="login">
                <span class="wh20b">Log in with Spotify</span>
            </button>
            <div class="gr20">Spotify Premium account required</div>
        </div>
    </div>
</template>

<script>
export default {
    name: "LoginPage",
    methods: {
        async login() {
            const data = await fetch("/api/spotify/login");
            const rURL = await data.text();
            window.location.href = rURL;
        },
    },
    beforeCreate() {
        if (this.$store.state.displayName) {
            this.$router.push({ name: "Profile" });
        }
    },
};
</script>

<style scoped>
.page {
    display: flex;
    flex-direction: column;
}

.cen {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.width-500 {
    width: 500px;
}

.margin-y-14 {
    margin: 14px 0;
}

.margin-y-40 {
    margin: 40px 0;
}

.shadow-box {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: #1f1b2e;
    box-shadow: 0px 0px 10px 4px rgba(255, 255, 255, 0.25);
    border-radius: 25px;
    height: 400px;
    gap: 8px;
}
</style>
