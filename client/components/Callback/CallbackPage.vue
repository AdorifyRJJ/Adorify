<!-- Page for account settings and management -->
<!-- User should be authenticated in order to see this page -->

<template>
  <main>
    <h1>Header</h1>
    <h2>Code: {{ code }}</h2>
  </main>
</template>

<script>
export default {
  name: "CallbackPage",
  async mounted() {
    if (this.$route.query.code) {
      console.log("cbpage");
      this.code = this.$route.query.code;
      await fetch(`/api/spotify/getToken?code=${this.code}`);
      this.$router.push({ name: 'Home' });
      console.log("cbpage2");
    }
  },
  data() {
    return {
      code: null,
    };
  },
};
</script>
