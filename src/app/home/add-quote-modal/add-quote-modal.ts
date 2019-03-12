import { Component, Input, ViewChild, OnInit } from '@angular/core';

@Component({
    selector: 'app-add-quote-modal',
    templateUrl: 'add-quote-modal.html',
    styleUrls: ['add-quote-modal.css']
})
export class AddQuoteModalComponent {
    @Input() modalName: string;

}
