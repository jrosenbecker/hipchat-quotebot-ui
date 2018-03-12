import {Router, Request, Response} from 'express';
import { QuotesDataService } from '../../services/quotes-data-service';

class QuoteRouter {
    router: Router;
    private _quotesDataService: QuotesDataService;

    constructor() {
        this.router = Router();
        this.init();
        this.registerRoutes();
    }

    private init(): void {
        this._quotesDataService = new QuotesDataService();
    }

    private registerRoutes(): void {
        this.router.get('/getAll', (req: Request, res: Response) => {
            return this._quotesDataService.getAllQuotes().then((data) => {
                return res.json(data);
            }).catch((err) => {
                console.error(err);
                throw err;
            });
        });

        this.router.get('/getRandom', (req: Request, res: Response) => {
            return this._quotesDataService.getRandomQuote().then((data) => {
                return res.json(data);
            }).catch((err) => {
                console.error(err);
                throw err;
            });
        });
    }
}

export default new QuoteRouter().router;
