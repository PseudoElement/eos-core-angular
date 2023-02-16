import {Component, EventEmitter, Input, OnDestroy, Output, Injector} from '@angular/core';
import {UntypedFormGroup} from '@angular/forms';
import {BsModalRef} from 'ngx-bootstrap';
import {PipRX} from '../../eos-rest';
import {EosMessageService} from '../../eos-common/services/eos-message.service';
import {SUCCESS_SAVE, WARN_SAVE_FAILED} from '../consts/messages.consts';
import {InputControlService} from '../../eos-common/services/input-control.service';
import {CheckboxInput} from '../../eos-common/core/inputs/checkbox-input';
import {StringInput} from '../../eos-common/core/inputs/string-input';
import {Subscription} from 'rxjs';
import { RKDefaultFields, TDefaultField, TDFSelect } from 'eos-dictionaries/adv-card/rk-default-values/rk-default-const';
import { E_FIELD_TYPE } from 'eos-dictionaries/interfaces';
import { AdvCardRKDataCtrl, DEFAULTS_LIST_NAME, PRJ_DEFAULTS_LIST_NAME, FILE_CONSTRAINT_LIST_NAME, AR_DOCGROUP_LIST_NAME, IUpdateDictEvent } from 'eos-dictionaries/adv-card/adv-card-rk-datactrl';
import { IConfirmWindow2 } from 'eos-common/confirm-window/confirm-window2.component';
import { RK_SELECTED_VALUE_LOGIC_DELETED } from 'app/consts/confirms.const';
import { ConfirmWindowService } from 'eos-common/confirm-window/confirm-window.service';
import { RKPDDefaultFields, RKPDdictionaries } from 'eos-dictionaries/prj-default-values/prj-default-values.component';
import { IMessage } from 'eos-common/interfaces';
import { EosDataConvertService } from 'eos-dictionaries/services/eos-data-convert.service';
import { EosUtils } from 'eos-common/core/utils';

const RC_TYPE_IS_DIFFERENT_WARNING_MESSAGE: IMessage = {
    type: 'warning',
    title: 'Внимание',
    msg: 'Копирование свойств возможно только для групп документов с одинаковым видом РК',
};

const THE_SAME_GROUP_WARNING_MESSAGE: IMessage = {
    type: 'warning',
    title: 'Внимание',
    msg: 'Невозможно копирование свойств группы самой себе',
};
// const CLASSIF_NAME = 'DOCGROUP_CL';

class CopyPropWarningList {
    logicDeleted = new Array<string>();
    emptyListValues = new Array<string>();
    hasDeletedList = new Array<string>();
}


class CopyPropWarningPage {
    list = new CopyPropWarningList();
    suffixText: string;

    constructor (suffix: string) {
        this.suffixText = suffix;
    }

    public asTextlist(): string[] {
        const result = [];
        if (this.list.logicDeleted.length) {
            let text = '';
            text += '\n' + this.suffixText + '\n логически удаленные элементы справочников: ';
            text += EosDataConvertService.listToCommaList(this.list.logicDeleted);
            result.push(text);
        }
        if (this.list.emptyListValues.length) {
            let text = '';
            text += '\n' + this.suffixText + '\n пустые списки: ';
            text += EosDataConvertService.listToCommaList(this.list.emptyListValues);
            result.push(text);
        }
        if (this.list.hasDeletedList.length) {
            let text = '';
            text += '\n' + this.suffixText + '\n списки, содержащие пустые элементы: ';
            text += EosDataConvertService.listToCommaList(this.list.hasDeletedList);
            result.push(text);
        }
        return result;
    }
}
class CopyPropWarning  {
    lists = {
        RK_D: new CopyPropWarningPage('В настройках реквизитов РК по умолчанию используются '),
        RK_W: new CopyPropWarningPage('В Правилах заполнения реквизитов РК при записи используются '),
        RK_F: new CopyPropWarningPage('В Правила для файлов РК используются '),
        RKPD_D: new CopyPropWarningPage('РКПД: '),
    };

    isEmpty(): boolean {
        for (const key in this.lists) {
            if (this.lists.hasOwnProperty(key)) {
                const list: CopyPropWarningPage = this.lists[key];
                if (list.list.hasDeletedList.length || list.list.emptyListValues.length || list.list.logicDeleted.length) {
                    return false;
                }
            }
        }
        return true;
        // return !(this.rk_defaults.length
        //     || this.a_write_rek.length
        //     || this.a_fc_rc.length
        //     || this.a_prj_rek.length
        //     || this.RKemptyListValues['D'].length
        //     || this.RKemptyListValues['W'].length
        //     || this.RKemptyListValues['F'].length
        //     || this.RKhasDeletedList['D'].length
        //     || this.RKhasDeletedList['W'].length
        //     || this.RKhasDeletedList['F'].length
        //     );
    }

