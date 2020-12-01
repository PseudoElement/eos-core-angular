import { RecordDescriptor } from './record-descriptor';
// import { ALL_ROWS } from 'eos-rest/core/consts';
import { AbstractDictionaryDescriptor } from './abstract-dictionary-descriptor';
import { ITreeDictionaryDescriptor } from 'eos-dictionaries/interfaces';
import { EosDictionaryNode } from './eos-dictionary-node';
import { ALL_ROWS } from 'eos-rest/core/consts';
import { AR_DESCRIPT } from 'eos-rest';
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
    constructor(dictionary: CitizensDictionaryDescriptor, descriptor: ITreeDictionaryDescriptor) {
        super(dictionary, descriptor);
        this.dictionary = dictionary;
        this._initFieldSets([
            'fullSearchFields',
        ], descriptor);
    }
}
export class CitizensDictionaryDescriptor extends AbstractDictionaryDescriptor {
    record: CitizenDescriptor;
    dopRec: AR_DESCRIPT[] = [];
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
        if (!this.dopRec.length) {
            return this.ar_Descript();
        } else {
            return Promise.resolve([]);
        }
        // return this.getData({
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
    public search(criteries: any[]): Promise<any[]> {
        const crit = criteries[0];
        if (crit.ISN_REGION) {
            crit.ISN_REGION = crit.ISN_REGION.replace(/"/g, '');
        }
        if (criteries[0].hasOwnProperty('DOP_REC')) {
            return this.searchDopRec(criteries);
        } else {
            return super.search(criteries);
        }
        //   return super.search(criteries);
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
        const filteredField = {};
        Object.keys(data).forEach(_key => {
            if (String([data[_key]]).trim().length) {
                filteredField[_key] = data[_key];
            }
        });
        return super.getFullSearchCriteries(filteredField);
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

    getData(query?: any, order?: string, limit?: number): Promise<any[]> {
        if (!query) {
            query = ALL_ROWS;
        }

        const req = { [this.apiInstance]: query };

        if (limit) {
            req.top = limit;
        }

        if (order) {
            req.orderby = order;
        }

        return this.apiSrv
            .read(req)
            .then((data: any[]) => {
                this.prepareForEdit(data);
                return data;
            });
    }
    ar_Descript(): Promise<any> {
        return this.apiSrv.read({
            AR_DESCRIPT: {
                criteries: {
                    OWNER: 'C',
                }
            }, expand: 'AR_VALUE_LIST_List'
        }).then((_descript: AR_DESCRIPT[]) => {
            this.dopRec = _descript;
            return Promise.resolve([]);
        });
    }
    searchDopRec(criteries: any[]): Promise<any> {
        const vaslues = JSON.parse(criteries[0].DOP_REC);
        const newCriteries = {};
        const critName = 'AR_CITIZEN_VALUE.' + vaslues.API_NAME;
        let values;
        switch (vaslues.type) {
            case 'text':
                values = `%${vaslues.SEARCH_VALUE}%`;
                break;
            case 'date':
                values = new Date(vaslues.SEARCH_VALUE).toLocaleDateString().replace(/[^0-9\.]/g, '').replace(/\./g, '/');
                break;
            default:
                values = `${vaslues.SEARCH_VALUE}`;
                break;
        }
        Object.assign(newCriteries, criteries[0], { [critName]: values });
        delete newCriteries['DOP_REC'];
        return this.apiSrv.read({
            CITIZEN: {
                criteries: newCriteries
            }
        }).then(_d => {
            return _d;
        });
    }
    protected _initRecord(data: ITreeDictionaryDescriptor) {
        this.record = new CitizenDescriptor(this, data);
    }
}
