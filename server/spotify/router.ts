import type { Request, Response } from 'express';
import express from 'express';
import SpotifyWebApi from 'spotify-web-api-node';
import * as util from './util';
import dotenv from 'dotenv';

const router = express.Router();

dotenv.config({});

// May need to edit this to do more things with playback, tracklist, etc.
// https://developer.spotify.com/documentation/general/guides/authorization/scopes/
const scopes = ['user-read-private', 'user-read-email', 'user-modify-playback-state'];

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.ID,
    clientSecret: process.env.SECRET,
    redirectUri: process.env.REDIRECT,
});

router.get('/login', async function (req: Request, res: Response) {
    const state = util.generateRandomString(16);
    const rURL = spotifyApi.createAuthorizeURL(scopes, state);
    res.set('Content-Type', 'text/html');
    res.status(200).send(rURL + '&show_dialog=true');
    res.end();
});

router.get('/getToken', async function (req: Request, res: Response) {
    try {
        const data = await spotifyApi.authorizationCodeGrant(req.query.code as string);
        spotifyApi.setAccessToken(data.body['access_token']);
        spotifyApi.setRefreshToken(data.body['refresh_token']);
    } catch (e: any) {
        res.status(404).json({
            message: e.body.error
        });
    }
    res.end();
});

router.get('/getMe', async function (req: Request, res: Response) {
    try {
        const data = await spotifyApi.getMe();
        res.status(200).json({
            message: 'Here is the object.',
            obj: data,
        });
    } catch (e: any) {
        res.status(404).json({
            message: e.body.error
        })
    }
    res.end();
});

export { router as spotifyRouter };