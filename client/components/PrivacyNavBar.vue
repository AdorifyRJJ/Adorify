<template>
  <nav>
      <div class="left">
          <router-link to="/login">
              <img src="../public/images/adorify_logo_full.svg">
          </router-link>
      </div>
      <div class="right">
        <button class="button loginButton" @click="login">
          <span class="wh18b">Log in with Spotify</span>
        </button>
      </div>
  </nav>
</template>

<script>
export default {
  name: "PrivacyNavBar",
  methods: {
        async login() {
            const data = await fetch("/api/spotify/login");
            const rURL = await data.text();
            window.location.href = rURL;
        },
    },
};
</script>

<style scoped>
nav {
  font-size: 0px;
  padding: 18px 26px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}


.loginButton {
  height: 36px;
}


</style>