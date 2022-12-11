export type StudyDate = {
    date: Date,
    studyTime: number,
}

export type PlaylistDate = {
    date: Date,
    spotifyPlaylistId: string,
}

//helper function to split into week, month, and alltime* arrays