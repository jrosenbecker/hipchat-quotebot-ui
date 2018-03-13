import * as express from 'express';
import * as bodyParser from 'body-parser';
import quotesController from './controllers/quotes-controller';
import photosController from './controllers/photos-controller';
import * as path from 'path';

class AppServer {
    public express: express.Application;

    constructor() {
        this.express = express();
        this.middleware();
        this.routes();
    }

    private middleware(): void {
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: false }));
    }

    private routes(): void {
        const router = express.Router();
        router.use('/', express.static('dist'));
        router.use('/*', (req, res) => {
            res.sendFile(path.resolve('dist', 'index.html'));
        });

        this.express.use('/api/quotes', quotesController);
        this.express.use('/api/photos', photosController);
        this.express.use('/', router);
    }
}

export default new AppServer().express;
