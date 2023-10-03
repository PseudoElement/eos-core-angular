import { Component, Input, NgZone, OnDestroy } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { InputControlService } from '../../eos-common/services/input-control.service';
import { DG_FILE_CONSTRAINT, DOCGROUP_CL, PipRX, PRJ_DEFAULT_VALUE } from '../../eos-rest';
import { SUCCESS_SAVE } from '../consts/messages.consts';
import { EosMessageService } from '../../eos-common/services/eos-message.service';
import { StringInput } from '../../eos-common/core/inputs/string-input';
import { E_FIELD_TYPE } from '../interfaces';
import { CheckboxInput } from '../../eos-common/core/inputs/checkbox-input';
import { DropdownInput } from '../../eos-common/core/inputs/select-input';
import { TextInput } from '../../eos-common/core/inputs/text-input';
import { NumberIncrementInput } from '../../eos-common/core/inputs/number-increment-input';
import { _ES } from '../../eos-rest/core/consts';
import { BsModalRef } from 'ngx-bootstrap';
import { VALIDATOR_TYPE, ValidatorsControl } from '../validators/validators-control';
import { Subscription } from 'rxjs';
import { IDynamicInputOptions } from '../../eos-common/dynamic-form-input/dynamic-input.component';
import { BaseCardEditDirective } from '../card-views/base-card-edit.component';
import { RK_SELECTED_VALUE_INCORRECT, RK_SELECTED_VALUE_INCORRECT_EMPTY_LIST, RK_ERROR_SAVE_SECUR } from '../../app/consts/confirms.const';
import { IConfirmWindow2 } from '../../eos-common/confirm-window/confirm-window2.component';
import { ConfirmWindowService } from '../../eos-common/confirm-window/confirm-window.service';
import { WaitClassifService } from '../../app/services/waitClassif.service';
import { ButtonsInput } from '../../eos-common/core/inputs/buttons-input';
import { RKDefaultValuesCardComponent } from '../../eos-dictionaries/adv-card/rk-default-values/rk-default-values.component';
import { EosDataConvertService } from '../../eos-dictionaries/services/eos-data-convert.service';
import { PRJ_DEFAULTS_LIST_NAME } from '../../eos-dictionaries/adv-card/adv-card-rk-datactrl';
import { Features } from '../../eos-dictionaries/features/features-current.const';
import { STRICT_OPTIONS, NOT_STRICT_OPTIONS_PRG } from '../../eos-dictionaries/adv-card/rk-default-values/rk-default-const';
import { AppContext } from '../../eos-rest/services/appContext.service';
import { DIGIT3_PATTERN } from '../../eos-common/consts/common.consts';

// const PRJ_DEFAULT_NAME = 'PRJ_DEFAULT_VALUE_List';
const FILE_CONSTRAINT_NAME = 'DG_FILE_CONSTRAINT_List';
const PRJ_KEY_SHABLON = '{{tableName}}.{{id}}';
const FILE_FIELDS = ['EXTENSIONS', 'MAX_SIZE', 'ONE_FILE'];
const REG_MAX_SIZE: RegExp = /^\d{0,8}$/;

const FeaturesRK = Features.cfg.rkdefaults;

export const RKPDdictionaries = [
    {
        name: 'security',
        req: { SECURITY_CL: {}, orderby: 'WEIGHT' },
        titleFieldName: 'GRIF_NAME',
        isnFieldName: 'SECURLEVEL',
    },
    {
        name: 'user_list_104',
        req: { USER_LISTS: PipRX.criteries({ ISN_LCLASSIF: '-99', CLASSIF_ID: '104' }), orderby: 'WEIGHT' },
        titleFieldName: 'NAME',
        isnFieldName: 'ISN_LIST',
        isUserList: true,
        isEmpty: false,
    }, {
        name: 'user_list_630',
        req: { USER_LISTS: PipRX.criteries({ ISN_LCLASSIF: '-99', CLASSIF_ID: '630' }), orderby: 'WEIGHT' },
        titleFieldName: 'NAME',
        isnFieldName: 'ISN_LIST',
        isUserList: true,
        isEmpty: false,
    }, {
        name: 'doc_templates',
        req: {DOC_TEMPLATES: PipRX.criteries({CATEGORY: 'ФАЙЛЫ ДОКУМЕНТОВ|Основной файл документа'}), orderby: 'WEIGHT'},
        titleFieldName: 'DESCRIPTION',
        isnFieldName: 'ISN_TEMPLATE',
    }, {
        name: 'user_list_107',
        req: { USER_LISTS: PipRX.criteries({ ISN_LCLASSIF: '-99', CLASSIF_ID: '107' }), orderby: 'WEIGHT' },
        titleFieldName: 'NAME',
        isnFieldName: 'REF_ISN_LIST',
        isUserList: true,
        isEmpty: false,
    },

];

