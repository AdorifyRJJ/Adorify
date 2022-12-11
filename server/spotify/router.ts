import type { Request, Response } from 'express';
import express from 'express';
import SpotifyWebApi from 'spotify-web-api-node';
import * as util from './util';
import dotenv from 'dotenv';
import * as userValidator from '../user/middleware';
import UserCollection from '../user/collection';

const router = express.Router();

dotenv.config({});

// May need to edit this to do more things with playback, tracklist, etc.
// https://developer.spotify.com/documentation/general/guides/authorization/scopes/
const scopes = ['user-read-private', 'user-read-email', 'user-read-playback-state', 'user-modify-playback-state', 'streaming', 'playlist-read-private', 'playlist-read-collaborative'];

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.ID,
    clientSecret: process.env.SECRET,
    redirectUri: process.env.REDIRECT,
});

router.get(
    '/login',
    [
        userValidator.isUserLoggedOut
    ],
    async function (req: Request, res: Response) {
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
    }
);

router.get(
    '/logout',
    [
        userValidator.isCurrentSessionUserExists,
        userValidator.isUserLoggedIn,
    ],
    async function (req: Request, res: Response) {
        const destroyCallback = (err: any) => {
            if (err) {
                res.status(500).json({
                    message: 'Session destroy error'
                })
            } else {
                res.status(200).json({
                    message: 'You have logged out successfully.'
                });
            }
            res.end();
        }
        req.session.destroy(destroyCallback);
    }
)

router.get(
    '/refreshAccessToken',
    [
        userValidator.isUserLoggedIn,
        userValidator.validRefreshToken,
    ],
    async function (req: Request, res: Response) {
        try {
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
                accessToken: req.session.accessToken,
                expiryTime: req.session.expiryTime,
            })
        } catch (e: any) {
            res.status(e.statusCode).json({
                message: e.body.error_description
            });
        }
        res.end();
    }
);

router.get(
    '/initializeAuth',
    [],
    async function (req: Request, res: Response) {
        try {
            const data = await spotifyApi.authorizationCodeGrant(req.query.code as string);
            req.session.accessToken = data.body['access_token'];
            req.session.refreshToken = data.body['refresh_token'];
            const tokenExpirationEpoch =
                new Date().getTime() / 1000 + data.body['expires_in'];
            req.session.expiryTime = tokenExpirationEpoch;

            const meSpotifyApi = new SpotifyWebApi({
                clientId: process.env.ID,
                clientSecret: process.env.SECRET,
                redirectUri: process.env.REDIRECT,
            });
            meSpotifyApi.setAccessToken(req.session.accessToken);
            const me = await meSpotifyApi.getMe();

            const user = await UserCollection.findOneByUsername(me.body.id);
            if (!user)
                await UserCollection.addOne(me.body.id, me.body.display_name);
            req.session.username = me.body.id;
            res.status(200).json({ me: me.body, accessToken: req.session.accessToken, expiryTime: req.session.expiryTime });
        } catch (e: any) {
            res.status(401).json({
                message: e.body.error
            });
        }
        res.end();
    }
);

router.get(
    '/getMe',
    [
        userValidator.isUserLoggedIn,
        userValidator.validAccessToken,
        util.refreshIfNeeded,
    ],
    async function (req: Request, res: Response) {
        try {
            const meSpotifyApi = new SpotifyWebApi({
                clientId: process.env.ID,
                clientSecret: process.env.SECRET,
                redirectUri: process.env.REDIRECT,
            });
            meSpotifyApi.setAccessToken(req.session.accessToken);
            const me = await meSpotifyApi.getMe();
            const userObj = await UserCollection.findOneByUsername(me.body.id);
            if (userObj.displayName !== me.body.display_name) await UserCollection.updateDisplayName(me.body.id, me.body.display_name);
            res.status(200).json({ me: me.body, accessToken: req.session.accessToken, expiryTime: req.session.expiryTime });
        } catch (e: any) {
            console.log(e)
        }
        res.end();
    }
);

