import UserCollection from "../user/collection";
import { Playlist } from "./model";

function generateExpiryDate(): Date {
  const now = new Date();
  const msToAdd = 10 * 60*60*1000 + Math.floor(Math.random() * 5 * 60*60*1000);
  return new Date(now.getTime() + msToAdd);
}

// const shallowSpotifyResponse = async (username: string, playlist: SpotifyApi.PlaylistObjectSimplified): Promise<any> => {
//   return {
//     ...playlist,
//     imageUrl: playlist.images[0]?.url,
//     isLiked: await UserCollection.inLikedPlaylists(username, playlist.id),
//   };
// };

const shallowDbResponse = async (username: string, playlist: Playlist): Promise<any> => {
  return {
    ...playlist,
    isLiked: await UserCollection.inLikedPlaylists(username, playlist.spotifyId),
  };
};

export {
  // shallowSpotifyResponse,
  shallowDbResponse,
  generateExpiryDate,
}