import UserCollection from "../user/collection";

const constructShallowPlaylistResponse = async (username: string, playlist: SpotifyApi.PlaylistObjectSimplified): Promise<any> => {
  return {
    ...playlist,
    isLiked: await UserCollection.inLikedPlaylists(username, playlist.id),
  };
};

export {
  constructShallowPlaylistResponse
}