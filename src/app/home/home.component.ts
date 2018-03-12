import { Component } from '@angular/core';
import { IconLinkConfig } from '../iconlink/iconlink.config';

@Component({
    templateUrl: 'home.component.html'
})
export class HomeComponent {
    public randomIconLinkConfig: IconLinkConfig;
    public searchIconLinkConfig: IconLinkConfig;
    public addIconLinkConfig: IconLinkConfig;

    constructor() {
        this.init();
    }

    init(): void {
        this.randomIconLinkConfig = {
            icon: 'casino',
            title: 'Random Quotes',
            description: 'A full screen display that will cycle between random quotes every few seconds',
            href: '/random'
        };

        this.searchIconLinkConfig = {
            icon: 'search',
            title: 'Search Quotes',
            description: 'Search for quotes by person or content',
            href: '/search'
        };

        this.addIconLinkConfig = {
            icon: 'add',
            title: 'Add Quote',
            description: 'Add quotes from somebody in the office',
            href: '/add'
        };
    }
}
