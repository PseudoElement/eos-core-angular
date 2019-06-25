import {Component, Input, OnDestroy} from '@angular/core';
import {AbstractControl, FormGroup, ValidatorFn} from '@angular/forms';
import {BsModalRef} from 'ngx-bootstrap';
import {InputControlService} from '../../eos-common/services/input-control.service';
import {NumberIncrementInput} from '../../eos-common/core/inputs/number-increment-input';
import {RadioInput} from '../../eos-common/core/inputs/radio-input';
import {EosDictionaryNode} from '../core/eos-dictionary-node';
import {SUCCESS_SAVE} from '../consts/messages.consts';
import {EosMessageService} from '../../eos-common/services/eos-message.service';
import {EosDictService} from '../services/eos-dict.service';
import {PipRX} from '../../eos-rest';
import {YEAR_PATTERN} from '../../eos-common/consts/common.consts';
import {Subscription} from 'rxjs';

@Component({
    selector: 'eos-update-properties',
    templateUrl: 'copy-node.component.html',
})

export class CopyNodeComponent implements OnDestroy {
    @Input() form: FormGroup;

    inputs: any = {};
    title: string;
    isYearValid = true;

    properties;
    private _nodes: EosDictionaryNode[];
    private _prev = {};
    private formChanges$: Subscription;

    constructor(
        private _bsModalRef: BsModalRef,
        private _msgSrv: EosMessageService,
        private _dictSrv: EosDictService,
        private _apiSrv: PipRX,
        private _inputCtrlSrv: InputControlService) {
    }

    ngOnDestroy(): void {
        this._unsubscribe();
    }

    public init(nodes: EosDictionaryNode[]) {
        this._nodes = nodes;
        this.title = 'Задайте параметры создания новых дел';
        this._initProperties();
        this._initInputs();
    }

    public hideModal() {
        this._bsModalRef.hide();
    }

    public save() {
        const descr = this._dictSrv.currentDictionary.descriptor;
        const rec = descr.getNewRecord({})['rec'];
        const recs = [];
        this._nodes.forEach((node) => {
            const currentRec = node.data.rec;

            const _newRec = {
                DUE: rec['DUE'],
                ISN_LCLASSIF: this._apiSrv.sequenceMap.GetTempISN(),
                CLASSIF_NAME: currentRec['CLASSIF_NAME'],
                NOTE: currentRec['NOTE'],
                YEAR_NUMBER: currentRec['YEAR_NUMBER'],
                NOM_NUMBER: rec['NOM_NUMBER'],
                SHELF_LIFE: currentRec['SHELF_LIFE'],
                END_YEAR: currentRec['END_YEAR'],
                ARTICLE: currentRec['ARTICLE'],
                CLOSED: currentRec['CLOSED'],
                SECURITY: currentRec['SECURITY'],
                ARCH_FLAG: currentRec['ARCH_FLAG'],
                E_DOCUMENT: currentRec['E_DOCUMENT'],
                PROTECTED: 0,
                DELETED: 0,
                IS_FINAL: 0,
                STATUS: '',
            };

            console.log(_newRec);
            if (!this.form.controls['C_YEAR'].value) {
                _newRec.YEAR_NUMBER = this.form.controls['YEAR'].value;
            }

            if (!this.form.controls['C_ONE_YEAR'].value) {
                _newRec.END_YEAR = _newRec.YEAR_NUMBER;
            }

            if (!this.form.controls['C_CLOSED'].value) {
                _newRec.CLOSED = 1;
            }

            if (this.form.controls['C_INDEX'].value) {
                _newRec.NOM_NUMBER = currentRec['NOM_NUMBER'];
            }

            if (!this.form.controls['C_NOTE'].value) {
                _newRec.NOTE = null;
            }
            if (!this.form.controls['C_SECRET'].value) {
                _newRec.SECURITY = null;
            }
            if (!this.form.controls['C_ARCHIVE'].value) {
                _newRec.ARCH_FLAG = 1;
            }

            recs.push(this._apiSrv.entityHelper.prepareAdded<any>(_newRec, descr.apiInstance));
        });

        this._apiSrv.batch(this._apiSrv.changeList(recs), '')
            .then(() => {
                this._dictSrv.selectCustomTreeNode()
                    .then(() => this._msgSrv.addNewMessage(SUCCESS_SAVE));
                this.hideModal();
            })
            .catch((err) => {
                const errMessage = err.message ? err.message : err;
                this._msgSrv.addNewMessage({
                    type: 'danger',
                    title: 'Ошибка обработки. Ответ сервера:',
                    msg: errMessage
                });
                this.hideModal();
            });
    }