router.get(
    '/transfer',
    [
        userValidator.isUserLoggedIn,
        userValidator.validAccessToken,
        //util.refreshIfNeeded,
    ],
    async function (req: Request, res: Response) {
        try {
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
    }
);

router.get(
    '/getCurrentTrack',
    [
        userValidator.isUserLoggedIn,
        userValidator.validAccessToken,
        //util.refreshIfNeeded,
    ],
    async (req: Request, res: Response) => {
        const playbackSpotifyApi = new SpotifyWebApi({
            clientId: process.env.ID,
            clientSecret: process.env.SECRET,
            redirectUri: process.env.REDIRECT,
        });
        playbackSpotifyApi.setAccessToken(req.session.accessToken);

        const currentTrack = await playbackSpotifyApi.getMyCurrentPlayingTrack();
        if (currentTrack.statusCode != 200)
            res.status(currentTrack.statusCode).json(currentTrack.body);

        res.status(200).json({
            message: 'Retrieved successfully',
            track: currentTrack.body,
        });
    }
)

router.get(
    '/play',
    [
        userValidator.isUserLoggedIn,
        userValidator.validAccessToken,
        //util.refreshIfNeeded,
    ],
    async function (req: Request, res: Response) {
        try {
            const playbackSpotifyApi = new SpotifyWebApi({
                clientId: process.env.ID,
                clientSecret: process.env.SECRET,
                redirectUri: process.env.REDIRECT,
            });
            playbackSpotifyApi.setAccessToken(req.session.accessToken);
            await playbackSpotifyApi.play({ device_id: req.query.deviceId as string });
            res.status(200).json({
                message: 'Playing.',
            });
        } catch (e: any) {
            res.status(e.body.error.status).json({
                message: e.body.error
            })
        }
        res.end();
    }
);

router.get(
    '/pause',
    [
        userValidator.isUserLoggedIn,
        userValidator.validAccessToken,
        //util.refreshIfNeeded,
    ],
    async function (req: Request, res: Response) {
        try {
            const playbackSpotifyApi = new SpotifyWebApi({
                clientId: process.env.ID,
                clientSecret: process.env.SECRET,
                redirectUri: process.env.REDIRECT,
            });
            playbackSpotifyApi.setAccessToken(req.session.accessToken);
            await playbackSpotifyApi.pause({ device_id: req.query.deviceId as string });
            res.status(200).json({
                message: 'Paused.',
            });
        } catch (e: any) {
            res.status(e.body.error.status).json({
                message: e.body.error
            })
        }
        res.end();
    }
);

router.post(
    '/next',
    [
        userValidator.isUserLoggedIn,
        userValidator.validAccessToken,
        //util.refreshIfNeeded,
    ],
    async function (req: Request, res: Response) {
        try {
            const playbackSpotifyApi = new SpotifyWebApi({
                clientId: process.env.ID,
                clientSecret: process.env.SECRET,
                redirectUri: process.env.REDIRECT,
            });
            playbackSpotifyApi.setAccessToken(req.session.accessToken);
            await playbackSpotifyApi.skipToNext({ device_id: req.query.deviceId as string });
            res.status(200).json({
                message: 'Skipped to next.',
            });
        } catch (e: any) {
            res.status(e.body.error.status).json({
                message: e.body.error
            })
        }
        res.end();
    }
)

router.post(
    '/previous',
    [
        userValidator.isUserLoggedIn,
        userValidator.validAccessToken,
        //util.refreshIfNeeded,
    ],
    async function (req: Request, res: Response) {
        try {
            const playbackSpotifyApi = new SpotifyWebApi({
                clientId: process.env.ID,
                clientSecret: process.env.SECRET,
                redirectUri: process.env.REDIRECT,
            });
            playbackSpotifyApi.setAccessToken(req.session.accessToken);
            await playbackSpotifyApi.skipToPrevious({ device_id: req.query.deviceId as string });
            res.status(200).json({
                message: 'Skipped to previous.',
            });
        } catch (e: any) {
            res.status(e.body.error.status).json({
                message: e.body.error
            })
        }
        res.end();
    }
)

router.post(
    '/addToQueue/:spotifyId?',
    [
        userValidator.isUserLoggedIn,
        userValidator.validAccessToken,
        //util.refreshIfNeeded,
    ],
    async function (req: Request, res: Response) {
        try {
            const playbackSpotifyApi = new SpotifyWebApi({
                clientId: process.env.ID,
                clientSecret: process.env.SECRET,
                redirectUri: process.env.REDIRECT,
            });
            playbackSpotifyApi.setAccessToken(req.session.accessToken);
            await playbackSpotifyApi.addToQueue(req.params.spotifyId);
            res.status(200).json({
                message: 'Added to queue.',
            });
        } catch (e: any) {
            res.status(e.body.error.status).json({
                message: e.body.error
            })
        }
        res.end();
    }
)

router.post(
    '/skipQueue',
    [
        userValidator.isUserLoggedIn,
        userValidator.validAccessToken,
        //util.refreshIfNeeded,
    ],
    async function (req: Request, res: Response) {
        try {
            const playbackSpotifyApi = new SpotifyWebApi({
                clientId: process.env.ID,
                clientSecret: process.env.SECRET,
                redirectUri: process.env.REDIRECT,
            });
            playbackSpotifyApi.setAccessToken(req.session.accessToken);
            for (let i = 0; i < 1; i++)
                await playbackSpotifyApi.skipToNext({ device_id: req.query.deviceId as string });
            res.status(200).json({
                message: 'Added to queue.',
            });
        } catch (e: any) {
            res.status(e.body.error.status).json({
                message: e.body.error
            })
        }
        res.end();
    }
)

export { router as spotifyRouter, spotifyApi };