    allAsMessagesArr() {

    }
}

@Component({
    selector: 'eos-update-properties',
    templateUrl: 'copy-properties.component.html',
})

export class CopyPropertiesComponent implements OnDestroy {
    @Input() form: UntypedFormGroup;
    @Output() onClose: EventEmitter<any> = new EventEmitter<any>();


    isUpdating = true;
    inputs: any = {};
    formValid: boolean;
    title: string;
    saveButtonLabel: string;
    properties;
    renewChilds: boolean;

    private _dataControllerRK: AdvCardRKDataCtrl;
    private _recTo: any;
    private _dgFrom: any;
    private properties_for_request = [];
    private formChanges$: Subscription;

    constructor(
        public injector: Injector,
        private _bsModalRef: BsModalRef,
        private _msgSrv: EosMessageService,
        private _apiSrv: PipRX,
        private _confirmSrv: ConfirmWindowService,

        private _inputCtrlSrv: InputControlService) {
            this._dataControllerRK = new AdvCardRKDataCtrl(this.injector);
    }

    ngOnDestroy(): void {
        if (this.formChanges$) {
            this.formChanges$.unsubscribe();
        }
        this.onClose.emit();
    }


    public init(toNodeRec: any, fromdue: string, renewChilds: boolean) {
        this.isUpdating = true;
        this._recTo = toNodeRec;
        this.renewChilds = renewChilds;

        if (!this.renewChilds) {
            if (toNodeRec.DUE.toString() === fromdue) {
                setTimeout(() => {
                    this._msgSrv.addNewMessage(THE_SAME_GROUP_WARNING_MESSAGE);
                    this.hideModal();
                }, 300);
                return null;
            }
        }

        return this._dataControllerRK.readDGValuesDUE(fromdue).then(([docGroup]) => {

            this._dgFrom = Object.assign({}, docGroup);

            if (!this.renewChilds) {
                if (docGroup.RC_TYPE.toString() !== this._recTo.RC_TYPE.toString()) {
                    setTimeout(() => {
                        this._msgSrv.addNewMessage(RC_TYPE_IS_DIFFERENT_WARNING_MESSAGE);
                        this.hideModal();
                    }, 300);
                    return;
                }
            }

            if (this.renewChilds) {
                this.title = 'Обновить свойства подчиненных групп документов';
                this.saveButtonLabel = 'Обновить';
                this._initPropertiesRenewChilds();
                this._initInputs();
            } else {
                this.title = 'Копирование свойств группы документов';
                this.saveButtonLabel = 'Копировать';
                this._initProperties();
                this._initInputs();
            }

            this.form.controls.NODE_TO_COPY.setValue(docGroup.CLASSIF_NAME);

            this.isUpdating = false;
            // this.hideModal();

        }).catch(() => {
            this.hideModal();
        });
    }

    public hideModal() {
        this._bsModalRef.hide();
        this.onClose.emit();
    }


    public save() {
        const changes = [];
        const args = {};
        const method = this.renewChilds ? 'DocGroupCopyFromParent' : 'DocGroupPropCopy';

        let flagStr = '';
        this.properties_for_request.forEach((prop) => {
            flagStr += (this.form.controls[prop].value ? '1' : '0');
        });

        this._validateData().then( (result) => {
            if (result) {
                Object.assign(args, this.renewChilds ? {due: this._recTo.DUE} : {due_from: this._dgFrom.DUE,
                    due_to: this._recTo.DUE});

                Object.assign(args, {flags: flagStr});

                PipRX.invokeSop(changes, method, args, 'POST', false);

                this._apiSrv.batch(changes, '')
                    .then(() => {
                        this._msgSrv.addNewMessage(SUCCESS_SAVE);
                        this.hideModal();
                    })
                    .catch(() => {
                        this._msgSrv.addNewMessage(WARN_SAVE_FAILED);
                    });
            }
        });

    }

