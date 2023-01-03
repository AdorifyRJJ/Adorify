import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';

export type Playlist = {
  _id: Types.ObjectId;
  spotifyId: string;
  numLikes: number;
  numUsed: number;
  numCompleted: number;
  ownerId: string;
  name: string;
  imageUrl: string;
  ownerName: string;
  isPublic: boolean;
  expiryTime: Date;
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
  ownerId: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  ownerName: {
    type: String,
    required: true
  },
  isPublic: {
    type: Boolean,
    required: true
  },
  expiryTime: {
    type: Date,
    required: true
  },
});

const PlaylistModel = model<Playlist>('Playlist', PlaylistSchema);
export default PlaylistModel;
