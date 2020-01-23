import { Component, Output, EventEmitter, OnChanges, ViewChild, OnDestroy, ElementRef, Input } from '@angular/core';
import { DynamicInputBase } from './dynamic-input-base';
import { BsDropdownDirective } from 'ngx-bootstrap';
import { AppContext } from 'eos-rest/services/appContext.service';


const LI_HEIGHT = 20;
@Component({
    selector: 'eos-dynamic-input-select2',
    templateUrl: 'dynamic-input-select2.component.html'
})

export class DynamicInputSelect2Component extends DynamicInputBase implements OnChanges, OnDestroy {

    @Output() buttonClick: EventEmitter<any> = new EventEmitter<any>();
    @Output() buttonClickRemove: EventEmitter<any> = new EventEmitter<any>();
    @Input() container: string;
    @Input() dropup: boolean;

    public focusedItem: any;


    @ViewChild('dropdown') private _dropDown: BsDropdownDirective;
    @ViewChild('dropdownElement') private dropdownElement: ElementRef;
    @ViewChild('textInputSelect') private textInputSelect: ElementRef;



    private _lastWrapperWidth: number;
    private _calcItemWidth: number;

    private _filterString: string = '';
    private _filterTimer: NodeJS.Timer;


    constructor() {
        super();
    }

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

    filterKeyDown(event) {
        const code = event.code /* !IE */ || event.key /* IE */;



        if (this.viewOpts.selectionEditable) {

        } else {
            event.preventDefault();
        }

        if (!this.dropdownElement || !this.focusedItem) {
            return;
        }

        if (code === 'ArrowDown' || code === 'Down') {
            this._hoverNext();
        } else if (code === 'ArrowUp' || code === 'Up') {
            this._hoverPrev();
        } else if (code === 'Enter' && this._dropDown.isOpen) {
            this.selectAction(null, this.focusedItem);
            this._dropDown.hide();
        } else if (this.inputCheck(event)) {
            this._filterString += String(event.key).toLowerCase();
            if (this._filterTimer) {
                clearTimeout(this._filterTimer);
            }
            this._filterTimer = setTimeout(() => {
                this._filterTimer = null;
                this._filterString = '';
            }, 500);

            const i = this.input.options.findIndex((o) => String(o.title).toLowerCase().indexOf(this._filterString) === 0);
            if (i !== -1) {
                this.focusedItem = this.input.options[i];
                this._scrollTo(this.focusedItem);
                // this.dropdownElement.nativeElement.scrollTop = i * LI_HEIGHT;
            }
        }
    }

    inputCheck(e) {
        if (e.metaKey || e.ctrlKey || e.altKey) {
            return false;
        }
        return (/^[А-Яа-яA-Za-z0-9 ]$/.test(e.key));
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

        if (AppContext.isIE()) {
            // console.log("TCL: DynamicInputSelect2Component -> selectAction -> AppContext.isIE", AppContext.isIE())
            /* IE fix */
            this._dropDown.hide();
            this._dropDown.hide();
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
    elementMouseEnter(item) {
        this.focusedItem = item;
    }

    elementMouseLeave(item) {
        this.focusedItem = null;
    }

    onButtonClick () {
        setTimeout(() => this.textInputSelect.nativeElement.focus(), 0);
    }
    private _hoverNext(): any {
        if (!this.input.options || !this.input.options.length) {
            return;
        }
        if (!this.focusedItem) {
            this.focusedItem = this.input.options[0];
        } else {
            const i = this.input.options.findIndex( (o) => o === this.focusedItem);
            if (i === -1 || i === this.input.options.length - 1) {
                this.focusedItem = this.input.options[0];
            } else {
                this.focusedItem = this.input.options[i + 1];
            }
        }
        this._scrollTo(this.focusedItem);
    }

    private _hoverPrev(): any {
        if (!this.input.options || !this.input.options.length) {
            return;
        }
        if (!this.focusedItem) {
            this.focusedItem = this.input.options[this.input.options.length - 1];
        } else {
            const i = this.input.options.findIndex( (o) => o === this.focusedItem);
            if (i === -1 || i === 0) {
                this.focusedItem = this.input.options[this.input.options.length - 1];
            } else {
                this.focusedItem = this.input.options[i - 1];
            }
        }

        this._scrollTo(this.focusedItem);

    }

    private _scrollTo(item: any): any {
        const i = this.input.options.findIndex( (o) => o === item);
        if (i !== -1) {
            const pos = i * LI_HEIGHT;
            const isVisible = this.dropdownElement.nativeElement.scrollTop < pos
                && (this.dropdownElement.nativeElement.scrollTop +
                this.dropdownElement.nativeElement.clientHeight) > pos;
            if (!isVisible) {
                this.dropdownElement.nativeElement.scrollTop = i * LI_HEIGHT;
            }
        }
    }



}
