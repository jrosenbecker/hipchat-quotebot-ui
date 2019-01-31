import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import quotesController from './controllers/quotes-controller';
import photosController from './controllers/photos-controller';
import * as path from 'path';
import loginController from './controllers/login-controller';

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
        this.express.use(cors());
    }

    private routes(): void {
        const router = express.Router();
        this.express.use('/api/quotes', quotesController);
        this.express.use('/api/photos', photosController);
        this.express.use('/login', loginController);
        this.express.use('/', router);
    }
}

export default new AppServer().express;
