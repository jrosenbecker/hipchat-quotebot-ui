import { Router, Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import * as jwt_decode from 'jwt-decode';
import * as url from 'url';
import { AuthorizationService } from '../services/authorization-service';
import { oAuthService } from '../services/google-oauth-service';

class PhotoRouter {
    router: Router;
    oauthClient: OAuth2Client;

    constructor() {
        this.router = Router();
        this.init();
        this.registerRoutes();
    }

    private init() {
        this.oauthClient = oAuthService;
    }

    private registerRoutes(): void {
        this.router.get('/', (req: Request, res: Response) => {
            const authorizeUrl = this.oauthClient.generateAuthUrl({
                access_type: 'offline',
                scope: 'openid profile email',
                prompt: 'consent'
            });

            res.redirect(authorizeUrl);
        });

        this.router.get('/callback', (req: Request, res: Response) => {
            const code = req.query['code'];
            this.oauthClient.getToken(code).then((tokenResponse) => {
                const redirectUrl = url.format({
                    host: `${process.env.FRONT_END_DOMAIN}/token`,
                    query: {
                        access_token: tokenResponse.tokens.access_token,
                        id_token: tokenResponse.tokens.id_token,
                        refresh_token: tokenResponse.tokens.refresh_token,
                        expiry_date: tokenResponse.tokens.expiry_date,
                        token_type: tokenResponse.tokens.token_type
                    }
                });

                const decodedIdentity = jwt_decode(tokenResponse.tokens.id_token);

                const service = new AuthorizationService();
                service.isAuthorized(decodedIdentity.email).then(isAuthorized => {
                    if (isAuthorized) {
                        res.redirect(redirectUrl);
                    } else {
                        res.sendStatus(403);
                    }
                });
            }).catch((error) => {
                console.error(error);
                res.sendStatus(500);
            });
        });

        this.router.get('/test', (req: Request, res: Response) => {
            const service = new AuthorizationService();

            service.isAuthorized('joe.rosenbecker@centare.com').then(result => res.send(result)).catch(err => res.send(err));
        });
    }
}

export default new PhotoRouter().router;
