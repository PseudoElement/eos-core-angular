import {Component, Input, OnDestroy} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {InputControlService} from '../../eos-common/services/input-control.service';
import {DG_FILE_CONSTRAINT, DOCGROUP_CL, PipRX, PRJ_DEFAULT_VALUE} from '../../eos-rest';
import {SUCCESS_SAVE} from '../consts/messages.consts';
import {EosMessageService} from '../../eos-common/services/eos-message.service';
import {StringInput} from '../../eos-common/core/inputs/string-input';
import {E_FIELD_TYPE} from '../interfaces';
import {CheckboxInput} from '../../eos-common/core/inputs/checkbox-input';
import {DropdownInput} from '../../eos-common/core/inputs/select-input';
import {TextInput} from '../../eos-common/core/inputs/text-input';
import {NumberIncrementInput} from '../../eos-common/core/inputs/number-increment-input';
import {_ES} from '../../eos-rest/core/consts';
import {BsModalRef} from 'ngx-bootstrap';
import {VALIDATOR_TYPE, ValidatorsControl} from '../validators/validators-control';
import {Subscription} from 'rxjs/Subscription';

const PRJ_DEFAULT_NAME = 'PRJ_DEFAULT_VALUE_List';
const FILE_CONSTRAINT_NAME = 'DG_FILE_CONSTRAINT_List';
const PRJ_KEY_SHABLON = '{{tableName}}.{{id}}';
const FILE_FIELDS = ['EXTENSIONS', 'MAX_SIZE', 'ONE_FILE'];
const REG_MAX_SIZE: RegExp = /^\d{0,8}$/;

@Component ({
    selector: 'eos-prj-default-values',
    templateUrl: 'prj-default-values.component.html',
})

export class PrjDefaultValuesComponent implements OnDestroy {
    @Input() form: FormGroup;
    nodeDescription: string;
    isnNode: number;
    formInvalid: boolean;
    data: any;

    currTab = 0;
    inputs: any = {};
    newData = {};
    isUpdating = true;

    prjDefaults = new PrjDefaultFactory();
    _currentFormStatus: any;

    private subscriptions: Subscription[];

    constructor(
        public bsModalRef: BsModalRef,
        private _msgSrv: EosMessageService,
        private _inputCtrlSrv: InputControlService,
        private _apiSrv: PipRX ) {
        this.subscriptions = [];
    }

