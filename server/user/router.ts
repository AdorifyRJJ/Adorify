import type {Request, Response} from 'express';
import express from 'express';
import UserCollection from './collection';
import * as userValidator from '../user/middleware';
import * as util from '../playlist/util';
import SpotifyWebApi from 'spotify-web-api-node';

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
  '/session',
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
    const spotifyApi = new SpotifyWebApi({
      clientId: process.env.ID,
      clientSecret: process.env.SECRET,
      redirectUri: process.env.REDIRECT,
    });
    spotifyApi.setAccessToken(req.session.accessToken);

    const populatedUser = await UserCollection.findOneByUsernameAndPopulate(req.session.username);
    const playlistInfos: Array<SpotifyApi.PlaylistObjectSimplified> = [];
    
    for (const p of populatedUser.likedPlaylists) {
      const playlistInfo = await spotifyApi.getPlaylist(p.spotifyId, {fields: 'tracks(!items)'});
      playlistInfos.push(playlistInfo.body);
    }
    res.status(200).json({
      message: 'Retrieved successfully.',
      playlists: await Promise.all(playlistInfos.map(p => util.constructShallowPlaylistResponse(req.session.username, p))),
    });
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