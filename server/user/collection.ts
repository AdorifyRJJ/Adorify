import type {HydratedDocument, Types} from 'mongoose';
import type {User} from './model';
import UserModel from './model';

/**
 * This file contains a class with functionality to interact with users stored
 * in MongoDB, including adding, finding, updating, and deleting. Feel free to add
 * additional operations in this file.
 *
 * Note: HydratedDocument<User> is the output of the UserModel() constructor,
 * and contains all the information in User. https://mongoosejs.com/docs/typescript.html
 */
class UserCollection {
  /**
   * Add a new user
   *
   * @param {string} username - The username of the user
   * @return {Promise<HydratedDocument<User>>} - The newly created user
   */
  static async addOne(username: string): Promise<HydratedDocument<User>> {
    const user = new UserModel({username: username, likedPlaylists: []});
    await user.save(); // Saves user to MongoDB
    return user;
  }

    /**
   * Delete a user from the collection.
   *
   * @param {string} username - The username of user to delete
   * @return {Promise<Boolean>} - true if the user has been deleted, false otherwise
   */
    static async deleteOne(username: string): Promise<boolean> {
      const user = await UserModel.deleteOne({username: username});
      return user !== null;
    }



  /**
   * Find a user by username.
   *
   * @param {string} username - The username of the user to find
   * @return {Promise<HydratedDocument<User>> | Promise<null>} - The user with the given username, if any
   */
  static async findOne(username: string): Promise<HydratedDocument<User>> {
    return UserModel.findOne({username: username});
  }

  /**
   * Update current user's likedPlaylists
   *
   * @param {string} username - The username of the user to find
   * @return {Promise<HydratedDocument<User>> | Promise<null>} - The user with the given username, if any
   */
  static async updateOne(username: string, playlistId: string, like: boolean): Promise<HydratedDocument<User>> {
    const user = await UserModel.findOne({username: username});
    user.username = username;
    if (like) {
      user.likedPlaylists = user.likedPlaylists.filter((playlist) => playlist !== playlistId)
    } else {
      user.likedPlaylists = user.likedPlaylists + [playlistId]
    }
    await user.save()
    return user;
  }


}

export default UserCollection;
