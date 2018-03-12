import * as express from 'express';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
import quoteRouter from './api/quotes';
import photosRouter from './api/photos';
import * as path from 'path';

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
        router.use('/*', (req, res) => {
            console.log(path.resolve('dist', 'index.html'));
            res.sendFile(path.resolve('dist', 'index.html'));
        });

        router.get('/hello', (req, res) => {
            res.json({
                message: 'Hello World!'
            });
        });

        this.express.use('/api/quotes', quoteRouter);
        this.express.use('/api/photos', photosRouter);
        this.express.use('/', router);
    }
}

export default new AppServer().express;
