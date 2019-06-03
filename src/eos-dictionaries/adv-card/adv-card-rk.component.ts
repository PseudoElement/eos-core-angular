import { Component, Output, EventEmitter, OnDestroy, OnInit, OnChanges, ViewChild, NgZone, Injector } from '@angular/core';
import {BsModalRef} from 'ngx-bootstrap';
import { AdvCardRKDataCtrl, DEFAULTS_LIST_NAME, FILE_CONSTRAINT_LIST_NAME, FICT_CONTROLS_LIST_NAME } from './adv-card-rk-datactrl';
import { EosDataConvertService } from 'eos-dictionaries/services/eos-data-convert.service';
import { FormGroup, AbstractControl } from '@angular/forms';
import { InputControlService } from 'eos-common/services/input-control.service';
import { TDefaultField, TDFSelectOption } from './rk-default-values/rk-default-const';
import { EosUtils } from 'eos-common/core/utils';
import { Subscription } from 'rxjs';
import { RKBasePage } from './rk-default-values/rk-base-page';
import { E_FIELD_TYPE } from 'eos-dictionaries/interfaces';
import { ValidatorsControl, VALIDATOR_TYPE } from 'eos-dictionaries/validators/validators-control';
import { ConfirmWindowService } from 'eos-common/confirm-window/confirm-window.service';
import { RK_SELECTED_LIST_IS_EMPTY, RK_SELECTED_LIST_HAS_DELETED } from 'app/consts/confirms.const';
import { IConfirmWindow2 } from 'eos-common/confirm-window/confirm-window2.component';
import {BaseCardEditComponent} from '../card-views/base-card-edit.component';

const NODE_LABEL_NAME = 'CLASSIF_NAME';
class Ttab {
    tag: number;
    title: string;
}

const tabs: Ttab [] = [
    {tag: 0, title: 'По умолчанию'},
    {tag: 1, title: 'Обязательные'},
    {tag: 2, title: 'При записи'},
    {tag: 3, title: 'Файлы'},
];


// Реквизит "Срок исполнения" может быть заполнен только в одном месте

@Component({
    selector: 'eos-adv-card-rk',
    templateUrl: 'adv-card-rk.component.html',
})

export class AdvCardRKEditComponent implements OnDestroy, OnInit, OnChanges {
    @Output() onChoose: EventEmitter<any> = new EventEmitter<any>();
    @Output() formChanged: EventEmitter<any> = new EventEmitter<any>();

    isUpdating = true;
    nodes: any[];
    tabs: Ttab [];
    dataController: AdvCardRKDataCtrl;
    activeTab: Ttab;
    form: FormGroup;

    values: any;

    descriptions: any;
    inputs: any;
    newData: any;
    storedValuesDG: any;
    editValues: any;
    isChanged: boolean;
    formInvalid: boolean;
    isEDoc: boolean;
    rkType: number;


    @ViewChild('currentPage') private currentPage: RKBasePage;
    private subscriptions: Subscription[];
    private _node = {};
    private isn_node: number;
    private _currentFormStatus: any;

    constructor(
        public injector: Injector,
        public bsModalRef: BsModalRef,
        public zone: NgZone,
        private _dataSrv: EosDataConvertService,
        private _inputCtrlSrv: InputControlService,
        private _confirmSrv: ConfirmWindowService,
    ) {
        this.isUpdating = true;
        this.tabs = tabs;
        this.subscriptions = [];
        this.editValues = {};
        this.isChanged = false;
    }

    ngOnChanges() {
    }

    ngOnInit() {
    }

    ngOnDestroy() {
        this.subscriptions.forEach((subscr) => {
            if (subscr) {
                subscr.unsubscribe();
            }
        });
        this.subscriptions = [];
    }

    updateLinks (el: TDefaultField, options: TDFSelectOption[], data: any) {
        if (el.key === 'JOURNAL_ISN_NOMENC' ||
            el.key === 'JOURNAL_ISN_NOMENC_W'
            ) {
            const rec = data[0];
            if (rec['DUE'] === '0.') {
                options[0].title = '...';
                options[0].rec = null;
            } else {
                options[0].rec = rec;
                options[0].title = rec['NOM_NUMBER'] + ' (' + rec['YEAR_NUMBER'] + ') ' + rec['CLASSIF_NAME'];
            }
        }
    }

