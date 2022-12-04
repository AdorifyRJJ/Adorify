import type { Request, Response } from 'express';
import express from 'express';
import PlaylistCollection from './collection';
import * as userValidator from '../user/middleware';
import * as util from './util';
import UserCollection from '../user/collection';
import SpotifyWebApi from 'spotify-web-api-node';
//import { spotifyApi } from '../spotify/router';

import dotenv from 'dotenv';
dotenv.config({});

const router = express.Router();

//////////////////////////

const playlistSpotifyApi = new SpotifyWebApi({
  clientId: process.env.ID,
  clientSecret: process.env.SECRET,
  redirectUri: 'http://localhost:3000',
});

let tokenExpirationEpoch: number;
//const authorizationCode = 'AQCelEmlus6jfIhTiw9McSNIIxfeyQ7cqVltIB-bCtKXBY0stfBLDdO3xAgE74e4_cvjbaXH_IIbfEri4DohxgXAya5GA8PU5jonuCtv9YJmlmaX0u_hUgUIZb--2EHV9I-sDTEn10WwQCefh65JaGaGM8WvfM7QTTp3ZDKEvfuQoOIP18iQRS5K0ziqRIVpuhzAEa_pqKGcfPaT0-DvZq0t-zF4XsyfE5odCDCbQczWGefCjOCPQ76BlL4HPpUam_x-2459gtkrQxrz1MW3QFd7yHAn53AAOxjG-eAbRhalrKwDrYqfKHse8aA';

playlistSpotifyApi.setRefreshToken('AQAT9rYtXW8cfp8bYEBQ3EIBPKksZZ6Qdny7523zguL8ysbb-f8lWRNr-3x9HX4wM4dcDQ8IbxcLueDha3aET5vs2fLOJnfaejWK9ZpThGwTfhfb-x7Wze99ghrV4nCTV5k');


// playlistSpotifyApi.authorizationCodeGrant(authorizationCode).then(
//   function(data) {
//     // Set the access token and refresh token
//     playlistSpotifyApi.setAccessToken('BQAWazHW5JYEo0oio1OwIo7eOtqTDJqfd5v3CrlNWn-UHstbx20GsS1fRvYXOP0eeRQngsu2RDcaUpWoXGHg-gmlHdhePupUqBGvj9JunbpecPK32FE-zoEOcqIs5cxb131-nANRveZneSmq5VzqPh7-ER40uxGB3KBWYkFvPIh_tHI-Fuck617x20c9GqURq6IW4ldamwhTsIrkda3RokyOo4r0QQZEjF8');
//     playlistSpotifyApi.setRefreshToken('AQAT9rYtXW8cfp8bYEBQ3EIBPKksZZ6Qdny7523zguL8ysbb-f8lWRNr-3x9HX4wM4dcDQ8IbxcLueDha3aET5vs2fLOJnfaejWK9ZpThGwTfhfb-x7Wze99ghrV4nCTV5k');

//     // Save the amount of seconds until the access token expired
//     tokenExpirationEpoch =
//       new Date().getTime() / 1000 + data.body['expires_in'];
//     console.log(
//       'Retrieved token. It expires in ' +
//         Math.floor(tokenExpirationEpoch - new Date().getTime() / 1000) +
//         ' seconds!'
//     );
//   },
//   function(err) {
//     console.log(
//       'Something went wrong when retrieving the access token!',
//       err.message
//     );
//   }
// );

// // Continually print out the time left until the token expires..
// let numberOfTimesUpdated = 0;

// setInterval(function () {
//   console.log(
//     'Time left: ' +
//     Math.floor(tokenExpirationEpoch - new Date().getTime() / 1000) +
//     ' seconds left!'
//   );

//   // OK, we need to refresh the token. Stop printing and refresh.
//   if (++numberOfTimesUpdated > 5) {
//     clearInterval(this);

//     // Refresh token and print the new time to expiration.
//     playlistSpotifyApi.refreshAccessToken().then(
//       function (data) {
//         tokenExpirationEpoch =
//           new Date().getTime() / 1000 + data.body['expires_in'];
//         console.log(
//           'Refreshed token. It now expires in ' +
//           Math.floor(tokenExpirationEpoch - new Date().getTime() / 1000) +
//           ' seconds!'
//         );
//       },
//       function (err) {
//         console.log('Could not refresh the token!', err.message);
//       }
//     );
//   }
// }, 1000);

//////////////////

const mostResults: Array<any> = [[], [], []];

//update most liked, used, productive every hour
setInterval(async () => {
  console.log('refreshing most liked, used, productive');
  // spotifyApi.setAccessToken();
  const data = await playlistSpotifyApi.refreshAccessToken();

  playlistSpotifyApi.setAccessToken(data.body['access_token']);
  if (data.body['refresh_token']) playlistSpotifyApi.setRefreshToken(data.body['refresh_token']);

  const filters = [PlaylistCollection.findMostLikes, PlaylistCollection.findMostUsed, PlaylistCollection.findMostProductive];

  for (let i = 0; i < filters.length; i++) {
    const playlists = await filters[i]();
    const playlistInfos: Array<SpotifyApi.PlaylistObjectSimplified> = [];

    for (const p of playlists) {
      const playlistInfo = await playlistSpotifyApi.getPlaylist(p.spotifyId, { fields: 'id, images, name, owner.display_name, public' });
      if (playlistInfo.statusCode === 200)
        playlistInfos.push(playlistInfo.body);
      else
        console.log('Failed to retrieve', playlistInfo.body);
    }

    mostResults[i] = playlistInfos;
  }
}, 10 * 1000);



