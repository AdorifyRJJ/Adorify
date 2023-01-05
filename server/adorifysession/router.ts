import type { Request, Response } from 'express';
import express from 'express';
import AdorifySessionCollection from './collection';
import * as userValidator from '../user/middleware';
import SpotifyWebApi from 'spotify-web-api-node';
import * as playlistUtil from '../playlist/util';
import dotenv from 'dotenv';
import PlaylistCollection from '../playlist/collection';
import * as spotifyUtil from '../spotify/util';
import UserCollection from '../user/collection';
import { Playlist } from '../playlist/model';
dotenv.config({});

const router = express.Router();

// POST /api/adorifySession

router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
  ],
  async (req: Request, res: Response) => {
    const as = await AdorifySessionCollection.addOne(req.session.username, req.body.length, req.body.spotifyId, req.body.initializedSessions);
    await PlaylistCollection.addUsed(req.body.spotifyId, req.body.initializedSessions);
    res.status(200).json({
      message: 'Adorify Session created successfully.',
      asID: as._id
    });
  }
)

// PUT /api/adorifySession/:asID

router.put(
  '/:asID?',
  [
    userValidator.isUserLoggedIn,
  ],
  async (req: Request, res: Response) => {
    await AdorifySessionCollection.incrementAS(req.params.asID, req.body.completed);
    await PlaylistCollection.addCompleted(req.body.spotifyId, 1);
    res.status(200).json({
      message: 'Adorify Session ended successfully.',
    });
  }
)

// GET /api/adorifySession/stats

router.get(
  '/stats',
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

    const totalTime = await AdorifySessionCollection.getTotalTimeByUsername(req.session.username);
    const completed = await AdorifySessionCollection.getTotalCompletedByUsername(req.session.username);
    const totalSessions = await AdorifySessionCollection.getTotalSessionsByUsername(req.session.username);

    const mostPlayed = await AdorifySessionCollection.getMostPlayedByUsername(req.session.username);
    // const mostPlayedWeek: Array<SpotifyApi.PlaylistObjectSimplified> = []

    // for (const p of mostPlayed.week) {
    //   // console.log(p.playlist)
    //   const playlistInfo = await spotifyApi.getPlaylist(p._id, { fields: 'name' });
    //   if (playlistInfo.statusCode === 200)
    //     mostPlayedWeek.push(playlistInfo.body);
    //   else
    //     console.log('Failed to retrieve', playlistInfo.body);
    // }

    const mostPlayedWeek = await Promise.all(mostPlayed.week.map(
      async (p: Playlist) => {
        return { name: p.name, isLiked: await UserCollection.inLikedPlaylists(req.session.username, p.spotifyId) };
      }
    ));

    const mostPlayedMonth = await Promise.all(mostPlayed.month.map(
      async (p: Playlist) => {
        return { name: p.name, isLiked: await UserCollection.inLikedPlaylists(req.session.username, p.spotifyId) };
      }
    ));

    // for (const p of mostPlayed.month) {
    //   const playlistInfo = await spotifyApi.getPlaylist(p._id, { fields: 'name' });
    //   if (playlistInfo.statusCode === 200)
    //     mostPlayedMonth.push(playlistInfo.body);
    //   else
    //     console.log('Failed to retrieve', playlistInfo.body);
    // }

    // const finalMostPlayedMonth = await Promise.all(mostPlayedWeek.map((p: SpotifyApi.PlaylistObjectSimplified) => playlistUtil.constructShallowPlaylistResponse(req.session.username, p)))

    const studyTimeArr = await AdorifySessionCollection.getStudyTimeByUsername(req.session.username, parseInt(req.query.tzoffset as string));
    let studyTimeModified = [];

    for (const tuple of studyTimeArr) {
      studyTimeModified.push(tuple[1]);
    }
    if (studyTimeModified.length === 0) studyTimeModified = Array.apply(0, Array(28)).map(() => 0);

    // console.log(finalMostPlayedWeek);
    res.status(200).json({
      message: 'Here are the user stats.',
      totalTime: totalTime ?? 0,
      completed: completed ?? 0,
      totalSessions: totalSessions ?? 0,
      mostPlayed: {
        week: mostPlayedWeek,
        month: mostPlayedMonth,
      },
      studyTime: studyTimeModified,
    });
  }
)

// GET /api/adorifySession/leaderboard

router.get(
  '/leaderboard',
  [
    userValidator.isUserLoggedIn,
  ],
  async (req: Request, res: Response) => {
    const ranks = await AdorifySessionCollection.getRanking(req.session.username);

    res.status(200).json({
      message: 'Here is the leaderboard.',
      topUsers: ranks.topUsers,
      userRanks: ranks.userInfo,
      _id: req.session.username
    });
  }
)


export { router as adorifySessionRouter };