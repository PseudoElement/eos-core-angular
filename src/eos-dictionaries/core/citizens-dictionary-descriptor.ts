import { RecordDescriptor } from './record-descriptor';
// import { ALL_ROWS } from 'eos-rest/core/consts';
import { AbstractDictionaryDescriptor } from './abstract-dictionary-descriptor';
import { ITreeDictionaryDescriptor } from 'eos-dictionaries/interfaces';
import { EosDictionaryNode } from './eos-dictionary-node';
// interface search {
//     CITIZEN_SURNAME?: string;
//     CITIZEN_CITY?: string;
//     ZIPCODE?: string;
//     CITIZEN_ADDR?: string;
//     ISN_REGION?: string;
// }
export class CitizenDescriptor extends RecordDescriptor {
    dictionary: CitizensDictionaryDescriptor;
    fullSearchFields: any;
    constructor(dictionary: CitizensDictionaryDescriptor, descriptor: ITreeDictionaryDescriptor, ) {
        super(dictionary, descriptor);
        this.dictionary = dictionary;
        this._initFieldSets([
            'fullSearchFields',
        ], descriptor);
    }
}
export class CitizensDictionaryDescriptor extends AbstractDictionaryDescriptor {
    record: CitizenDescriptor;
    public addRecord(data: any, _useless: any, isProtected = false, isDeleted = false): Promise<any> {
        return Promise.resolve();
    }
    public hasCustomTree() {
        return false;
    }
    public hasTemplateTree() {
        return true;
    }
    public extendCritery(critery, { mode, deleted, onlyNew }, selectedNode) {
        if (onlyNew) {
            critery['NEW'] = '1';
        }
        return super.extendCritery(critery, { mode, deleted }, selectedNode);
    }

    public getRoot() {
        return Promise.resolve([]);
        // return this.getData({  вернуть после перевода на нормальную пагинацию
        //     CITIZEN: ALL_ROWS
        // });
    }
    public updateRecord(originalData, updates, appendToChanges): Promise<any> {
        return super.updateRecord(originalData, updates, appendToChanges);
    }
    public getTemplateTree(data): Promise<any> {
        return Promise.resolve([]);
    }
    public getChildren(): Promise<any[]> {
        return Promise.resolve([]);
        //  return this.getData();  вернуть после перевода на нормальную пагинацию пагинации
    }

    public getSubtree(): Promise<any[]> {
        return Promise.resolve([]);
    }
    public onPreparePrintInfo(): Promise<any> {
        return Promise.reject('Type of dictionary not true!');
    }
    public cutNode(node?: EosDictionaryNode): void {
        console.log(this);
    }
    // public combine(slicedNodes: EosDictionaryNode[], markedNodes: EosDictionaryNode[]): Promise<any> { // перенос в abstra
    //     const preSave = [];
    //     let paramsSop = '';
    //     let change: Array<any> = [{
    //         method: 'MERGE',
    //         requestUri: `CITIZEN(${markedNodes[0].id})`,
    //         data: {
    //             DELETED: 0
    //         }
    //     }];
    //     slicedNodes.forEach((node, i) => {
    //         preSave.push({
    //             method: 'DELETE',
    //             requestUri: `CITIZEN(${node.id})`
    //         });
    //         i !== slicedNodes.length - 1 ? paramsSop += `${node.id},` : paramsSop += `${node.id}`;
    //     });
    //     PipRX.invokeSop(change, 'ClassifJoin_TRule', { 'pk': markedNodes[0].id, 'type': 'CITIZEN', 'ids': paramsSop }, 'POST', false);
    //     change = change.concat(preSave);
    //     return this.apiSrv.batch(change, '');
    // }
    public search(criteries: any[]): Promise<any[]> {
        const crit = criteries[0];
        if (crit.ISN_REGION) {
            crit.ISN_REGION = crit.ISN_REGION.replace(/"/g, '');
        }
        return super.search(criteries);
    }
    public getConfigOpenGopRc(flag: boolean, node: EosDictionaryNode, nodeId: string, paramsMode) {
        const config = {
            classif: 'gop_rc',
            id: 'CITIZEN_dict',
        };
        if (flag) {
            config['user_id'] = -1;
        } else {
            config['user_id'] = node.id;
            if (!paramsMode) {
                config['editMode'] = true;
            }
        }
        return config;
    }
    public getFullSearchCriteries(data) {
        return super.getFullSearchCriteries(data);
    }
    public updateUncheckCitizen(nodes: EosDictionaryNode[]): Promise<any> {
        const change = [];
        nodes.forEach(node => {
            if (node.data.rec.NEW === 1) {
                change.push({
                    method: 'MERGE',
                    requestUri: `CITIZEN(${node.id})`,
                    data: {
                        NEW: 0
                    }
                });
            }
        });
        if (change.length) {
            return this.apiSrv.batch(change, '');
        }
        return Promise.resolve();
    }
    protected _initRecord(data: ITreeDictionaryDescriptor) {
        this.record = new CitizenDescriptor(this, data);
    }
}
