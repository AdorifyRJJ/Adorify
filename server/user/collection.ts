import type {HydratedDocument, Types} from 'mongoose';
import PlaylistModel from '../playlist/model';
import PlaylistCollection from '../playlist/collection';
import type {User} from './model';
import UserModel from './model';

class UserCollection {
  static async addOne(username: string): Promise<HydratedDocument<User>> {
    const user = new UserModel({
      username: username,
      likedPlaylists: [],
    });
    await user.save();
    return user;
  }

  static async findOneByUsername(username: string): Promise<HydratedDocument<User>> {
    return UserModel.findOne({username: username});
  }

  // static async addToLikedPlaylists(username: string, playlist: Types.ObjectId | String): Promise<HydratedDocument<User>> {
  //   const user = await UserModel.findOne({username: username});
  //   user.likedPlaylists.push(playlist as Types.ObjectId);

  //   await user.save();
  //   return user;
  // }

  // static async deleteFromLikedPlaylists(username: string, playlist: Types.ObjectId | String): Promise<HydratedDocument<User>> {
  //   const user = await UserModel.findOne({username: username});
  //   user.likedPlaylists.push(playlist as Types.ObjectId);

  //   await user.save();
  //   return user;
  // }

  static async inLikedPlaylists(username: string, spotifyId: string): Promise<boolean> {
    const user = await UserModel.findOne({username: username});
    const playlist = await PlaylistCollection.findOneBySpotifyId(spotifyId);
    return playlist ? user.likedPlaylists.indexOf(playlist._id) !== -1 : false;
  }

  static async toggleLikedPlaylists(username: string, playlist: Types.ObjectId | string): Promise<boolean> {
    const user = await UserModel.findOne({username: username});
    const idx = user.likedPlaylists.indexOf(playlist as Types.ObjectId);
    if (idx === -1) {
      user.likedPlaylists.push(playlist as Types.ObjectId);
      await PlaylistCollection.addLike(playlist);
    }
    else {
      user.likedPlaylists.splice(idx, 1);
      await PlaylistCollection.removeLike(playlist);
    }
    await user.save();
    return idx === -1;
  }

  static async deleteOne(username: string): Promise<boolean> {
    const user = await UserModel.deleteOne({username: username});
    await PlaylistCollection.deleteAllByOwner(username);
    return user !== null;
  }
}

export default UserCollection;
