import type { Request, Response } from 'express';
import express from 'express';
import SpotifyWebApi from 'spotify-web-api-node';
import * as util from './util';

const router = express.Router();

// May need to edit this to do more things with playback, tracklist, etc.
// https://developer.spotify.com/documentation/general/guides/authorization/scopes/
const scopes = ['user-read-private', 'user-read-email'];

const spotifyApi = new SpotifyWebApi({
    clientId: '472aa14c539543c6ad5575e706e88ab7',
    clientSecret: '11c619f5e98341eab55e1327ddb1cc37',
    redirectUri: `http://localhost:8080`,
});

router.get('/login', async function (req: Request, res: Response) {
    const state = util.generateRandomString(16);
    const rURL = spotifyApi.createAuthorizeURL(scopes, state);
    res.set('Content-Type', 'text/html');
    res.status(200).send(rURL + '&show_dialog=true');
});

router.get('/getToken', async function (req: Request, res: Response) {
    console.log('getting token')
    try {
        const data = await spotifyApi.authorizationCodeGrant(req.query.code as string);
        spotifyApi.setAccessToken(data.body['access_token']);
        spotifyApi.setRefreshToken(data.body['refresh_token']);
    } catch (e: any) {
        console.log('backend get token', e.body.error)
    }
});

router.get('/getMe', async function (req: Request, res: Response) {

    try {
        const data = await spotifyApi.getMe();
        res.status(200).json({
            message: 'Here is the object.',
            obj: data,
        });
    } catch (e: any) {
        console.log('backend get me', e.body.error)
    }


});

export { router as spotifyRouter };