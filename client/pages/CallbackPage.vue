<template>
    <main>

    </main>
</template>

<script>
export default {
  name: "CallbackPage",
  async beforeCreate() {
    if (this.$route.query.code) {
      const myData = await fetch(`/api/spotify/initializeAuth?code=${this.$route.query.code}`);
      if (myData.ok) {
        const myDataJson = await myData.json();
        this.$store.commit("setUsername", myDataJson.id);
        this.$store.commit("scheduleRefresh");
      }
      this.$router.push('/');
    }
  },
};
</script>

<style></style>