    private _initProperties() {
        this.properties = [
            {
                key: 'C_ONE_YEAR',
                label: 'Текущие/Переходящие',
                opt_label: 'Текущие',
            }, {
                key: 'C_CLOSED',
                label: 'Открытые/Закрытые',
                opt_label: 'Закрытые',
            }, {
                key: 'C_INDEX',
                label: 'Индекс',
                value: 1,
                opt_label: 'Только индекс подразделения',
            }, {
                key: 'C_NOTE',
                label: 'Примечание',
                opt_label: 'Пусто',
            }, {
                key: 'C_SECRET',
                label: 'Гриф',
                opt_label: 'Пусто',
            }, {
                key: 'C_ARCHIVE',
                label: 'Сдача в архив',
                opt_label: 'Подлежит сдаче в архив',
            },
        ];
    }

    private _initInputs() {
        this._prev['C_YEAR'] = 0;
        this._prev['YEAR'] = (new Date).getFullYear();

        this.inputs['YEAR'] = new NumberIncrementInput({
            key: 'YEAR',
            forNode: true,
            type: 'numberIncrement',
            pattern: YEAR_PATTERN,
            value: (new Date).getFullYear(),
        });

        this.inputs['C_YEAR'] = new RadioInput({
            key: 'C_YEAR',
            label: 'Год ввода в действие',
            value: 0,
            options: [
                {
                    title: 'как в исходных',
                    value: 1,
                }, {
                    title: 'За ',
                    value: 0,
                },
            ]
        });

        this.properties.forEach((prop) => {
            this.inputs[prop.key] = new RadioInput({
                key: prop.key,
                label: prop.label,
                value: prop.value || 0,
                options: [
                    {
                        title: 'как в исходных',
                        value: 1,
                    }, {
                        title: prop.opt_label,
                        value: 0,
                    },
                ]
            });
        });

        this.form = this._inputCtrlSrv.toFormGroup(this.inputs, true);
        this.form.controls['YEAR'].setValidators(this._yearValidator());
        this.formChanges$ = this.form.valueChanges.subscribe((formChanges) => this._valueChanges(formChanges));
    }

    private _valueChanges(fc: any) {
        this._unsubscribe();

        const yearCtrl = this.form.controls['YEAR'];

        if (this._prev['YEAR'] !== fc['YEAR']) {
            this.form.controls['C_YEAR'].setValue(0);
            fc['C_YEAR'] = 0;
        }
        if (this._prev['C_YEAR'] !== fc['C_YEAR']) {
            if (fc['C_YEAR']) {
                yearCtrl.clearValidators();
            } else {
                yearCtrl.setValidators(this._yearValidator());
            }
        }

        Object.assign(this._prev, fc);
        yearCtrl.updateValueAndValidity();
        this.isYearValid = this.form.controls['YEAR'].valid || fc['C_YEAR'];
        this.formChanges$ = this.form.valueChanges.subscribe((formChanges) => this._valueChanges(formChanges));
    }

    private _yearValidator(): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } => {
            let error = null;
            if (!control.value) {
                error = 'Задайте год';
            } else {
                if (control.value < 1900 || control.value > 2100) {
                    error = 'Год задан неверно';
                }
            }
            return error ? {valueError: error} : null;
        };
    }

    private _unsubscribe() {
        this.formChanges$.unsubscribe();
    }
}
