import {Router, Request, Response} from 'express';
import * as http from 'request';
import * as xml2js from 'xml2js';
import * as rn from 'random-number';
import { FlickrDataService } from '../services/flickr-data-service';

class PhotoRouter {
    router: Router;
    private parser: xml2js.Parser;
    private _flickrDataService: FlickrDataService;

    constructor() {
        this.parser = new xml2js.Parser();
        this.router = Router();
        this.init();
        this.registerRoutes();
    }

    private init() {
        this._flickrDataService = new FlickrDataService();
    }

    private registerRoutes(): void {
        this.router.get('/getRandom', (req: Request, res: Response) => {
            this._flickrDataService.getRandomImageUrl().then(url => {
                res.json({
                    url: url
                });
            });
        });
    }
}

export default new PhotoRouter().router;
