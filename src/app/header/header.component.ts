import { Component } from '@angular/core';

@Component({
    selector: 'app-header-component',
    templateUrl: 'header.component.html',
    styleUrls: ['header.component.css']
})
export class HeaderComponent {
    title: String = 'Madison Quotes';
}
