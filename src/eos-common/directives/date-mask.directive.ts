import { Directive, /* HostListener, ElementRef, */ forwardRef, ElementRef, HostListener } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { DATE_INPUT_PATERN, DATE_JSON_PATTERN } from '../consts/common.consts';
import { EosUtils } from '../core/utils';

@Directive({
    selector: '[eosDateMask]',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => EosDateMaskDirective),
            multi: true
        }
    ]
})
export class EosDateMaskDirective implements ControlValueAccessor {
    private dateValue: Date;

    get value() {
        return this.dateValue;
    }

    set value(val) {
        this.dateValue = val;
        this.onChange(this.dateValue);
        this.onTouched();
    }


    constructor(private ref: ElementRef) { }


    onChange: any = () => { };
    onTouched: any = () => { };

    @HostListener('keydown', ['$event'])
    onKeydown(kbEvt: KeyboardEvent) {
        switch (kbEvt.keyCode) {
            case 8: // backspace
            case 46: // delete
                kbEvt.preventDefault();
                break;
        }
    }

    @HostListener('keyup', ['$event'])
    onKeyup(kbEvt: KeyboardEvent) {
        const elem = this.ref.nativeElement;
        const cursorPos = elem.selectionStart;
        let oldVal = elem.value;

        // replace removed symbols with _
        switch (kbEvt.keyCode) {
            case 8: // backspace
                if (cursorPos === 3 || cursorPos === 6) {
                    oldVal = this.removeSymbolAt(oldVal, cursorPos - 2);
                } else if (cursorPos > 0) {
                    oldVal = this.removeSymbolAt(oldVal, cursorPos - 1);
                }
                break;
            case 46: // delete
                if (cursorPos === 0) {
                    oldVal = '';
                } else if (cursorPos !== 2 && cursorPos !== 5) {
                    oldVal = this.removeSymbolAt(oldVal, cursorPos);
                }
                break;
        }

        const parts = oldVal.split('.');
        const valParts = '..'.split('.')
            .map((subVal, idx) => parts[idx] ? parts[idx].replace(/\D/g, '_') : '')
            .map((subNum, idx) => (subNum + '____').substr(0, idx < 2 ? 2 : 4));

        const val = valParts.join('.');
        if (val.replace(/\D/g, '')) {
            this.ref.nativeElement.value = val;
        } else {
            this.ref.nativeElement.value = null;
        }

        this.value = this.parseDate(this.ref.nativeElement.value);

        elem.selectionStart = cursorPos;

        switch (kbEvt.keyCode) {
            case 8: // backspace
                if (cursorPos === 3 || cursorPos === 6) {
                    elem.selectionStart = cursorPos - 2;
                } else if (cursorPos === 0) {
                    elem.selectionStart = cursorPos;
                } else {
                    elem.selectionStart = cursorPos - 1;
                }
                elem.selectionEnd = elem.selectionStart;
                break;
            case 37: // left
            case 39: // right
                break;
            case 46: // delete
                elem.selectionStart = cursorPos;
                break;
            default:
                if (cursorPos === 2 || cursorPos === 5) {
                    elem.selectionStart = cursorPos + 1;
                }
        }

        elem.selectionEnd = elem.selectionStart;

        /*
        switch (kbEvt.keyCode) {
            case 8: // backspace
            case 37: // left
                if (cursorPos === 3 || cursorPos === 6) {
                    elem.selectionStart = cursorPos - 2;
                } else if (cursorPos === 0) {
                    elem.selectionStart = cursorPos;
                } else {
                    elem.selectionStart = cursorPos - 1;
                }
                elem.selectionEnd = elem.selectionStart + 1;
                break;
            case 38: // up
                elem.selectionStart = 0;
                elem.selectionEnd = 1;
                break;
            case 40: // down
                elem.selectionStart = 9;
                elem.selectionEnd = 10;
                break;
            case 39: // right
            case 46: // delete
            default:
                if (cursorPos === 2 || cursorPos === 5) {
                    console.log(cursorPos);
                    elem.selectionStart = cursorPos + 2;
                    elem.selectionEnd = cursorPos + 1;
                } if (cursorPos === 10) {
                    elem.selectionStart = cursorPos - 1;
                } else {
                    elem.selectionStart = cursorPos;
                }
                elem.selectionEnd = cursorPos + 1;
                console.log(cursorPos, elem.selectionStart, elem.selectionEnd);
        }
        */
    }

    registerOnChange(fn) {
        this.onChange = fn;
    }

    registerOnTouched(fn) {
        this.onTouched = fn;
    }

    writeValue(value) {
        if (value) {
            if (value instanceof Date) {
                value.setHours(0, 0, 0, 0);
            }
            this.value = value;
            this.ref.nativeElement.value = EosUtils.dateToStringValue(value);
        }
    }

    private removeSymbolAt(source: string, pos: number): string {
        const val = source.split('');
        val[pos] = '_';
        return val.join('');
    }

    private parseDate(value: string): Date {
        value = (value && 'string' === typeof value) ? value.trim() : value;
        if (value) {
            if (DATE_INPUT_PATERN.test(value)) { // if correct format
                // convert to UTC format then to Date
                this.dateValue = new Date(value.replace(DATE_INPUT_PATERN, '$3-$2-$1T00:00:00.000Z'));
            } else if (DATE_JSON_PATTERN.test(value)) {
                this.dateValue = new Date(value);
            } else {
                this.dateValue = new Date('incorrect date');
            }
        } else {
            this.dateValue = null;
        }
        return this.dateValue;
    }

}
