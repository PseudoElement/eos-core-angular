import {Component, EventEmitter, Input, OnDestroy, Output, Injector} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {WaitClassifService} from '../../app/services/waitClassif.service';
import {BsModalRef} from 'ngx-bootstrap';
import {DOCGROUP_CL, PipRX} from '../../eos-rest';
import {EosMessageService} from '../../eos-common/services/eos-message.service';
import {IMessage} from '../../eos-common/core/message.interface';
import {SUCCESS_SAVE, WARN_SAVE_FAILED} from '../consts/messages.consts';
import {InputControlService} from '../../eos-common/services/input-control.service';
import {CheckboxInput} from '../../eos-common/core/inputs/checkbox-input';
import {StringInput} from '../../eos-common/core/inputs/string-input';
import {Subscription} from 'rxjs';
import { RKDefaultFields, TDefaultField, TDFSelect } from 'eos-dictionaries/adv-card/rk-default-values/rk-default-const';
import { E_FIELD_TYPE } from 'eos-dictionaries/interfaces';
import { AdvCardRKDataCtrl, DEFAULTS_LIST_NAME, PRJ_DEFAULTS_LIST_NAME } from 'eos-dictionaries/adv-card/adv-card-rk-datactrl';
import { IConfirmWindow2 } from 'eos-common/confirm-window/confirm-window2.component';
import { RK_SELECTED_VALUE_LOGIC_DELETED } from 'app/consts/confirms.const';
import { ConfirmWindowService } from 'eos-common/confirm-window/confirm-window.service';
import { RKPDDefaultFields, RKPDdictionaries } from 'eos-dictionaries/prj-default-values/prj-default-values.component';

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
const CLASSIF_NAME = 'DOCGROUP_CL';

@Component({
    selector: 'eos-update-properties',
    templateUrl: 'copy-properties.component.html',
})

export class CopyPropertiesComponent implements OnDestroy {
    @Input() form: FormGroup;
    @Output() onClose: EventEmitter<any> = new EventEmitter<any>();

    isUpdating = true;
    inputs: any = {};
    formValid: boolean;
    fromParent: boolean;
    title: string;
    saveButtonLabel: string;
    properties;
    private rec_to;
    private rec_from;
    private properties_for_request = [];
    private formChanges$: Subscription;

    constructor(
        public injector: Injector,
        private _waitClassif: WaitClassifService,
        private _bsModalRef: BsModalRef,
        private _msgSrv: EosMessageService,
        private _apiSrv: PipRX,
        private _confirmSrv: ConfirmWindowService,
        private _inputCtrlSrv: InputControlService) {
    }

    ngOnDestroy(): void {
        if (this.formChanges$) {
            this.formChanges$.unsubscribe();
        }
        this.onClose.emit();
    }

    public init(rec: any, fromParent: boolean) {
        this.isUpdating = true;
        this.rec_to = rec;
        this.fromParent = fromParent;

        if (this.fromParent) {
            this.title = 'Обновить свойства подчиненных групп документов';
            this.saveButtonLabel = 'Обновить';
            this._initPropertiesFromParent();
            this._initInputs();
            this.isUpdating = false;
        } else {
            this.title = 'Копирование свойств группы документов';
            this.saveButtonLabel = 'Копировать';
            this._initProperties();
            this._initInputs();
            this._chooseDocGroup();
        }
    }

    public hideModal() {
        this._bsModalRef.hide();
        this.onClose.emit();
    }