    protected controlChecked(name: string): boolean {
        return this.form.controls[name] && this.form.controls[name].value;
    }
    private _warningsCheckDefaults(docGroup: any, fieldsForCheck: TDefaultField[], listName: string): Promise<any[]> {
        const reqs = [];
        const ldeleted_errors = [];

        for (let i = 0; i < fieldsForCheck.length; i++) {
            const el = fieldsForCheck[i];

            if (!el.dict) { continue; }

            const default_value = docGroup[listName].find(v => v['DEFAULT_ID'] === el.key);

            if (!default_value) { continue; }

            const value = default_value['VALUE'];

            if (!value) { continue; }

            let query: any;
            if (el.dict.criteries) {
                query = { criteries: Object.assign({}, el.dict.criteries) };
            } else {
                query = { criteries: {}};
            }
            query.criteries[el.dict.dictKey] = value;

            const req = {[el.dict.dictId]: query};

            const request = this._apiSrv.read(req).then((data) => {
                if (data && data[0] && (data[0]['DELETED'])) {
                    ldeleted_errors.push ({ field: el, value: data});
                }
                return data;
            });

            reqs.push (request);
        }

        return Promise.all(reqs).then ( (r) => {
            return Promise.resolve(ldeleted_errors);
        });
    }

    private _userListWarningsCheck(warnings: CopyPropWarning, docGroup: any): any {
        let fields = {};

        if (this.controlChecked('a_default_rek_prj') /*|| this.controlChecked('a_prj_rek') || this.controlChecked('a_fc_prj')*/) {
            fields = Object.assign(fields, this._dataControllerRK.getDescriptionsRKPD());
        }

        if (this.controlChecked('a_default_rek') ||
            this.controlChecked('a_write_rek') ||
            this.controlChecked('a_fc') || this.controlChecked('a_fc_rc')) {
            const list = [];
            const RKfields = this._dataControllerRK.getDescriptionsRK()[DEFAULTS_LIST_NAME];
            if (this.controlChecked('a_default_rek')) {
                list.push(... RKfields.filter( f => f.page === 'D'));
            }
            if (this.controlChecked('a_write_rek')) {
                list.push(... RKfields.filter( f => f.page === 'W'));
            }
            if (this.controlChecked('a_fc') || this.controlChecked('a_fc_rc')) {
                list.push(... RKfields.filter( f => f.page === 'F'));
            }

            fields = Object.assign(fields, {[DEFAULTS_LIST_NAME]: list });
        }


        if (EosUtils.isObjEmpty(fields)
        ) {
            this._dataControllerRK.markCacheForDirty('USER_LISTS');
            return this._dataControllerRK.updateDictsOptions(fields, 'USER_LISTS', this._dgFrom, (event: IUpdateDictEvent) => {
                const el = event.el;
                const savedData = docGroup[event.key].find (f => f.DEFAULT_ID === el.key);
                if (savedData) {
                    const selectedOpt = event.options.find( o => String(o.value) === String(savedData.VALUE));
                    if (selectedOpt) {
                        const page: CopyPropWarningPage = event.key === PRJ_DEFAULTS_LIST_NAME ? warnings.lists.RKPD_D :
                                                          el.page === 'F' ? warnings.lists.RK_F :
                                                          el.page === 'W' ? warnings.lists.RK_W : warnings.lists.RK_D;

                        if (selectedOpt.isEmpty) {
                            page.list.emptyListValues.push(el.longTitle || el.title);
                        }
                        if (selectedOpt.hasDeleted) {
                            page.list.hasDeletedList.push(el.longTitle || el.title);
                        }
                    }
                }
            });

        } else {
            return Promise.resolve(null);
        }
    }