export const RKPDDefaultFields: any[] = [
    {
        DEFAULT_ID: 'ANNOTAT',
        DEFAULT_TYPE: E_FIELD_TYPE.text,
        DESCRIPTION: 'Содержание',
        LENGTH: 2000,
        order: 100,
    }, {
        DEFAULT_ID: 'ANNOTAT_M',
        DEFAULT_TYPE: E_FIELD_TYPE.boolean,
        DESCRIPTION: 'Содержание',
        LENGTH: 2000,
    }, {
        DEFAULT_ID: 'CONSISTS_M',
        DEFAULT_TYPE: E_FIELD_TYPE.boolean,
        DESCRIPTION: 'Состав',
        LENGTH: 255,
    }, {
        DEFAULT_ID: 'DOC_DATE_M',
        DEFAULT_TYPE: E_FIELD_TYPE.boolean,
        DESCRIPTION: 'Дата регистрации',
        READONLY: true,
        DEFAULT_VALUE: true,
    }, {
        DEFAULT_ID: 'FREE_NUM_M',
        DEFAULT_TYPE: E_FIELD_TYPE.boolean,
        DESCRIPTION: 'Рег.№',
        READONLY: true,
        DEFAULT_VALUE: true,
    }, {
        DEFAULT_ID: 'ISN_PERSON_EXE_M',
        DEFAULT_TYPE: E_FIELD_TYPE.boolean,
        DESCRIPTION: 'Исполнитель',
        READONLY: true,
        DEFAULT_VALUE: true,
    }, {
        DEFAULT_ID: 'PRUB_M',
        DEFAULT_TYPE: E_FIELD_TYPE.boolean,
        DESCRIPTION: 'Рубрики',
    }, {
        DEFAULT_ID: 'PSND_M',
        DEFAULT_TYPE: E_FIELD_TYPE.boolean,
        DESCRIPTION: 'Адресаты',
    }, {
        DEFAULT_ID: 'SECURLEVEL',
        DEFAULT_TYPE: E_FIELD_TYPE.select,
        DESCRIPTION: 'Доступ',
        // DEFAULT_VALUE: 1,
        CLASSIF_ID: 'security',
        order: 30,
    }, {
        DEFAULT_ID: 'SECURLEVEL_FILE',
        DEFAULT_TYPE: E_FIELD_TYPE.select,
        DESCRIPTION: 'Грифы',
        CLASSIF_ID: 'security',
        order: 50,
    }, {
        DEFAULT_ID: 'ACCESS_MODE_FILE',
        DEFAULT_TYPE: E_FIELD_TYPE.select,
        DESCRIPTION: 'Доступ',
    },
    {
        DEFAULT_ID: 'REF_FILE_ACCESS_LIST',
        DEFAULT_TYPE: E_FIELD_TYPE.select,
        DESCRIPTION: '',
        CLASSIF_ID: 'user_list_104',
    },
    {
        DEFAULT_ID: 'SECURLEVEL_M',
        DEFAULT_TYPE: E_FIELD_TYPE.boolean,
        DESCRIPTION: 'Доступ',
        READONLY: true,
    }, {
        DEFAULT_ID: 'SEND_DEP_PARM',
        DEFAULT_TYPE: 'D',
        DESCRIPTION: 'Параметр копирования оригинал/копия',
    }, {
        DEFAULT_ID: 'SEND_ISN_LIST_DEP',
        DEFAULT_TYPE: E_FIELD_TYPE.select,
        DESCRIPTION: 'Внутренние',
        FULL_DESCRIPTION: 'Внутренние адресаты',
        CLASSIF_ID: 'user_list_104',
        order: 160,
    }, {
        DEFAULT_ID: 'SEND_ISN_LIST_ORGANIZ',
        DEFAULT_TYPE: E_FIELD_TYPE.select,
        DESCRIPTION: 'Внешние',
        FULL_DESCRIPTION: 'Внешние адресаты',
        CLASSIF_ID: 'user_list_630',
        order: 170,
    }, {
        DEFAULT_ID: 'SIGN_ISN_LIST',
        DEFAULT_TYPE: E_FIELD_TYPE.select,
        DESCRIPTION: 'Внутренние',
        FULL_DESCRIPTION: 'Внутренние подписи',
        CLASSIF_ID: 'user_list_104',
        order: 130,
    }, {
        DEFAULT_ID: 'SIGN_ISN_LIST_M',
        DEFAULT_TYPE: E_FIELD_TYPE.boolean,
        DESCRIPTION: 'Подписи',
    }, {
        DEFAULT_ID: 'TERM_EXEC',
        DEFAULT_TYPE: E_FIELD_TYPE.numberIncrement,
        DESCRIPTION: 'Срок исп. (План. дата), от даты регистрации',
        order: 20,
        PATTERN: DIGIT3_PATTERN,
        minValue: 1,
        maxValue: 999
    }, {
        DEFAULT_ID: 'TERM_EXEC_M',
        DEFAULT_TYPE: E_FIELD_TYPE.boolean,
        DESCRIPTION: 'Срок исп. (План. дата)',
    }, {
        DEFAULT_ID: 'VISA_ISN_LIST',
        DEFAULT_TYPE: E_FIELD_TYPE.select,
        DESCRIPTION: 'Внутренние',
        FULL_DESCRIPTION: 'Внутренние визы',
        CLASSIF_ID: 'user_list_104',
        order: 110,
    }, {
        DEFAULT_ID: 'VISA_ISN_LIST_M',
        DEFAULT_TYPE: E_FIELD_TYPE.boolean,
        DESCRIPTION: 'Визы',
    }, {
        DEFAULT_ID: 'FILE',
        DEFAULT_TYPE: E_FIELD_TYPE.select,
        DESCRIPTION: 'Файлы',
        CLASSIF_ID: 'doc_templates',
        order: 150,
    }, {
        DEFAULT_ID: 'FILE_M',
        DEFAULT_TYPE: E_FIELD_TYPE.boolean,
        DESCRIPTION: 'Файлы',
    }, {
        DEFAULT_ID: 'SIGN_OUTER_ISN_LIST',
        DEFAULT_TYPE: E_FIELD_TYPE.select,
        DESCRIPTION: 'Внешние',
        FULL_DESCRIPTION: 'Внешние подписи',
        CLASSIF_ID: 'user_list_630',
        order: 140,
    }, {
        DEFAULT_ID: 'VISA_OUTER_ISN_LIST',
        DEFAULT_TYPE: E_FIELD_TYPE.select,
        DESCRIPTION: 'Внешние',
        FULL_DESCRIPTION: 'Внешние визы',
        CLASSIF_ID: 'user_list_630',
        order: 120,
    }, {
        DEFAULT_ID: 'PRJ_EXEC_LIST',
        DEFAULT_TYPE: E_FIELD_TYPE.select,
        DESCRIPTION: 'Доп. исполнители',
        CLASSIF_ID: 'user_list_104',
        order: 40,
    }, {
        DEFAULT_ID: 'CONSISTS',
        DEFAULT_TYPE: E_FIELD_TYPE.string,
        DESCRIPTION: 'Состав',
        LENGTH: 255,
        order: 10,
    }, {
        DEFAULT_ID: 'NOTE',
        DEFAULT_TYPE: E_FIELD_TYPE.text,
        DESCRIPTION: 'Примечание',
        LENGTH: 2000,
        order: 180,
    }, {
        DEFAULT_ID: 'RUBRIC_LIST',
        DEFAULT_TYPE: E_FIELD_TYPE.select,
        DESCRIPTION: 'Рубрики',
        CLASSIF_ID: 'user_list_107',
        order: 190,
    }, {
        DEFAULT_ID: 'TERM_EXEC_TYPE',
        DEFAULT_TYPE: FeaturesRK.calendarControl,
        DEFAULT_VALUE: FeaturesRK.calendarValuesDefault,
        options: FeaturesRK.calendarValues,
        DESCRIPTION: ' Срок исполнения РК в каких днях',
    }, {
        DEFAULT_ID: 'PRJ_RC.MAX_SIZE',
        DEFAULT_TYPE: E_FIELD_TYPE.number,
        DESCRIPTION: 'Max размер',
        CATEGORY: 'PRJ_RC',
        PATTERN: REG_MAX_SIZE,
        TABLE_NAME: 'DG_FILE_CONSTRAINT_List',
        order: 1000,
    }, {
        DEFAULT_ID: 'PRJ_RC.ONE_FILE',
        DEFAULT_TYPE: E_FIELD_TYPE.boolean,
        DESCRIPTION: 'Один файл',
        CATEGORY: 'PRJ_RC',
        TABLE_NAME: 'DG_FILE_CONSTRAINT_List',
        order: 1010,
    }, {
        DEFAULT_ID: 'PRJ_RC.EXTENSIONS',
        DEFAULT_TYPE: E_FIELD_TYPE.string,
        DESCRIPTION: 'С расширением',
        CATEGORY: 'PRJ_RC',
        TABLE_NAME: 'DG_FILE_CONSTRAINT_List',
        LENGTH: 255,
        order: 1020,
    }, {
        DEFAULT_ID: 'PRJ_VISA_SIGN.MAX_SIZE',
        DEFAULT_TYPE: E_FIELD_TYPE.number,
        DESCRIPTION: 'Max размер',
        CATEGORY: 'PRJ_VISA_SIGN',
        PATTERN: REG_MAX_SIZE,
        TABLE_NAME: 'DG_FILE_CONSTRAINT_List',
        order: 1030,
    }, {
        DEFAULT_ID: 'PRJ_VISA_SIGN.ONE_FILE',
        DEFAULT_TYPE: E_FIELD_TYPE.boolean,
        DESCRIPTION: 'Один файл',
        CATEGORY: 'PRJ_VISA_SIGN',
        TABLE_NAME: 'DG_FILE_CONSTRAINT_List',
        order: 1040,
    }, {
        DEFAULT_ID: 'PRJ_VISA_SIGN.EXTENSIONS',
        DEFAULT_TYPE: E_FIELD_TYPE.string,
        DESCRIPTION: 'С расширением',
        CATEGORY: 'PRJ_VISA_SIGN',
        TABLE_NAME: 'DG_FILE_CONSTRAINT_List',
        LENGTH: 255,
        order: 1050,
    }, {
        DEFAULT_ID: 'CAN_MANAGE_EXEC',
        DEFAULT_TYPE: E_FIELD_TYPE.boolean,
        DESCRIPTION: 'Управление Исполнителями',
        order: 50,
    }, {
        DEFAULT_ID: 'CAN_WORK_WITH_FILES',
        DEFAULT_TYPE: E_FIELD_TYPE.boolean,
        DESCRIPTION: 'Работа с файлами РКПД',
        order: 70,
    }, {
        DEFAULT_ID: 'CAN_WORK_WITH_PRJ',
        DEFAULT_TYPE: E_FIELD_TYPE.boolean,
        DESCRIPTION: 'Работа с РКПД',
        order: 60,
    }, {
        DEFAULT_ID: 'CAN_MANAGE_APPROVAL',
        DEFAULT_TYPE: E_FIELD_TYPE.boolean,
        DESCRIPTION: 'Организация согл-я и утв-я',
        order: 80,
    }, {
        DEFAULT_ID: 'ISN_NOMENKL_M',
        DEFAULT_TYPE: E_FIELD_TYPE.boolean,
        DESCRIPTION: 'Индекс дела по номенклатуре',
        READONLY: false,
        DEFAULT_VALUE: false,
    },];
