import { Router, Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import { TokenKind } from 'graphql';

class PhotoRouter {
    router: Router;
    oauthClient: OAuth2Client;

    constructor() {
        this.router = Router();
        this.init();
        this.registerRoutes();
    }

    private init() {
        this.oauthClient = new OAuth2Client(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            process.env.GOOGLE_REDIRECT_URI
        );
    }

    private registerRoutes(): void {
        this.router.get('/', (req: Request, res: Response) => {
            const authorizeUrl = this.oauthClient.generateAuthUrl({
                access_type: 'offline',
                scope: 'openid profile email'
            });

            res.redirect(authorizeUrl);
        });

        this.router.get('/callback', (req: Request, res: Response) => {
            const code = req.query['code'];
            this.oauthClient.getToken(code).then((tokenResponse) => {
                // TODO: Use environment variable for the domain
                // tslint:disable-next-line:max-line-length
                res.redirect(`http://localhost:4200/token?access_token=${tokenResponse.tokens.access_token}&id_token=${tokenResponse.tokens.id_token}&refresh_token=${tokenResponse.tokens.refresh_token}`);
            }).catch((error) => {
                console.error(error);
                res.sendStatus(500);
            });
        });
    }
}

export default new PhotoRouter().router;
