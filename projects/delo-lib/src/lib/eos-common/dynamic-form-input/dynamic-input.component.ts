import { Component, Input, Output, EventEmitter } from '@angular/core';
import type { InputBase } from '../core/inputs/input-base';
import { FormGroup } from '@angular/forms';
import { E_FIELD_TYPE } from '../../eos-dictionaries/interfaces';
import { DatePickerStyleFixes } from '../../eos-common/type/const.type';


export class ErrorTooltip {
    visible = false;
    message = '';
    placement = 'bottom';
    class = 'tooltip-error';
    container = '';
    force = false;
}
export class IDynamicInputEvents {
    select?: Function;
    remove?: Function;
    getTitle?: Function;
}
export class IDynamicInputOptions {
    hideLabel?: boolean; // default: false;
    hidePicker?: boolean; // default: false;
    selEmptyEn?: boolean; // default: false;
    selectionEditable?: boolean; // default: false; Allow edit text value for select-2
    // dropdownContainer?: string ; // контейнер для dropdown select. 'body' или не указано для локального положения
    defaultValue?: { value: string, title: string , disabled?: boolean };
    enRemoveButton?: boolean; // for dictlink second button
    events?: IDynamicInputEvents;
    // selEmptyValDis?: boolean; // default: false;
}
@Component({
    selector: 'eos-dynamic-input',
    templateUrl: 'dynamic-input.component.html'
})
export class DynamicInputComponent {
    @Input() input: InputBase<any>;
    @Input() iconForElem: string;
    @Input() visibleDeletElem: boolean;
    @Input() form: FormGroup;
    @Input() readonly: boolean;
    @Input() disabled: boolean;
    @Input() isGroup: boolean;
    @Input() hideLabel: boolean;
    @Input() viewOpts: IDynamicInputOptions;
    @Input() container: string; // контейнер для dropdown select. 'body' или не указано для локального положения
    @Input() dropup: boolean; // выкидывать меню селекта вверх, а не вниз
    @Input() height: number; // ограничить высоту выпадалки или указать минимальную высота textarea в dynamic-input-text
    @Input() notStandartText: boolean; // параметр для text принимает boolean по дефолту undefined, если true то прячет иконку
    @Input() placement: string; // используется для даты чтобы можно было указать в какую сторону открывать выпадашку
    @Input() customStyle: DatePickerStyleFixes | undefined; // для передачи кастомных стилей выподающему окну Datepicker
    @Input() shouldHideTooltipOnBlur?: boolean;
    @Output() onControlBlur: EventEmitter<any> = new EventEmitter<any>();
    @Output() onControlFocus: EventEmitter<any> = new EventEmitter<any>();

    // для контрола контекстного поиска в карточке пользователя
    @Output() onClickChoose: EventEmitter<any> = new EventEmitter<any>();
    @Output() onEnterSearchEmptyResults: EventEmitter<any> = new EventEmitter<any>();

    types = E_FIELD_TYPE;
    tooltip: ErrorTooltip = new ErrorTooltip;

    constructor () {
        if (!this.viewOpts) {
            this.viewOpts = <IDynamicInputOptions> {};
        }
    }
}