class PrjDefaultItem {
    id: string;
    type: E_FIELD_TYPE;
    descr: string;
    fullDescr: string;
    dictId: string;
    readonly: boolean;
    defaultValue: any;
    tableName: string;
    category: string;
    pattern: RegExp;
    length?: number;
    order?: number;
    options?: any[];
    minValue?: number;
    maxValue?: number;

    constructor(rec) {
        if (rec) {
            this.id = rec.DEFAULT_ID;
            this.type = rec.DEFAULT_TYPE;
            this.descr = rec.DESCRIPTION;
            this.fullDescr = rec.FULL_DESCRIPTION;
            this.dictId = rec.CLASSIF_ID;
            this.readonly = rec.READONLY;
            this.defaultValue = rec.DEFAULT_VALUE ? rec.DEFAULT_VALUE : null;
            this.category = rec.CATEGORY ? rec.CATEGORY : null;
            this.pattern = rec.PATTERN ? rec.PATTERN : undefined;
            this.tableName = rec.TABLE_NAME ? rec.TABLE_NAME : 'PRJ_DEFAULT_VALUE_List';
            this.length = rec.LENGTH;
            this.order = rec.order;
            this.options = rec.options;
            this.minValue = rec.minValue ? rec.minValue : undefined;
            this.maxValue = rec.maxValue ? rec.maxValue : undefined;
        }
    }
}


