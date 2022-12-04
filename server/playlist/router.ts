import type {Request, Response} from 'express';
import express from 'express';
import PlaylistCollection from './collection';
import * as userValidator from '../user/middleware';
import * as util from './util';
import UserCollection from '../user/collection';
import SpotifyWebApi from 'spotify-web-api-node';

const router = express.Router();

// GET /api/playlists/mine?offset=
router.get(
  '/mine',
  [
    userValidator.isUserLoggedIn,
    userValidator.validAccessToken,
  ],
  async (req: Request, res: Response) => {
    const spotifyApi = new SpotifyWebApi({
      clientId: process.env.ID,
      clientSecret: process.env.SECRET,
      redirectUri: process.env.REDIRECT,
    });
    spotifyApi.setAccessToken(req.session.accessToken);
    const myPlaylists = await spotifyApi.getUserPlaylists(req.session.username, {offset: parseInt(req.query.offset as string)});
    if (myPlaylists.statusCode !== 200) {
      res.status(myPlaylists.statusCode).json(myPlaylists.body);
    }
      
    
    res.status(200).json({
      message: 'Retrieved succesfully.',
      ...myPlaylists.body,
      items: await Promise.all(myPlaylists.body.items.map(p => util.constructShallowPlaylistResponse(req.session.username, p))),
      // href: myPlaylists.body.href,
      // limit: myPlaylists.body.limit,
      // next: myPlaylists.body.next,
      // previous: myPlaylists.body.previous,
      // total: myPlaylists.body.total,
      // offset: myPlaylists.body.offset,
    });
  }
)

// GET /api/playlists/info/:spotifyId
router.get(
  '/info/:spotifyId?',
  [
    userValidator.isUserLoggedIn,
    userValidator.validAccessToken,
  ],
  async (req: Request, res: Response) => {
    const spotifyApi = new SpotifyWebApi({
      clientId: process.env.ID,
      clientSecret: process.env.SECRET,
      redirectUri: process.env.REDIRECT,
    });
    spotifyApi.setAccessToken(req.session.accessToken);

    const playlistInfo = await spotifyApi.getPlaylist(req.params.spotifyId);
    if (playlistInfo.statusCode !== 200)
      res.status(playlistInfo.statusCode).json(playlistInfo.body);

    const playlist = await PlaylistCollection.findOneBySpotifyId(req.params.spotifyId);
    if (playlist)
      await PlaylistCollection.updateIsPublic(req.params.spotifyId, playlistInfo.body.public !== null ? playlistInfo.body.public : false);

    res.status(200).json({
      message: 'Retrieved succesfully.',
      playlistInfo: playlistInfo.body,
      isLiked: await UserCollection.inLikedPlaylists(req.session.username, req.params.spotifyId),
    });
  }
)

// GET /api/playlists/info/:spotifyId/tracks?offset=
router.get(
  '/info/:spotifyId?/tracks',
  [
    userValidator.isUserLoggedIn,
    userValidator.validAccessToken,
  ],
  async (req: Request, res: Response) => {
    const spotifyApi = new SpotifyWebApi({
      clientId: process.env.ID,
      clientSecret: process.env.SECRET,
      redirectUri: process.env.REDIRECT,
    });
    spotifyApi.setAccessToken(req.session.accessToken);

    const tracks = await spotifyApi.getPlaylistTracks(req.params.spotifyId, {offset: parseInt(req.query.offset as string)})
    if (tracks.statusCode !== 200)
      res.status(tracks.statusCode).json(tracks.body);

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
    userValidator.validAccessToken,
  ],
  async (req: Request, res: Response) => {
    const playlist = await PlaylistCollection.findOneBySpotifyId(req.params.spotifyId);
    if (!playlist) {
      const spotifyApi = new SpotifyWebApi({
        clientId: process.env.ID,
        clientSecret: process.env.SECRET,
        redirectUri: process.env.REDIRECT,
      });
      spotifyApi.setAccessToken(req.session.accessToken);

      const playlistInfo = await spotifyApi.getPlaylist(req.params.spotifyId, {fields: 'owner.id, public'});
      if (playlistInfo.statusCode !== 200)
        res.status(playlistInfo.statusCode).json(playlistInfo.body);

      await PlaylistCollection.addOne(req.params.spotifyId, playlistInfo.body.owner.id, playlistInfo.body.public !== null ? playlistInfo.body.public : false);
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
    userValidator.validAccessToken,
  ],
  async (req: Request, res: Response) => {
    console.log('here')
    const spotifyApi = new SpotifyWebApi({
      clientId: process.env.ID,
      clientSecret: process.env.SECRET,
      redirectUri: process.env.REDIRECT,
    });
    spotifyApi.setAccessToken(req.session.accessToken);

    const playlists = await PlaylistCollection.findMostLikes();
    const playlistInfos: Array<SpotifyApi.PlaylistObjectSimplified> = [];
    
    for (const p of playlists) {
      const playlistInfo = await spotifyApi.getPlaylist(p.spotifyId);
      if (playlistInfo.statusCode === 200)
        playlistInfos.push(playlistInfo.body);
      else
        console.log('Failed to retrieve', playlistInfo.body);
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
    userValidator.validAccessToken,
  ],
  async (req: Request, res: Response) => {
    const spotifyApi = new SpotifyWebApi({
      clientId: process.env.ID,
      clientSecret: process.env.SECRET,
      redirectUri: process.env.REDIRECT,
    });
    spotifyApi.setAccessToken(req.session.accessToken);

    const playlists = await PlaylistCollection.findMostUsed();
    const playlistInfos: Array<SpotifyApi.PlaylistObjectSimplified> = [];

    for (const p of playlists) {
      const playlistInfo = await spotifyApi.getPlaylist(p.spotifyId);
      if (playlistInfo.statusCode === 200)
        playlistInfos.push(playlistInfo.body);
      else
        console.log('Failed to retrieve', playlistInfo.body);
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
    userValidator.validAccessToken,
  ],
  async (req: Request, res: Response) => {
    const spotifyApi = new SpotifyWebApi({
      clientId: process.env.ID,
      clientSecret: process.env.SECRET,
      redirectUri: process.env.REDIRECT,
    });
    spotifyApi.setAccessToken(req.session.accessToken);

    const playlists = await PlaylistCollection.findMostProductive();
    const playlistInfos: Array<SpotifyApi.PlaylistObjectSimplified> = [];

    for (const p of playlists) {
      const playlistInfo = await spotifyApi.getPlaylist(p.spotifyId);
      if (playlistInfo.statusCode === 200)
        playlistInfos.push(playlistInfo.body);
      else
        console.log('Failed to retrieve', playlistInfo.body);
    }
    res.status(200).json({
      message: 'Retrieved successfully.',
      playlists: await Promise.all(playlistInfos.map(p => util.constructShallowPlaylistResponse(req.session.username, p))),
    });
  }
)




export {router as playlistRouter};