import { Component, Input, ViewChild, OnInit, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { QuotesService } from '../../services/quotes.service';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs/operators';
import { M } from 'materialize-css';

@Component({
    selector: 'app-add-quote-modal',
    templateUrl: 'add-quote-modal.html',
    styleUrls: ['add-quote-modal.css']
})
export class AddQuoteModalComponent implements OnInit {
    @Input() modalName: string;
    @ViewChild('modalRef') modalRef: ElementRef<any>;
    addQuoteForm: FormGroup;
    isSaving = false;

    constructor(
        private _fb: FormBuilder,
        private _quotesService: QuotesService,
        private _toastr: ToastrService
    ) { }

    ngOnInit(): void {
        this.addQuoteForm = this._fb.group({
            quote: this._fb.control('', Validators.required),
            whoSaidIt: this._fb.control('', Validators.required)
        });
    }

    saveQuote(): void {
        const quote = this.addQuoteForm.get('quote').value;
        const quotee = this.addQuoteForm.get('whoSaidIt').value;
        this.isSaving = true;
        this._quotesService.saveQuote(quote, quotee).pipe(
            take(1)
        ).subscribe(() => {
            this._toastr.success(`Let's hope this doesn't come back to bite you`, 'Quote Added!');
            this.isSaving = false;
            this.addQuoteForm.reset();
        }, (error) => {
            this._toastr.error('An error occurred adding the quote');
            this.isSaving = false;
        });
    }
}