    ngOnDestroy() {
        this.subscriptions.forEach((subscr) => {
            if (subscr) {
                subscr.unsubscribe();
            }
        });
        this.subscriptions = [];
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

    init(content: {}) {
        Object.assign(this, content);

        this._fillInputs()
            .then(() => {
                this.form = this._inputCtrlSrv.toFormGroup(this.inputs, true);
                this._getDocGroupWithPrjDefaultValues()
                    .then((data) => {
                        this.data = data[0];
                        this._fillInputsValues();
                        this.isUpdating = false;
                     });
                this._updateValidators(this.form.controls);
                this.subscriptions.push(this.form.statusChanges
                    .subscribe((status) => {
                        if (this._currentFormStatus !== status) {
                            this.formInvalid = (status === 'INVALID');
                        }
                        this._currentFormStatus = status;
                    }));
            });
    }

    setTab(i: number) {
        this.currTab = i;
    }

    cancel(): void {
        this.bsModalRef.hide();
    }

    save(): void {
        this._apiSrv
            .read<DOCGROUP_CL>({
                DOCGROUP_CL: PipRX.criteries({'ISN_NODE': this.data['ISN_NODE'].toString()}),
                expand: PRJ_DEFAULT_NAME + ',' + FILE_CONSTRAINT_NAME,
                foredit: true,
            })
            .then(([docGroup]) => {
                this._apiSrv.entityHelper.prepareForEdit(docGroup);

                this.prjDefaults.items.forEach((item) => {
                    if (!item.readonly) {
                        const control = this.form.controls[this._getFieldKey(item.id, item.tableName)];
                        if (control) {
                            const value = control.value;
                            if (item.tableName === PRJ_DEFAULT_NAME) {
                                const prj = docGroup.PRJ_DEFAULT_VALUE_List.find((f) => f.DEFAULT_ID === item.id);
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
                    const dgFile = docGroup.DG_FILE_CONSTRAINT_List.find((f) => f.CATEGORY === category);
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
                        const newDgFile = <DG_FILE_CONSTRAINT> {
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
                        ch.requestUri = ch.requestUri
                            .replace('DG_FILE_CONSTRAINT_List(' + docGroup.ISN_NODE + ')', 'DG_FILE_CONSTRAINT_List(\'' + docGroup.DUE
                                + ' ' + ch.data.CATEGORY + '\')');
                    }
                });
                this._apiSrv.batch(changes, '')
                    .then(() => {
                        this._msgSrv.addNewMessage(SUCCESS_SAVE);
                        this.bsModalRef.hide();
                    })
                    .catch((err) => {
                        this._msgSrv.addNewMessage({msg: err.message, type: 'danger', title: 'Ошибка записи'});
                    });
            });
    }

    private _getDGFileProperties(category) {
        const res = {};

        FILE_FIELDS.forEach((f) => {
            let value = this.form.controls['DG_FILE_CONSTRAINT_List.' + category + '.' + f].value;
            if (f === 'ONE_FILE') {
                value = value ? 1 : 0;
            }
            Object.assign(res, {[f]: value});
        });
        return res;
    }

    private _getDocGroupWithPrjDefaultValues(): Promise<any> {
        return this._apiSrv
            .read<DOCGROUP_CL>({
                DOCGROUP_CL: PipRX.criteries({'ISN_NODE': this.isnNode.toString()}),
                expand: PRJ_DEFAULT_NAME + ',' + FILE_CONSTRAINT_NAME,
            });
    }

    private _fillInputs(): Promise<any> {
        return this.prjDefaults.fillDictionariesLists(this._apiSrv)
            .then(() => {
                this.prjDefaults.items.forEach((prjDefault) => {
                    const key = this._getFieldKey(prjDefault.id, prjDefault.tableName);
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
                        length: undefined,
                    };

                    switch (prjDefault.type) {
                        case E_FIELD_TYPE.string:
                            this.inputs[key] = new StringInput(commonParams);
                            break;
                        case E_FIELD_TYPE.select:
                            this.inputs[key] = new DropdownInput(Object.assign({}, commonParams, {
                                options: this.prjDefaults.options[prjDefault.dictId]}));
                            break;
                        case E_FIELD_TYPE.text:
                            this.inputs[key] = new TextInput(commonParams);
                            break;
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

    private _getFieldKey(id, tableName) {
        return PRJ_KEY_SHABLON.replace('{{id}}', id).replace('{{tableName}}', tableName);
    }

    private _setValue(value: any, tableName) {
        const control = this.form.controls[this._getFieldKey(value['DEFAULT_ID'], tableName)];
        if (control) {
            control.setValue(value['VALUE']);
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
        this.data[PRJ_DEFAULT_NAME].forEach(value => {
                this._setValue(value, PRJ_DEFAULT_NAME);
        });
        this.data[FILE_CONSTRAINT_NAME].forEach(value => {
            this._setFileValue(value);
        });
    }

    private _updateValidators(controls: any): any {
        ValidatorsControl.appendValidator(controls['DG_FILE_CONSTRAINT_List.PRJ_RC.EXTENSIONS'],
            ValidatorsControl.existValidator(VALIDATOR_TYPE.EXTENSION_DOT));
        ValidatorsControl.appendValidator(controls['DG_FILE_CONSTRAINT_List.PRJ_VISA_SIGN.EXTENSIONS'],
            ValidatorsControl.existValidator(VALIDATOR_TYPE.EXTENSION_DOT));
    }
}

class PrjDefaultFactory {
    options = new Map<string, any[]>();

    private readonly _items = Array<PrjDefaultItem>();

    constructor() {
        this._getPrjDefaults().forEach((recs) => {
            this._items.push(new PrjDefaultItem(recs));
        });
    }

    get items() {
        return this._items;
    }

    get requiredItems() {
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
        ];
    }

    get dictionaries() {
        return [
            {
                name: 'security',
                req: {SECURITY_CL: {}},
                titleFieldName: 'GRIF_NAME',
                isnFieldName: 'SECURLEVEL',
            }, {
                name: 'user_list_104',
                req: {USER_LISTS: PipRX.criteries({ISN_LCLASSIF: '-99', CLASSIF_ID: '104'}), orderby: 'WEIGHT'},
                titleFieldName: 'NAME',
                isnFieldName: 'ISN_LIST',
            }, {
                name: 'user_list_630',
                req: {USER_LISTS: PipRX.criteries({ISN_LCLASSIF: '-99', CLASSIF_ID: '630'}), orderby: 'WEIGHT'},
                titleFieldName: 'NAME',
                isnFieldName: 'ISN_LIST',
            }, {
                name: 'doc_templates',
                req: {DOC_TEMPLATES: PipRX.criteries({CATEGORY: 'ФАЙЛЫ ДОКУМЕНТОВ'}), orderby: 'WEIGHT'},
                titleFieldName: 'DESCRIPTION',
                isnFieldName: 'ISN_TEMPLATE',
            }, {
                name: 'user_list_107',
                req: {USER_LISTS: PipRX.criteries({ISN_LCLASSIF: '-99', CLASSIF_ID: '107'}), orderby: 'WEIGHT'},
                titleFieldName: 'NAME',
                isnFieldName: 'REF_ISN_LIST',
            }
        ];
    }

    fillDictionariesLists(apiSrv: PipRX): Promise<any[]> {
        const reads = [];
        this.dictionaries.forEach((dict) => {
            reads.push(new Promise<any>((resolve) => apiSrv.read(dict.req)
                .then(records => {
                    records.forEach((record) => {
                        if (!this.options[dict.name]) {
                            this.options[dict.name] = [];
                        }
                        this.options[dict.name].push({
                            title: record[dict.titleFieldName],
                            value: record[dict.isnFieldName]});
                    });
                    return resolve(records);
                })));
        });
        return Promise.all(reads);
    }

    private _getPrjDefaults(): any[] {
        return [{
            DEFAULT_ID: 'ANNOTAT',
            DEFAULT_TYPE: E_FIELD_TYPE.text,
            DESCRIPTION: 'Содержание',
        }, {
            DEFAULT_ID: 'ANNOTAT_M',
            DEFAULT_TYPE: E_FIELD_TYPE.boolean,
            DESCRIPTION: 'Содержание',
        }, {
            DEFAULT_ID: 'CONSISTS_M',
            DEFAULT_TYPE: E_FIELD_TYPE.boolean,
            DESCRIPTION: 'Состав',
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
            DEFAULT_VALUE: 1,
            CLASSIF_ID: 'security',
        }, {
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
            CLASSIF_ID: 'user_list_104'
        }, {
            DEFAULT_ID: 'SEND_ISN_LIST_ORGANIZ',
            DEFAULT_TYPE: E_FIELD_TYPE.select,
            DESCRIPTION: 'Внешние',
            CLASSIF_ID: 'user_list_630'
        }, {
            DEFAULT_ID: 'SIGN_ISN_LIST',
            DEFAULT_TYPE: E_FIELD_TYPE.select,
            DESCRIPTION: 'Внутренние',
            CLASSIF_ID: 'user_list_104'
        }, {
            DEFAULT_ID: 'SIGN_ISN_LIST_M',
            DEFAULT_TYPE: E_FIELD_TYPE.boolean,
            DESCRIPTION: 'Подписи',
        }, {
            DEFAULT_ID: 'TERM_EXEC',
            DEFAULT_TYPE: E_FIELD_TYPE.numberIncrement,
            DESCRIPTION: 'Срок исп. (План. дата), от даты регистрации',
        }, {
            DEFAULT_ID: 'TERM_EXEC_M',
            DEFAULT_TYPE: E_FIELD_TYPE.boolean,
            DESCRIPTION: 'Срок исп. (План. дата)',
        }, {
            DEFAULT_ID: 'VISA_ISN_LIST',
            DEFAULT_TYPE: E_FIELD_TYPE.select,
            DESCRIPTION: 'Внутренние',
            CLASSIF_ID: 'user_list_104'
        }, {
            DEFAULT_ID: 'VISA_ISN_LIST_M',
            DEFAULT_TYPE: E_FIELD_TYPE.boolean,
            DESCRIPTION: 'Визы',
        }, {
            DEFAULT_ID: 'FILE',
            DEFAULT_TYPE: E_FIELD_TYPE.select,
            DESCRIPTION: 'Файлы',
            CLASSIF_ID: 'doc_templates',
        }, {
            DEFAULT_ID: 'FILE_M',
            DEFAULT_TYPE: E_FIELD_TYPE.boolean,
            DESCRIPTION: 'Файлы',
        }, {
            DEFAULT_ID: 'SIGN_OUTER_ISN_LIST',
            DEFAULT_TYPE: E_FIELD_TYPE.select,
            DESCRIPTION: 'Внешние',
            CLASSIF_ID: 'user_list_630',
        }, {
            DEFAULT_ID: 'VISA_OUTER_ISN_LIST',
            DEFAULT_TYPE: E_FIELD_TYPE.select,
            DESCRIPTION: 'Внешние',
            CLASSIF_ID: 'user_list_630',
        }, {
            DEFAULT_ID: 'PRJ_EXEC_LIST',
            DEFAULT_TYPE: E_FIELD_TYPE.select,
            DESCRIPTION: 'Доп. исполнители',
            CLASSIF_ID: 'user_list_104'
        }, {
            DEFAULT_ID: 'CONSISTS',
            DEFAULT_TYPE: E_FIELD_TYPE.string,
            DESCRIPTION: 'Состав',
        }, {
            DEFAULT_ID: 'NOTE',
            DEFAULT_TYPE: E_FIELD_TYPE.text,
            DESCRIPTION: 'Примечание',
        }, {
            DEFAULT_ID: 'RUBRIC_LIST',
            DEFAULT_TYPE: E_FIELD_TYPE.select,
            DESCRIPTION: 'Рубрики',
            CLASSIF_ID: 'user_list_107'
        }, {
            DEFAULT_ID: 'TERM_EXEC_TYPE',
            DEFAULT_TYPE: 'D',
            DESCRIPTION: ' Срок исполнения РК в каких днях',
        }, {
            DEFAULT_ID: 'CAN_MANAGE_EXEC',
            DEFAULT_TYPE: 'D',
            DESCRIPTION: 'Управление исполнителями',
        }, {
            DEFAULT_ID: 'CAN_WORK_WITH_PRJ',
            DEFAULT_TYPE: 'D',
            DESCRIPTION: 'Работа с РКПД',
        }, {
            DEFAULT_ID: 'CAN_WORK_WITH_FILES',
            DEFAULT_TYPE: 'D',
            DESCRIPTION: 'Работа с файлами РКПД',
        }, {
            DEFAULT_ID: 'CAN_MANAGE_APPROVAL',
            DEFAULT_TYPE: 'D',
            DESCRIPTION: 'Организация согл-я и утв-я',
        }, {
            DEFAULT_ID: 'PRJ_RC.MAX_SIZE',
            DEFAULT_TYPE: E_FIELD_TYPE.number,
            DESCRIPTION: 'Max размер',
            CATEGORY: 'PRJ_RC',
            PATTERN: REG_MAX_SIZE,
            TABLE_NAME: 'DG_FILE_CONSTRAINT_List',
        }, {
            DEFAULT_ID: 'PRJ_RC.ONE_FILE',
            DEFAULT_TYPE: E_FIELD_TYPE.boolean,
            DESCRIPTION: 'Один файл',
            CATEGORY: 'PRJ_RC',
            TABLE_NAME: 'DG_FILE_CONSTRAINT_List',
        }, {
            DEFAULT_ID: 'PRJ_RC.EXTENSIONS',
            DEFAULT_TYPE: E_FIELD_TYPE.string,
            DESCRIPTION: 'С расширением',
            CATEGORY: 'PRJ_RC',
            TABLE_NAME: 'DG_FILE_CONSTRAINT_List',
        }, {
            DEFAULT_ID: 'PRJ_VISA_SIGN.MAX_SIZE',
            DEFAULT_TYPE: E_FIELD_TYPE.number,
            DESCRIPTION: 'Max размер',
            CATEGORY: 'PRJ_VISA_SIGN',
            PATTERN: REG_MAX_SIZE,
            TABLE_NAME: 'DG_FILE_CONSTRAINT_List',
        }, {
            DEFAULT_ID: 'PRJ_VISA_SIGN.ONE_FILE',
            DEFAULT_TYPE: E_FIELD_TYPE.boolean,
            DESCRIPTION: 'Один файл',
            CATEGORY: 'PRJ_VISA_SIGN',
            TABLE_NAME: 'DG_FILE_CONSTRAINT_List',
        }, {
            DEFAULT_ID: 'PRJ_VISA_SIGN.EXTENSIONS',
            DEFAULT_TYPE: E_FIELD_TYPE.string,
            DESCRIPTION: 'С расширением',
            CATEGORY: 'PRJ_VISA_SIGN',
            TABLE_NAME: 'DG_FILE_CONSTRAINT_List',
        }];
    }
}

class PrjDefaultItem {
    id: string;
    type: E_FIELD_TYPE;
    descr: string;
    dictId: string;
    readonly: boolean;
    defaultValue: any;
    tableName: string;
    category: string;
    pattern: string;

    constructor(rec) {
        if (rec) {
            this.id = rec.DEFAULT_ID;
            this.type = rec.DEFAULT_TYPE;
            this.descr = rec.DESCRIPTION;
            this.dictId = rec.CLASSIF_ID;
            this.readonly = rec.READONLY;
            this.defaultValue = rec.DEFAULT_VALUE ? rec.DEFAULT_VALUE : null;
            this.category = rec.CATEGORY ? rec.CATEGORY : null;
            this.pattern = rec.PATTERN ? rec.PATTERN : undefined;
            this.tableName = rec.TABLE_NAME ? rec.TABLE_NAME : 'PRJ_DEFAULT_VALUE_List';
        }
    }
}