    private _validateData(): Promise<boolean> {
        const dataControllerRK = new AdvCardRKDataCtrl(this.injector);
        const due = this.renewChilds ? this._recTo.DUE : this._dgFrom.DUE;

        return dataControllerRK.readDGValuesDUE(due).then(([docGroup]) => {
            const warnings: CopyPropWarning = new CopyPropWarning();
            const checks = [];


            checks.push(this._userListWarningsCheck(warnings, docGroup));

            if (this.controlChecked('a_default_rek')) {
                const fieldsForCheck = RKDefaultFields.filter((field: TDefaultField) => field.type === E_FIELD_TYPE.select && field.page === 'D');
                checks.push(this._warningsCheckDefaults(docGroup, fieldsForCheck, DEFAULTS_LIST_NAME).then( (result: any[]) => {
                    // warnings.lists.RK_D.list.logicDeleted = result;
                    warnings.lists.RK_D.list.logicDeleted.push(...result.map(r => (r.field.longTitle || r.field.title)));
                    return Promise.resolve(result);
                }));
            }

            if (this.controlChecked('a_write_rek')) {
                const fieldsForCheck = RKDefaultFields.filter((field: TDefaultField) => field.type === E_FIELD_TYPE.select && field.page === 'W');
                checks.push(this._warningsCheckDefaults(docGroup, fieldsForCheck, DEFAULTS_LIST_NAME).then( (result: any[]) => {
                    warnings.lists.RK_W.list.logicDeleted = result;
                    return Promise.resolve(result);
                }));
            }

            if (this.controlChecked('a_fc') || this.controlChecked('a_fc_rc')) {
                const fieldsForCheck = RKDefaultFields.filter((field: TDefaultField) => field.type === E_FIELD_TYPE.select && field.page === 'F');
                checks.push(this._warningsCheckDefaults(docGroup, fieldsForCheck, DEFAULTS_LIST_NAME).then( (result: any[]) => {
                    warnings.lists.RK_F.list.logicDeleted = result;
                    return Promise.resolve(result);
                }));
            }

            if (this.controlChecked('a_prj_rek') || this.controlChecked('a_default_rek_prj') || this.controlChecked('a_fc_prj')) {
                const list = RKPDDefaultFields.filter ( l => (l.DEFAULT_TYPE === E_FIELD_TYPE.select && l.CLASSIF_ID));
                const fieldsForCheck = list.map( v => {
                    const dict = RKPDdictionaries.find( d => d.name === v.CLASSIF_ID);
                    let table = '';
                    for (const key in dict.req) {
                        if (dict.req.hasOwnProperty(key)) {
                            table = key;
                            break;
                        }
                    }

                    const field: TDefaultField = {
                        key: v.DEFAULT_ID,
                        title: v.DESCRIPTION,
                        type: v.DEFAULT_TYPE,
                        dict: <TDFSelect> {
                            dictId: table,
                            dictKey: dict.isnFieldName,
                            dictKeyTitle: dict.titleFieldName,
                        }
                    };
                    return field;
                });

                checks.push(this._warningsCheckDefaults(docGroup, fieldsForCheck, PRJ_DEFAULTS_LIST_NAME).then( (result: any[]) => {
                    warnings.lists.RKPD_D.list.logicDeleted = result;
                    return Promise.resolve(result);
                }));
            }

            return Promise.all(checks).then ( (r) => {
                return this._confirmWarnings(warnings);
            });
        });
    }

    private _confirmWarnings(warning: CopyPropWarning): Promise<boolean> {
        if (warning.isEmpty()) {
            return Promise.resolve(true);
        }


        let confirmationsChain = Promise.resolve(true);
        confirmationsChain = confirmationsChain.then( (res) => {
            if (!res) {
                return res;
            }

            const confirmLD: IConfirmWindow2 = Object.assign({}, RK_SELECTED_VALUE_LOGIC_DELETED);
            confirmLD.body = '';
            confirmLD.bodyList = [];
            confirmLD.bodyList.push(...warning.lists.RK_D.asTextlist());
            confirmLD.bodyList.push(...warning.lists.RK_W.asTextlist());
            confirmLD.bodyList.push(...warning.lists.RK_F.asTextlist());
            confirmLD.bodyList.push(...warning.lists.RKPD_D.asTextlist());
            confirmLD.bodyList = confirmLD.bodyList.filter(v => v !== '');

            confirmLD.bodyAfterList = 'Продолжить?';

            return this._confirmSrv.confirm2(confirmLD).then((button) => {
                return (button && button.result === 1);
            });

        });

        return Promise.resolve(confirmationsChain);
    }

