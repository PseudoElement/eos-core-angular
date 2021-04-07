import { Component, Output, EventEmitter, OnDestroy, OnInit, OnChanges, ViewChild, NgZone, Injector } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { AdvCardRKDataCtrl, DEFAULTS_LIST_NAME, FILE_CONSTRAINT_LIST_NAME, FICT_CONTROLS_LIST_NAME, IUpdateDictEvent } from './adv-card-rk-datactrl';
import { EosDataConvertService } from 'eos-dictionaries/services/eos-data-convert.service';
import { FormGroup, AbstractControl } from '@angular/forms';
import { InputControlService } from 'eos-common/services/input-control.service';
import { TDefaultField, STRICT_OPTIONS, NOT_STRICT_OPTIONS } from './rk-default-values/rk-default-const';
import { EosUtils } from 'eos-common/core/utils';
import { Subscription } from 'rxjs';
import { RKBasePage } from './rk-default-values/rk-base-page';
import { E_FIELD_TYPE } from 'eos-dictionaries/interfaces';
import { ValidatorsControl, VALIDATOR_TYPE } from 'eos-dictionaries/validators/validators-control';
import { ConfirmWindowService } from 'eos-common/confirm-window/confirm-window.service';
import { /* RK_SELECTED_VALUE_INCORRECT_EMPTY_LIST ,*/ RK_SELECTED_VALUE_INCORRECT, RK_SELECTED_VALUE_INCORRECT_ONLY_DELETED, RK_ERROR_SAVE_SECUR } from 'app/consts/confirms.const';
import { IConfirmWindow2 } from 'eos-common/confirm-window/confirm-window2.component';
import { BaseCardEditComponent } from '../card-views/base-card-edit.component';
import { WaitClassifService } from 'app/services/waitClassif.service';
import { Features } from 'eos-dictionaries/features/features-current.const';
import { EOSDICTS_VARIANT } from 'eos-dictionaries/features/features.interface';
import { AppContext } from 'eos-rest/services/appContext.service';
import { PipRX, USER_LISTS } from 'eos-rest';

const NODE_LABEL_NAME = 'CLASSIF_NAME';
class Ttab {
    tag: number;
    title: string;
}

const tabs: Ttab[] = [
    { tag: 0, title: 'По умолчанию' },
    { tag: 1, title: 'Обязательные' },
    { tag: 2, title: 'При записи' },
    { tag: 3, title: 'Файлы' },
];

// declare function openPopup(url: string, callback?: Function): boolean;

@Component({
    selector: 'eos-adv-card-rk',
    templateUrl: 'adv-card-rk.component.html',
})

export class AdvCardRKEditComponent implements OnDestroy, OnInit, OnChanges {
    @Output() onChoose: EventEmitter<any> = new EventEmitter<any>();
    @Output() formChanged: EventEmitter<any> = new EventEmitter<any>();

    isUpdating = true;
    nodes: any[];
    tabs: Ttab[];
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
        private _waitClassifSrv: WaitClassifService,
        private _appContext: AppContext,
        private _pipRX: PipRX,
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

