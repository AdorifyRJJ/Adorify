import type { Request, Response, NextFunction } from 'express';
import SpotifyWebApi from 'spotify-web-api-node';

const generateRandomString = (length: number) => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

const refreshIfNeeded = async (req: Request, res: Response, next: NextFunction) => {
    if (req.session.expiryTime) {
        const timeFromNow = req.session.expiryTime - (new Date().getTime() / 1000) - 30;
        if (timeFromNow < 0) {
            const refreshSpotifyApi = new SpotifyWebApi({
                clientId: process.env.ID,
                clientSecret: process.env.SECRET,
                redirectUri: process.env.REDIRECT,
            });
            try {
                refreshSpotifyApi.setRefreshToken(req.session.refreshToken);
                const data = await refreshSpotifyApi.refreshAccessToken();
                req.session.accessToken = data.body['access_token']
                if (data.body['refresh_token']) req.session.refreshToken = data.body['refresh_token'];
                const tokenExpirationEpoch =
                    new Date().getTime() / 1000 + data.body['expires_in'];
                req.session.expiryTime = tokenExpirationEpoch;
            } catch (e: any) {
                res.status(e.statusCode).json({
                    message: e.body.error_description
                });
                res.end();
                return;
            }

        }
    }
    next();
}

export { generateRandomString, refreshIfNeeded };