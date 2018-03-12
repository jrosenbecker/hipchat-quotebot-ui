import {Router, Request, Response} from 'express';
import * as http from 'request';
import * as xml2js from 'xml2js';
import * as rn from 'random-number';

class PhotoRouter {
    router: Router;
    private parser: xml2js.Parser;

    constructor() {
        this.parser = new xml2js.Parser();
        this.router = Router();
        this.registerRoutes();
    }

    private registerRoutes(): void {
        this.router.get('/getRandom', (req: Request, res: Response) => {
            const flickrRequestOptions = {
                url: 'https://api.flickr.com/services/rest/',
                qs: {
                    method: 'flickr.photosets.getPhotos',
                    api_key: process.env.FLICKR_KEY,
                    user_id: process.env.FLICKR_USER_ID,
                    photoset_id: process.env.FLICKR_PHOTOSET_ID
                }
            };

            http.get(flickrRequestOptions, (error, flickrRes, body) => {
                this.parser.parseString(body, (err, result) => {
                    const photos = result.rsp.photoset[0].photo;
                    const max =  photos.length;
                    const index = rn({
                        min: 0,
                        max: max - 1,
                        integer: true
                    });
                    const photo = photos[index].$;
                    const url = `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_h.jpg`;

                    res.json({
                        url: url
                    });
                });
            });
        });
    }
}

export default new PhotoRouter().router;
