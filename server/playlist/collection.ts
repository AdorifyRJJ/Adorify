import type {HydratedDocument, Types} from 'mongoose';
import type {Playlist} from './model';
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

  static async findOne(id: Types.ObjectId | string): Promise<HydratedDocument<Playlist>> {
    return PlaylistModel.findOne({_id: id});
  }

  static async findOneBySpotifyId(spotifyId: string): Promise<HydratedDocument<Playlist>> {
    return PlaylistModel.findOne({spotifyId: spotifyId});
  }

  static async findMostLikes(): Promise<Array<HydratedDocument<Playlist>>> {
    return PlaylistModel.find({isPublic: true}).sort({numLikes: -1}).limit(20);
  }

  static async findMostUsed(): Promise<Array<HydratedDocument<Playlist>>> {
    return PlaylistModel.find({isPublic: true}).sort({numUsed: -1}).limit(20);
  }

  static async findMostProductive(): Promise<Array<HydratedDocument<Playlist>>> {
    // improve this metric in the future
    return PlaylistModel.find({isPublic: true}).sort({numCompleted: -1}).limit(20);
  }

  static async addLike(id: Types.ObjectId | string): Promise<void> {
    const playlist = await PlaylistModel.findOne({_id: id});
    playlist.numLikes++;

    await playlist.save();
  }

  static async removeLike(id: Types.ObjectId | string): Promise<void> {
    const playlist = await PlaylistModel.findOne({_id: id});
    playlist.numLikes--;

    await playlist.save();
  }

  static async addUsed(id: Types.ObjectId | string): Promise<void> {
    const playlist = await PlaylistModel.findOne({_id: id});
    playlist.numUsed++;

    await playlist.save();
  }

  static async addCompleted(id: Types.ObjectId | string): Promise<void> {
    const playlist = await PlaylistModel.findOne({_id: id});
    playlist.numCompleted++;

    await playlist.save();
  }

  static async updateIsPublic(id: Types.ObjectId | string, isPublic: boolean): Promise<void> {
    const playlist = await PlaylistModel.findOne({_id: id});
    playlist.isPublic = isPublic;

    await playlist.save();
  }
}

export default PlaylistCollection;
