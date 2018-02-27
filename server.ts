import * as express from 'express';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';

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
        let router = express.Router();


        router.get('/', (req, res) => {
            res.json({
                message: 'This is the root route!'
            });
        });

        router.get('/hello', (req, res) => {
            res.json({
                message: 'Hello World!'
            });
        });

        this.express.use('/', router);
    }
}

export default new AppServer().express;