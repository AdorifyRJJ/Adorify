import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';

export type Playlist = {
  _id: Types.ObjectId;
  spotifyId: string;
  numLikes: number;
  numUsed: number;
  numCompleted: number;
  owner: string;
  name: string;
  isPublic: boolean;
};

const PlaylistSchema = new Schema({
  spotifyId: {
    type: String,
    unique: true,
    required: true
  },
  numLikes: {
    type: Number,
    required: true
  },
  numUsed: {
    type: Number,
    required: true
  },
  numCompleted: {
    type: Number,
    required: true
  },
  owner: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  isPublic: {
    type: Boolean,
    required: true
  },
});

const PlaylistModel = model<Playlist>('Playlist', PlaylistSchema);
export default PlaylistModel;
