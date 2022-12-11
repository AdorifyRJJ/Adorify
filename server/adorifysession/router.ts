import type { Request, Response } from 'express';
import express from 'express';
import AdorifySessionCollection from './collection';
import * as userValidator from '../user/middleware';
import * as spotifyUtil from '../spotify/util';

import SpotifyWebApi from 'spotify-web-api-node';


import dotenv from 'dotenv';
dotenv.config({});

const router = express.Router();

// POST /api/adorifySession

router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
  ],
  async (req: Request, res: Response) => {
    const as = await AdorifySessionCollection.addOne(req.session.username, req.body.length, req.body.spotifyId);
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
    await AdorifySessionCollection.endOne(req.params.asID);
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
    const totalTime = AdorifySessionCollection.getTotalTimeByUsername(req.session.username);
    const completed = AdorifySessionCollection.getTotalCompletedByUsername(req.session.username);
    const totalSessions = AdorifySessionCollection.getTotalSessionsByUsername(req.session.username);
    const mostPlayed = AdorifySessionCollection.getMostPlayedByUsername(req.session.username);
    const studyTime = AdorifySessionCollection.getStudyTimeByUsername(req.session.username);

    res.status(200).json({
      message: 'Here are the user stats.',
      totalTime: totalTime,
      completed: completed,
      totalSessions: totalSessions,
      mostPlayed: mostPlayed,
      studyTime: studyTime,
    });
  }
)

// GET /api/adorifySesion/leaderboard

router.get(
  '/leaderboard',
  [
    userValidator.isUserLoggedIn,
  ],
  async (req: Request, res: Response) => {

    const topUsers = AdorifySessionCollection.getTopTenUsers();
    const userRanks = AdorifySessionCollection.getRankingByUsername(req.session.username);


    res.status(200).json({
      message: 'Here is the leaderboard.',
      topUsers: topUsers,
      userRanks: userRanks,
    });
  }
)


export { router as adorifySessionRouter };