    updateLinks2(event: IUpdateDictEvent) {
        const el = event.el;
        if (el.key === 'JOURNAL_ISN_NOMENC' ||
            el.key === 'JOURNAL_ISN_NOMENC_W'
        ) {
            const rec = event.data[0];
            if (rec['DUE'] === '0.') {
                event.options[0].title = '...';
            } else {
                event.options[0].title = rec['NOM_NUMBER'] + ' (' + rec['YEAR_NUMBER'] + ') ' + rec['CLASSIF_NAME'];
            }
            event.options[0].rec = rec;
        }
    }
    checkUpdateSecurlable(): boolean {
        let securelevel;
        let securelevelFile;
        if (!(+this.form.controls['DOC_DEFAULT_VALUE_List.SECURLEVEL'].value) || !(+this.form.controls['DOC_DEFAULT_VALUE_List.SECURLEVEL_FILE'].value)) {
            return false;
        }
        this.inputs['DOC_DEFAULT_VALUE_List.SECURLEVEL'].options.forEach(elem => {
            if (+elem.value === +this.form.controls['DOC_DEFAULT_VALUE_List.SECURLEVEL'].value) {
                securelevel = elem.confidentional;
            }
        });
        this.inputs['DOC_DEFAULT_VALUE_List.SECURLEVEL_FILE'].options.forEach(elem => {
            if (+elem.value === +this.form.controls['DOC_DEFAULT_VALUE_List.SECURLEVEL_FILE'].value) {
                securelevelFile = elem.confidentional;
            }
        });
        // если securelevelFile имеет confidentional === 1 и если securelevelFile не имеет confidentional === 1 тогда вернуть true
        if (securelevelFile === 1 && !securelevel) {
            return true;
        }
        return false;
    }
    save(): void {
        // перед подготовкой к сохранению проверить можно ли сохранять
        if (this._appContext.cbBase && this.checkUpdateSecurlable()) {
            RK_ERROR_SAVE_SECUR.body = 'Гриф РК и гриф файлов по умолчанию не соответствуют друг другу.';
            this._confirmSrv.confirm2(RK_ERROR_SAVE_SECUR);
            return ;
        }
        if (!this._node['ACCESS_MODE'] && !this.checkDspGrif(+this.form.controls['DOC_DEFAULT_VALUE_List.SECURLEVEL'].value)) {
            RK_ERROR_SAVE_SECUR.body = `Запись информации невозможна, поскольку значение реквизита РК <Доступ>,
             не соответствует значению флага <РК перс. доступа>.
             Либо взведите флаг, либо cмените значение реквизита <Доступ>.
             `;
            this._confirmSrv.confirm2(RK_ERROR_SAVE_SECUR);
            return ;
        }

        this.preSaveCheck(this.newData).then(isCancel => {
            if (!isCancel) {
                console.log('hi');
                this.dataController.save(this.isn_node, this.inputs, this.newData).then(() => {
                    this.bsModalRef.hide();
                }).catch(() => {

                });
            }
        });
    }

    public userListsEdit() {
        // this.dataController.zone.run(() => {
        //     this.rereadUserLists();
        // });
        this._waitClassifSrv.openClassif({
            classif:
                (Features.cfg.variant === EOSDICTS_VARIANT.Nadzor ? 'TECH_LISTS' : 'COMMON_LIST')
        })
            .then(() => {
                // console.log('result: ', result);
                this.dataController.zone.run(() => {
                    // console.log('zone');
                    this.rereadUserLists();
                });
            })
            .catch(() => {
                // console.log('window closed');
                this.dataController.zone.run(() => {
                    this.rereadUserLists();
                });
            });
    }


    rereadUserLists() {
        this.dataController.markCacheForDirty('USER_LISTS');
        this.dataController.updateDictsOptions(this.dataController.getDescriptionsRK(), 'USER_LISTS', null, () => {
        }).then(() => {
            for (const key in this.inputs) {
                if (this.inputs.hasOwnProperty(key)) {
                    const input = this.inputs[key];
                    const field: TDefaultField = input.descriptor;
                    if (field && field.dict && field.dict.dictId === 'USER_LISTS') {
                        const control = this.form.controls[key];
                        if (control) {
                            const val = control.value;
                            if (val) {
                                const opt = field.options.find(o => Number(o.value) === Number(val));
                                if (!opt) {
                                    // control.setValue(null);
                                }
                            }
                        }
                    }
                }
            }
            this._updateInputs(this.inputs);
            this._updateOptions(this.inputs);
            this.form.updateValueAndValidity();
        });

    }

