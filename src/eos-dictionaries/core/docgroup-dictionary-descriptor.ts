import { TreeDictionaryDescriptor } from 'eos-dictionaries/core/tree-dictionary-descriptor';
import { EosDictionaryNode } from './eos-dictionary-node';
import { EosUtils } from 'eos-common/core/utils';
import {ConfirmWindowService} from '../../eos-common/confirm-window/confirm-window.service';
import {CONFIRM_DOCGROUP_CHECK_DUPLINDEXES} from '../consts/confirm.consts';
import { AdvCardRKDataCtrl } from 'eos-dictionaries/adv-card/adv-card-rk-datactrl';
import { Injector } from '@angular/core';
import { CONFIRM_DG_FIXE, BUTTON_RESULT_YES } from 'app/consts/confirms.const';
import { EosMessageService } from 'eos-common/services/eos-message.service';
import { IDictionaryDescriptor } from 'eos-dictionaries/interfaces';
import { PipRX } from 'eos-rest';

const RC_TYPE = 'RC_TYPE';
const DOCGROUP_INDEX = 'DOCGROUP_INDEX';
// const ISN_NODE = 'ISN_NODE';
const inheritFiields = [
    'PRJ_NUM_FLAG',
    'EDS_FLAG', // ЭП
    'ENCRYPT_FLAG', // Шифрование
    'IS_COPYCOUNT', // Нумерация копий
    'E_DOCUMENT', // Оригинал в эл. виде
    'PRJ_SHABLON', // Шаблон проекта
    'PRJ_NUM_FLAG', // Проекты документов (для исходящих)
    RC_TYPE, DOCGROUP_INDEX, 'ACCESS_MODE', 'ACCESS_MODE_FIXED', 'SHABLON', ];

export class DocgroupDictionaryDescriptor extends TreeDictionaryDescriptor {



    constructor(
        descriptor: IDictionaryDescriptor,
        apiSrv: PipRX,
        private _injector: Injector
    ) {
        super (descriptor, apiSrv);
    }

    getNewRecord(preSetData: {}, parentNode: EosDictionaryNode): {} {
        const newPreset = {};
        EosUtils.deepUpdate(newPreset, preSetData);
        if (parentNode) {
            inheritFiields.forEach((f) => this._fillParentField(newPreset, parentNode.data, f));
        }
        return super.getNewRecord(newPreset, parentNode);
    }

    getData(query?: any, order?: string, limit?: number): Promise<any[]> {
        return super.getData(query, order, limit)
            .then((data) => {
                return data;
            });
    }



    confirmSave(nodeData: any, confirmSrv: ConfirmWindowService, isNewRecord: boolean): Promise<boolean> {
        let result = Promise.resolve(true);

        const index = this._getRecField(nodeData, DOCGROUP_INDEX);
        const due = this._getRecField(nodeData, 'DUE');
        if (index) {
            result = result.then( () => {
                return this._checkIndexDublicates(due, index).then ( res => {
                    if (res === 'NOT_UNIQUE') {
                        return this._confimDuplindex(index, confirmSrv);
                    }
                    return true;
                });
            });
        }

        if (!isNewRecord) {
            result = result.then( () => {
                const ctrl = new AdvCardRKDataCtrl(this._injector);
                return ctrl.doCorrectsRKToDG(nodeData).then(changes => {
                    if (!EosUtils.isObjEmpty(changes.fixE)) {
                        return confirmSrv.confirm2(CONFIRM_DG_FIXE)
                        .then((button) => {
                            if (button && button.result === BUTTON_RESULT_YES) {
                                nodeData['_appendChanges'] = changes.fixE;
                                return changes.fixE;
                            } else {
                                return false;
                            }
                        });
                    }
                    return Promise.resolve(true);
                }).catch(err => {
                    const _msgSrv = this._injector.get(EosMessageService);
                    _msgSrv.addNewMessage({msg: err.message, type: 'danger', title: 'Ошибка РК'});
                });
            });
        }

        return result;
    }

    private _checkIndexDublicates(due, index): Promise<any> {
        // return canChangeClassifRequest('DOCGROUP_CL', 'DOCGROUP_INDEX_UNIQUE', { id: String(due), data: String(index) });
        const query = { args: { type: 'DOCGROUP_CL', oper: 'DOCGROUP_INDEX_UNIQUE', id: String(due), data: String(index) } };
        const req = { CanChangeClassif: query};
        return this.apiSrv.read(req);
    }

    private _confimDuplindex(index: string, confirmSrv: ConfirmWindowService): Promise<boolean> {
        const confirmParams = Object.assign({}, CONFIRM_DOCGROUP_CHECK_DUPLINDEXES);
        confirmParams.body = confirmParams.body.replace('{{index}}', index);
        return confirmSrv.confirm(confirmParams)
            .then((doSave) => {
                return doSave;
            });
    }

    private _fillParentField(preset: any, parentData: any, fieldName: string) {
        if (this._getRecField(parentData, fieldName)) {
            Object.assign(preset['rec'], {[fieldName]: this._getRecField(parentData, fieldName)});
        }
    }

    private _getRecField(data: any, fieldName: string): any {
        return data['rec'] ? data['rec'][fieldName] : null;
     }

}