class PrjDefaultFactory {
    options = new Map<string, any[]>();

    private readonly _items = Array<PrjDefaultItem>();

    constructor() {
        PrjDefaultFactory.getPrjDefaults().forEach((recs) => {
            this._items.push(new PrjDefaultItem(recs));
        });
    }

    get items(): PrjDefaultItem[] {
        return this._items;
    }

    public static getPrjDefaults(): any[] {
        return RKPDDefaultFields;
    }

    static get requiredItems() {
        return [
            'PRJ_DEFAULT_VALUE_List.FREE_NUM_M',
            'PRJ_DEFAULT_VALUE_List.DOC_DATE_M',
            'PRJ_DEFAULT_VALUE_List.ISN_PERSON_EXE_M',
            'PRJ_DEFAULT_VALUE_List.TERM_EXEC_M',
            'PRJ_DEFAULT_VALUE_List.SECURLEVEL_M',
            'PRJ_DEFAULT_VALUE_List.CONSISTS_M',
            'PRJ_DEFAULT_VALUE_List.ANNOTAT_M',
            'PRJ_DEFAULT_VALUE_List.VISA_ISN_LIST_M',
            'PRJ_DEFAULT_VALUE_List.SIGN_ISN_LIST_M',
            'PRJ_DEFAULT_VALUE_List.PSND_M',
            'PRJ_DEFAULT_VALUE_List.FILE_M',
            'PRJ_DEFAULT_VALUE_List.PRUB_M',
            'PRJ_DEFAULT_VALUE_List.ISN_NOMENKL_M',
        ];
    }

    static get dictionaries() {
        return RKPDdictionaries;
    }

    fillDictionariesLists(apiSrv: PipRX): Promise<any[]> {
        const reads = [];
        this.options = new Map<string, any[]>();
        PrjDefaultFactory.dictionaries.forEach((dict) => {
            const req = Object.assign({}, dict.req);
            reads.push(new Promise<any>((resolve) => apiSrv.read(req)
                .then(records => {
                    if (!this.options[dict.name]) {
                        this.options[dict.name] = [];
                    }
                    records.forEach((record) => {
                        this.options[dict.name].push({
                            title: record[dict.titleFieldName],
                            value: record[dict.isnFieldName],
                            disabled: record['DELETED'],
                            confidentional: record['CONFIDENTIONAL'],
                            style: { color: record['CONFIDENTIONAL'] ? 'red' : 'black' },
                            isEmpty: false,
                            hasDeleted: false,
                        });
                    });
                    if (dict.isUserList) {
                        this._appendListInfo(this.options[dict.name], apiSrv)
                            .then(() => {
                                return resolve(records);
                            });
                    } else {
                        return resolve(records);
                    }
                })));
        });
        return Promise.all(reads);
    }

    private _appendListInfo(options: [any], apiSrv: PipRX) {
        const listreqs = [];

        for (let i = 0; i < options.length; i++) {
            const el = options[i];

            const query = { args: { isn: el.value } };
            const req = { ValidateUserList4DefaultValues: query };
            listreqs.push(apiSrv.read(req).then((response) => {
                if (String(response) === 'LIST_IS_EMPTY') {
                    el.isEmpty = true;
                } else if (String(response) === 'LIST_CONTAINS_DELETED') {
                    el.hasDeleted = true;
                }
            }));
        }
        return Promise.all(listreqs);
    }
}

@Component({
    selector: 'eos-prj-default-values',
    templateUrl: 'prj-default-values.component.html',
})

export class PrjDefaultValuesComponent implements OnDestroy {
    @Input() form: FormGroup;

    selOpts: IDynamicInputOptions = {
        defaultValue: { value: '', title: '...'}
    };

    nodeDescription: string;
    isnNode: number;
    formInvalid: boolean;
    data: any;

    currTab = 0;
    inputs: any = {};
    newData = {};
    isUpdating = true;
    isPrjExecFull = false;
    prevValues = {};
    requiredItems = PrjDefaultFactory.requiredItems;

    prjDefaults = new PrjDefaultFactory();
    _currentFormStatus: any;
    dayTypeTitle: string;
    isFileAccessEnabled = false;
    isSecurLavelAccessEnabled = false;

    private $valueChanges: Subscription;
    private $statusChanges: Subscription;

    constructor(
        public bsModalRef: BsModalRef,
        private _msgSrv: EosMessageService,
        private _inputCtrlSrv: InputControlService,
        private _apiSrv: PipRX,
        private _zone: NgZone,
        private _waitClassifSrv: WaitClassifService,
        private _confirmSrv: ConfirmWindowService,
        private _appContext: AppContext,
        ) {
        this.dayTypeTitle = 'дней';
    }

