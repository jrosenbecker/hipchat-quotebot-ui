import * as http from 'request';
import * as xml2js from 'xml2js';
import * as rn from 'random-number';

export class FlickrDataService {
    getRandomImageUrl(): Promise<string> {
        return new Promise((resolve, reject) => {
            const flickrRequestOptions = {
                url: 'https://api.flickr.com/services/rest/',
                qs: {
                    method: 'flickr.photosets.getPhotos',
                    api_key: process.env.FLICKR_KEY,
                    user_id: process.env.FLICKR_USER_ID,
                    photoset_id: process.env.FLICKR_PHOTOSET_ID
                }
            };
            const parser = new xml2js.Parser();
            console.log(process.env.FLICKR_PHOTOSET_ID);
            http.get(flickrRequestOptions, (httpError, flickrRes, body) => {
                if (httpError) {
                    reject(httpError);
                }
                if (flickrRes.statusCode === 200) {
                    parser.parseString(body, (parseError, result) => {
                        if (parseError) {
                            reject(parseError);
                        }

                        const photos = result.rsp.photoset[0].photo;
                        const max =  photos.length;
                        const index = rn({
                            min: 0,
                            max: max - 1,
                            integer: true
                        });
                        const photo = photos[index].$;
                        const url = `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_h.jpg`;

                        resolve(url);
                    });
                } else {
                    reject('Flickr HTTP Request was not a 200');
                }

            });
        });
    }
}
