import { TreeDictionaryDescriptor } from 'eos-dictionaries/core/tree-dictionary-descriptor';
import { EosDictionaryNode } from './eos-dictionary-node';
import { EosUtils } from 'eos-common/core/utils';

const RC_TYPE = 'RC_TYPE';
const RC_TYPE_NODE = 'RC_TYPE_NODE';

export class DocgroupDictionaryDescriptor extends TreeDictionaryDescriptor {
    getNewRecord(preSetData: {}, parentNode: EosDictionaryNode): {} {
        const newPreset = {};
        EosUtils.deepUpdate(newPreset, preSetData);
        if (parentNode && parentNode.data.rec[RC_TYPE]) {
            Object.assign(newPreset['rec'],
                {[RC_TYPE]: parentNode.data.rec[RC_TYPE],
                [RC_TYPE_NODE]: parentNode.data.rec[RC_TYPE]});
        }
        return super.getNewRecord(newPreset, parentNode);
    }

    getData(query?: any, order?: string, limit?: number): Promise<any[]> {
        return super.getData(query, order, limit)
            .then((data) => {
                data.forEach(d => {
                    d['RC_TYPE_NODE'] = d['RC_TYPE'];
                });
                return data;
            });
    }
}