    save(): void {
        this.preSaveCheck(this.newData).then(isCancel => {
            if (!isCancel) {
                this.dataController.save(this.isn_node, this.inputs, this.newData).then (r => {
                    this.bsModalRef.hide();
                }).catch (err => {

                });
            }
        });
    }

    preSaveCheck(newdata: any): Promise<any> {
        let confPromise = Promise.resolve(false);
        // проверить списки на предмет наличия логически удаленных записей.
        const fields = this.descriptions[DEFAULTS_LIST_NAME];
        for (let i = 0; i < fields.length; i++) {
            const el: TDefaultField = fields[i];
            if (!el.dict) { continue; }
            if (el.dict.dictId !== 'USER_LISTS') { continue; }

            // const id = el.dict.criteries['CLASSIF_ID'];
            const val = newdata[DEFAULTS_LIST_NAME][el.key];
            if (val) {
                const opt = el.options.find ( o => Number(o.value) === Number(val));
                if (opt && opt.isEmpty) {
                    confPromise = this._presaveConfirmAppen(confPromise, el, RK_SELECTED_LIST_IS_EMPTY);
                }

                if (opt && opt.hasDeleted) {
                    confPromise = this._presaveConfirmAppen(confPromise, el, RK_SELECTED_LIST_HAS_DELETED);
                }

            }
        }

        return confPromise;
    }



    cancel(): void {
        this.bsModalRef.hide();
    }

    public hideModal(): void {
        this.bsModalRef.hide();
    }

    public getTitleLabel() {
        return 'Реквизиты РК "' + this._node[NODE_LABEL_NAME] + '"';
    }

    public clickTab (item: Ttab) {
        this.activeTab = item;
        this._autoFocus();
    }

    public initByNodeData(dndata: any) {
        this.isUpdating = true;
        this.isn_node = dndata['ISN_NODE'];
        if (!dndata) {
            this._node = {};
        } else {
            this._node = dndata;
        }

        this.activeTab = tabs[0];

        this.dataController = new AdvCardRKDataCtrl(this.injector/*, this._zone, this._apiSrv, this._msgSrv, this._dictSrv*/);
        this.descriptions = this.dataController.getDescriptions();

        this.dataController.readDGValues(this.isn_node).then (values => {
            this.storedValuesDG = values[0];
            if (this.storedValuesDG['E_DOCUMENT'] === 1) {
                this.isEDoc = true;
            } else {
                this.isEDoc = false;
            }

            this.rkType = this.storedValuesDG['RC_TYPE'];

            this.values = {
                [DEFAULTS_LIST_NAME]: this._makeDefaults(this.descriptions[DEFAULTS_LIST_NAME]),
                [FILE_CONSTRAINT_LIST_NAME]: this._makeDefaults(this.descriptions[FILE_CONSTRAINT_LIST_NAME]),
                [FICT_CONTROLS_LIST_NAME]: this._makeDefaults(this.descriptions[FICT_CONTROLS_LIST_NAME]),
            };

            this._appendDBDefValues(this.values[DEFAULTS_LIST_NAME], this.storedValuesDG[DEFAULTS_LIST_NAME]);
            this._appendDBFilesValues(this.values[FILE_CONSTRAINT_LIST_NAME], this.storedValuesDG[FILE_CONSTRAINT_LIST_NAME]);
            this.isChanged = true;
            this._checkCorrectValuesLogic(this.values);
            this.editValues = this._makePrevValues(this.values);

            this.dataController.loadDictsOptions(this.values, this.updateLinks).then (() => {
                this.inputs = this._getInputs();
                this._updateInputs(this.inputs);
                this._updateOptions(this.inputs);
                const isNode = false;
                this.form = this._inputCtrlSrv.toFormGroup(this.inputs, isNode);
                this._updateValidators(this.form.controls);

                this.subscriptions.push(this.form.statusChanges
                    .subscribe((status) => {
                        if (this._currentFormStatus !== status) {
                            this.formInvalid = (status === 'INVALID');
                        }
                        this._currentFormStatus = status;
                    }));

                this._subscribeToChanges();
                this.isUpdating = false;
                this._autoFocus();
            });
        });

    }