    preSaveCheck(newdata: any): Promise<any> {
        this.dataController.markCacheForDirty('USER_LISTS');
        return this.dataController.updateDictsOptions(this.dataController.getDescriptionsRK(), 'USER_LISTS', null, () => {
            // console.log(event);
            this._updateInputs(this.inputs);
            this._updateOptions(this.inputs);
        }).then(() => {
            this.form.updateValueAndValidity();
            // проверить списки на предмет наличия логически удаленных записей.
            const fields_ = this.descriptions[DEFAULTS_LIST_NAME];
            // Выводить ошибки в заданном порядке.
            const sortable = fields_.sort((a, b) => a.order > b.order ? 1 : a.order < b.order ? -1 :
                (a.order === undefined ? 1 :
                    (b.order === undefined ? -1 : 0)));

            const listLD = [];
            const listHasDeleted = [];
            const listIsEmpty = [];
            const listBeenDeleted = [];
            for (let i = 0; i < sortable.length; i++) {
                const el: TDefaultField = sortable[i];
                if (!el.dict) { continue; }
                // if (el.dict.dictId !== 'USER_LISTS') { continue; }

                const val = newdata[DEFAULTS_LIST_NAME][el.key];

                if (el.key === 'SECURLEVEL_FILE' && Number(val) < 0) {
                    continue;
                }

                if (val) {
                    const opt = el.options.find(o => Number(o.value) === Number(val));
                    if (opt && opt.isEmpty && el.key !== 'REF_FILE_ACCESS_LIST') {
                        listIsEmpty.push(el);
                        // confirmationsChain = this._presaveConfirmAppend(confirmationsChain, el, RK_SELECTED_LIST_IS_EMPTY);
                    }
                    if (opt && opt.hasDeleted) {
                        listHasDeleted.push(el);
                        // confirmationsChain = this._presaveConfirmAppend(confirmationsChain, el, RK_SELECTED_LIST_CONTAIN_DELETED);
                    }
                    if (opt && opt.disabled) {
                        listLD.push(el);
                        // confPromise = this._presaveConfirmAppend(confPromise, el, RK_SELECTED_VALUE_LOGIC_DELETED);
                    }
                    if (!opt) {
                        // Bug 105284: Из поля, где использовался удаленный список, просто надо удалить, молча
                        const control = this.form.controls[DEFAULTS_LIST_NAME + '.' + el.key];
                        if (control) {
                            control.setValue(null);
                        }
                        listBeenDeleted.push(el);
                        // confPromise = this._presaveConfirmAppend(confPromise, el, RK_SELECTED_LIST_BEEN_DELETED);
                    }
                }
            }

            const listLDText = this._elListToText(listLD);
            const listHasDeletedText = this._elListToText(listHasDeleted);
            const listIsEmptyText = this._elListToText(listIsEmpty);
            const listBeenDeletedText = this._elListToText(listBeenDeleted);
            let confirmationsChain = Promise.resolve(false);
            let confirmLD: IConfirmWindow2 = Object.assign({}, RK_SELECTED_VALUE_INCORRECT);
            if (listLDText || listHasDeletedText || listIsEmptyText || listBeenDeletedText) {
                confirmLD.bodyList = [];
                if (listLDText) {
                    confirmLD.bodyList.push('В настройках реквизитов используются логически удаленные элементы справочников: ' + listLDText);
                }
                if (listBeenDeletedText) {
                    confirmLD.bodyList.push('Выбран список, который был удален. Значение очищено. Реквизиты: ' + listBeenDeletedText);
                }
                if (listIsEmptyText) {
                    confirmLD.bodyList.push('В следующих реквизитах выбран пустой список: ' + listIsEmptyText);
                   // confirmLD = Object.assign({}, RK_SELECTED_VALUE_INCORRECT_EMPTY_LIST);
                }
                if (listHasDeletedText) {
                    // confirmLD.bodyList.push(`В выбранном списке ДЛ есть удаленные элементы справочника.
                    // Они не войдут в список ДЛ прикрепляемого файла. `);
                    confirmLD.bodyList.push('Выбран список, в котором некоторые элементы логически удалены. Реквизиты: ' + listHasDeletedText);
                }
            } else {
                confirmLD = null;
            }
            confirmationsChain = this._checkListWithDeletedForRefFileAccess().then((res) => {
                if (res) {
                    return res;
                } else {
                    if (confirmLD) {
                        return this._confirmSrv.confirm2(confirmLD).then((button) => {
                            return (!button || button.result === 2);
                        });
                    }
                    return Promise.resolve(false);

                }
            });
            return confirmationsChain;
        });
    }

