import { TreeDictionaryDescriptor } from 'eos-dictionaries/core/tree-dictionary-descriptor';
import { EosDictionaryNode } from './eos-dictionary-node';
import { EosUtils } from 'eos-common/core/utils';
import {ConfirmWindowService} from '../../eos-common/confirm-window/confirm-window.service';
import {CONFIRM_DOCGROUP_CHECK_DUPLINDEXES} from '../consts/confirm.consts';
import { AdvCardRKDataCtrl } from 'eos-dictionaries/adv-card/adv-card-rk-datactrl';
import { Injector } from '@angular/core';
import { CONFIRM_DG_FIXE, BUTTON_RESULT_YES, CONFIRM_DG_SHABLONRK, CONFIRM_DG_FIXE_V2 } from 'app/consts/confirms.const';
import { EosMessageService } from 'eos-common/services/eos-message.service';
import { IDictionaryDescriptor } from 'eos-dictionaries/interfaces';
import { PipRX } from 'eos-rest';
import { CB_FUNCTIONS, AppContext } from 'eos-rest/services/appContext.service';
import { DocgroupTemplateChecker } from 'eos-dictionaries/docgroup-template-config/docgroup-template-checker';
import { TDefaultField } from 'eos-dictionaries/adv-card/rk-default-values/rk-default-const';

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
    RC_TYPE,
    DOCGROUP_INDEX,
    'ACCESS_MODE',
    'ACCESS_MODE_FIXED',
    'SHABLON',
];

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
        const appctx = this._injector.get(AppContext);
        const isCBFunc = appctx.getParams(CB_FUNCTIONS) === 'YES';
        if (parentNode) {
            [
                ... inheritFiields,
                ... isCBFunc ? ['REG_DATE_PROTECTED'] : [], // 'Запрещено редактировать рег. дату'
            ]
            .forEach((f) => this.fillParentField(newPreset, parentNode.data, f));
            if (newPreset['rec']['IS_NODE'] === 1 && parentNode.data.rec['RC_TYPE'] === 0) {
                newPreset['rec']['RC_TYPE'] = 1;
            }
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
        const shablonIsCorrect = DocgroupTemplateChecker.shablonIsCorrect(nodeData.rec.SHABLON, nodeData.rec.RC_TYPE);
        if (!shablonIsCorrect) {
            return confirmSrv.confirm2(CONFIRM_DG_SHABLONRK)
                .then((button) => {
                        return false;
                });
        }

        let result = Promise.resolve(true);

        const index = this.getRecField(nodeData, DOCGROUP_INDEX);
        const due = this.getRecField(nodeData, 'DUE');
        if (index) {
            result = result.then( (r) => {
                return this._checkIndexDublicates(due, index).then ( res => {
                    if (res === 'NOT_UNIQUE') {
                        return this._confimDuplindex(index, confirmSrv);
                    }
                    return r;
                });
            });
        }

        if (!isNewRecord) {
            result = result.then( (r) => {
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
                    if (!EosUtils.isObjEmpty(changes.fixRCTYPE)) {
                        const warn = Object.assign( {}, CONFIRM_DG_FIXE_V2);
                        warn.bodyList = [];
                        changes.fixRCTYPE_d.forEach( (rec) => {
                            const title = (<TDefaultField>rec.descriptor).longTitle || (<TDefaultField>rec.descriptor).title;
                            if (title) {
                                warn.bodyList.push(title);
                            }
                        });
                        return confirmSrv.confirm2(warn)
                        .then((button) => {
                            if (button && button.result === BUTTON_RESULT_YES) {
                                nodeData['_appendChanges'] = changes.fixRCTYPE;
                                return changes.fixRCTYPE;
                            } else {
                                return false;
                            }
                        });
                    }
                    return Promise.resolve(r);
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
        const query = { args: { type: 'DOCGROUP_CL', oper: 'DOCGROUP_INDEX_UNIQUE', data: String(index) } };
        if (due) {
            query.args['id'] = String(due);
        }
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

}
