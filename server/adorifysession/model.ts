import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';

export type AdorifySession = {
  _id: Types.ObjectId;
  username: string;
  spotifyPlaylistId: string;
  length: number;
  startTime: Date;
  completed: number;
  initializedSessions: number;
};

const AdorifySessionSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  spotifyPlaylistId: {
    type: String,
    required: true
  },
  length: {
    type: Number,
    required: true
  },
  startTime: {
    type: Date,
    required: true
  },
  completed: {
    type: Number,
    required: true
  },
  initializedSessions: {
    type: Number,
    required: true,
  }
});

// AdorifySessionSchema.virtual('playlist', {
//   ref: 'Playlist',
//   localField: 'spotifyPlaylistId',
//   foreignField: 'spotifyId',
// })

const AdorifySessionModel = model<AdorifySession>('AdorifySession', AdorifySessionSchema);
export default AdorifySessionModel;
