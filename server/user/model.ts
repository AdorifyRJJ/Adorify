import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';
import { Playlist } from '../playlist/model';

export type User = {
  _id: Types.ObjectId;
  username: string;
  likedPlaylistIds: Array<string>;
};

export type PopulatedUser = {
  _id: Types.ObjectId;
  username: string;
  likedPlaylistIds: Array<string>;
  likedPlaylists: Array<Playlist>;
};

const UserSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
  likedPlaylistIds: {
    type: [String],
    required: true
  },
});

UserSchema.virtual('likedPlaylists', {
  ref: 'Playlist',
  localField: 'likedPlaylistIds',
  foreignField: 'spotifyId',
})

const UserModel = model<User>('User', UserSchema);
export default UserModel;
