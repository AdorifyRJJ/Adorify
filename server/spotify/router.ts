import type { Request, Response } from 'express';
import express from 'express';
import SpotifyWebApi from 'spotify-web-api-node';
import * as util from './util';
import dotenv from 'dotenv';

const router = express.Router();

dotenv.config({});

// May need to edit this to do more things with playback, tracklist, etc.
// https://developer.spotify.com/documentation/general/guides/authorization/scopes/
const scopes = ['user-read-private', 'user-read-email', 'user-modify-playback-state', 'streaming'];

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.ID,
    clientSecret: process.env.SECRET,
    redirectUri: process.env.REDIRECT,
});

router.get('/login', async function (req: Request, res: Response) {
    const loginSpotifyApi = new SpotifyWebApi({
        clientId: process.env.ID,
        clientSecret: process.env.SECRET,
        redirectUri: process.env.REDIRECT,
    });

    const state = util.generateRandomString(16);
    const rURL = loginSpotifyApi.createAuthorizeURL(scopes, state);
    res.set('Content-Type', 'text/html');
    res.status(200).send(rURL + '&show_dialog=true');
    res.end();
});

router.get('/refreshAccessToken', async function (req: Request, res: Response) {
    try {
        if (!req.session.refreshToken){
            res.status(404).json({
                message: 'Refresh token not found.',
            })
            res.end();
            return;
        }
        const refreshSpotifyApi = new SpotifyWebApi({
            clientId: process.env.ID,
            clientSecret: process.env.SECRET,
            redirectUri: process.env.REDIRECT,
        });
        refreshSpotifyApi.setRefreshToken(req.session.refreshToken);
        const data = await refreshSpotifyApi.refreshAccessToken();
        req.session.accessToken = data.body['access_token']
        if (data.body['refresh_token']) req.session.refreshToken = data.body['refresh_token'];
        const tokenExpirationEpoch =
            new Date().getTime() / 1000 + data.body['expires_in'];
        req.session.expiryTime = tokenExpirationEpoch;
        res.status(200).json({
            message: 'Success!',
        })
    } catch (e: any) {
        res.status(e.body.error.status).json({
            message: e.body.error
        });
    }
    res.end();
});

router.get('/getExpiryTime', async function (req: Request, res: Response) {
    if (req.session.expiryTime) {
        res.status(200).json({
            expiryTime: req.session.expiryTime
        });
    } else {
        res.status(404).json({
            message: 'expiry time not found'
        })
    }
    res.end();
});

router.get('/getAccessToken', async function (req: Request, res: Response) {
    if (req.session.accessToken) {
        res.status(200).json({
            token: req.session.accessToken,
        })
    } else {
        res.status(404).json({
            message: 'access token does not exist'
        });
    }
    res.end();
});

router.get('/initializeAuth', async function (req: Request, res: Response) {
    try {
        const data = await spotifyApi.authorizationCodeGrant(req.query.code as string);
        req.session.accessToken = data.body['access_token'];
        req.session.refreshToken = data.body['refresh_token'];
        const tokenExpirationEpoch =
            new Date().getTime() / 1000 + data.body['expires_in'];
        req.session.expiryTime = tokenExpirationEpoch;
        res.status(200).json({
            message: 'Success!',
        })
    } catch (e: any) {
        res.status(e.body.error.status).json({
            message: e.body.error
        });
    }
    res.end();
});

router.get('/getMe', async function (req: Request, res: Response) {
    try {
        if (!req.session.accessToken){
            res.status(404).json({
                message: 'Access token not found.',
            })
            res.end();
            return;
        }
        const meSpotifyApi = new SpotifyWebApi({
            clientId: process.env.ID,
            clientSecret: process.env.SECRET,
            redirectUri: process.env.REDIRECT,
        });
        meSpotifyApi.setAccessToken(req.session.accessToken);
        const data = await meSpotifyApi.getMe();
        res.status(200).json({ data });
    } catch (e: any) {
        res.status(e.body.error.status).json({
            message: e.body.error
        })
    }
    res.end();
});

router.get('/transfer', async function (req: Request, res: Response) {
    try {
        if (!req.session.accessToken){
            res.status(404).json({
                message: 'Access token not found.',
            })
            res.end();
            return;
        }
        const playbackSpotifyApi = new SpotifyWebApi({
            clientId: process.env.ID,
            clientSecret: process.env.SECRET,
            redirectUri: process.env.REDIRECT,
        });
        playbackSpotifyApi.setAccessToken(req.session.accessToken);
        const deviceArr = [req.query.deviceId as string];
        const transfer = await playbackSpotifyApi.transferMyPlayback(deviceArr);
        res.status(200).json({
            message: 'Here is the object.',
            transfer: transfer,
        });
    } catch (e: any) {
        res.status(e.body.error.status).json({
            message: e.body.error
        })
    }
    res.end();
});

router.get('/play', async function (req: Request, res: Response) {
    try {
        if (!req.session.accessToken){
            res.status(404).json({
                message: 'Access token not found.',
            })
            res.end();
            return;
        }
        const playbackSpotifyApi = new SpotifyWebApi({
            clientId: process.env.ID,
            clientSecret: process.env.SECRET,
            redirectUri: process.env.REDIRECT,
        });
        playbackSpotifyApi.setAccessToken(req.session.accessToken);
        const playData = await playbackSpotifyApi.play({ device_id: req.query.deviceId as string });
        res.status(200).json({
            message: 'Here is the object.',
            playData: playData,
        });
    } catch (e: any) {
        res.status(e.body.error.status).json({
            message: e.body.error
        })
    }
    res.end();
});

router.get('/pause', async function (req: Request, res: Response) {
    try {
        if (!req.session.accessToken){
            res.status(404).json({
                message: 'Access token not found.',
            })
            res.end();
            return;
        }
        const playbackSpotifyApi = new SpotifyWebApi({
            clientId: process.env.ID,
            clientSecret: process.env.SECRET,
            redirectUri: process.env.REDIRECT,
        });
        playbackSpotifyApi.setAccessToken(req.session.accessToken);
        const playData = await playbackSpotifyApi.pause({ device_id: req.query.deviceId as string });
        res.status(200).json({
            message: 'Here is the object.',
            playData: playData,
        });
    } catch (e: any) {
        res.status(e.body.error.status).json({
            message: e.body.error
        })
    }
    res.end();
});

export { router as spotifyRouter, spotifyApi };