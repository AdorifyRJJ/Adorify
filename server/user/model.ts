import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';
import { Playlist } from '../playlist/model';

export type User = {
  _id: Types.ObjectId;
  username: string;
  likedPlaylists: Array<Types.ObjectId>;
};

export type PopulatedUser = {
  _id: Types.ObjectId;
  username: string;
  likedPlaylists: Array<Playlist>;
}

const UserSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  likedPlaylists: {
    type: [Schema.Types.ObjectId],
    ref: 'Playlist',
    required: true
  },
});

const UserModel = model<User>('User', UserSchema);
export default UserModel;
