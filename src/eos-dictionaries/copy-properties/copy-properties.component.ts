import {Component, Input, OnDestroy} from '@angular/core';
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

    isUpdating = true;
    inputs: any = {};
    formValid: boolean;
    fromParent: boolean;
    title: string;
    private rec_to;
    private rec_from;
    private properties;
    private properties_for_request = [];
    private formChanges$: Subscription;

    constructor(
        private _waitClassif: WaitClassifService,
        private _bsModalRef: BsModalRef,
        private _msgSrv: EosMessageService,
        private _apiSrv: PipRX,
        private _inputCtrlSrv: InputControlService) {
    }

    ngOnDestroy(): void {
        if (this.formChanges$) {
            this.formChanges$.unsubscribe();
        }
    }

    public init(rec: any, fromParent: boolean) {
        this.isUpdating = true;
        this.rec_to = rec;
        this.fromParent = fromParent;

        if (this.fromParent) {
            this.title = 'Обновить свойства подчиненных групп документов';
            this._initPropertiesFromParent();
            this._initInputs();
            this.isUpdating = false;
        } else {
            this.title = 'Копирование свойств группы документов';
            this._initProperties();
            this._initInputs();
            this._chooseDocGroup();
        }
    }

    public hideModal() {
        this._bsModalRef.hide();
    }

    public save() {
        const changes = [];
        const args = {};
        const method = this.fromParent ? 'DocGroupCopyFromParent' : 'DocGroupPropCopy';

        let flagStr = '';
        this.properties_for_request.forEach((prop) => {
            flagStr += (this.form.controls[prop].value ? '1' : '0');
        });

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
                label: 'Перечень реквизитов РК, обязазательных для заполнения',
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
        this._waitClassif.openClassif({classif: CLASSIF_NAME, selectMulty: false}, true)
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
