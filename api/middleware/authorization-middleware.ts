import { Request, NextFunction, Response } from 'express';
import { AuthorizationService } from '../services/authorization-service';
import { P } from '@angular/core/src/render3';

export function checkAuthorization(req: Request, res: Response, next: NextFunction) {
    if (req.headers.authorization) {
        const authorizationService = new AuthorizationService();
        authorizationService.isAuthorized(req.headers.authorization).then((authorized) => {
            if (authorized) {
                next();
            } else {
                res.sendStatus(401);
            }
        });
    } else {
        res.sendStatus(403);
    }
}
