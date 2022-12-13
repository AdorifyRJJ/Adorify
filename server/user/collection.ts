import type { HydratedDocument, Types } from 'mongoose';
import AdorifySessionCollection from '../adorifysession/collection';
import PlaylistCollection from '../playlist/collection';
import type { PopulatedUser, User } from './model';
import UserModel from './model';

class UserCollection {
  static async addOne(username: string, displayName: string, imgURL: string): Promise<HydratedDocument<User>> {
    const user = new UserModel({
      username: username,
      displayName: displayName,
      imgURL: imgURL,
      likedPlaylistIds: [],
    });
    await user.save();
    return user;
  }

  static async findOneByUsername(username: string): Promise<HydratedDocument<User>> {
    return UserModel.findOne({ username: username });
  }

  static async updateDisplayName(username: string, displayName: string): Promise<void> {
    const user = await UserModel.findOne({ username: username });
    user.displayName = displayName;
    await user.save();
  }

  static async updateImgURL(username: string, imgURL: string): Promise<void> {
    const user = await UserModel.findOne({ username: username });
    user.imgURL = imgURL;
    await user.save();
  }


  static async findOneByUsernameAndPopulate(username: string): Promise<HydratedDocument<PopulatedUser>> {
    return await UserModel.findOne({ username: username }).populate('likedPlaylists');
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
    const user = await UserModel.findOne({ username: username });
    const playlist = await PlaylistCollection.findOneBySpotifyId(spotifyId);
    return playlist ? user.likedPlaylistIds.indexOf(spotifyId) !== -1 : false;
  }

  static async toggleLikedPlaylists(username: string, spotifyId: string): Promise<boolean> {
    const user = await UserModel.findOne({ username: username });
    const idx = user.likedPlaylistIds.indexOf(spotifyId);
    if (idx === -1) {
      user.likedPlaylistIds.push(spotifyId);
      await PlaylistCollection.addLike(spotifyId);
    }
    else {
      user.likedPlaylistIds.splice(idx, 1);
      await PlaylistCollection.removeLike(spotifyId);
    }
    await user.save();
    return idx === -1;
  }

  static async deleteOne(username: string): Promise<boolean> {
    const user = await UserModel.deleteOne({ username: username });
    await PlaylistCollection.deleteAllByOwner(username);
    await AdorifySessionCollection.deleteAllByUser(username);
    return user !== null;
  }
}

export default UserCollection;
