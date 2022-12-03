<template>
    <main>

    </main>
</template>

<script>
export default {
  name: "CallbackPage",
  async beforeCreate() {
    if (this.$route.query.code) {
      await fetch(`/api/spotify/initializeAuth?code=${this.$route.query.code}`);
    }
    await fetch("/api/users/session", method: 'POST', body: {username: myDataJson.data.body.id});
    this.$router.push('/');
  },
};
</script>

<style></style>
