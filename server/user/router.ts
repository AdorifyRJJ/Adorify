import type {Request, Response} from 'express';
import express from 'express';
import UserCollection from './collection';
import * as userValidator from '../user/middleware';
import { PopulatedUser } from './model';

const router = express.Router();

// POST /api/users/session
router.post(
  '/session',
  [],
  async (req: Request, res: Response) => {
    const user = await UserCollection.findOneByUsername(req.body.username);
    if (!user)
      await UserCollection.addOne(req.body.username);
    req.session.username = req.body.username;
    res.status(200).json({
      message: 'You have logged in successfully.'
    });
  }
)

// DELETE /api/users/session
router.delete(
  'session',
  [
    userValidator.isUserLoggedIn,
  ],
  (req: Request, res: Response) => {
    req.session.username = undefined;
    res.status(200).json({
      message: 'You have logged out successfully.'
    });
  }
)

// GET /api/users
router.get(
  '/',
  [
    userValidator.isUserLoggedIn,
  ],
  async (req: Request, res: Response) => {
    const user = await UserCollection.findOneByUsername(req.session.username);
    const populatedUser = await user.populate('likedPlaylists') as PopulatedUser;
    res.status(200).json({
      message: 'Liked playlists retrieved succesfully.',
      likedPlaylists: populatedUser.likedPlaylists.map(constructShallowPlaylistResponse),
    })
  }
)

// DELETE /api/users
router.delete(
  '/',
  [
    userValidator.isUserLoggedIn,
  ],
  async (req: Request, res: Response) => {
    await UserCollection.deleteOne(req.session.username);
    req.session.username = undefined;
    res.status(200).json({
      message: 'Your account has been deleted successfully.'
    });
  }
)

export {router as userRouter};