import type {HydratedDocument, Types} from 'mongoose';
import UserCollection from "../user/collection";
import { playlistRouter } from './router';

const constructMinePlaylistResponse = async (username: string, playlist: SpotifyApi.PlaylistObjectSimplified): Promise<any> => {
  return {
    ...playlist,
    isLiked: await UserCollection.inLikedPlaylists(username, playlist.id),
  };
};

const constructSinglePlaylistResponse = async (username: string, id: Types.ObjectId | string, playlist: SpotifyApi.SinglePlaylistResponse): Promise<any> => {
  return {
    ...playlist,
    _id: id,
    isLiked: await UserCollection.inLikedPlaylists(username, playlist.id),
  };
}

const constructPlaylistTrackResponse = async (username: string, id: Types.ObjectId | string, tracks: SpotifyApi.PlaylistTrackResponse): Promise<any> => {
  return {
    ...playlist,
    _id: id,
    isLiked: await UserCollection.inLikedPlaylists(username, playlist.id),
  };
}

export {
  constructMinePlaylistResponse,
  constructSinglePlaylistResponse
}