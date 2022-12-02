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

export {
  isCurrentSessionUserExists,
  isUserLoggedIn,
};
