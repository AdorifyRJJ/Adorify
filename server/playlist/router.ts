import type {Request, Response} from 'express';
import express from 'express';
import PlaylistCollection from './collection';
import * as userValidator from '../user/middleware';
import * as util from './util';
import { spotifyApi } from '../spotify/router';
import UserCollection from '../user/collection';

const router = express.Router();

// GET /api/playlists/mine?offset=
router.get(
  '/mine',
  [
    userValidator.isUserLoggedIn,
  ],
  async (req: Request, res: Response) => {
    const myPlaylists = await spotifyApi.getUserPlaylists(req.session.username, {offset: parseInt(req.query.offset as string)});
    
    res.status(200).json({
      message: 'Retrieved succesfully.',
      items: await Promise.all(myPlaylists.body.items.map(p => util.constructShallowPlaylistResponse(req.session.username, p))),
      // href: myPlaylists.body.href,
      // limit: myPlaylists.body.limit,
      // next: myPlaylists.body.next,
      // previous: myPlaylists.body.previous,
      // total: myPlaylists.body.total,
      // offset: myPlaylists.body.offset,
      ...myPlaylists.body,
    });
  }
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
      await PlaylistCollection.updateIsPublic(req.params.spotifyId, playlistInfo.body.public);

    res.status(200).json({
      message: 'Retrieved succesfully.',
      playlistInfo: playlistInfo.body,
      isLiked: UserCollection.inLikedPlaylists(req.session.username, req.params.spotifyId),
    });
  }
)

// GET /api/playlists/info/:spotifyId/tracks?offset=
router.get(
  '/info/:spotifyId?/tracks',
  [
    userValidator.isUserLoggedIn,
  ],
  async (req: Request, res: Response) => {
    const tracks = await spotifyApi.getPlaylistTracks(req.params.spotifyId, {offset: parseInt(req.query.offset as string)})
    res.status(200).json({
      message: 'Retrieved succesfully.',
      tracks: tracks.body,
    });
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
      const playlistInfo = await spotifyApi.getPlaylist(req.params.spotifyId, {fields: 'owner.id, public'});
      await PlaylistCollection.addOne(req.params.spotifyId, playlistInfo.body.owner.id, playlistInfo.body.public);
    }

    const isLiked = await UserCollection.toggleLikedPlaylists(req.session.username, req.params.spotifyId);
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
    const playlistInfos: Array<SpotifyApi.PlaylistObjectSimplified> = [];
    for (const p of playlists) {
      const playlistInfo = await spotifyApi.getPlaylist(p.spotifyId, {fields: 'tracks(!items)'});
      playlistInfos.push(playlistInfo.body);
    }
    res.status(200).json({
      message: 'Retrieved successfully.',
      playlists: await Promise.all(playlistInfos.map(p => util.constructShallowPlaylistResponse(req.session.username, p))),
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
    const playlistInfos: Array<SpotifyApi.PlaylistObjectSimplified> = [];
    for (const p of playlists) {
      const playlistInfo = await spotifyApi.getPlaylist(p.spotifyId, {fields: 'tracks(!items)'});
      playlistInfos.push(playlistInfo.body);
    }
    res.status(200).json({
      message: 'Retrieved successfully.',
      playlists: await Promise.all(playlistInfos.map(p => util.constructShallowPlaylistResponse(req.session.username, p))),
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
    const playlistInfos: Array<SpotifyApi.PlaylistObjectSimplified> = [];
    for (const p of playlists) {
      const playlistInfo = await spotifyApi.getPlaylist(p.spotifyId, {fields: 'tracks(!items)'});
      playlistInfos.push(playlistInfo.body);
    }
    res.status(200).json({
      message: 'Retrieved successfully.',
      playlists: await Promise.all(playlistInfos.map(p => util.constructShallowPlaylistResponse(req.session.username, p))),
    });
  }
)


export {router as playlistRouter};