    public save() {
        const changes = [];
        const args = {};
        const method = this.fromParent ? 'DocGroupCopyFromParent' : 'DocGroupPropCopy';

        let flagStr = '';
        this.properties_for_request.forEach((prop) => {
            flagStr += (this.form.controls[prop].value ? '1' : '0');
        });

        this._validateData().then( (result) => {
            if (result) {
                Object.assign(args, this.fromParent ? {due: this.rec_to.DUE} : {due_from: this.rec_from.DUE,
                    due_to: this.rec_to.DUE});

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
                query = { criteries: el.dict.criteries};
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

    private _validateData(): Promise<boolean> {
        const dataControllerRK = new AdvCardRKDataCtrl(this.injector);
        const due = this.fromParent ? this.rec_to.DUE : this.rec_from.DUE;

        return dataControllerRK.readDGValuesDUE(due).then(([docGroup]) => {
            const checks = [];
            const warnings = {
                rk_defaults: [],
                a_write_rek: [],
                a_fc_rc: [],
                a_prj_rek: [],
                isEmpty(): boolean {
                    return !(this.rk_defaults.length || this.a_write_rek.length || this.a_fc_rc.length || this.a_prj_rek.length);
                }
            };

            if (this.controlChecked('a_default_rek')) {
                const fieldsForCheck = RKDefaultFields.filter((field: TDefaultField) => field.type === E_FIELD_TYPE.select && field.page === 'D');
                checks.push(this._warningsCheckDefaults(docGroup, fieldsForCheck, DEFAULTS_LIST_NAME).then( (result: any[]) => {
                    warnings.rk_defaults = result;
                    return Promise.resolve(result);
                }));
            }

            if (this.controlChecked('a_write_rek')) {
                const fieldsForCheck = RKDefaultFields.filter((field: TDefaultField) => field.type === E_FIELD_TYPE.select && field.page === 'W');
                checks.push(this._warningsCheckDefaults(docGroup, fieldsForCheck, DEFAULTS_LIST_NAME).then( (result: any[]) => {
                    warnings.a_write_rek = result;
                    return Promise.resolve(result);
                }));
            }

            if (this.controlChecked('a_fc') || this.controlChecked('a_fc_rc')) {
                const fieldsForCheck = RKDefaultFields.filter((field: TDefaultField) => field.type === E_FIELD_TYPE.select && field.page === 'F');
                checks.push(this._warningsCheckDefaults(docGroup, fieldsForCheck, DEFAULTS_LIST_NAME).then( (result: any[]) => {
                    warnings.a_write_rek = result;
                    return Promise.resolve(result);
                }));
            }

            if (this.controlChecked('a_prj_rek') || this.controlChecked('a_default_rek_prj') || this.controlChecked('a_fc_prj')) {
                const list = RKPDDefaultFields.filter ( l => l.DEFAULT_TYPE === E_FIELD_TYPE.select);
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
                    warnings.a_prj_rek = result;
                    return Promise.resolve(result);
                }));
            }

            return Promise.all(checks).then ( (r) => {
                // console.log("TCL: warnings", warnings);
                return this._confirmWarnings(warnings);
            });

        });
    }

    private _confirmWarnings(warning: any): Promise<boolean> {
        if (warning.isEmpty()) {
            return Promise.resolve(true);
        }


        let confirmationsChain = Promise.resolve(true);
        confirmationsChain = confirmationsChain.then( (res) => {
            if (!res) {
                return res;
            }

            const confirmLD: IConfirmWindow2 = Object.assign({}, RK_SELECTED_VALUE_LOGIC_DELETED);
            // confirmLD.manualCR = true;
            let confirmbodyRKPD = '';
            let confirmbodyRK = '';

            if (warning.rk_defaults.length) {
                confirmbodyRK += '\nПо умолчанию: ';
                for (let i = 0; i < warning.rk_defaults.length; i++) {
                    const element = warning.rk_defaults[i];
                    confirmbodyRK += element.field.longTitle || element.field.title;
                    confirmbodyRK += (i < warning.rk_defaults.length - 1) ? ', ' : '.';
                }
            }

            if (warning.a_write_rek.length) {
                confirmbodyRK += '\nПри записи: ';

                for (let i = 0; i < warning.a_write_rek.length; i++) {
                    const element = warning.a_write_rek[i];
                    confirmbodyRK += element.field.longTitle || element.field.title;
                    confirmbodyRK += (i < warning.a_write_rek.length - 1) ? ', ' : '.';
                }
            }

            if (warning.a_fc_rc.length) {
                confirmbodyRK += '\nФайлы: ';

                for (let i = 0; i < warning.a_fc_rc.length; i++) {
                    const element = warning.a_fc_rc[i];
                    confirmbodyRK += element.field.longTitle || element.field.title;
                    confirmbodyRK += (i < warning.a_fc_rc.length - 1) ? ', ' : '.';
                }
            }

            if (warning.a_prj_rek.length) {
                confirmbodyRKPD += '\nРКПД: ';

                for (let i = 0; i < warning.a_prj_rek.length; i++) {
                    const element = warning.a_prj_rek[i];
                    confirmbodyRKPD += element.field.longTitle || element.field.title;
                    confirmbodyRKPD += (i < warning.a_prj_rek.length - 1) ? ', ' : '.';
                }
            }

            confirmLD.bodyList = [];
            if (confirmbodyRK !== '') {
                confirmbodyRK = 'В настройках реквизитов РК используются логически удаленные элементы справочников:\n' + confirmbodyRK;
                confirmLD.bodyList.push (confirmbodyRK);
            }
            if (confirmbodyRKPD !== '') {
                confirmbodyRKPD = 'В настройках реквизитов РКПД используются логически удаленные элементы справочников:\n' + confirmbodyRKPD;
                confirmLD.bodyList.push (confirmbodyRKPD);
            }
            confirmLD.body = '';
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
            }, {
                key: 'a_default_rek',
                label: 'Правила заполнения реквизитов РК по умолчанию',
            }, {
                key: 'a_mand_rek',
                label: 'Перечень реквизитов РК, обязательных для заполнения',
            }, {
                key: 'a_write_rek',
                label: 'Правила заполнения реквизитов РК при записи',
            }, {
                key: 'a_fc_rc',
                label: 'Правила для файлов РК',
            }, {
                key: 'a_prj_shablon',
                label: 'Свойства РКПД (наличие проектов и шаблон рег.№)',
                disabled: !this.rec_to.PRJ_NUM_FLAG,
            }, {
                key: 'a_default_rek_prj',
                label: 'Правила заполнения реквизитов РКПД по умолчанию',
                disabled: !this.rec_to.PRJ_NUM_FLAG,
            }, {
                key: 'a_mand_rek_prj',
                label: 'Перечень реквизитов РКПД, обязательных для заполнения',
                disabled: !this.rec_to.PRJ_NUM_FLAG,
            }, {
                key: 'a_fc_prj',
                label: 'Ограничения файлов для РКПД',
                disabled: !this.rec_to.PRJ_NUM_FLAG,
            }, {
                key: 'a_add_rek',
                label: 'Дополнительные реквизиты и правила их заполнения',
                disabled: !this.rec_to.PRJ_NUM_FLAG,
            }, {
                key: 'a_add_rub',
                label: 'Дополнительные реквизиты рубрик',
                disabled: !this.rec_to.PRJ_NUM_FLAG,
            }];
        this.properties_for_request = ['a_shablon', 'a_default_rek', 'a_mand_rek', 'a_write_rek', 'a_prj_shablon',
            'a_default_rek_prj', 'a_mand_rek_prj', 'a_add_rek', 'a_add_rub', 'a_fc_rc', 'a_fc_prj'];
    }

    private _initPropertiesFromParent() {
        this.properties = [
            {
                key: 'a_shablon',
                label: 'Шаблон номерообразования',
            }, {
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
                disabled: !this.rec_to.PRJ_NUM_FLAG,
            }];
        this.properties_for_request = ['a_shablon', 'a_add_rek', 'a_default_rek', 'a_mand_rek', 'a_write_rek',
            'a_prj_rek', 'a_fc'];
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

    private _chooseDocGroup() {
        this._waitClassif.openClassif({
            classif: CLASSIF_NAME,
            selectMulty: false,
            skipDeleted: false,
        }, true)
            .then((isn) => {
                if (isn) {
                    if (this.rec_to.ISN_NODE.toString() === isn) {
                        this.hideModal();
                        this._msgSrv.addNewMessage(THE_SAME_GROUP_WARNING_MESSAGE);
                    } else {
                        this._apiSrv.read<DOCGROUP_CL>({DOCGROUP_CL: PipRX.criteries({ISN_NODE: isn})})
                            .then(([docGroup]) => {
                                this.rec_from = {};
                                Object.assign(this.rec_from, docGroup);
                                if (docGroup.RC_TYPE.toString() !== this.rec_to.RC_TYPE.toString()) {
                                    this.hideModal();
                                    this._msgSrv.addNewMessage(RC_TYPE_IS_DIFFERENT_WARNING_MESSAGE);
                                }
                                this.form.controls.NODE_TO_COPY.setValue(docGroup.CLASSIF_NAME);
                            });
                    }
                } else {
                    this.hideModal();
                }
                this.isUpdating = false;
            })
            .catch(() => {
                this.hideModal();
            });
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