    private _presaveConfirmAppen(confPromise: Promise<boolean>, el: TDefaultField, win: IConfirmWindow2): Promise<boolean> {
        return confPromise.then ((res) => {
            const testc: IConfirmWindow2 = Object.assign({}, win);
            testc.body = testc.body.replace('{{REK}}', el.title);
            if (res) {
                return res;
            } else {
                return this._confirmSrv.confirm2(testc).then((button) => {
                    return (!button || button.result === 2);
                });
            }
        });
    }
    private _updateInputs(inputs: any): any {
        if (!this.isEDoc) {
            inputs['DOC_DEFAULT_VALUE_List.SPECIMEN'].required = true;
        }
        inputs['DOC_DEFAULT_VALUE_List.FREE_NUM_M'].value = 1;
        inputs['DOC_DEFAULT_VALUE_List.DOC_DATE_M'].value = 1;
        inputs['DOC_DEFAULT_VALUE_List.SECURLEVEL_M'].value = 1;
        inputs['DOC_DEFAULT_VALUE_List.ISN_CARD_REG_M'].value = 1;
        inputs['DOC_DEFAULT_VALUE_List.ISN_CABINET_REG_M'].value = 1;
    }

    private _updateValidators(controls: any): any {
        ValidatorsControl.appendValidator(controls['DG_FILE_CONSTRAINT_List.REPLY.EXTENSIONS'],
            ValidatorsControl.existValidator(VALIDATOR_TYPE.EXTENSION_DOT));
        ValidatorsControl.appendValidator(controls['DG_FILE_CONSTRAINT_List.RESOLUTION.EXTENSIONS'],
            ValidatorsControl.existValidator(VALIDATOR_TYPE.EXTENSION_DOT));
        ValidatorsControl.appendValidator(controls['DG_FILE_CONSTRAINT_List.DOC_RC.EXTENSIONS'],
            ValidatorsControl.existValidator(VALIDATOR_TYPE.EXTENSION_DOT));

        ValidatorsControl.appendValidator(controls['DOC_DEFAULT_VALUE_List.REF_FILE_ACCESS_LIST'],
            (control: AbstractControl): { [key: string]: any } => {
            const c = this.form.controls['DOC_DEFAULT_VALUE_List.SECURLEVEL_FILE'];
            if (c) {
                const v = c.value;
                if (v) {
                    if ((!control.value || control.value === '') && (v === '-1')) {
                        return { valueError: 'Итоговый список не должен быть пустым. Заполните его или измените значение "Доступ"'};
                    }
                }
            }
            return null;
        });

        const controlSrok1 = controls['DOC_DEFAULT_VALUE_List.TERM_EXEC'];
        const controlSrok2 = controls['DOC_DEFAULT_VALUE_List.TERM_EXEC_W'];
        const err = 'Реквизит "Срок исполнения" может быть заполнен только в одном месте';

        ValidatorsControl.appendValidator(controlSrok1,
            ValidatorsControl.onlyOneOfControl(controlSrok1, controlSrok2, err));
        ValidatorsControl.appendValidator(controlSrok2,
            ValidatorsControl.onlyOneOfControl(controlSrok1, controlSrok2, err));

    }


