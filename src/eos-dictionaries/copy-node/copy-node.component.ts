import {Component, Input} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {BsModalRef} from 'ngx-bootstrap';
import {InputControlService} from '../../eos-common/services/input-control.service';
import {NumberIncrementInput} from '../../eos-common/core/inputs/number-increment-input';
import {RadioInput} from '../../eos-common/core/inputs/radio-input';
import {EosDictionaryNode} from '../core/eos-dictionary-node';
import {SUCCESS_SAVE} from '../consts/messages.consts';
import {EosMessageService} from '../../eos-common/services/eos-message.service';
import {EosDictService} from '../services/eos-dict.service';
import {PipRX} from '../../eos-rest';

@Component({
    selector: 'eos-update-properties',
    templateUrl: 'copy-node.component.html',
})

export class CopyNodeComponent {
    @Input() form: FormGroup;

    inputs: any = {};
    title: string;

    properties;
    private _nodes: EosDictionaryNode[];

    constructor(
        private _bsModalRef: BsModalRef,
        private _msgSrv: EosMessageService,
        private _dictSrv: EosDictService,
        private _apiSrv: PipRX,
        private _inputCtrlSrv: InputControlService) {
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
                END_YEAR: node.data['END_YEAR'],
                ARTICLE: node.data['ARTICLE'],
                CLOSED: node.data['CLOSED'],
                SECURITY: node.data['SECURITY'],
                ARCH_FLAG: node.data['ARCH_FLAG'],
                E_DOCUMENT: node.data['E_DOCUMENT'],
                PROTECTED: 0,
                DELETED: 0,
                IS_FINAL: 0,
                STATUS: '',
            };

            if (!this.form.controls['С_YEAR'].value) {
                _newRec.YEAR_NUMBER = this.form.controls['YEAR'].value;
            }

            if (!this.form.controls['С_ONE_YEAR'].value) {
                _newRec.END_YEAR = _newRec.YEAR_NUMBER;
            }

            if (!this.form.controls['С_CLOSED'].value) {
                _newRec.CLOSED = 1;
            }

            if (this.form.controls['С_INDEX'].value) {
                _newRec.NOM_NUMBER = currentRec['NOM_NUMBER'];
            }

            if (!this.form.controls['С_NOTE'].value) {
                _newRec.NOTE = null;
            }
            if (!this.form.controls['С_SECRET'].value) {
                _newRec.SECURITY = null;
            }
            if (!this.form.controls['С_ARCHIVE'].value) {
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
                key: 'С_ONE_YEAR',
                label: 'Текущие/Переходящие',
                opt_label: 'Текущие',
            }, {
                key: 'С_CLOSED',
                label: 'Открытые/Закрытые',
                opt_label: 'Закрытые',
            }, {
                key: 'С_INDEX',
                label: 'Индекс',
                value: 1,
                opt_label: 'Только индекс подразделения',
            }, {
                key: 'С_NOTE',
                label: 'Примечание',
                opt_label: 'Пусто',
            }, {
                key: 'С_SECRET',
                label: 'Гриф',
                opt_label: 'Пусто',
            }, {
                key: 'С_ARCHIVE',
                label: 'Сдача в архив',
                opt_label: 'Подлежит сдаче в архив',
            },
        ];
    }

    private _initInputs() {
        this.inputs['YEAR'] = new NumberIncrementInput({
            key: 'YEAR',
            forNode: true,
            value: (new Date).getFullYear(),
        });

        this.inputs['С_YEAR'] = new RadioInput({
            key: 'С_YEAR',
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
    }
}
