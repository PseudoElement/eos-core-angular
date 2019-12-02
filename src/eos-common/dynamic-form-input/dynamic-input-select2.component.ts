import { Component, Output, EventEmitter, OnChanges, ViewChild, OnDestroy, ElementRef, Input } from '@angular/core';
import { DynamicInputBase } from './dynamic-input-base';
import { BsDropdownDirective } from 'ngx-bootstrap';


@Component({
    selector: 'eos-dynamic-input-select2',
    templateUrl: 'dynamic-input-select2.component.html'
})

export class DynamicInputSelect2Component extends DynamicInputBase implements OnChanges, OnDestroy {

    @Output() buttonClick: EventEmitter<any> = new EventEmitter<any>();
    @Output() buttonClickRemove: EventEmitter<any> = new EventEmitter<any>();
    @Input() container: string;
    @Input() dropup: boolean;

    @ViewChild('dropdown') private _dropDown: BsDropdownDirective;
    @ViewChild('textInputSelect') private textInputSelect: ElementRef;

    private _lastWrapperWidth: number;
    private _calcItemWidth: number;

    constructor() {
        super();
    }
    // @HostListener('scroll', ['$event'])
    // private onScroll($event:Event): void {
    //     this._dropDown.hide();
    //     console.log($event.srcElement.scrollLeft, $event.srcElement.scrollTop);
    // }


    get textType(): string {
        if (this.input.password) {
            return 'password';
        }
        return 'text';
    }

    get label(): string {
        return this.input.groupLabel && this.isGroup ? this.input.groupLabel : this.input.label;
    }

    get currentValue(): string {
        let value = '...'; // ..this.input.label;
        const ctrl = this.control;
        if (ctrl) {
            if (this.viewOpts.selectionEditable) {
                return this.control.value;
            }
            let optValue = this.input.options.find((option) => option.value === ctrl.value);
            if (!optValue && typeof ctrl.value === 'string') {
                optValue = this.input.options.find((option) => option.value.toString() === ctrl.value);
            }
            if (optValue) {
                value = optValue.title;
            }
        }
        return value;
    }

    controlIsValid() {
        return this.control.valid;
    }

    // foo () {
    //     const res = (this.viewOpts && this.viewOpts.selectionEditable) ? this.input.key : undefined;
    //     return res;
    // }

    onInput(event) {
        event.stopPropagation();
        this._delayedTooltip();
        if (this.viewOpts.selectionEditable) {
            this.control.setValue(event.target.value);
        }
    }
    getMenuWidthStyle(): any {
        const w = this.getMenuWidth();
        return { 'min-width.px': w, 'max-width.px': w };
    }

    getMenuWidth(): number {
        const w = this.textInputSelect.nativeElement.clientWidth;
        if (w === this._lastWrapperWidth) {
            return this._calcItemWidth;
        }
        this._lastWrapperWidth = w;
        this._calcItemWidth = w;

        return this._calcItemWidth;

    }
    selectClick(evt: Event) {
        if (this.readonly) {
            evt.stopImmediatePropagation();
            evt.stopPropagation();
            evt.preventDefault();
        }
    }

    ignoreKeyDown(event) { // IE backspace
        if (this.viewOpts.selectionEditable) {

        } else {
            event.preventDefault();
        }
    }

    selectAction (e: MouseEvent, item: any, params?: any) {
        if (item.value === '') {
            this.control.setValue(null);
        } else {
            this.control.setValue(String(item.value));
        }
    }

    isItemSelected (item: any): boolean {
        return String(this.control.value) === String(item.value);
    }

    ngOnDestroy () {
        if (this._dropDown) {
            this._dropDown.autoClose = false;
            this._dropDown.hide();
        }
        super.ngOnDestroy();
    }

}
