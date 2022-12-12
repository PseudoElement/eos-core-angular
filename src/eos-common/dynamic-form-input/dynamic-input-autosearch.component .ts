import { Component, Output, EventEmitter, OnChanges, ViewChild, OnDestroy, ElementRef, Input } from '@angular/core';
import { DynamicInputBase } from './dynamic-input-base';
import { BsDropdownDirective } from 'ngx-bootstrap';
import { AppContext } from 'eos-rest/services/appContext.service';

const LI_HEIGHT = 20;
@Component({
    selector: 'eos-dynamic-input-autosearch',
    templateUrl: 'dynamic-input-autosearch.component.html'
})

export class DynamicInputAutoSearchComponent extends DynamicInputBase implements OnChanges, OnDestroy {
    @Output() buttonClick: EventEmitter<any> = new EventEmitter<any>();
    @Output() buttonClickRemove: EventEmitter<any> = new EventEmitter<any>();
    @Output() onClickDict: EventEmitter<any> = new EventEmitter<any>();
    @Input() container: string;
    @Input() dropup: boolean;
    @Input() height: number;
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
        return 'text';
    }

    get label(): string {
        return this.input.groupLabel && this.isGroup ? this.input.groupLabel : this.input.label;
    }

    get currentValue(): string {
        const ctrl = this.control;
        if (ctrl) {
            return this.control.value;
        } else {
            return undefined;
        }
    }

    get currentTooltip(): string {
        let optValue;
        const ctrl = this.control;
        if (ctrl) {
            optValue = this.input.options.find((option) => option.value === ctrl.value);
        }
        if (this.textInputSelect && optValue && optValue.tooltip) {
            const tooltip = this.textInputSelect.nativeElement.clientWidth < this.textInputSelect.nativeElement.scrollWidth ? this.currentValue : undefined;
            return tooltip;
        } else {
            return undefined;
        }
    }

    controlIsValid() {
        return this.control.valid;
    }

    onInput(event) {
        event.stopPropagation();
        this.delayedTooltip();
        this.control.setValue(event.target.value);

    }

    getMenuWidthStyle(): any {
        const w = this.getMenuWidth();
        return { 'min-width.px': w, 'max-width.px': w, 'max-height.px': this.height ? this.height : 500 };
    }

    getItemTooltip(event, item): string {
        if (event && item.tooltip) {
            const tooltip = event.clientWidth < event.scrollWidth ? item.title : undefined;
            return tooltip;
        } else {
            return undefined;
        }
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
        evt.stopImmediatePropagation();
        evt.stopPropagation();
        evt.preventDefault();
    }

    filterKeyDown(event) {
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

    selectAction(e: MouseEvent, item: any, params?: any) {
        if (item.value === '') {
            this.control.setValue(null);
        } else {
            this.control.setValue(String(item.value));
        }

        if (AppContext.isIE()) {
            // console.log("TCL: DynamicInputSelect2Component -> selectAction -> AppContext.isIE", AppContext.isIE())
            /* IE fix */
            this._dropDown.hide();
            if (e) {
                e.preventDefault();
                e.stopImmediatePropagation();
                e.stopPropagation();
            }
        }
    }

    isItemSelected(item: any): boolean {
        return String(this.control.value) === String(item.value);
    }

    elementMouseEnter(item) {
        this.focusedItem = item;
    }

    elementMouseLeave(item) {
        this.focusedItem = null;
    }

    onMenuShown() {
        this.inputTooltip.visible = false;
    }

    onMenuHidden() {
        setTimeout(() => {
            this.updateMessage();
        }, 100);
    }

    onButtonClick() {
        this.control.setValue('');
    }

    private _scrollTo(item: any): any {
        const i = this.input.options.findIndex((o) => o === item);
        if (i !== -1) {
            const pos = i * LI_HEIGHT;
            console.log(this.dropdownElement);
            const isVisible = this.dropdownElement.nativeElement.scrollTop < pos
                && (this.dropdownElement.nativeElement.scrollTop +
                    this.dropdownElement.nativeElement.clientHeight) > pos;
            if (!isVisible) {
                this.dropdownElement.nativeElement.scrollTop = i * LI_HEIGHT;
            }
        }
    }

}
