<template>
    <div class="scrollable wrapper">
        <div class="scrollable-content page">
            <div class="leftSection">
                <div class="leftContent">
                    <div class="topInfo">
                        <div class="topLine">
                            <div class="wh36n">Pomodoro</div>
                            <div class="wh20n">+</div>
                            <!-- <div class="wh36n">Spotify</div> -->
                            <img src="../public/images/Spotify_Logo_RGB_White.png" height="48" width="auto" />
                        </div>
                        <div class="wh20n">=</div>
                        <img src="../public/images/adorify_logo_full.svg" height="72" width="auto" />
                    </div>
                    <button class="button loginButton" @click="login">
                        <span class="wh18b">Log in with Spotify</span>
                    </button>
                    <div class="gr16">Spotify Premium account required</div>
                    <div id="footer">
                        <router-link to="/privacy" class="gr12">Privacy Policy</router-link>
                        <span class="gr12">|</span>
                        <!-- <span class="gr12">Donate</span>
                        <span class="gr12">|</span> -->
                        <span class="gr12">©2023 Adorify</span>
                    </div>
                </div>
            </div>
            <div class="rightSection">
                <div class="rightContent">
                    <Splide
                        ref="splide"
                        :options="{ type: 'loop', autoplay: true, arrows: false, pagination: true, height: '480px', width: '540px'}">
                        <SplideSlide>
                            <div class="slide">
                                <img class="demoImg" src="../public/images/ls1.png" height="300" />
                                <div class="wh30b botText">Pomodoro sessions and Spotify study music, all in one.</div>
                            </div>
                        </SplideSlide>
                        <SplideSlide>
                            <div class="slide">
                                <img class="demoImg" src="../public/images/ls2.png" height="300"/>
                                <div class="wh30b botText">Focus while your music plays. When the music stops, take a break!</div>
                            </div>
                        </SplideSlide>
                        <SplideSlide>
                            <div class="slide">
                                <img class="demoImg" src="../public/images/ls3.png" height="300"/>
                                <div class="wh30b botText">Browse the most productive playlists curated by other users!</div>
                            </div>
                        </SplideSlide>
                        <SplideSlide>
                            <div class="slide">
                                <img class="demoImg" src="../public/images/ls4.png" height="300"/>
                                <div class="wh30b botText">Keep studying to climb the leaderboards!</div>
                            </div>
                        </SplideSlide>
                    </Splide>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { Splide, SplideSlide } from '@splidejs/vue-splide';

export default {
    components: { Splide, SplideSlide },
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
    mounted() {
        this.$refs.splide._data.splide.root.classList.add('is-overflow');
    }
};
</script>

<style scoped>

.wrapper {
    width: 100%;
    position: fixed;
    top: 0px;
}

.page {
    height: 100%;
    min-height: 500px;
    display: flex;
}

.leftSection {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.topInfo {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
}

.topLine {
    display: flex;
    align-items: center;
    gap: 10px;
}

.loginButton {
    margin-top: 24px;
    margin-bottom: 16px;
    width: 420px;
}

.rightSection {
    display: none;
}

@media (min-width: 1100px) {
    .leftSection {
        width: 45%;
    }
    .rightSection {
        background-color: #664eff;
        width: 55%;
        display: flex;
        justify-content: center;
        align-items: center;

        border-radius: 40px 0 0 40px;
    }
}

.slide {
    width: 540px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 40px;
}

.demoImg {
    border-radius: 25px;
    box-shadow: 0px 4px 10px 4px rgba(0, 0, 0, 0.25);
}

.botText {
    text-align: center;
}


/* .page {
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
} */
</style>
