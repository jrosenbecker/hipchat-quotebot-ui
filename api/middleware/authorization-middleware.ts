import { Request, NextFunction, Response } from 'express';

export function checkAuthorization(req: Request, res: Response, next: NextFunction) {
    if (req.headers.authorization) {
        
        next();
    } else {
        res.sendStatus(403);
    }
}
