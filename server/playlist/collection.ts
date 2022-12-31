import type { HydratedDocument, Types } from 'mongoose';
import type { Playlist } from './model';
import PlaylistModel from './model';

class PlaylistCollection {
  static async addOne(spotifyId: string, owner: string, isPublic: boolean): Promise<HydratedDocument<Playlist>> {
    const playlist = new PlaylistModel({
      spotifyId: spotifyId,
      numLikes: 0,
      numUsed: 0,
      numCompleted: 0,
      owner: owner,
      isPublic: isPublic,
    });
    await playlist.save();
    return playlist;
  }

  // static async findOne(id: Types.ObjectId | string): Promise<HydratedDocument<Playlist>> {
  //   return PlaylistModel.findOne({_id: id});
  // }

  static async findOneBySpotifyId(spotifyId: string): Promise<HydratedDocument<Playlist>> {
    return PlaylistModel.findOne({ spotifyId: spotifyId });
  }

  static async deleteAllByOwner(owner: string): Promise<void> {
    await PlaylistModel.deleteMany({ owner: owner });
  }

  static async countTotal(): Promise<number> {
    return PlaylistModel.find({ isPublic: true }).count();
  }

  static async findMostLikes(offset: number): Promise<Array<HydratedDocument<Playlist>>> {
    return PlaylistModel.find({ isPublic: true }).sort({ numLikes: -1, spotifyId: 1 }).skip(offset).limit(6);
  }

  static async findMostUsed(offset: number): Promise<Array<HydratedDocument<Playlist>>> {
    return PlaylistModel.find({ isPublic: true }).sort({ numUsed: -1, spotifyId: 1 }).skip(offset).limit(6);
  }

  static async findMostProductive(offset: number): Promise<Array<HydratedDocument<Playlist>>> {
    // return playlists in order of (playlist.numCompleted/playlist.numUsed) iff playlist.numCompleted > THRESHOLD
    // return PlaylistModel.find({isPublic: true}).sort({numCompleted: -1}).limit(6);
    return PlaylistModel.aggregate([
      {
        $match: { isPublic: true }
      },
      {
        $addFields: {
          productivityRatio: {
            $cond: [
              {
                $gte: ["$numCompleted", 5]
              },
              {
                $divide: ["$numCompleted", "$numUsed"]
              },
              0
            ]

          }
        }
      },
    ]).sort({ productivityRatio: -1, spotifyId: 1 }).skip(offset).limit(6)
  }

  static async addLike(spotifyId: string): Promise<void> {
    const playlist = await PlaylistModel.findOne({ spotifyId: spotifyId });
    playlist.numLikes++;

    await playlist.save();
  }

  static async removeLike(spotifyId: string): Promise<void> {
    const playlist = await PlaylistModel.findOne({ spotifyId: spotifyId });
    playlist.numLikes--;

    await playlist.save();
  }

  static async addUsed(spotifyId: string, amount: number): Promise<void> {
    const playlist = await PlaylistModel.findOne({ spotifyId: spotifyId });
    playlist.numUsed = playlist.numUsed + amount;

    await playlist.save();
  }

  static async addCompleted(spotifyId: string, amount: number): Promise<void> {
    const playlist = await PlaylistModel.findOne({ spotifyId: spotifyId });
    playlist.numCompleted = playlist.numCompleted + amount;

    await playlist.save();
  }

  static async updateIsPublic(spotifyId: string, isPublic: boolean): Promise<void> {
    const playlist = await PlaylistModel.findOne({ spotifyId: spotifyId });
    playlist.isPublic = isPublic;

    await playlist.save();
  }
}

export default PlaylistCollection;
