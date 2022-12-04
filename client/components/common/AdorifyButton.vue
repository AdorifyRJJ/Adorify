<template>
    <div>
        <v-btn @click="clickHandler">{{content}}</v-btn>
    </div>
</template>

<script>

export default {
    name: "AdorifyButton",
    props: ['content', 'clickHandler']
};
</script>

<style scoped src="vuetify/dist/vuetify.min.css"></style>
