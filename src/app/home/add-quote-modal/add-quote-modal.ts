import { Component, Input, ViewChild, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
    selector: 'app-add-quote-modal',
    templateUrl: 'add-quote-modal.html',
    styleUrls: ['add-quote-modal.css']
})
export class AddQuoteModalComponent implements OnInit {
    @Input() modalName: string;
    addQuoteForm: FormGroup;

    constructor(private _fb: FormBuilder) { }

    ngOnInit(): void {
        this.addQuoteForm = this._fb.group({
            quote: this._fb.control('', Validators.required),
            whoSaidIt: this._fb.control('', Validators.required)
        });
    }

    saveQuote(): void {
        console.log(this.addQuoteForm.value);
    }
}
