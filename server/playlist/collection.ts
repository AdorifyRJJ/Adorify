import type { HydratedDocument, Types } from 'mongoose';
import type { Playlist } from './model';
import PlaylistModel from './model';
import { generateExpiryDate } from './util';

class PlaylistCollection {
  static async addOne(spotifyId: string, ownerId: string, name: string, imageUrl: string, ownerName: string, isPublic: boolean): Promise<HydratedDocument<Playlist>> {
    const expiryTime = generateExpiryDate();
    const playlist = new PlaylistModel({
      spotifyId: spotifyId,
      numLikes: 0,
      numUsed: 0,
      numCompleted: 0,
      ownerId: ownerId,
      name: name,
      imageUrl: imageUrl,
      ownerName: ownerName,
      isPublic: isPublic,
      expiryTime: expiryTime,
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

  static async deleteAllByOwner(ownerId: string): Promise<void> {
    await PlaylistModel.deleteMany({ ownerId: ownerId });
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
    ]).sort({ productivityRatio: -1, numUsed: -1, spotifyId: 1 }).skip(offset).limit(6);
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

  static async update(spotifyId: string, name: string, imageUrl: string, ownerName: string, isPublic: boolean): Promise<HydratedDocument<Playlist>> {
    const playlist = await PlaylistModel.findOne({ spotifyId: spotifyId });
    playlist.name = name;
    playlist.imageUrl = imageUrl;
    playlist.ownerName = ownerName;
    playlist.isPublic = isPublic;
    playlist.expiryTime = generateExpiryDate();

    console.log('pls')
    await playlist.save();
    console.log('ret')
    return playlist;
  }


}

export default PlaylistCollection;
