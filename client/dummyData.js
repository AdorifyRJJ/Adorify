const myLikedPlaylists = [
    "Instrumental Study",
    "Classical",
    "Lo-fi Hip Hop",
    "Study Playlist #1",
    "Ballad",
    "wjsn2",
    "wjsn4",
    "twice2",
];

const myMostPlayedPlaylists = ["wjsn2", "wjsn4", "twice2"];

const leaderboardByWeek = [
    { username: "jerrya", focusTime: "21hr 54min" },
    { username: "billybob123", focusTime: "20hr 28min" },
    { username: "mozart.12", focusTime: "19hr 6min" },
    { username: "joeya", focusTime: "19hr 6min" },
    { username: "ronalda", focusTime: "0hr 2min" },
];

const leaderboardByMonth = [
    { username: "ronalda", focusTime: "52hr 54min" },
    { username: "jerrya", focusTime: "21hr 54min" },
    { username: "billybob123", focusTime: "20hr 28min" },
    { username: "mozart.12", focusTime: "19hr 6min" },
    { username: "joeya", focusTime: "19hr 6min" },
];

const leaderboardByAllTime = [
    { username: "joeya", focusTime: "119hr 6min" },
    { username: "ronalda", focusTime: "52hr 54min" },
    { username: "jerrya", focusTime: "21hr 54min" },
    { username: "billybob123", focusTime: "20hr 28min" },
    { username: "mozart.12", focusTime: "19hr 6min" },
];

const mySpotifyPlaylists = [
    {
        playlistName: "wjsn1",
        username: "jerrya",
        public: false,
        liked: false,
    },
    {
        playlistName: "wjsn2",
        username: "jerrya",
        public: false,
        liked: true,
    },
    {
        playlistName: "wjsn3",
        username: "jerrya",
        public: true,
        liked: false,
    },
    {
        playlistName: "wjsn4",
        username: "jerrya",
        public: true,
        liked: true,
    },
];

const publicPlaylists = [
    {
        playlistName: "wjsn3",
        username: "jerrya",
        public: true,
        liked: false,
    },
    {
        playlistName: "wjsn4",
        username: "jerrya",
        public: true,
        liked: true,
    },
    { playlistName: "twice1", username: "ronalda", public: true, liked: false },
    { playlistName: "twice2", username: "ronalda", public: true, liked: true },
];
export {
    // myLikedPlaylists,
    myMostPlayedPlaylists,
    leaderboardByWeek,
    leaderboardByMonth,
    leaderboardByAllTime,
    mySpotifyPlaylists,
    publicPlaylists,
};
