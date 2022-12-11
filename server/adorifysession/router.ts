import type { Request, Response } from 'express';
import express from 'express';
import AdorifySessionCollection from './collection';
import * as userValidator from '../user/middleware';
import * as spotifyUtil from '../spotify/util';

import SpotifyWebApi from 'spotify-web-api-node';


import dotenv from 'dotenv';
dotenv.config({});

const router = express.Router();

router.post(
  '/testadd',
  [
    userValidator.isUserLoggedIn,
  ],
  async (req: Request, res: Response) => {
    const as = await AdorifySessionCollection.testAddOne('testuser 3',
      req.body.length,
      req.body.spotifyId,
      req.body.startTime,
      req.body.completed,
      req.body.initializedSessions);
    await AdorifySessionCollection.testAddOne('testuser 4',
      req.body.length,
      req.body.spotifyId,
      req.body.startTime,
      req.body.completed,
      req.body.initializedSessions);
    await AdorifySessionCollection.testAddOne('testuser 5',
      req.body.length,
      req.body.spotifyId,
      req.body.startTime,
      req.body.completed,
      req.body.initializedSessions);
    await AdorifySessionCollection.testAddOne('testuser 6',
      req.body.length,
      req.body.spotifyId,
      req.body.startTime,
      req.body.completed,
      req.body.initializedSessions);
    await AdorifySessionCollection.testAddOne('testuser 7',
      req.body.length,
      req.body.spotifyId,
      req.body.startTime,
      req.body.completed,
      req.body.initializedSessions);
    await AdorifySessionCollection.testAddOne('testuser 8',
      req.body.length,
      req.body.spotifyId,
      req.body.startTime,
      req.body.completed,
      req.body.initializedSessions);
    await AdorifySessionCollection.testAddOne('testuser 9',
      req.body.length,
      req.body.spotifyId,
      req.body.startTime,
      req.body.completed,
      req.body.initializedSessions);
    await AdorifySessionCollection.testAddOne('testuser 10',
      req.body.length,
      req.body.spotifyId,
      req.body.startTime,
      req.body.completed,
      req.body.initializedSessions);
    await AdorifySessionCollection.testAddOne('testuser 11',
      req.body.length,
      req.body.spotifyId,
      req.body.startTime,
      req.body.completed,
      req.body.initializedSessions);
    res.status(200).json({
      message: 'Adorify Session created successfully.',
    });
  }
)

// POST /api/adorifySession

router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
  ],
  async (req: Request, res: Response) => {
    const as = await AdorifySessionCollection.addOne(req.session.username, req.body.length, req.body.spotifyId, req.body.initializedSessions);
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
  ],
  async (req: Request, res: Response) => {
    const totalTime = await AdorifySessionCollection.getTotalTimeByUsername(req.session.username);
    const completed = await AdorifySessionCollection.getTotalCompletedByUsername(req.session.username);
    const totalSessions = await AdorifySessionCollection.getTotalSessionsByUsername(req.session.username);

    const mostPlayed = await AdorifySessionCollection.getMostPlayedByUsername(req.session.username);
    const studyTime = await AdorifySessionCollection.getStudyTimeByUsername(req.session.username);
    const studyTimeArr = [...Object.entries(studyTime)].splice(0, 28).reverse();
    const studyTimeModified = [];

    for (const tuple of studyTimeArr) {
      studyTimeModified.push(tuple[1]);
    }

    res.status(200).json({
      message: 'Here are the user stats.',
      totalTime: totalTime,
      completed: completed,
      totalSessions: totalSessions,
      mostPlayed: mostPlayed,
      studyTime: studyTimeModified,
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
    const ranks = await AdorifySessionCollection.getRanking(req.session.username);

    res.status(200).json({
      message: 'Here is the leaderboard.',
      topUsers: ranks.topUsers,
      userRanks: ranks.userRank,
    });
  }
)


export { router as adorifySessionRouter };