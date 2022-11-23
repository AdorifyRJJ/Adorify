import type { Request, Response } from 'express';
import express from 'express';
import SpotifyWebApi from 'spotify-web-api-node';
import * as util from './util';

const router = express.Router();

// May need to edit this to do more things with playback, tracklist, etc.
// https://developer.spotify.com/documentation/general/guides/authorization/scopes/
const scopes = ['user-read-private', 'user-read-email'];

// Move id to .env file? When I did this it doesn't seem to initialize the SpotifyWebApi object correctly; the field becomes undefined.
const spotifyApi = new SpotifyWebApi({
    clientId: '472aa14c539543c6ad5575e706e88ab7',
    redirectUri: 'http://localhost:8080/callback',
});

router.get('/login', async function (req: Request, res: Response) {
    const state = util.generateRandomString(16);
    const rURL = spotifyApi.createAuthorizeURL(scopes, state);
    res.status(200).send({rURI: rURL});
    console.log(res)
    res.end();
    /*
    const redirect_uri = 'http://localhost:8080/callback';

    
    const scope = 'user-read-private user-read-email';

    const params = new URLSearchParams();
    params.append('response_type', 'code');
    params.append('client_id', client_id);
    params.append('scope', scope);
    params.append('redirect_uri', redirect_uri);
    params.append('state', state);

    const spotify_uri = 'https://accounts.spotify.com/authorize?' + params.toString();

    console.log(spotify_uri)
    res.writeHead(200, {
        Location: spotify_uri
    });
    res.end();
    */
});

export { router as spotifyRouter };