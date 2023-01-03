import UserCollection from "../user/collection";
import { Playlist } from "./model";

function generateExpiryDate(): Date {
  const now = new Date();
  const msToAdd = 10 * 60*60*1000 + Math.floor(Math.random() * 5 * 60*60*1000);
  // const msToAdd = 1 * 60*1000 + Math.floor(Math.random() * 2 * 60*1000);
  return new Date(now.getTime() + msToAdd);
}

const shallowSpotifyResponse = async (username: string, playlist: SpotifyApi.PlaylistObjectSimplified): Promise<any> => {
  return {
    ...playlist,
    image: playlist.images[0]?.url,
    isLiked: await UserCollection.inLikedPlaylists(username, playlist.id),
  };
};

const shallowDbResponse = async (username: string, playlist: Playlist): Promise<any> => {
  return {
    id: playlist.spotifyId,
    name: playlist.name,
    image: playlist.imageUrl,
    owner: {id: playlist.ownerId, display_name: playlist.ownerName},
    public: playlist.isPublic,
    isLiked: await UserCollection.inLikedPlaylists(username, playlist.spotifyId),
  };
};

export {
  shallowSpotifyResponse,
  shallowDbResponse,
  generateExpiryDate,
}