    private _checkCorrectValuesLogic(values: any): any {
        // Внутренние адресаты
        if (values[DEFAULTS_LIST_NAME]['SEND_ISN_LIST_DEP']) {
            if (!values[DEFAULTS_LIST_NAME]['SEND_MARKSEND']) {
                values[DEFAULTS_LIST_NAME]['SEND_DEP_PARM'] = null;
            } else if (!values[DEFAULTS_LIST_NAME]['SEND_DEP_PARM']) {
                values[DEFAULTS_LIST_NAME]['SEND_DEP_PARM'] = '1';
            }
        } else {
            values[DEFAULTS_LIST_NAME]['SEND_MARKSEND'] = null;
            values[DEFAULTS_LIST_NAME]['SEND_DEP_PARM'] = null;
        }
        // Картотека регистрации
        const v1 = values[DEFAULTS_LIST_NAME]['ISN_CARD_REG_CURR_W'];
        const v2 = values[DEFAULTS_LIST_NAME]['ISN_CARD_REG_FORWARD_W'];
        const v3 = values[DEFAULTS_LIST_NAME]['ISN_CARD_REG_W'];

        values[FICT_CONTROLS_LIST_NAME]['KR_CURRENT'] = null;
        values[FICT_CONTROLS_LIST_NAME]['KR_CURRENT_IF'] = null;
        values[FICT_CONTROLS_LIST_NAME]['ISN_CARD_REG_W_1'] = null;
        values[FICT_CONTROLS_LIST_NAME]['ISN_CARD_REG_W_2'] = null;

        if (v1 && !v2 && !v3) { // Текущая картотека регистратора
            values[FICT_CONTROLS_LIST_NAME]['KR_CURRENT'] = '0';
        } else if (!v1 && !v2 && v3) { // выбор
            values[FICT_CONTROLS_LIST_NAME]['KR_CURRENT'] = '1';
            values[FICT_CONTROLS_LIST_NAME]['ISN_CARD_REG_W_1'] = v3;
        } else if (v1 && v2 && !v3) { // Картотека первой пересылки РК Текущая картотека
            values[FICT_CONTROLS_LIST_NAME]['KR_CURRENT'] = '2';
            values[FICT_CONTROLS_LIST_NAME]['KR_CURRENT_IF'] = '0';
        } else if (!v1 && v2 && v3) { // Картотека первой пересылки РК выбор
            values[FICT_CONTROLS_LIST_NAME]['KR_CURRENT'] = '2';
            values[FICT_CONTROLS_LIST_NAME]['KR_CURRENT_IF'] = '1';
            values[FICT_CONTROLS_LIST_NAME]['ISN_CARD_REG_W_2'] = v3;
        } else if (!v1 && !v2 && ! v3) { // Отсутствуют данные
            values[FICT_CONTROLS_LIST_NAME]['KR_CURRENT'] = '0';
            values[DEFAULTS_LIST_NAME]['ISN_CARD_REG_CURR_W'] = '1';
        }

        if (this.isEDoc) {
            // Номер экземпляра Должен быть НЕ задан (поле не может быть заполненным)
            values[DEFAULTS_LIST_NAME]['SPECIMEN'] = null;
            // Передача документов Не может быть задан. Контролы параметра недоступны и очищены от значений.
            values[DEFAULTS_LIST_NAME]['JOURNAL_ISN_LIST'] = null;
            values[DEFAULTS_LIST_NAME]['JOURNAL_PARM'] = null;

            // при записи
            values[DEFAULTS_LIST_NAME]['JOURNAL_PARM_W'] = null;
            values[DEFAULTS_LIST_NAME]['JOURNAL_ISN_LIST_W'] = null;
            values[DEFAULTS_LIST_NAME]['JOURNAL_FROM_WHO_W'] = null;
            values[DEFAULTS_LIST_NAME]['JOURNAL_WHO_EMPTY_W'] = null;
            values[DEFAULTS_LIST_NAME]['JOURNAL_WHO_REDIRECTION_W'] = null;
            values[DEFAULTS_LIST_NAME]['JOURNAL_WHERE_REDIRECTION_W'] = null;
            values[DEFAULTS_LIST_NAME]['JOURNAL_FROM_FORWARD_W'] = null;
            values[DEFAULTS_LIST_NAME]['JOURNAL_PARM_W'] = null;

            // Внутренние адресаты [1, 3]
            if (values[DEFAULTS_LIST_NAME]['SEND_DEP_PARM']) {
                if (values[DEFAULTS_LIST_NAME]['SEND_DEP_PARM'] !== '1' && values[DEFAULTS_LIST_NAME]['SEND_DEP_PARM'] !== '3') {
                    values[DEFAULTS_LIST_NAME]['SEND_DEP_PARM'] = '1';
                }
            }
        } else {
            // Номер экземпляра Должен быть задан (поле не может быть пустым)
            const v = this.values[DEFAULTS_LIST_NAME]['SPECIMEN'];
            if (!v) {
                this.values[DEFAULTS_LIST_NAME]['SPECIMEN'] = '1';
            }
            // Внутренние адресаты [0, 1, 2]
            if (values[DEFAULTS_LIST_NAME]['SEND_DEP_PARM']) {
                if (values[DEFAULTS_LIST_NAME]['SEND_DEP_PARM'] !== '0' &&
                    values[DEFAULTS_LIST_NAME]['SEND_DEP_PARM'] !== '1' &&
                    values[DEFAULTS_LIST_NAME]['SEND_DEP_PARM'] !== '2') {
                    values[DEFAULTS_LIST_NAME]['SEND_DEP_PARM'] = '1';
                }
            }
        }
    }