    private static _getFieldKey(id, tableName) {
        return PRJ_KEY_SHABLON.replace('{{id}}', id).replace('{{tableName}}', tableName);
    }

    private static _updateValidators(controls: any): any {
        ValidatorsControl.appendValidator(controls['DG_FILE_CONSTRAINT_List.PRJ_RC.EXTENSIONS'],
            ValidatorsControl.existValidator(VALIDATOR_TYPE.EXTENSION_DOT));
        ValidatorsControl.appendValidator(controls['DG_FILE_CONSTRAINT_List.PRJ_VISA_SIGN.EXTENSIONS'],
            ValidatorsControl.existValidator(VALIDATOR_TYPE.EXTENSION_DOT));
        ValidatorsControl.appendValidator(controls['PRJ_DEFAULT_VALUE_List.REF_FILE_ACCESS_LIST'],
            (control: AbstractControl): { [key: string]: any } => {
                const c = controls['PRJ_DEFAULT_VALUE_List.ACCESS_MODE_FILE'];
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
            ValidatorsControl.appendValidator(controls['PRJ_DEFAULT_VALUE_List.ACCESS_MODE_FILE'],
            (control: AbstractControl): { [key: string]: any } => {
                const c = controls['PRJ_DEFAULT_VALUE_List.SECURLEVEL_FILE'].value;
                if ((!control.value || control.value === '') && (c && c !== '')) {
                            return { valueError: 'Поле доступ не должно быть пустым.' };
                        }
                return null;
            });
    }

    ngOnDestroy() {
        this.$statusChanges.unsubscribe();
        this.$valueChanges.unsubscribe();
    }

    get isDefaultTab() {
        return this.currTab === 0;
    }
    get isReqiredTab() {
        return this.currTab === 1;
    }
    get isFilesTab() {
        return this.currTab === 2;
    }
    public securColor(name: string) {
        if (this.form) {
            const val = this.form.controls[name].value;
            const val1 = this.InputsSucerlevelOpt(name).filter(f => +f.value === +val);
            return val1[0] ? val1[0].style.color : 'black';
        }
        return 'black';
    }
     InputsSucerlevelOpt(name) {
        return this.inputs['PRJ_DEFAULT_VALUE_List.SECURLEVEL'].options;
    }

    init(content: {}) {
        Object.assign(this, content);
        this._fillInputs()
            .then(() => {
                this.form = this._inputCtrlSrv.toFormGroup(this.inputs, true);
                this._getDocGroupWithPrjDefaultValues()
                    .then((data) => {
                        this.data = data[0];
                        this._fillInputsValues();
                        this._updateInputsOptions();
                        const grif = this.form.controls['PRJ_DEFAULT_VALUE_List.SECURLEVEL_FILE'];
                        this._updateAccessInput(grif.value);
                        this.updateSEndAccess(grif.value);
                        this.isUpdating = false;
                        this._prjExecListOnChange();
                        BaseCardEditDirective.autoFocusOnFirstStringElement('eos-prj-default-values');
                    });
                PrjDefaultValuesComponent._updateValidators(this.form.controls);
                this.$statusChanges = this.form.statusChanges
                    .subscribe((status) => {
                        if (this._currentFormStatus !== status) {
                            this.formInvalid = (status === 'INVALID');
                        }
                        this._currentFormStatus = status;
                    });
                this.form.controls['PRJ_DEFAULT_VALUE_List.SECURLEVEL_FILE'].valueChanges.subscribe(newValue => {
                    this.updateSEndAccess(newValue);
                });
                this.form.controls['PRJ_DEFAULT_VALUE_List.ACCESS_MODE_FILE'].valueChanges.subscribe(newValue => {
                    if (newValue && (newValue === '3' || newValue === '2' || newValue === '4' || newValue === '5')) {
                        this.isFileAccessEnabled = true;
                        this.validity('PRJ_DEFAULT_VALUE_List.REF_FILE_ACCESS_LIST', true);
                    } else {
                        this.isFileAccessEnabled = false;
                        this.setValue('PRJ_DEFAULT_VALUE_List.REF_FILE_ACCESS_LIST', null);
                        this.validity('PRJ_DEFAULT_VALUE_List.REF_FILE_ACCESS_LIST', true);
                    }
                });
            });
    }
    updateSEndAccess(newValue) {
        if (newValue) {
            this.isSecurLavelAccessEnabled = true;
            this._updateAccessInput(newValue);
        } else {
            this.isFileAccessEnabled = false;
            this.isSecurLavelAccessEnabled = false;
            this.setValue('PRJ_DEFAULT_VALUE_List.REF_FILE_ACCESS_LIST', null);
            this.validity('PRJ_DEFAULT_VALUE_List.REF_FILE_ACCESS_LIST', true);
            this.setValue('PRJ_DEFAULT_VALUE_List.ACCESS_MODE_FILE', null);
            this.validity('PRJ_DEFAULT_VALUE_List.ACCESS_MODE_FILE', true);
        }
    }
    setValue(path: string, value: any) {
        const control = this.form.controls[path];
        if (control) {
            control.setValue(value /*, {emitEvent: emit} */);
        }
    }
    validity(path: string, markDirty: boolean = false): any {
        const control = this.form.controls[path];
        if (control) {
            control.updateValueAndValidity();
            if (markDirty) {
                control.markAsDirty();
            }
        }
    }

    setTab(i: number) {
        this.currTab = i;
        BaseCardEditDirective.autoFocusOnFirstStringElement('eos-prj-default-values');
    }

    cancel(): void {
        this.bsModalRef.hide();
    }
    checkUpdateSecurlable(): boolean {
        let securelevel;
        let securelevelFile;
        // проверяю что в обоих полях есть данные
        if (!(+this.form.controls['PRJ_DEFAULT_VALUE_List.SECURLEVEL'].value) || !(+this.form.controls['PRJ_DEFAULT_VALUE_List.SECURLEVEL_FILE'].value)) {
            return false;
        }
        this.inputs['PRJ_DEFAULT_VALUE_List.SECURLEVEL'].options.forEach(elem => {
            if (+elem.value === +this.form.controls['PRJ_DEFAULT_VALUE_List.SECURLEVEL'].value) {
                securelevel = elem.confidentional;
            }
        });
        this.inputs['PRJ_DEFAULT_VALUE_List.SECURLEVEL_FILE'].options.forEach(elem => {
            if (+elem.value === +this.form.controls['PRJ_DEFAULT_VALUE_List.SECURLEVEL_FILE'].value) {
                securelevelFile = elem.confidentional;
            }
        });
        // если securelevel имеет confidentional === 1 и если securelevelFile не имеет confidentional === 1 тогда вернуть true
        if (securelevelFile === 1 && !securelevel) {
            return true;
        }
        return false;
    }
    save(): void {
        if (this._appContext.cbBase && this.checkUpdateSecurlable()) {
            RK_ERROR_SAVE_SECUR.body = 'Гриф РКПД и гриф файлов по умолчанию не соответствуют друг другу.';
            this._confirmSrv.confirm2(RK_ERROR_SAVE_SECUR);
            return ;
        }
        this._preSaveCheck()
            .then((res) => {
                if (res) { return; }
                this._apiSrv
                    .read<DOCGROUP_CL>({
                        DOCGROUP_CL: PipRX.criteries({ 'ISN_NODE': this.data['ISN_NODE'].toString() }),
                        expand: PRJ_DEFAULTS_LIST_NAME + ',' + FILE_CONSTRAINT_NAME,
                        foredit: true,
                    })
                    .then(([docGroup]) => {
                        this._apiSrv.entityHelper.prepareForEdit(docGroup);

                        this.prjDefaults.items.forEach((item) => {
                            if (!item.readonly) {
                                const key = PrjDefaultValuesComponent._getFieldKey(item.id, item.tableName);
                                const control = this.form.controls[key];
                                if (control) {
                                    let value = control.value;
                                    if (item.type === E_FIELD_TYPE.boolean) {
                                        value = value ? '1' : false;
                                    }

                                    if (item.tableName === PRJ_DEFAULTS_LIST_NAME) {
                                        const prj = docGroup.PRJ_DEFAULT_VALUE_List
                                            .find((f) => f.DEFAULT_ID === item.id);
                                        if (prj) {
                                            if (prj.VALUE !== value) {
                                                if (value) {
                                                    prj.VALUE = value.toString();
                                                    prj._State = _ES.Modified;
                                                } else {
                                                    prj._State = _ES.Deleted;
                                                }
                                            }
                                        } else {
                                            if (value) {
                                                const newPrj = <PRJ_DEFAULT_VALUE>{
                                                    _State: _ES.Added,
                                                    DEFAULT_ID: item.id,
                                                    DUE: docGroup.DUE,
                                                    ISN_DOCGROUP: this.isnNode,
                                                    VALUE: value.toString(),
                                                };
                                                docGroup.PRJ_DEFAULT_VALUE_List.push(newPrj);
                                            }
                                        }
                                    }
                                }
                            }
                        });

                        const categories = ['PRJ_RC', 'PRJ_VISA_SIGN'];
                        categories.forEach((category) => {
                            const dgFile = docGroup.DG_FILE_CONSTRAINT_List
                                .find((f) => f.CATEGORY === category);
                            const prop = this._getDGFileProperties(category);
                            if (dgFile) {
                                FILE_FIELDS.forEach(f => {
                                    if (dgFile[f] !== prop[f]) {
                                        if (prop[f]) {
                                            dgFile[f] = prop[f];
                                        } else {
                                            dgFile[f] = null;
                                            if (f === 'ONE_FILE') {
                                                dgFile[f] = 0;
                                            }
                                        }
                                        dgFile._State = _ES.Modified;
                                    } else {
                                        if (dgFile[f]) {
                                            dgFile[f] = dgFile[f];
                                        }
                                    }
                                });
                            } else {
                                const newDgFile = <DG_FILE_CONSTRAINT>{
                                    _State: _ES.Added,
                                    CATEGORY: category,
                                    DUE: docGroup.DUE,
                                    ISN_DOCGROUP: this.isnNode,
                                    MAX_SIZE: null,
                                    ONE_FILE: 0,
                                    EXTENSIONS: null,
                                };
                                let addDgFile = false;
                                FILE_FIELDS.forEach(f => {
                                    if (prop[f]) {
                                        addDgFile = true;
                                        newDgFile[f] = prop[f];
                                        newDgFile._State = _ES.Added;
                                    }
                                });
                                if (addDgFile) {
                                    docGroup.DG_FILE_CONSTRAINT_List.push(newDgFile);
                                }
                            }
                        });

                        const changes = this._apiSrv.changeList([docGroup]);
                        changes.forEach(ch => {
                            if (ch.method === 'MERGE' || ch.method === 'DELETE') {
                                ch.requestUri = ch.requestUri
                                    .replace('PRJ_DEFAULT_VALUE_List(\'', 'PRJ_DEFAULT_VALUE_List(\'' + docGroup.DUE + ' ');
                                if (ch.data) {
                                    ch.requestUri = ch.requestUri
                                        .replace('DG_FILE_CONSTRAINT_List(' + docGroup.ISN_NODE + ')', 'DG_FILE_CONSTRAINT_List(\'' + docGroup.DUE
                                            + ' ' + ch.data.CATEGORY + '\')');
                                }
                            }
                        });
                        this._apiSrv.batch(changes, '')
                            .then(() => {
                                this._msgSrv.addNewMessage(SUCCESS_SAVE);
                                this.bsModalRef.hide();
                            })
                            .catch((err) => {
                                this._msgSrv.addNewMessage({ msg: err.message, type: 'danger', title: 'Ошибка записи' });
                            });
                    });
            });
    }

    public userListsEdit() {
        this._waitClassifSrv.openClassif({ classif: 'COMMON_LIST' })
            .then()
            .catch(() => {
                this._zone.run(() => {
                    this._rereadUserLists();
                });
            });
    }
    private _updateAccessInput(value) {
        const optionsWithDsp: Array<any> = this.inputs['PRJ_DEFAULT_VALUE_List.SECURLEVEL_FILE'].options;
        const findDsp = optionsWithDsp.filter(o => +o.value === +value);
        const v = this.inputs['PRJ_DEFAULT_VALUE_List.ACCESS_MODE_FILE'].options;
        const controlAccess = this.form.controls['PRJ_DEFAULT_VALUE_List.ACCESS_MODE_FILE'];
        if (findDsp.length) {
            if (findDsp[0].confidentional) {
                v.length = 0;
                v.push(...STRICT_OPTIONS);
                    controlAccess.patchValue('4');
                // if (controlAccess.value === '3' || controlAccess.value === '2' || controlAccess.value === '1') {

                // }
            } else {
                v.length = 0;
                v.push(...NOT_STRICT_OPTIONS_PRG);
                    controlAccess.patchValue('1');
            }
        }


    }

    private _preSaveCheck(): Promise<any> {
        // проверить списки на предмет наличия логически удаленных записей.
        const fields1 = this.prjDefaults.items;

        // Выводить ошибки в заданном порядке.
        const sortable = fields1.sort((a, b) => a.order > b.order ? 1 : a.order < b.order ? -1 :
            (a.order === undefined ? 1 :
                (b.order === undefined ? -1 : 0)));


        const listLD = [];
        const listHasDeleted = [];
        const listIsEmpty = [];
        const listBeenDeleted = [];

        for (let i = 0; i < sortable.length; i++) {
            const el = sortable[i];
            if (!el.dictId) { continue; }

            const val = this.form.controls[PrjDefaultValuesComponent._getFieldKey(el.id, el.tableName)].value;
            if (val) {
                const opt = this.prjDefaults.options[el.dictId].find(o => Number(o.value) === Number(val));
                if (opt) {
                    if (opt.isEmpty) {
                        listIsEmpty.push(el);
                    } else if (opt.hasDeleted) {
                        listHasDeleted.push(el);
                    }
                    if (opt && opt.disabled) {
                        listLD.push(el);
                    }
                } else {
                    const control = this.form.controls[PRJ_DEFAULTS_LIST_NAME + '.' + el.id];
                    if (control) {
                        control.setValue(null);
                    }
                    listBeenDeleted.push(el);
                }
            }
        }
        const listLDText = this._elListToText(listLD);
        const listHasDeletedText = this._elListToText(listHasDeleted);
        const listIsEmptyText = this._elListToText(listIsEmpty);
        const listBeenDeletedText = this._elListToText(listBeenDeleted);

        let confirmationsChain = Promise.resolve(false);
        if (listLDText || listHasDeletedText || listIsEmptyText || listBeenDeletedText) {
            let confirmLD: IConfirmWindow2 = Object.assign({}, RK_SELECTED_VALUE_INCORRECT);

            confirmLD.bodyList = [];
            if (listLDText) {
                confirmLD.bodyList.push('В настройках реквизитов используются логически удаленные элементы справочников: ' + listLDText);
            }
            if (listBeenDeletedText) {
                confirmLD.bodyList.push('Выбран список, который был удален. Значение очищено. Реквизиты: ' + listBeenDeletedText);
            }
            if (listIsEmptyText) {
                // confirmLD.bodyList.push('В следующих реквизитах выбран пустой список: ' + listIsEmptyText);
                confirmLD = Object.assign({}, RK_SELECTED_VALUE_INCORRECT_EMPTY_LIST);
                confirmLD.bodyList = [];
            }
            if (listHasDeletedText) {
                confirmLD.bodyList.push('Выбран список, в котором некоторые элементы логически удалены. Реквизиты: ' + listHasDeletedText);
            }

            confirmationsChain = confirmationsChain.then((res) => {
                if (res) {
                    return res;
                } else {
                    return this._confirmSrv.confirm2(confirmLD).then((button) => {
                        return (!button || button.result === 2);
                    });
                }
            });
        }

        return confirmationsChain;
    }

    private _elListToText(list: any[]): string {
        return EosDataConvertService.listToCommaList(list.map((el) => (el.longTitle || el.fullDescr || el.title || el.descr)));
    }

    private _prjExecListOnChange(newValue?) {
        if (this.$valueChanges) {
            this.$valueChanges.unsubscribe();
        }

        let ctrl = this.form.controls['PRJ_DEFAULT_VALUE_List.PRJ_EXEC_LIST'];
        if (ctrl) {
            this.isPrjExecFull = !!ctrl.value;
            if (!ctrl.value) {
                this.form.controls['PRJ_DEFAULT_VALUE_List.CAN_MANAGE_APPROVAL'].setValue(0);
                this.form.controls['PRJ_DEFAULT_VALUE_List.CAN_WORK_WITH_FILES'].setValue(0);
                this.form.controls['PRJ_DEFAULT_VALUE_List.CAN_WORK_WITH_PRJ'].setValue(0);
                this.form.controls['PRJ_DEFAULT_VALUE_List.CAN_MANAGE_EXEC'].setValue(0);
            }
        }

        ctrl = this.form.controls['PRJ_DEFAULT_VALUE_List.TERM_EXEC'];
        if (ctrl) {
            if (this.prevValues['TERM_EXEC'] !== ctrl.value && ctrl.value) {
                this.prevValues['TERM_EXEC'] = ctrl.value;
            }
            const lbls = RKDefaultValuesCardComponent.termExecOptsByValue(Number(ctrl.value || 0));
            this.inputs['PRJ_DEFAULT_VALUE_List.TERM_EXEC_TYPE'].options = lbls.options;
            this.dayTypeTitle = lbls.daysLabel;
        }

        this.$valueChanges = this.form.valueChanges.subscribe((value) => {
            this._prjExecListOnChange();
        });
    }

    private _getDGFileProperties(category) {
        const res = {};

        FILE_FIELDS.forEach((f) => {
            let value = this.form.controls['DG_FILE_CONSTRAINT_List.' + category + '.' + f].value;
            if (f === 'ONE_FILE') {
                value = value ? 1 : 0;
            }
            Object.assign(res, { [f]: value });
        });
        return res;
    }

    private _getDocGroupWithPrjDefaultValues(): Promise<any> {
        return this._apiSrv
            .read<DOCGROUP_CL>({
                DOCGROUP_CL: PipRX.criteries({ ISN_NODE: this.isnNode.toString() }),
                expand: PRJ_DEFAULTS_LIST_NAME + ',' + FILE_CONSTRAINT_NAME,
            });
    }

    private _fillInputs(): Promise<any> {
        return this.prjDefaults.fillDictionariesLists(this._apiSrv)
            .then(() => {
                this.prjDefaults.items.forEach((prjDefault) => {
                    const key = PrjDefaultValuesComponent._getFieldKey(prjDefault.id, prjDefault.tableName);
                    const commonParams = {
                        key: key,
                        label: prjDefault.descr,
                        required: false,
                        forNode: true,
                        value: prjDefault.defaultValue,
                        isUnique: false,
                        uniqueInDict: false,
                        readonly: prjDefault.readonly,
                        disabled: false,
                        dict: prjDefault.tableName,
                        pattern: prjDefault.pattern,
                        length: prjDefault.length,
                        options: prjDefault.options,
                        minValue: prjDefault.minValue,
                        maxValue: prjDefault.maxValue
                    };

                    switch (prjDefault.type) {
                        case E_FIELD_TYPE.string:
                            this.inputs[key] = new StringInput(commonParams);
                            break;
                        case E_FIELD_TYPE.select:
                            this.inputs[key] = new DropdownInput(Object.assign({}, commonParams, {
                                options: this.prjDefaults.options[prjDefault.dictId],
                            }));
                            break;
                        case E_FIELD_TYPE.text:
                            this.inputs[key] = new TextInput(commonParams);
                            break;
                        case E_FIELD_TYPE.buttons: {
                            this.inputs[key] = new ButtonsInput(commonParams);
                            break;
                        }
                        case E_FIELD_TYPE.boolean:
                            this.inputs[key] = new CheckboxInput(commonParams);
                            break;
                        case E_FIELD_TYPE.numberIncrement:
                            this.inputs[key] = new NumberIncrementInput(commonParams);
                            break;
                        default:
                            this.inputs[key] = new StringInput(commonParams);
                    }
                });

            });
    }

    private _setValue(value: any, tableName) {
        const control = this.form.controls[PrjDefaultValuesComponent._getFieldKey(value['DEFAULT_ID'], tableName)];
        if (control) {
            let val = value['VALUE'];
            const item = this.prjDefaults.items.find((it) => it.id === value['DEFAULT_ID']
                && it.type === E_FIELD_TYPE.boolean && val === '0');
            if (item) {
                val = 0;
            }
            control.setValue(val);
        }
    }

    private _setFileValue(value) {
        const controlTeplate = FILE_CONSTRAINT_NAME + '.' + value.CATEGORY + '.';

        FILE_FIELDS.forEach((f) => {
            const ctrl = this.form.controls[controlTeplate + f];
            if (ctrl) {
                ctrl.setValue(value[f]);
            }
        });
    }

    private _fillInputsValues() {
        this.data[PRJ_DEFAULTS_LIST_NAME].forEach(value => {
            this._setValue(value, PRJ_DEFAULTS_LIST_NAME);
        });
        this.data[FILE_CONSTRAINT_NAME].forEach(value => {
            this._setFileValue(value);
        });
    }

    private _updateInputsOptions() {
        for (const key in this.inputs) {
            if (this.inputs.hasOwnProperty(key)) {
                const input = this.inputs[key];
                if (input.controlType === E_FIELD_TYPE.select) {
                    const control = this.form.controls[input.key];
                    const filteredOptions = input.options.filter(o => !o.disabled || String(o.value) === String(control.value));
                    input.options = filteredOptions;
                }
            }
        }
    }

    private _rereadUserLists() {
        this.prjDefaults.fillDictionariesLists(this._apiSrv)
            .then(() => {
                this.prjDefaults.items.forEach((prjDefault) => {
                    if (prjDefault.type === E_FIELD_TYPE.select) {
                        const key = PrjDefaultValuesComponent._getFieldKey(prjDefault.id, prjDefault.tableName);
                        this.inputs[key].options = this.prjDefaults.options[prjDefault.dictId];
                    }
                });
            });
    }
}
