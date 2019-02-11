import { Component, OnInit, trigger, state, style, transition, animate } from '@angular/core';
import { Quote } from '../models/quote';
import { QuotesService } from '../services/quotes.service';
import { PhotoService } from '../services/photo.service';
import { Photo } from '../models/photo';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { AuthService } from '../services/auth.service';
import { take } from 'rxjs/operators';

const TRANSITION_TIME_SECONDS = 2;

@Component({
    selector: 'app-random-component',
    templateUrl: 'home.component.html',
    styleUrls: ['home.component.css'],
    animations: [
        trigger('crossfade', [
            state('show', style({opacity: 1})),
            state('hide', style({opacity: 0})),
            transition('* => show', animate(`${TRANSITION_TIME_SECONDS}s ease-in`)),
            transition('show => hide', animate(`${TRANSITION_TIME_SECONDS}s ease-out`))
        ]),
        trigger('zoom', [
            state('inactive', style({transform: 'scale(1)'})),
            state('active', style({transform: 'scale(2)'})),
            transition('inactive => active', animate('300s ease-in')),
            transition('active => inactive', animate('0s ease-out'))
        ])
    ]
})
export class HomeComponent implements OnInit {
    state1 = 'hide';
    state2 = 'hide';
    zoom1 = 'inactive';
    zoom2 = 'inactive';
    quote1: Quote;
    quote2: Quote;
    backgroundImage1: Photo;
    backgroundImage2: Photo;
    private interval;
    private refreshRateMinutes = 5;
    private clickEnabled: boolean;

    constructor(private _quotesService: QuotesService, private _photoService: PhotoService, private _authService: AuthService) { }

    ngOnInit(): void {
        this.backgroundImage1 = new Photo();
        this.backgroundImage2 = new Photo();

        this.getQuoteAndImage().subscribe((quote1Values) => {
            // Set first quote
            this.quote1 = quote1Values[0];
            this.backgroundImage1 = quote1Values[1];

            // Display the first quote initially
            this.state1 = 'show';
            this.state2 = 'hide';

            this.zoom1 = 'active';

            // Wait for the animation to finish and then set the second quote
            this.getQuoteAndImageAfterTransition().subscribe(quote2Values => {
                this.quote2 = quote2Values[0];
                this.backgroundImage2 = quote2Values[1];
            });
        });

        // Begin a scheduled transition
        this.setSchedule(this.refreshRateMinutes);
    }


    logout() {
        this._authService.logout();
    }

    backgroundImageStyle(backgroundImage: Photo): any {
        return {
            'background-image': `url('${backgroundImage.url}')`
        };
    }

    changeImage(): void {
        if (this.state1 === 'show') {
            this.state1 = 'hide';
            this.state2 = 'show';
            this.zoom2 = 'active';

            // After transition ends set the text/image for the hidden quote
            this.getQuoteAndImageAfterTransition().subscribe(values => {
                this.quote1 = values[0];
                this.backgroundImage1 = values[1];
                this.zoom1 = 'inactive';
            });
        } else {
            this.state1 = 'show';
            this.state2 = 'hide';
            this.zoom1 = 'active';

            // After transition ends set the text/image for the hidden quote
            this.getQuoteAndImageAfterTransition().subscribe(values => {
                this.quote2 = values[0];
                this.backgroundImage2 = values[1];
                this.zoom2 = 'inactive';
            });
        }
    }

    updateOnDoubleClick(): void {
        // Only allow double click transition if there is a new quote to display
        if (this.clickEnabled) {
            this.changeImage();
            this.setSchedule(this.refreshRateMinutes);
        }
    }

    private getQuoteAndImage(): Observable<[Quote, Photo]> {
        const quoteObservable = this._quotesService.getRandom();
        const imageObservable = this._photoService.getRandom();
        return Observable.forkJoin(quoteObservable, imageObservable);
    }

    private getQuoteAndImageAfterTransition(): Observable<[Quote, Photo]> {
        return Observable.create((observer: Observer<[Quote, Photo]>) => {
            this.clickEnabled = false;
            setTimeout(() => {
                this.getQuoteAndImage().subscribe(values => {
                    this.clickEnabled = true;
                    observer.next(values);
                    observer.complete();
                });
            }, TRANSITION_TIME_SECONDS * 1000);
        });
    }

    private setSchedule(minutes: number) {
        if (this.interval) {
            clearInterval(this.interval);
        }

        this.interval = setInterval(() => {
            this.changeImage();
        }, minutes * 60000);
    }

}
