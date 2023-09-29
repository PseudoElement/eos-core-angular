import { Component, Output, EventEmitter, OnChanges, ViewChild, OnDestroy, ElementRef, Input } from '@angular/core';
import { DynamicInputBaseDirective } from './dynamic-input-base';
import { BsDropdownDirective } from 'ngx-bootstrap';
import { AppContext } from '../../eos-rest/services/appContext.service';

const LI_HEIGHT = 20;
@Component({
    selector: 'eos-dynamic-input-autosearch',
    templateUrl: 'dynamic-input-autosearch.component.html'
})

export class DynamicInputAutoSearchComponent extends DynamicInputBaseDirective implements OnChanges, OnDestroy {
    @Output() buttonClick: EventEmitter<any> = new EventEmitter<any>();
    @Output() buttonClickRemove: EventEmitter<any> = new EventEmitter<any>();
    @Output() onClickChoose: EventEmitter<any> = new EventEmitter<any>();
    @Output() onEnterSearchEmptyResults: EventEmitter<any> = new EventEmitter<any>();
    @Output() onInputChange: EventEmitter<string> = new EventEmitter<string>();
    @Output() onSelectDropDown: EventEmitter<string> = new EventEmitter<string>();
    @Input() container: string;
    @Input() dropup: boolean;
    @Input() height: number;
    public focusedItem: any;
    @ViewChild('dropdown', {static: false}) private _dropDown: BsDropdownDirective;
    @ViewChild('dropdownElement', {static: false}) private dropdownElement: ElementRef;
    @ViewChild('textInputSelect', {static: false}) private textInputSelect: ElementRef;
    private _lastWrapperWidth: number;
    private _calcItemWidth: number;
    private _onInputDebounce: NodeJS.Timeout;
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

    onInput(event: Event) {
        event.stopPropagation();
        const input = event.target as HTMLInputElement
        if(input.value) this.onInputChange.emit(input.value);
        if(this._onInputDebounce) clearTimeout(this._onInputDebounce)
        this._onInputDebounce = setTimeout(() => {
            this.control.setValue((event.target as HTMLInputElement).value);
            this.showDropDown()
        }, 300)
    }

    showDropDown() {
        if (this.control.value.length >= 3) {
            this._dropDown.show();
            if (this.input.options.length > 1) {
                this.setFirstFocusedItem();
            }
        } else {
            this._dropDown.hide();
        }
    }

    hideDropDown() {
        this._dropDown.hide();
    }

    getMenuWidthStyle(): any {
        const w = this.getMenuWidth();
        return { 'min-width.px': w, 'max-width.px': w, 'max-height.px': this.height ? this.height : 400 };
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
        const w = this.textInputSelect?.nativeElement.clientWidth || window.innerWidth;
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

    selectAction(e: MouseEvent, item: any, params?: any) {
        if (item) {
            if (item.value === '') {
                this.control.setValue(null);
            } else {
                this.control.setValue(String(item.value));
                this.onSelectDropDown.emit(item.value);
            }
        }
        this._dropDown.hide();
        if (AppContext.isIE()) {
            // console.log("TCL: DynamicInputSelect2Component -> selectAction -> AppContext.isIE", AppContext.isIE())
            /* IE fix */
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

    onMenuShown(event) {
        this.inputTooltip.visible = false;
    }

    onMenuHidden(event) {
        setTimeout(() => {
            this.updateMessage();
        }, 700);
    }

    onEraseClick() {
        this.control.setValue('');
        this.input.options = [];
        this._dropDown.hide();
    }

    filterKeyDown(event) {
        const code = event.code /* !IE */ || event.key /* IE */;
        const isLessThen3Chars = event.target.value.length < 3
        switch (code) {
            case 'ArrowDown':
            case 'Down': this._hoverNext(); break;
            case 'ArrowUp':
            case 'Up': this._hoverPrev(); break;
            case 'Enter': 
                this.onEnterSearchEmptyResults.emit();
                if(isLessThen3Chars &&  this._dropDown.isOpen) {
                    this.selectAction(null, this.focusedItem);
                    this._dropDown.hide();
                }
            }
    }

    setFirstFocusedItem() {
        this.focusedItem = this.input.options[0];
        this._scrollTo(this.focusedItem);
    }

    onClick() {
        if (this.input.options.length > 0 && this.form.enabled) {
            if (this._dropDown.isOpen) {
                this._dropDown.hide();
            } else {
                this._dropDown.show();
            }
        }
    }

    shouldShowDropdown(): boolean {
        return this.form.enabled && this.input.options.length > 0 && !!this.currentValue.trim()
    }


    private _hoverNext(): any {
        if (!this.input.options || !this.input.options.length) {
            return;
        }
        if (!this.focusedItem) {
            this.focusedItem = this.input.options[0];
        } else {
            const i = this.input.options.findIndex((o) => o === this.focusedItem);
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
            const i = this.input.options.findIndex((o) => o === this.focusedItem);
            if (i === -1 || i === 0) {
                this.focusedItem = this.input.options[this.input.options.length - 1];
            } else {
                this.focusedItem = this.input.options[i - 1];
            }
        }
        this._scrollTo(this.focusedItem);
    }

    private _scrollTo(item: any): any {
        const i = this.input.options.findIndex((o) => o === item);
        if (i !== -1 && this.dropdownElement) {
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
