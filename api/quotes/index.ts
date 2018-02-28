import {Router, Request, Response} from 'express';

class QuoteRouter {
    router: Router

    constructor() {
        this.router = Router();
        this.init();
    }

    private init(): void {
        this.router.get('/getAll', (req: Request, res: Response) => {
            res.json({
                message: "Quote getAll method"
            });
        });
    }
}

export default new QuoteRouter().router;