// GET /api/playlists/mine?offset=
router.get(
  '/mine',
  [
    userValidator.isUserLoggedIn,
    userValidator.validAccessToken,
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


    res.status(200).json({
      message: 'Retrieved succesfully.',
      ...myPlaylists.body,
      items: await Promise.all(myPlaylists.body.items.map(p => util.constructShallowPlaylistResponse(req.session.username, p))),
      // href: myPlaylists.body.href,
      // limit: myPlaylists.body.limit,
      // next: myPlaylists.body.next,
      // previous: myPlaylists.body.previous,
      // total: myPlaylists.body.total,
      // offset: myPlaylists.body.offset,
    });
  }
)

// GET /api/playlists/info/:spotifyId
router.get(
  '/info/:spotifyId?',
  [
    userValidator.isUserLoggedIn,
    userValidator.validAccessToken,
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

    const playlist = await PlaylistCollection.findOneBySpotifyId(req.params.spotifyId);
    if (playlist)
      await PlaylistCollection.updateIsPublic(req.params.spotifyId, playlistInfo.body.public !== null ? playlistInfo.body.public : false);

    res.status(200).json({
      message: 'Retrieved succesfully.',
      playlistInfo: playlistInfo.body,
      isLiked: await UserCollection.inLikedPlaylists(req.session.username, req.params.spotifyId),
    });
  }
)

// GET /api/playlists/info/:spotifyId/tracks?offset=
router.get(
  '/info/:spotifyId?/tracks',
  [
    userValidator.isUserLoggedIn,
    userValidator.validAccessToken,
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

      const playlistInfo = await spotifyApi.getPlaylist(req.params.spotifyId, { fields: 'owner.id, public' });
      if (playlistInfo.statusCode !== 200)
        res.status(playlistInfo.statusCode).json(playlistInfo.body);

      await PlaylistCollection.addOne(req.params.spotifyId, playlistInfo.body.owner.id, playlistInfo.body.public !== null ? playlistInfo.body.public : false);
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
  ],
  async (req: Request, res: Response) => {
    // console.log('here')
    // const spotifyApi = new SpotifyWebApi({
    //   clientId: process.env.ID,
    //   clientSecret: process.env.SECRET,
    //   redirectUri: process.env.REDIRECT,
    // });
    // spotifyApi.setAccessToken(req.session.accessToken);

    // const playlists = await PlaylistCollection.findMostLikes();
    // const playlistInfos: Array<SpotifyApi.PlaylistObjectSimplified> = [];

    // for (const p of playlists) {
    //   const playlistInfo = await spotifyApi.getPlaylist(p.spotifyId, { fields: 'id, images, name, owner.display_name, public' });
    //   if (playlistInfo.statusCode === 200)
    //     playlistInfos.push(playlistInfo.body);
    //   else
    //     console.log('Failed to retrieve', playlistInfo.body);
    // }
    res.status(200).json({
      message: 'Retrieved successfully.',
      items: await Promise.all(mostResults[0].map((p: SpotifyApi.PlaylistObjectSimplified) => util.constructShallowPlaylistResponse(req.session.username, p))),
    });
  }
)

// GET /api/playlists/mostUsed
router.get(
  '/mostUsed',
  [
    userValidator.isUserLoggedIn,
    userValidator.validAccessToken,
  ],
  async (req: Request, res: Response) => {
    // const spotifyApi = new SpotifyWebApi({
    //   clientId: process.env.ID,
    //   clientSecret: process.env.SECRET,
    //   redirectUri: process.env.REDIRECT,
    // });
    // spotifyApi.setAccessToken(req.session.accessToken);

    // const playlists = await PlaylistCollection.findMostUsed();
    // const playlistInfos: Array<SpotifyApi.PlaylistObjectSimplified> = [];

    // for (const p of playlists) {
    //   const playlistInfo = await spotifyApi.getPlaylist(p.spotifyId, { fields: 'id, images, name, owner.display_name, public' });
    //   if (playlistInfo.statusCode === 200)
    //     playlistInfos.push(playlistInfo.body);
    //   else
    //     console.log('Failed to retrieve', playlistInfo.body);
    // }
    res.status(200).json({
      message: 'Retrieved successfully.',
      items: await Promise.all(mostResults[1].map((p: SpotifyApi.PlaylistObjectSimplified) => util.constructShallowPlaylistResponse(req.session.username, p))),
    });
  }
)

// GET /api/playlists/mostProductive
router.get(
  '/mostProductive',
  [
    userValidator.isUserLoggedIn,
    userValidator.validAccessToken,
  ],
  async (req: Request, res: Response) => {
    // const spotifyApi = new SpotifyWebApi({
    //   clientId: process.env.ID,
    //   clientSecret: process.env.SECRET,
    //   redirectUri: process.env.REDIRECT,
    // });
    // spotifyApi.setAccessToken(req.session.accessToken);

    // const playlists = await PlaylistCollection.findMostProductive();
    // const playlistInfos: Array<SpotifyApi.PlaylistObjectSimplified> = [];

    // for (const p of playlists) {
    //   const playlistInfo = await spotifyApi.getPlaylist(p.spotifyId, { fields: 'id, images, name, owner.display_name, public' });
    //   if (playlistInfo.statusCode === 200)
    //     playlistInfos.push(playlistInfo.body);
    //   else
    //     console.log('Failed to retrieve', playlistInfo.body);
    // }
    res.status(200).json({
      message: 'Retrieved successfully.',
      items: await Promise.all(mostResults[2].map((p: SpotifyApi.PlaylistObjectSimplified) => util.constructShallowPlaylistResponse(req.session.username, p))),
    });
  }
)




export { router as playlistRouter };