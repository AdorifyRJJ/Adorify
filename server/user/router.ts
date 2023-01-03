import type {Request, Response} from 'express';
import express from 'express';
import UserCollection from './collection';
import * as userValidator from '../user/middleware';
import * as util from '../playlist/util';
import * as spotifyUtil from '../spotify/util';
import SpotifyWebApi from 'spotify-web-api-node';
import PlaylistCollection from '../playlist/collection';
import { Playlist } from '../playlist/model';

const router = express.Router();

// GET /api/users
router.get(
  '/',
  [
    userValidator.isUserLoggedIn,
    userValidator.validAccessToken,
    spotifyUtil.refreshIfNeeded,
  ],
  async (req: Request, res: Response) => {
    const spotifyApi = new SpotifyWebApi({
      clientId: process.env.ID,
      clientSecret: process.env.SECRET,
      redirectUri: process.env.REDIRECT,
    });
    spotifyApi.setAccessToken(req.session.accessToken);

    const populatedUser = await UserCollection.findOneByUsernameAndPopulate(req.session.username);
    const finalPlaylists: Array<Playlist> = [];

    for (const p of populatedUser.likedPlaylists) {
      if (p.expiryTime < new Date()) {
        const playlistInfo = await spotifyApi.getPlaylist(p.spotifyId, { fields: 'id, owner.id, owner.display_name, name, images, public' });
        if (playlistInfo.statusCode === 200) {
          const p = playlistInfo.body;
          const updatedPlaylist = await PlaylistCollection.update(p.id, p.name, p.images[0]?.url, p.owner.display_name, p.public !== null ? p.public : false);
          finalPlaylists.push(updatedPlaylist);
        }
        else {
          console.log('Failed to retrieve', playlistInfo.body);
          finalPlaylists.push(p);
        }
      }
      // if it's not expired, just return from db
      else {
        finalPlaylists.push(p);
      }
    }
    res.status(200).json({
      message: 'Retrieved successfully.',
      playlists: await Promise.all(finalPlaylists.map((p: Playlist) => util.shallowDbResponse(req.session.username, p))),
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