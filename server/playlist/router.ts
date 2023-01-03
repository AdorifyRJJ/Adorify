import type { Request, Response } from 'express';
import express from 'express';
import PlaylistCollection from './collection';
import * as userValidator from '../user/middleware';
import * as util from './util';
import * as spotifyUtil from '../spotify/util';
import UserCollection from '../user/collection';
import SpotifyWebApi from 'spotify-web-api-node';
//import { spotifyApi } from '../spotify/router';

import dotenv from 'dotenv';
import { HydratedDocument } from 'mongoose';
import { Playlist } from './model';
dotenv.config({});

const router = express.Router();

//////////////////////////

// const playlistSpotifyApi = new SpotifyWebApi({
//   clientId: process.env.ID,
//   clientSecret: process.env.SECRET,
//   redirectUri: process.env.PLAYLISTREDIRECT,
// });

// playlistSpotifyApi.setRefreshToken(process.env.REFRESHTOKEN);

// const mostResults: Array<any> = [[], [], []];

// //update most liked, used, productive every hour
// setInterval(async () => {
//   console.log('refreshing most liked, used, productive');
//   // spotifyApi.setAccessToken();
//   const data = await playlistSpotifyApi.refreshAccessToken();

//   playlistSpotifyApi.setAccessToken(data.body['access_token']);
//   if (data.body['refresh_token']) playlistSpotifyApi.setRefreshToken(data.body['refresh_token']);

//   const filters = [PlaylistCollection.findMostLikes, PlaylistCollection.findMostUsed, PlaylistCollection.findMostProductive];

//   for (let i = 0; i < filters.length; i++) {
//     const playlists = await filters[i]();
//     const playlistInfos: Array<SpotifyApi.PlaylistObjectSimplified> = [];

//     for (const p of playlists) {
//       const playlistInfo = await playlistSpotifyApi.getPlaylist(p.spotifyId, { fields: 'id, images, name, owner.display_name, public' });
//       if (playlistInfo.statusCode === 200)
//         playlistInfos.push(playlistInfo.body);
//       else
//         console.log('Failed to retrieve', playlistInfo.body);
//     }

//     mostResults[i] = playlistInfos;
//   }
// }, 60*60*1000);



// GET /api/playlists/mine?offset=
router.get(
  '/mine',
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

    const myPlaylists = await spotifyApi.getUserPlaylists(req.session.username, { offset: parseInt(req.query.offset as string) });
    if (myPlaylists.statusCode !== 200) {
      res.status(myPlaylists.statusCode).json(myPlaylists.body);
    }

    const finalPlaylists: Array<Playlist> = [];
    for (const p of myPlaylists.body.items) {
      const updatedPlaylist = await PlaylistCollection.update(p.id, p.name, p.images[0]?.url, p.owner.display_name, p.public !== null ? p.public : false);
      finalPlaylists.push(updatedPlaylist);
    }

    res.status(200).json({
      message: 'Retrieved succesfully.',
      ...myPlaylists.body,
      items: await Promise.all(finalPlaylists.map((p: Playlist) => util.shallowDbResponse(req.session.username, p))),
    });
  }
)

// GET /api/playlists/info/:spotifyId
router.get(
  '/info/:spotifyId?',
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

    const playlistInfo = await spotifyApi.getPlaylist(req.params.spotifyId);
    if (playlistInfo.statusCode !== 200)
      res.status(playlistInfo.statusCode).json(playlistInfo.body);

    const p = playlistInfo.body;
    await PlaylistCollection.update(p.id, p.name, p.images[0]?.url, p.owner.display_name, p.public !== null ? p.public : false);

    res.status(200).json({
      message: 'Retrieved succesfully.',
      playlistInfo: p,
      isLiked: await UserCollection.inLikedPlaylists(req.session.username, p.id),
    });
  }
)

// GET /api/playlists/info/:spotifyId/tracks?offset=
router.get(
  '/info/:spotifyId?/tracks',
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

    const tracks = await spotifyApi.getPlaylistTracks(req.params.spotifyId, { offset: parseInt(req.query.offset as string) })
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
    spotifyUtil.refreshIfNeeded,
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

      const playlistInfo = await spotifyApi.getPlaylist(req.params.spotifyId, { fields: 'id, owner.id, owner.display_name, name, images, public' });
      if (playlistInfo.statusCode !== 200)
        res.status(playlistInfo.statusCode).json(playlistInfo.body);

      const p = playlistInfo.body;
      await PlaylistCollection.addOne(p.id, p.owner.id, p.name, p.images[0]?.url, p.owner.display_name, p.public !== null ? p.public : false);
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
    spotifyUtil.refreshIfNeeded,
  ],
  async (req: Request, res: Response) => {
    const spotifyApi = new SpotifyWebApi({
      clientId: process.env.ID,
      clientSecret: process.env.SECRET,
      redirectUri: process.env.REDIRECT,
    });
    spotifyApi.setAccessToken(req.session.accessToken);

    const offset = parseInt(req.query.offset as string)

    const playlists = await PlaylistCollection.findMostLikes(offset);
    const finalPlaylists: Array<Playlist> = [];

    for (const p of playlists) {
      // if it's expired, fetch updated info from Spotify
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
      items: await Promise.all(finalPlaylists.map((p: Playlist) => util.shallowDbResponse(req.session.username, p))),
      limit: 6,
      offset: offset,
      next: offset + 6 < Math.min(100, await PlaylistCollection.countTotal()),
      previous: offset > 0,
    });
  }
)

// GET /api/playlists/mostUsed
router.get(
  '/mostUsed',
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

    const offset = parseInt(req.query.offset as string)

    const playlists = await PlaylistCollection.findMostUsed(offset);
    const finalPlaylists: Array<Playlist> = [];

    for (const p of playlists) {
      // if it's expired, fetch updated info from Spotify
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
      items: await Promise.all(finalPlaylists.map((p: Playlist) => util.shallowDbResponse(req.session.username, p))),
      limit: 6,
      offset: offset,
      next: offset + 6 < Math.min(100, await PlaylistCollection.countTotal()),
      previous: offset > 0,
    });
  }
)

// GET /api/playlists/mostProductive
router.get(
  '/mostProductive',
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

    const offset = parseInt(req.query.offset as string)

    const playlists = await PlaylistCollection.findMostProductive(offset);
    const finalPlaylists: Array<Playlist> = [];

    for (const p of playlists) {
      // if it's expired, fetch updated info from Spotify
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
      items: await Promise.all(finalPlaylists.map((p: Playlist) => util.shallowDbResponse(req.session.username, p))),
      limit: 6,
      offset: offset,
      next: offset + 6 < Math.min(100, await PlaylistCollection.countTotal()),
      previous: offset > 0,
    });
  }
)




export { router as playlistRouter };