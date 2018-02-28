import * as express from 'express';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
import quoteRouter from './api/quotes';

class AppServer {
    public express: express.Application;

    constructor() {
        console.log('Starting to construct');
        this.express = express();
        this.middleware();
        this.routes();
    }

    private middleware(): void {
        this.express.use(logger('dev'));
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: false }));
    }

    private routes(): void {
        const router = express.Router();
        router.use('/', express.static('dist'));

        router.get('/hello', (req, res) => {
            res.json({
                message: 'Hello World!'
            });
        });

        this.express.use('/', router);
        this.express.use('/api/quotes', quoteRouter);
    }
}

export default new AppServer().express;
