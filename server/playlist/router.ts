import type {Request, Response} from 'express';
import express from 'express';
import PlaylistCollection from './collection';
import * as userValidator from '../user/middleware';
import { spotifyApi } from '../spotify/router';
import UserCollection from '../user/collection';

const router = express.Router();

// GET /api/playlists/mine
router.get(
  '/mine',
  [
    userValidator.isUserLoggedIn,
  ],
  async (req: Request, res: Response) => {
    const myPlaylists = await spotifyApi.getUserPlaylists(req.session.username)
  }

  // return shallow mine response
)

// GET /api/playlists/info/:spotifyId
router.get(
  '/info/:spotifyId?',
  [
    userValidator.isUserLoggedIn,
  ],
  async (req: Request, res: Response) => {
    const playlistInfo = await spotifyApi.getPlaylist(req.params.spotifyId);

    const playlist = await PlaylistCollection.findOneBySpotifyId(req.params.spotifyId);
    if (playlist)
      await PlaylistCollection.updateIsPublic(playlist._id, playlistInfo.body.public);

    // return deep response
  }
)

// PUT /api/playlists/:spotifyId
router.put(
  '/:spotifyId?',
  [
    userValidator.isUserLoggedIn,
  ],
  async (req: Request, res: Response) => {
    const playlist = await PlaylistCollection.findOneBySpotifyId(req.params.spotifyId);
    if (!playlist) {
      const playlistInfo = await spotifyApi.getPlaylist(req.params.spotifyId);
      await PlaylistCollection.addOne(req.params.spotifyId, playlistInfo.body.owner.id, playlistInfo.body.public);
    }

    const isLiked = await UserCollection.toggleLikedPlaylists(req.session.username, playlist._id);
    res.status(200).json({
      message: 'Toggled succesfully.',
      isLiked: isLiked,
    });
  }
)

// GET /api/playlists/mostLiked
router.get(
  '/mostLiked',
  [
    userValidator.isUserLoggedIn,
  ],
  async (req: Request, res: Response) => {
    const playlists = await PlaylistCollection.findMostLikes();
    res.status(200).json({
      message: 'Retrieved successfully.',
      playlists: playlists.map(constructShallowPlaylistResponse),
    });
  }
)

// GET /api/playlists/mostUsed
router.get(
  '/mostUsed',
  [
    userValidator.isUserLoggedIn,
  ],
  async (req: Request, res: Response) => {
    const playlists = await PlaylistCollection.findMostUsed();
    res.status(200).json({
      message: 'Retrieved successfully.',
      playlists: playlists.map(constructShallowPlaylistResponse),
    });
  }
)

// GET /api/playlists/mostProductive
router.get(
  '/mostProductive',
  [
    userValidator.isUserLoggedIn,
  ],
  async (req: Request, res: Response) => {
    const playlists = await PlaylistCollection.findMostProductive();
    res.status(200).json({
      message: 'Retrieved successfully.',
      playlists: playlists.map(constructShallowPlaylistResponse),
    });
  }
)

export {router as playlistRouter};