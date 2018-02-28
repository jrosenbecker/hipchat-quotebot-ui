import { Component, Input } from '@angular/core';
import { IconLinkConfig } from './iconlink.config';

@Component({
    selector: 'app-icon-link',
    templateUrl: 'iconlink.component.html',
    styleUrls: ['iconlink.component.css']
})
export class IconLinkComponent {
    @Input() config: IconLinkConfig;
 }
