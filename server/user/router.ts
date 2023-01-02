import type {Request, Response} from 'express';
import express from 'express';
import UserCollection from './collection';
import * as userValidator from '../user/middleware';
import * as util from '../playlist/util';
import * as spotifyUtil from '../spotify/util';
import SpotifyWebApi from 'spotify-web-api-node';
import PlaylistCollection from '../playlist/collection';

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
    const playlistInfos: Array<SpotifyApi.PlaylistObjectSimplified> = [];
    
    for (const p of populatedUser.likedPlaylists) {
      const playlistInfo = await spotifyApi.getPlaylist(p.spotifyId, {fields: 'id, images, name, owner.display_name, public'});
      if (playlistInfo.statusCode === 200) {
        playlistInfos.push(playlistInfo.body);
        await PlaylistCollection.update(p.spotifyId, playlistInfo.body.name, playlistInfo.body.public !== null ? playlistInfo.body.public : false);
      }
      else
        console.log('Failed to retrieve', playlistInfo.body);
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