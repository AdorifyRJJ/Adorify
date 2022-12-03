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
    await fetch("/api/users/session", method: 'POST', body: JSON.stringify({username: this.$store.state.username}));
    this.$router.push('/');
  },
};
</script>

<style></style>
