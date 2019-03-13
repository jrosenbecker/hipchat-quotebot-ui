import {Router, Request, Response} from 'express';
import { QuotesDataService } from '../services/quotes-data-service';
import { Quote } from '../models/quote';
import * as moment from 'moment';
import { AuthorizationService } from '../services/authorization-service';

class QuoteRouter {
    router: Router;
    private _quotesDataService: QuotesDataService;
    private _authorizationService: AuthorizationService;

    constructor() {
        this.router = Router();
        this.init();
        this.registerRoutes();
    }

    private init(): void {
        this._quotesDataService = new QuotesDataService();
        this._authorizationService = new AuthorizationService();
    }

    private registerRoutes(): void {
        this.router.get('/getRandom', (req: Request, res: Response) => {
            return this._quotesDataService.getRandomQuote().then((data) => {
                return res.json(data);
            }).catch((err) => {
                console.error(err);
                throw err;
            });
        });

        this.router.post('/', (req: Request, res: Response) => {
            const quote: Quote = req.body as Quote;
            quote.AddedOn = '' + moment().valueOf();
            this._authorizationService.getUserName(req.headers.authorization).then((name) => {
                quote.AddedBy = name;
                console.log(quote.AddedBy);
                return this._quotesDataService.saveQuote(quote).then((result) => {
                    return res.sendStatus(204);
                }).catch((error) => {
                    console.error(JSON.stringify(error));
                    return res.status(400).send(error);
                });
            }).catch((error) => {
                console.error(JSON.stringify(error));
                return res.status(500).json({ error: 'Error looking up user' });
            });
        });
    }
}

export default new QuoteRouter().router;
