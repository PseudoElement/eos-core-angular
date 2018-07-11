import { TreeDictionaryDescriptor } from 'eos-dictionaries/core/tree-dictionary-descriptor';
import { DOCGROUP_CL } from 'eos-rest';

export class DocgroupDictionaryDescriptor extends TreeDictionaryDescriptor {
    getRelated(rec: DOCGROUP_CL): Promise<any> {
        const reqs = [];
        return Promise.all(reqs);
    }
}
