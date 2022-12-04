<template>
  <div>
    <h1>Playlist Info Page</h1>
    <MyLikedPlaylists />
    <div>[Playlist info]</div>
    <LikeButton :playlist="playlist" />

    <!-- push or link?? -->
    <button @click="exit">Back</button>
    <!-- <router-link to="/playlists"><div>Back</div></router-link> -->

    <TrackItem :key="i" v-for="(track, i) in this.tracks" :track="track" />
  </div>
</template>

<script>
import MyLikedPlaylists from "../components/MyLikedPlaylists.vue";
import TrackItem from "../components/Playlists/TrackItem.vue";
import LikeButton from "../components/common/LikeButton.vue";
export default {
  components: { MyLikedPlaylists, TrackItem, LikeButton },
  name: "PlaylistInfoPage",
  data() {
    return {
      spotifyId: this.$route.params.spotifyId,
      playlist: null,
      tracks: [],
    };
  },
  computed: {},
  methods: {
    exit() {
      this.$router.back();
    },
  },
  mounted() {
    //api calls
    // GET /api/playlists/info/:spotifyId/tracks?offset=
    // GET /api/playlists/info/:spotifyId
    this.playlist = this.$store.getters.getPlaylistById(this.spotifyId);
    this.tracks = [
      this.playlist.playlistName + "_1",
      this.playlist.playlistName + "_2",
      this.playlist.playlistName + "_3",
      this.playlist.playlistName + "_4",
    ];
  },
  async beforeCreate() {
    if (!this.$store.state.displayName) {
      this.$router.push({ name: "Login" });
    }
    if (this.$store.state.connected) {
      this.$store.commit("forceDisconnect");
    }
  },
};
</script>

<style></style>
