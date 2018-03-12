import { Component, OnInit, trigger, state, style, transition, animate } from '@angular/core';
import { Quote } from '../../models/quote';
import { QuotesService } from '../../services/quotes.service';
import { PhotoService } from '../../services/photo.service';
import { Photo } from '../../models/photo';


@Component({
    selector: 'app-random-component',
    templateUrl: 'random.component.html',
    styleUrls: ['random.component.css'],
    animations: [
        trigger('crossfade', [
            state('show', style({opacity: 1})),
            state('hide', style({opacity: 0})),
            transition('* => show', animate('2s ease-in')),
            transition('show => hide', animate('2s ease-out'))
        ])
    ]
})
export class RandomComponent implements OnInit {
    state1 = 'hide';
    state2 = 'hide';
    quote1: Quote;
    quote2: Quote;
    backgroundImage1: Photo;
    backgroundImage2: Photo;

    private refreshRateMinutes = 5;

    constructor(private _quotesService: QuotesService, private _photoService: PhotoService) { }

    ngOnInit(): void {
        this.backgroundImage1 = new Photo();
        this.backgroundImage2 = new Photo();
        this._quotesService.getRandom().subscribe(quote => {
            this.quote1 = quote;
            this._photoService.getRandom().subscribe(photo => {
                this.backgroundImage1 = photo;
                this.state1 = 'show';
                this.state2 = 'hide';
            });
        });

        setInterval(() => {
            this.changeImage();
        }, this.refreshRateMinutes * 60000);
    }

    backgroundImageStyle(backgroundImage: Photo): any {
        return {
            'background-image': `url('${backgroundImage.url}')`
        };
    }

    changeImage(): void {
        if (this.state1 === 'show') {
            this._quotesService.getRandom().subscribe(quote => {
                this.quote2 = quote;
                this._photoService.getRandom().subscribe(photo => {
                    this.backgroundImage2 = photo;
                    console.log(this.backgroundImage2.url);
                    setTimeout(() => {
                        this.state1 = 'hide';
                        this.state2 = 'show';
                    }, 5000);
                });
            });
        } else {
            this._quotesService.getRandom().subscribe(quote => {
                this.quote1 = quote;
                this._photoService.getRandom().subscribe(photo => {
                    this.backgroundImage1 = photo;
                    console.log(this.backgroundImage1.url);
                    setTimeout(() => {
                        this.state1 = 'show';
                        this.state2 = 'hide';
                    }, 5000);
                });
            });
        }
    }
}
