import { Router, Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import * as jwt_decode from 'jwt-decode';
import * as url from 'url';
import { AuthorizationService } from '../services/authorization-service';
import { oAuthService } from '../services/google-oauth-service';
import * as http from 'request';
import * as UIDGenerator from 'uid-generator';

class LoginRouter {
    router: Router;
    oauthClient: OAuth2Client;
    uidgen: any;

    constructor() {
        this.router = Router();
        this.init();
        this.registerRoutes();
    }

    private init() {
        this.oauthClient = oAuthService;
        this.uidgen = new UIDGenerator(512);
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


                const decodedIdentity = jwt_decode(tokenResponse.tokens.id_token);

                const service = new AuthorizationService();
                service.isEmailWhitelisted(decodedIdentity.email).then(isAuthorized => {
                    if (isAuthorized) {
                        this.uidgen.generate().then(uid => {
                            const accessToken = uid;
                            const redirectUrl = url.format({
                                host: `${process.env.FRONT_END_DOMAIN}/token`,
                                query: {
                                    access_token: accessToken,
                                    id_token: tokenResponse.tokens.id_token,
                                    refresh_token: tokenResponse.tokens.refresh_token,
                                    expiry_date: tokenResponse.tokens.expiry_date,
                                    token_type: tokenResponse.tokens.token_type
                                }
                            });
                            service.saveSession(decodedIdentity.email, accessToken, tokenResponse.tokens.id_token)
                            .then((data) => res.redirect(redirectUrl))
                            .catch(error => res.sendStatus(500));
                        }).catch(error => res.sendStatus(500));
                    } else {
                        res.sendStatus(403);
                    }
                });
            }).catch((error) => {
                console.error(error);
                res.sendStatus(500);
            });
        });

        this.router.post('/refresh', (req: Request, res: Response) => {
            const refreshToken = req.body.refresh_token;
            http.post('https://www.googleapis.com/oauth2/v4/token', {
                form: {
                    client_id: process.env.GOOGLE_CLIENT_ID,
                    client_secret: process.env.GOOGLE_CLIENT_SECRET,
                    grant_type: 'refresh_token',
                    refresh_token: refreshToken
                }
            }, (error, response) => {
                if (error) {
                    console.error(error);
                    res.sendStatus(500);
                } else {
                    const body = JSON.parse(response.body);
                    const decodedIdentity = jwt_decode(body.id_token);

                    const service = new AuthorizationService();
                    service.isEmailWhitelisted(decodedIdentity.email).then(isAuthorized => {
                        if (isAuthorized) {
                            this.uidgen.generate().then(uid => {
                                service.saveSession(decodedIdentity.email, uid, body.id_token)
                                    .then((data) => res.json({
                                        access_token: uid
                                    }))
                                    .catch(() => res.sendStatus(500));
                            }).catch(() => res.sendStatus(500));
                        } else {
                            res.sendStatus(403);
                        }
                    });
                }
            });
        });

        this.router.get('/test', (req: Request, res: Response) => {
            const service = new AuthorizationService();

            service.isAuthorized(req.headers.authorization).then(result => res.send(result)).catch(err => res.send(err));
        });
    }
}

export default new LoginRouter().router;
