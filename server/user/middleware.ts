import type {Request, Response, NextFunction} from 'express';
import UserCollection from '../user/collection';

const isCurrentSessionUserExists = async (req: Request, res: Response, next: NextFunction) => {
  if (req.session.username) {
    const user = await UserCollection.findOneByUsername(req.session.username);

    if (!user) {
      req.session.username = undefined;
      res.status(500).json({
        error: 'User session was not recognized.'
      });
      return;
    }
  }

  next();
};

const isUserLoggedIn = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.username) {
    res.status(403).json({
      error: 'You must be logged in to complete this action.'
    });
    return;
  }

  next();
};

const validRefreshToken = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.refreshToken){
    res.status(404).json({
        message: 'Refresh token not found.',
    })
    res.end();
    return;
  }

  next();
}


const validAccessToken = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.accessToken){
    res.status(404).json({
        message: 'Access token not found.',
    })
    res.end();
    return;
  }

  next();
}

export {
  isCurrentSessionUserExists,
  isUserLoggedIn,
  validRefreshToken,
  validAccessToken,
};