    private _initProperties() {
        this.properties = [
            {
                key: 'a_shablon',
                label: 'Шаблон рег.№ РК',
                disabled: !(this._dgFrom.SHABLON && this._dgFrom.SHABLON !== ''),
            },
            {
                key: 'a_docvid',
                label: 'Вид Документа',
                disabled: !(this._dgFrom[DEFAULTS_LIST_NAME] && this._dgFrom[DEFAULTS_LIST_NAME].length),
            },
            {
                key: 'a_default_rek',
                label: 'Правила заполнения реквизитов РК по умолчанию',
                disabled: !(this._dgFrom[DEFAULTS_LIST_NAME] && this._dgFrom[DEFAULTS_LIST_NAME].length),
            }, {
                key: 'a_mand_rek',
                label: 'Перечень реквизитов РК, обязательных для заполнения',
                disabled: !(this._dgFrom[DEFAULTS_LIST_NAME] && this._dgFrom[DEFAULTS_LIST_NAME].length),
            }, {
                key: 'a_write_rek',
                label: 'Правила заполнения реквизитов РК при записи',
                disabled: !(this._dgFrom[DEFAULTS_LIST_NAME] && this._dgFrom[DEFAULTS_LIST_NAME].length),
            }, {
                key: 'a_fc_rc',
                label: 'Правила для файлов РК',
                disabled: !(this._dgFrom[FILE_CONSTRAINT_LIST_NAME] && this._dgFrom[FILE_CONSTRAINT_LIST_NAME].length),
            }, {
                key: 'a_prj_shablon',
                label: 'Свойства РКПД (наличие проектов и шаблон рег.№)',
                disabled: !(this._dgFrom.PRJ_NUM_FLAG && this._dgFrom.PRJ_SHABLON),
            }, {
                key: 'a_default_rek_prj',
                label: 'Правила заполнения реквизитов РКПД по умолчанию',
                disabled: !(this._dgFrom.PRJ_NUM_FLAG /* && this._dgFrom[PRJ_DEFAULTS_LIST_NAME] && this._dgFrom[PRJ_DEFAULTS_LIST_NAME].length */),
            }, {
                key: 'a_mand_rek_prj',
                label: 'Перечень реквизитов РКПД, обязательных для заполнения',
                disabled: !(this._dgFrom.PRJ_NUM_FLAG /* && this._dgFrom[PRJ_DEFAULTS_LIST_NAME] && this._dgFrom[PRJ_DEFAULTS_LIST_NAME].length */),
            }, {
                key: 'a_fc_prj',
                label: 'Ограничения файлов для РКПД',
                disabled: !(this._dgFrom.PRJ_NUM_FLAG /* && this._dgFrom[FILE_CONSTRAINT_LIST_NAME] && this._dgFrom[FILE_CONSTRAINT_LIST_NAME].length */),
            }, {
                key: 'a_add_rek',
                label: 'Дополнительные реквизиты и правила их заполнения',
                disabled: !(this._dgFrom[AR_DOCGROUP_LIST_NAME] && this._dgFrom[AR_DOCGROUP_LIST_NAME].length),
            }, {
                key: 'a_add_rub',
                label: 'Дополнительные реквизиты рубрик',
                disabled: !(this._dgFrom[AR_DOCGROUP_LIST_NAME] && this._dgFrom[AR_DOCGROUP_LIST_NAME].length),
            }];
        this.properties_for_request = ['a_shablon', 'a_default_rek', 'a_mand_rek', 'a_write_rek', 'a_prj_shablon',
            'a_default_rek_prj', 'a_mand_rek_prj', 'a_add_rek', 'a_add_rub', 'a_fc_rc', 'a_fc_prj', 'a_docvid'];
    }

    private _initPropertiesRenewChilds() {
        this.properties = [
            {
                key: 'a_shablon',
                label: 'Шаблон номерообразования',
            },
            {
                key: 'a_docvid',
                label: 'Вид Документа',
            },
            {
                key: 'a_add_rek',
                label: 'Дополнительные реквизиты',
            }, {
                key: 'a_default_rek',
                label: 'Правила заполнения реквизитов по умолчанию',
            }, {
                key: 'a_mand_rek',
                label: 'Перечень обязательно заполняемых реквизитов',
            }, {
                key: 'a_write_rek',
                label: 'Правила заполнения реквизитов при записи',
            }, {
                key: 'a_fc',
                label: 'Правила для файлов',
            }, {
                key: 'a_prj_rek',
                label: 'Свойства проектов документов',
                hidden: !(this._recTo.PRJ_NUM_FLAG && String(this._recTo.RC_TYPE) === '3'),
                // disabled: !(this._recTo.PRJ_NUM_FLAG && String(this._recTo.RC_TYPE) === '3'),
            }];


        this.properties_for_request = ['a_shablon', 'a_add_rek', 'a_default_rek', 'a_mand_rek', 'a_write_rek',
            'a_prj_rek', 'a_fc', 'a_docvid' ];
    }

    private _initInputs() {
        this.inputs['NODE_TO_COPY'] = new StringInput({
            key: 'NODE_TO_COPY',
            label: 'Выбранная группа документов',
            forNode: true,
            disabled: true,
        });

        this.properties.forEach((prop) => {
            this.inputs[prop.key] = new CheckboxInput({
                key: prop.key,
                label: prop.label,
                forNode: true,
                disabled: prop.disabled,
            });
        });

        this.form = this._inputCtrlSrv.toFormGroup(this.inputs, true);
        this.formChanges$ = this.form.valueChanges.subscribe(() => this._validateForm());
    }


    private _validateForm() {
        this.formValid = false;
        for (const prop of this.properties_for_request) {
            if (this.form.controls[prop].value) {
                this.formValid = true;
                break;
            }
        }
    }
}
