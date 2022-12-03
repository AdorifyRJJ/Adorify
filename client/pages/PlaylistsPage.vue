<template>
    <div>
        <h1>Playlists Page</h1>
        <h3>Liked</h3>
        <div :key="i" v-for="(playlist, i) in myLikedPlaylists">
            {{ playlist }}
        </div>
        <h3>Find playlists</h3>
        <div>
            <button @click="getMyPlaylists">Spotify Library</button>
            <button @click="getPublicPlaylists">Public Playlists</button>
        </div>
        <PlaylistCard
            :key="'uwu' + j"
            v-for="(playlist, j) in playlists"
            :playlist="playlist"
            @likePlaylist="addPlaylist"
            @unlikePlaylist="removePlaylist"
        ></PlaylistCard>
    </div>
</template>

<script>
import {
    myLikedPlaylists,
    mySpotifyPlaylists,
    publicPlaylists,
} from "../dummyData.js";
import PlaylistCard from "../components/Playlists/PlaylistCard.vue";

export default {
    components: { PlaylistCard },
    name: "PlaylistsPage",
    data() {
        return {
            myLikedPlaylists: myLikedPlaylists,
            playlists: publicPlaylists,
        };
    },
    methods: {
        getMyPlaylists() {
            this.playlists = mySpotifyPlaylists;
        },
        getPublicPlaylists() {
            this.playlists = publicPlaylists;
        },
        addPlaylist(playlistName) {
            if (!this.myLikedPlaylists.includes(playlistName)) {
                this.myLikedPlaylists.push(playlistName);

                const objIdx = this.playlists.findIndex(
                    (obj) => obj.playlistName === playlistName
                );
                this.playlists[objIdx].liked = true;

                // this.playlists.map((playlist) => {
                //     if (playlist.playlistName === playlistName) {
                //         playlist.liked = true;
                //     }
                // });
            }
        },
        removePlaylist(playlistName) {
            if (this.myLikedPlaylists.includes(playlistName)) {
                const idx = this.myLikedPlaylists.indexOf(playlistName);
                if (idx > -1) {
                    this.myLikedPlaylists.splice(idx, 1);
                }

                const objIdx = this.playlists.findIndex(
                    (obj) => obj.playlistName === playlistName
                );
                this.playlists[objIdx].liked = false;

                // this.playlists.map((playlist) => {
                //     if (playlist.playlistName === playlistName) {
                //         playlist.liked = false;
                //     }
                // });
            }
        },
    },
};
</script>

<style></style>
