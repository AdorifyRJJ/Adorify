<template>
  <v-app>
    <v-select
      :items="items"
      v-model="selectedItem"
      v-on:change="transferData"
      solo
    ></v-select>
  </v-app>
</template>

<script>
export default {
  name: "AdorifyDropdown",
  props: ["items", "updateSelection"],
  data() {
    return {
      selectedItem: null,
    };
  },
  methods: {
    transferData() {
      this.updateSelection(this.selectedItem);
    },
  },
};
</script>

<style scoped src="vuetify/dist/vuetify.min.css"></style>
