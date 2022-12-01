<template>
    <div>
        <h1>Login Page</h1>
        <div style="border: solid">
            <div>Pomodoro</div>
            <div>+</div>
            <div>Spotify</div>
            <div>=</div>
            <div>Adorify</div>
        </div>
        <button @click="login">Login with Spotify</button>
        <div>Spotify Premium account required</div>
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
};
</script>

<style></style>