    _elListToText(list: any[]): string {
        return EosDataConvertService.listToCommaList(list.map((el) => (el.longTitle || el.title)));
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

    public clickTab(item: Ttab) {
        this.activeTab = item;
        BaseCardEditComponent.autoFocusOnFirstStringElement('eos-adv-card-rk');
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

        this.dataController = new AdvCardRKDataCtrl(this.injector/*, this._zone, this._pipRX, this._msgSrv, this._dictSrv*/);
        this.descriptions = this.dataController.getDescriptionsRK();

        this.dataController.readDGValues(this.isn_node).then(values => {
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
            this._checkCorrectValuesLogic(this.values /*, this.descriptions*/);
            this.editValues = this._makePrevValues(this.values);
            this.dataController.updateDictsOptions(this.dataController.getDescriptionsRK(), null, this.values, this.updateLinks2).then(() => {
                this.inputs = this._getInputs();
                this._updateInputs(this.inputs);
                const isNode = false;
                this.form = this._inputCtrlSrv.toFormGroup(this.inputs, isNode);
                this._updateOptions(this.inputs);
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
                BaseCardEditComponent.autoFocusOnFirstStringElement('eos-adv-card-rk');
            });
        });

    }
    private checkDspGrif(value: number): boolean {
        const options = this.inputs['DOC_DEFAULT_VALUE_List.SECURLEVEL'].options;
        if (options.length) {
            const findVal = options.filter(o =>  +o.value === +value);
            if (findVal[0]) {
                if (findVal[0].hasOwnProperty('confidentional')) {
                    return false;
                }
                return true;
            }
        }
        return true;
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

        for (const key in inputs) {
            if (inputs.hasOwnProperty(key)) {
                const input = inputs[key];
                if (input.descriptor && input.descriptor.options && input.descriptor.type === E_FIELD_TYPE.select) {
                    const val = input.value;
                    const i_opt = Object.assign(input.descriptor.options);
                    input.options = i_opt.filter((o) => (!o.disabled || String(o.value) === String(val)));
                }
            }
        }
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
                const c = this.form.controls['DOC_DEFAULT_VALUE_List.ACCESS_MODE_FILE'];
                if (c) {
                    const v = c.value;
                    if (v) {
                        if ((!control.value || control.value === '') && (v === '3' || v === '5')) {
                            return { valueError: 'Итоговый список не должен быть пустым. Заполните его или измените значение "Доступ"' };
                        }
                    }
                }
                return null;
            });
            ValidatorsControl.appendValidator(controls['DOC_DEFAULT_VALUE_List.ACCESS_MODE_FILE'],
            (control: AbstractControl): { [key: string]: any } => {
                const c = this.form.controls['DOC_DEFAULT_VALUE_List.SECURLEVEL_FILE'].value;
                if ((!control.value || control.value === '') && (c && c !== '')) {
                            return { valueError: 'Поле доступ не должно быть пустым.' };
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
        } else if (!v1 && !v2 && !v3) { // Отсутствуют данные
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
        const res = {};
        for (let i = 0; i < descr.length; i++) {
            const el = descr[i];
            if (el.default !== undefined) {
                res[el.key] = el.default;
            }
        }
        return res;
    }

    private _updateOptions(values: any[]) {
        const grif = this.form.controls['DOC_DEFAULT_VALUE_List.SECURLEVEL_FILE'];
        this.updateAccessInput(grif.value);
    }
    private updateAccessInput(value) {
        const optionsWithDsp: Array<any> = this.inputs['DOC_DEFAULT_VALUE_List.SECURLEVEL_FILE'].options;
        const findDsp = optionsWithDsp.filter(o => +o.value === +value);
        const v = this.inputs['DOC_DEFAULT_VALUE_List.ACCESS_MODE_FILE'].options;
        if (findDsp.length) {
            if (findDsp[0].confidentional) {
                v.length = 0;
                v.push(...STRICT_OPTIONS);
            } else {
                v.length = 0;
                v.push(...NOT_STRICT_OPTIONS);
            }
        }

    }

    private _appendDBFilesValues(values: any[], data: any): void {
        for (let i = 0; i < data.length; i++) {
            const el = data[i];
            values[el['CATEGORY'] + '.' + 'EXTENSIONS'] = el['EXTENSIONS'];
            values[el['CATEGORY'] + '.' + 'MAX_SIZE'] = el['MAX_SIZE'];
            values[el['CATEGORY'] + '.' + 'ONE_FILE'] = el['ONE_FILE'];
        }
    }

    private _appendDBDefValues(values: any[], data: any): void {
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

    private _getPrevValue(path: string): any {
        return this.editValues[path];
    }

    private _setPrevValue(path: string, value: any) {
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

    /**
     * @method _checkListWithDeleted проверяет список с удаленными элементами,
     * есть ли там элементы, кроме удаленных,
     * если нету, то запрещаем сохранение
     */
    private _checkListWithDeletedForRefFileAccess(): Promise<boolean> {
        // check ref file access
        const fields_ = this.descriptions[DEFAULTS_LIST_NAME].filter(el => {
            return el.key === 'REF_FILE_ACCESS_LIST';
        });
        const listIsEmpty = [];
        for (let i = 0; i < fields_.length; i++) {
            const el: TDefaultField = fields_[i];
            if (!el.dict) { continue; }
            const val = this.newData[DEFAULTS_LIST_NAME][el.key];
            if (val) {
                const opt = el.options.find(o => Number(o.value) === Number(val));
                if (opt && opt.isEmpty) {
                    listIsEmpty.push(el);
                }
            }
        }
        const access = this.newData.DOC_DEFAULT_VALUE_List.ACCESS_MODE_FILE;
        if (listIsEmpty.length) {
            const warnMessage = Object.assign({}, RK_SELECTED_VALUE_INCORRECT_ONLY_DELETED);
            if (listIsEmpty && access === '3' || access === '5') {
                return this._confirmSrv.confirm2(warnMessage)
                    .then(() => true);
            } else {
                return Promise.resolve(false);
            }
        }
        const listIsn = this.newData &&
            this.newData.DOC_DEFAULT_VALUE_List &&
            this.newData.DOC_DEFAULT_VALUE_List.REF_FILE_ACCESS_LIST;
        if (listIsn && Number(listIsn)) {
            return this._pipRX.read({
                USER_LISTS: Number(listIsn),
                expand: 'LIST_ITEMS_List'
            })
                .then((lists: USER_LISTS[]) => {
                    if (lists && lists.length) {
                        const [list] = lists;
                        const items = list.LIST_ITEMS_List;

                        if (items && items.length) {
                            const refIsnArr = items && items.map((item) => item.REF_ISN);
                            const refIsnString = refIsnArr.join('|');
                            return this._pipRX.read({
                                'DEPARTMENT': PipRX.criteries({ ISN_NODE: refIsnString })
                            }).then((nodes) => {
                                if (nodes && nodes.length) {
                                    const warnMessage = Object.assign({}, RK_SELECTED_VALUE_INCORRECT_ONLY_DELETED);
                                    const allDeleted = nodes.every((node: any) => node.DELETED === 1);
                                    if (allDeleted && access === '3' || allDeleted && access === '5') {
                                        return this._confirmSrv.confirm2(warnMessage).then(() => true);
                                    }
                                    return false;
                                }
                                return false;
                            });
                        } else {
                            const warnMessage = Object.assign({}, RK_SELECTED_VALUE_INCORRECT_ONLY_DELETED);
                            return this._confirmSrv.confirm2(warnMessage).then(() => true);
                        }
                    }
                });
                /* .then((nodes: any) => {
                    console.log(nodes);
                    if (nodes && nodes.length) {
                        const warnMessage = Object.assign({}, RK_SELECTED_VALUE_INCORRECT_ONLY_DELETED);
                        console.log(warnMessage);
                        const allDeleted = nodes.every((node) => node.DELETED === 1);
                        if (allDeleted && access === '3' || access === '5') {
                            return this._confirmSrv.confirm2(warnMessage)
                                .then(() => true);
                        }   else {
                            return false;
                        }
                    }
                    return false;
                }); */
        }
        return Promise.resolve(false);
    }
}
