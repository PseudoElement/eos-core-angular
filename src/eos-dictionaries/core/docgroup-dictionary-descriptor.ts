import { TreeDictionaryDescriptor } from 'eos-dictionaries/core/tree-dictionary-descriptor';
import { EosDictionaryNode } from './eos-dictionary-node';
import { EosUtils } from 'eos-common/core/utils';
import {ConfirmWindowService} from '../../eos-common/confirm-window/confirm-window.service';
import {CONFIRM_DOCGROUP_CHECK_DUPLINDEXES} from '../consts/confirm.consts';
import {PipRX} from '../../eos-rest';

const RC_TYPE = 'RC_TYPE';
const RC_TYPE_NODE = 'RC_TYPE_NODE';
const DOCGROUP_INDEX = 'DOCGROUP_INDEX';
const ISN_NODE = 'ISN_NODE';
const inheritFiields = [RC_TYPE, DOCGROUP_INDEX, 'ACCESS_MODE', 'ACCESS_MODE_FIXED', 'SHABLON', 'PRJ_SHABLON'];

export class DocgroupDictionaryDescriptor extends TreeDictionaryDescriptor {
    getNewRecord(preSetData: {}, parentNode: EosDictionaryNode): {} {
        const newPreset = {};
        EosUtils.deepUpdate(newPreset, preSetData);
        if (parentNode) {
            inheritFiields.forEach((f) => this._fillParentField(newPreset, parentNode.data, f));
            Object.assign(newPreset['rec'], {[RC_TYPE_NODE]: this._getRecField(newPreset, RC_TYPE)});
        }
        return super.getNewRecord(newPreset, parentNode);
    }

    getData(query?: any, order?: string, limit?: number): Promise<any[]> {
        return super.getData(query, order, limit)
            .then((data) => {
                data.forEach((d) => d[RC_TYPE_NODE] = d[RC_TYPE]);
                return data;
            });
    }

    confirmSave(nodeData: any, confirmSrv: ConfirmWindowService): Promise<boolean> {
        const index = this._getRecField(nodeData, DOCGROUP_INDEX);
        const isn_node = this._getRecField(nodeData, ISN_NODE);
        if (index) {
            return this.apiSrv.read({DOCGROUP_CL: PipRX.criteries({DOCGROUP_INDEX: index})})
                .then((records) => {
                    if (records.length) {
                        const fNode = records.find((r) => r[ISN_NODE] !== isn_node && r[DOCGROUP_INDEX] === index);
                        // const fNode = records.find((r) => r[ISN_NODE] === isn_node);
                        if (fNode) {
                            return this._confimDuplindex(index, confirmSrv);
                        }
                    }
                    return true;
                });
        }
        return Promise.resolve(true);
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
