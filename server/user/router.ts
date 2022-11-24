import type {Request, Response} from 'express';
import express from 'express';
import FreetCollection from '../freet/collection';
import UserCollection from './collection';
import * as userValidator from '../user/middleware';
import * as util from './util';

const router = express.Router();

/**
 * Add current user to the database
 *
 * @name POST /api/users
 *
 * @return - 
 */
router.post(
  '/',
  [],
  async (req: Request, res: Response) => {
    const user = await UserCollection.addOne(req.body.username);
    res.status(200).json({
      message: 'success POST /api/users',
      user: util.constructUserResponse(user)
    });
  }
);

/**
 * Delete current user from the database
 *
 * @name DELETE /api/users
 *
 * @param {string} username - The user's username
 *
 */
router.delete(
  '/',
  [],
  async (req: Request, res: Response) => {
    await UserCollection.deleteOne(req.body.username);
    // add other synchronizations
    res.status(201).json({
      message: 'success DELETE /api/users',
    });
  }
);

/**
 * Get likedPlaylists of current user
 *
 * @name GET /api/users
 *
 * @return - 
 *
 */
router.get(
  '/',
  [],
  async (req: Request, res: Response) => {
    const user = await UserCollection.findOne(req.body.username)
    res.status(200).json({
      message: 'success GET /api/users',
      user: util.constructUserResponse(user)
    });
  }
);

/**
 * Update current user's likedPlaylists
 *
 * @name PUT /api/users
 *
 * @param {string} username - username of user
 * @param {string} password - user's password
 * @return {UserResponse} - The updated user
 *
 */
router.put(
  '/',
  [],
  async (req: Request, res: Response) => {
    const user = await UserCollection.updateOne(req.body.username, req.body.playlistId, req.body.like);
    res.status(201).json({
      message: 'success PUT /api/users',
      user: util.constructUserResponse(user)
    });
  }
);

export {router as userRouter};
