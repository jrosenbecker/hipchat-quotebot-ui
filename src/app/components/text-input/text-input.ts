import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

const CONTROL_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => TextInputComponent),
    multi: true
};

@Component({
    selector: 'app-text-input',
    templateUrl: 'text-input.html',
    styleUrls: ['text-input.css'],
    providers: [CONTROL_VALUE_ACCESSOR]
})
export class TextInputComponent implements ControlValueAccessor {

    @Input() label: string;
    @Input() field: string;

    value: string;
    disabled = false;


    private onModelChange: Function;
    private onTouched: Function;

    writeValue(value): void {
        this.value = value;
    }
    registerOnChange(fn: any): void {
        this.onModelChange = fn;
    }
    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    touched() {
        this.onTouched();
    }

    valueUpdated() {
        this.onModelChange();
    }
}
