import { TreeDictionaryDescriptor } from 'eos-dictionaries/core/tree-dictionary-descriptor';
import { EosDictionaryNode } from './eos-dictionary-node';
import { EosUtils } from 'eos-common/core/utils';

const RC_TYPE = 'RC_TYPE';
const RC_TYPE_NODE = 'RC_TYPE_NODE';
const inheritFiields = [RC_TYPE, 'DOCGROUP_INDEX', 'ACCESS_MODE', 'ACCESS_MODE_FIXED'];

export class DocgroupDictionaryDescriptor extends TreeDictionaryDescriptor {
    getNewRecord(preSetData: {}, parentNode: EosDictionaryNode): {} {
        const newPreset = {};
        EosUtils.deepUpdate(newPreset, preSetData);
        if (parentNode) {
            inheritFiields.forEach((f) => this._fillParentField(newPreset, parentNode, f));
            Object.assign(newPreset['rec'], {[RC_TYPE_NODE]: newPreset['rec'][RC_TYPE]});
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

    private _fillParentField(preset, parentNode, fieldName) {
        if (parentNode.data.rec[fieldName]) {
            Object.assign(preset['rec'], {[fieldName]: parentNode.data.rec[fieldName]});
        }
     }
}