    private _makeDefaults(descr: TDefaultField[]): any {
        const res = { };
        for (let i = 0; i < descr.length; i++) {
            const el = descr[i];
            if (el.default !== undefined) {
                res[el.key] = el.default;
            }
        }
        return res;
    }

    private _updateOptions(values: any[]) {
        const v = values['DOC_DEFAULT_VALUE_List.SECURLEVEL_FILE'];
        v.options.push (
            {
                value: '-1', title: 'Список ДЛ'
            }, {
                value: '-2', title: 'Фигуранты РК'
            }
        );

    }

    private _appendDBFilesValues (values: any[], data: any): void {
        for (let i = 0; i < data.length; i++) {
            const el = data[i];
            values[el['CATEGORY'] + '.' + 'EXTENSIONS'] = el['EXTENSIONS'];
            values[el['CATEGORY'] + '.' + 'MAX_SIZE'] = el['MAX_SIZE'];
            values[el['CATEGORY'] + '.' + 'ONE_FILE'] = el['ONE_FILE'];
        }
    }

    private _appendDBDefValues (values: any[], data: any): void {
        for (let i = 0; i < data.length; i++) {
            const el = data[i];
            values[el['DEFAULT_ID']] = el['VALUE'];
        }
    }

    private _getInputs(): any {
        const i: any = {};
        for (const key in this.descriptions) {
            if (this.descriptions.hasOwnProperty(key)) {
                const r = this.descriptions[key];
                i[key] = {};
                r.forEach(element => {
                    if (!element.foreignKey) {
                        element.foreignKey = element.key;
                    }
                    if (element.type === E_FIELD_TYPE.boolean) {
                        if (this.values[key][element.key] === '0') {
                            this.values[key][element.key] = null;
                        }
                    } else if (this.values[key]) {
                        if (this.values[key][element.key] === 'null') {
                            this.values[key][element.key] = null;
                        }
                    }
                    const t = i[key];
                    t[element.key] = element;
                });
            }

        }
        return this._dataSrv.getInputs(i, this.values);
    }

    private _subscribeToChanges() {
        this.subscriptions.push(this.form.valueChanges.subscribe((newVal) => {
            let changed = false;
            Object.keys(newVal).forEach((path) => {
                if (this._changeByPath(path, newVal[path])) {
                    changed = true;
                }
            });
            this.formChanged.emit(changed);
        }));
    }

    private _makePrevValues(values: any): any {
        const res = {};
        for (const k1 in values) {
            if (values.hasOwnProperty(k1)) {
                const e1 = values[k1];
                for (const k2 in e1) {
                    if (e1.hasOwnProperty(k2)) {
                        const e2 = e1[k2];
                        res[k1 + '.' + k2] = e2;
                    }
                }
            }
        }
        return res;
    }

    private _getPrevValue (path: string): any {
        return this.editValues[path];
    }

    private _setPrevValue (path: string, value: any) {
        this.editValues[path] = value;
    }

    private _changeByPath(path: string, value: any): boolean {
        const type: E_FIELD_TYPE = this.inputs[path].controlType;
        value = this.form.controls[path].value; // ignore for support change-in-change
        value = this.dataController.fixDBValueByType(value, type);
        const prevValue = this.dataController.fixDBValueByType(this._getPrevValue(path), type);

        this.newData = EosUtils.setValueByPath(this.newData, path, value);

        if (value !== prevValue) {
            this.isChanged = true;
            this._setPrevValue(path, value);
            if (this.currentPage) { this.currentPage.onDataChanged(path, prevValue, value); }
            return true;
        }
        return false;
    }

    private _autoFocus() {
        setTimeout(() => BaseCardEditComponent.autoFocusOnFirstStringElement('eos-adv-card-rk'),
            100);
    }

}
