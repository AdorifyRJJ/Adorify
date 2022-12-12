import type { Request, Response } from 'express';
import express from 'express';
import AdorifySessionCollection from './collection';
import * as userValidator from '../user/middleware';


import dotenv from 'dotenv';
dotenv.config({});

const router = express.Router();

// POST /api/adorifySession

router.post(
  '/testadd',
  [
    userValidator.isUserLoggedIn,
  ],
  async (req: Request, res: Response) => {
    // const as = await AdorifySessionCollection.testAddOne(req.session.username,
    //   req.body.length,
    //   req.body.spotifyId,
    //   req.body.startTime,
    //   req.body.completed+17,
    //   req.body.initializedSessions);
    await AdorifySessionCollection.testAddOne('oldtestuser 3',
      req.body.length,
      req.body.spotifyId,
      req.body.startTime,
      req.body.completed+3,
      req.body.initializedSessions);
    await AdorifySessionCollection.testAddOne('oldtestuser 4',
      req.body.length,
      req.body.spotifyId,
      req.body.startTime,
      req.body.completed+4,
      req.body.initializedSessions);
    await AdorifySessionCollection.testAddOne('oldtestuser 5',
      req.body.length,
      req.body.spotifyId,
      req.body.startTime,
      req.body.completed+5,
      req.body.initializedSessions);
    await AdorifySessionCollection.testAddOne('oldtestuser 6',
      req.body.length,
      req.body.spotifyId,
      req.body.startTime,
      req.body.completed+6,
      req.body.initializedSessions);
    await AdorifySessionCollection.testAddOne('oldtestuser 7',
      req.body.length,
      req.body.spotifyId,
      req.body.startTime,
      req.body.completed+7,
      req.body.initializedSessions);
    await AdorifySessionCollection.testAddOne('oldtestuser 8',
      req.body.length,
      req.body.spotifyId,
      req.body.startTime,
      req.body.completed+8,
      req.body.initializedSessions);
    await AdorifySessionCollection.testAddOne('oldtestuser 9',
      req.body.length,
      req.body.spotifyId,
      req.body.startTime,
      req.body.completed+9,
      req.body.initializedSessions);
    await AdorifySessionCollection.testAddOne('oldtestuser 10',
      req.body.length,
      req.body.spotifyId,
      req.body.startTime,
      req.body.completed+10,
      req.body.initializedSessions);
    await AdorifySessionCollection.testAddOne('oldtestuser 11',
      req.body.length,
      req.body.spotifyId,
      req.body.startTime,
      req.body.completed+11,
      req.body.initializedSessions);
    res.status(200).json({
      message: 'Adorify Session created successfully.',
    });
  }
)

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
    const studyTimeArr = await AdorifySessionCollection.getStudyTimeByUsername(req.session.username);
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
      userRanks: ranks.userRank,
    });
  }
)


export { router as adorifySessionRouter };