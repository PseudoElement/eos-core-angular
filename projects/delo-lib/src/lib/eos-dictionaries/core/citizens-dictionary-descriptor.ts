import { RecordDescriptor } from './record-descriptor';
// import { ALL_ROWS } from 'eos-rest/core/consts';
import { AbstractDictionaryDescriptor } from './abstract-dictionary-descriptor';
import { IRecordModeDescription, ITreeDictionaryDescriptor } from '../../eos-dictionaries/interfaces';
import { EosDictionaryNode } from './eos-dictionary-node';
import { ALL_ROWS } from '../../eos-rest/core/consts';
import { AR_DESCRIPT, CITIZEN, REGION_CL } from '../../eos-rest';
import { creatorGraphQlParam } from '../services/creator-graphQl-param'
import { ResponseCitizens, ResponseProt } from '../interfaces/fetch.interface';
import { converterFetchRequest } from '../services/converter-fetch-request';

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
    modeList: IRecordModeDescription[];
    constructor(dictionary: CitizensDictionaryDescriptor, descriptor: ITreeDictionaryDescriptor) {
        super(dictionary, descriptor);
        this.dictionary = dictionary;
        this.modeList = descriptor.modeList;
        this._initFieldSets([
            'fullSearchFields',
        ], descriptor);
    }
}
export class CitizensDictionaryDescriptor extends AbstractDictionaryDescriptor {
    record: CitizenDescriptor;
    dopRec: AR_DESCRIPT[] = [];
    private createFetchParam = new creatorGraphQlParam();
    private converter = new converterFetchRequest();

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
        if (crit['common'].ISN_REGION) {
            crit['common'].ISN_REGION = crit['common'].ISN_REGION.replace(/"/g, '');
        }
        if (crit['common']['NEW']) {
            crit['common']['NEW'] = 1;
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
            from_classif: true,
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
        if(data.srchMode === 'common'){
            const newData = JSON.parse(JSON.stringify(data));
            const filteredField = {};
            const searchDate = newData.common;
            Object.keys(searchDate).forEach(_key => {
                if (String([searchDate[_key]]).trim().length) {
                    filteredField[_key] = searchDate[_key];
                }
            });
            newData.common = super.getFullSearchCriteries(filteredField)
            return newData;
        } else {
            return data;
        }
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

    getData(data?: any, order?: string, limit?: number): Promise<any[]> {
        if(data && data.criteries) {
            if (data.criteries.srchMode === 'common') {
                return this.searchCommon(data, order, limit)
            } else if (data.criteries.srchMode === 'protocol'){
                return this.searchProtocol(data.criteries.protocol)
            }
        } else {
            return Promise.resolve([]);
        }
    }

    async searchCommon(data?: any, order?: string, limit?: number) {
        let query: any = {}
        query.criteries = data.criteries.common ? data.criteries.common : ALL_ROWS;
        const req = { [this.apiInstance]: query };
        limit ? req.top = limit : null;
        order ? req.orderby = order: null;
   
        const sitizenResponse: CITIZEN[] = await  this.apiSrv.read<CITIZEN>(req);
        const updateResponse = await this.updateResponse(sitizenResponse);
        return updateResponse;
    }
    
    async searchProtocol(data: any) {
        const protReq: string = this.createFetchParam.prot(data);
        const requestProt = await this.graphQl.query(protReq);
        if (requestProt.ok) {
            const prot: ResponseProt = await requestProt.json();
            if (prot.errors) {
                console.error('Error: ', prot.errors[0].message);
                return [];
            } else {
                if (prot.data.protsPg.items.length) {
                    const citizensReq = this.createFetchParam.citizens(prot.data.protsPg.items);
                    const requestCitizens = await this.graphQl.query(citizensReq);
                    const citizens: ResponseCitizens = await requestCitizens.json();
                    const convertSitizenResponse: CITIZEN[] =  this.converter.citizensReq(citizens.data.citizensPg.items);
                    const updateResponse: CITIZEN[] = await this.updateResponse(convertSitizenResponse);
                    return updateResponse;
                } else {
                    return [];
                }
            }
        } else {
            console.error('Error: status request: ', requestProt.status);
            return [];
        }
    }

    private async updateResponse(response: CITIZEN[]):Promise<CITIZEN[]> {
        const REG_DUE = response.filter(cit => cit.DUE_REGION).map(d => d.DUE_REGION);
        const regionResponse: REGION_CL[] = await this.queryForRegion(REG_DUE);
        this.prepareForEdit(response);
        this.updateData(response, regionResponse);
        return response;
    }

    updateData(citizen: CITIZEN[], regions: REGION_CL[]) {
        if (regions.length) {
            citizen.map(cit => {
                const findRegion = regions.find((region: REGION_CL) => region.DUE === cit.DUE_REGION);
                if (findRegion) {
                    cit['_region'] = findRegion;
                }
            });
        }
    }

    queryForRegion(ids: string[]): Promise<REGION_CL[]> {
        let ids_list = '';
        const arrayIdsList = [];
        const query_list = [];
        ids.forEach((elem) => {
            if(ids.length === 1){
                ids_list = elem;
            } else {
                ids_list += elem + '|';
                if (ids_list.length > 1500) { // заполняем запрос, небольшим количеством символов, если их больше то разделяем на несколько запросов
                    arrayIdsList.push(ids_list);
                    ids_list = '';
                }
            }
        });
        arrayIdsList.push(ids_list);
        arrayIdsList.forEach(l => {
            query_list.push(this.getRegionName(l));
        });
        return Promise.all(query_list).then(data => {
            const list_region = [];
            data.forEach((d: any[]) => list_region.push(...d));
            return list_region;
        });
    }

    getRegionName(region): Promise<any> {
        const queryRegion = {
            REGION_CL: {
                criteries: {
                    DUE: String(region)
                }
            }
        };
        return this.apiSrv.read(queryRegion)
            .then(result => {
                return result;
            });
    }

    ar_Descript(): Promise<any> {
        return this.apiSrv.read<AR_DESCRIPT>({
            AR_DESCRIPT: {
                criteries: {
                    OWNER: 'C',
                }
            },
            orderby: 'AR_CATEGORY.WEIGHT',
            expand: 'AR_VALUE_LIST_List',
            foredit: true,
            reload: true
        }).then((_descript: AR_DESCRIPT[]) => {
            this.dopRec = _descript;
            return this.dopRec;
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
