import { IRecordModeDescription, IRecordOperationResult, ITreeDictionaryDescriptor } from '../../eos-dictionaries/interfaces';
import { RestError } from '../../eos-rest/core/rest-error';
import { CONTACT, ORGANIZ_CL, SEV_ASSOCIATION, ADDR_CATEGORY_CL, MEDO_PARTICIPANT } from '../../eos-rest';
import { SevIndexHelper } from '../../eos-rest/services/sevIndex-helper';
import { PipRX } from '../../eos-rest/services/pipRX.service';
import { TreeDictionaryDescriptor, TreeRecordDescriptor } from './tree-dictionary-descriptor';
import { ALL_ROWS } from '../../eos-rest/core/consts';
import { EosDictionaryNode } from './eos-dictionary-node';
import { EosUtils } from '../../eos-common/core/utils';
import { DepartmentDictionaryDescriptor } from './department-dictionary-descriptor';
import { FieldDescriptor } from './field-descriptor';
import { ModeFieldSet } from './record-mode';
import { SearchQueryOrganization } from '../interfaces/fetch.interface';
import { OrganizAdvancedSearch } from '../services/creator-graphQl-param/advanced-search/organiz-advanced-search';
import { ProtAdvancedSearch } from '../services/creator-graphQl-param/advanced-search/prot-advanced-search';
import { OrganizConverterFetchRequest } from '../services/converter-fetch-request/organiz-converter';
import { E_DICTIONARY_ID } from '../../eos-dictionaries/consts/dictionaries/enum/dictionaryId.enum';
import { PROTOCOL_ID } from '../../eos-dictionaries/consts/protocolId.const';

const inheritFiields = [
    'ISN_ADDR_CATEGORY',
];

class OrganizRecord extends TreeRecordDescriptor {
    dictionary: DepartmentDictionaryDescriptor;
    parentField: FieldDescriptor;
    modeField: FieldDescriptor;
    modeList: IRecordModeDescription[];
    fullSearchFields: ModeFieldSet | any;
    constructor(dictionary: OrganizationDictionaryDescriptor, descriptor: ITreeDictionaryDescriptor) {
        super(dictionary, descriptor);
        this.modeList = descriptor.modeList;
        this._initModeSets(['fullSearchFields'], descriptor);
    }
    private _initModeSets(setNames: string[], descriptor: ITreeDictionaryDescriptor) {
        setNames.forEach((setName) => {
            if (!this[setName]) {
                this[setName] = new ModeFieldSet(this, descriptor[setName]);
            }
        });
    }
}

export class OrganizationDictionaryDescriptor extends TreeDictionaryDescriptor {
    sevOrg: SEV_ASSOCIATION[];
    totalRecords: number;
    dopRec = [];
    modeList: IRecordModeDescription[];
    private organizParam = new OrganizAdvancedSearch();
    private protParam = new ProtAdvancedSearch();
    private converter = new OrganizConverterFetchRequest();
    public protNameParam: string = this.protNamenCreatorParam(PROTOCOL_ID[this.record.dictionary.id]);
    
    public getFullSearchCriteries(data: any) {
        const srchMode = data['srchMode'];
        const criteries = super.getFullSearchCriteries(data[srchMode]);
        const queries = { contact: null, medo: null, organiz: null, branch: null, protocol: null };
        if (srchMode === 'medo') {
            if (criteries.hasOwnProperty('CONTACT.MEDO_ID')) {
                queries.contact = {
                    'CONTACT.MEDO_ID': criteries['CONTACT.MEDO_ID'],
                    'CONTACT.ORDERNUM': 0
                };
            }
            if (criteries.hasOwnProperty('GATE') || criteries.hasOwnProperty('GATE_ID')) {
                queries.medo = {};
                if (criteries.hasOwnProperty('GATE')) {
                    queries.medo.GATE = criteries['GATE'];
                }
                if (criteries.hasOwnProperty('GATE_ID')) {
                    queries.medo.GATE_ID = criteries['GATE_ID'];
                }
            }
            if (criteries.hasOwnProperty('CONTACT.MEDO_GLOBAL_ID')) {
                if (!queries.contact) {
                    queries.contact = {
                        'CONTACT.MEDO_GLOBAL_ID': criteries['CONTACT.MEDO_GLOBAL_ID'],
                        'CONTACT.ORDERNUM': 0
                    };
                } else {
                    queries.contact['CONTACT.MEDO_GLOBAL_ID'] = criteries['CONTACT.MEDO_GLOBAL_ID'];
                }
            }
        } else if (srchMode === 'protocol') {
            queries.protocol = criteries;
        } else {
            if (criteries.hasOwnProperty('EMAIL')) {
                const email = criteries.EMAIL;
                delete criteries.EMAIL;
                criteries['CONTACT.E_MAIL'] = email;
            }
            queries.organiz = criteries;
        }
        return queries;
    }

    public getNewRecord(preSetData: {}, parentNode: EosDictionaryNode): {} {
        const newPreset = {};
        EosUtils.deepUpdate(newPreset, preSetData);
        if (parentNode) {
            [
                ...inheritFiields,
            ]
                .forEach((f) => this.fillParentField(newPreset, parentNode.data, f));
        }
        return super.getNewRecord(newPreset, parentNode);
    }
    public async updatSev(str: string): Promise<any> {
        this.sevOrg = await this.apiSrv.read<any>({SEV_ASSOCIATION: PipRX.criteries({ 'OBJECT_NAME': str })});
        return this.sevOrg;
    }
    public async getRoot(): Promise<any[]> {
        await this.updatSev('ORGANIZ_CL');
        return this.getData({ criteries: { IS_NODE: '0', DUE: '0%', LAYER: '0:2' } }, 'WEIGHT');
    }

    public search(criteries: any[], order?: string, limit?: number, skip?: number): Promise<any> {
        const query = [];
        const queries = criteries[0];
        if (queries.medo || queries.contact) {
            query.push(this.searchMedo(queries, {top: limit, orderby: order, skip: skip}, criteries['DELETED']));
        }
        if (queries.protocol) {
            query.push(this.searchProto(queries, {top: limit, orderby: order, skip: skip}, criteries['DELETED']));
        }
        if (queries.organiz) {
            const extQuery = this.getCriteriesBranch(queries);
            if (extQuery) {
                Object.assign(queries.organiz, extQuery);
            }
            if (!criteries['DELETED']) {
                queries.organiz['DELETED'] = 0;
            } else {
                delete queries.organiz['DELETED'];
            }
            if (queries.organiz.hasOwnProperty('DOP_REC')) {
                query.push(this.searchDopRec([queries.organiz], {top: limit, orderby: order, skip: skip}));
            } else {
                query.push(this.searchAbs(queries.organiz, order, limit, skip));
            }
        }
        if (query.length === 0) {
            if (!queries['DELETED']) {
                criteries['DELETED'] = 0;
            }
            let q = criteries;
            if (criteries[0]) {
                q = queries;
            }
            query.push(this.searchAbs(q, order, limit, skip));
        }
        return Promise.all(query)
        .then((ans) => {
            if (ans[0]) {
                const answer = ans[0];
                this.totalRecords = answer['TotalRecords'];
                answer['TotalRecords'] = answer['TotalRecords'];
                return answer;
            } else {
                return [];
            }
        });
        // для быстрого поиска
    }
    public searchAbs(criteries: any, order?: string, limit?: number, skip?: number): Promise<any[]> {
        const _search = this.getData(PipRX.criteries(criteries), order, limit, skip);
        return Promise.all([_search])
        .then((results) => {
            return results[0];
        });
    }
    public getCriteriesBranch(criteries: any): any {
        const obj = {};
        if (criteries.hasOwnProperty('DUE') || criteries.hasOwnProperty('LAYER') || criteries.hasOwnProperty('ISN_HIGH_NODE')) {
            if (criteries.hasOwnProperty('DUE')) {
                obj['DUE'] = criteries['DUE'];
            }
            if (criteries.hasOwnProperty('LAYER')) {
                obj['LAYER'] = criteries['LAYER'];
            }
            if (criteries.hasOwnProperty('ISN_HIGH_NODE')) {
                obj['ISN_HIGH_NODE'] = criteries['ISN_HIGH_NODE'];
            }
            return obj;
        }
        return null;
    }

    public searchMedo(queries: { medo: any, contact: any }, {top, skip, orderby}, flagDeleted): Promise<any> {
        let queryMedo = null;
        let queryContact = null;
        let flagmedo = false;
        let flagorganiz = false;
        if (queries.medo) {
            flagmedo = true;
            queryMedo = this.apiSrv.read({
                MEDO_PARTICIPANT: {
                    criteries: queries.medo
                }
            });
        } else {
            queryMedo = Promise.resolve(null);
        }

        if (queries.contact) {
            const extQuery = this.getCriteriesBranch(queries);
            if (extQuery) {
                Object.assign(queries.contact, extQuery);
            }
            const q = {
                ORGANIZ_CL: {
                    criteries: queries.contact
                },
                top: top,
                skip: skip,
                orderby: orderby,
            }
            if (!flagDeleted) {
                q['ORGANIZ_CL']['criteries']['DELETED'] = 0;
            } else {
                delete q['ORGANIZ_CL']['criteries']['DELETED'];
            }
            flagorganiz = true;
            queryContact = this.apiSrv.read(q);
        } else {
            queryContact = Promise.resolve(null);
        }

        return Promise.all([queryMedo, queryContact]).then((data: [MEDO_PARTICIPANT[], ORGANIZ_CL[]]) => {
            if (flagmedo && flagorganiz) {
                const ids = [];
                data[0].forEach(value => {
                    data[1].forEach(val => {
                        if (+value.ISN_ORGANIZ === +val.ISN_NODE) {
                            ids.push(val);
                        }
                    });
                });
                return ids;
            }
            if (!flagmedo && flagorganiz) {
                return data[1];
            }
            if (flagmedo && !flagorganiz) {
                const ids = [];
                data[0].forEach(value => {
                    ids.push(value.ISN_ORGANIZ);
                });
                if (ids.length) {
                    return this.apiSrv.read({
                        ORGANIZ_CL: {
                            criteries: {
                                ISN_NODE: ids.join('|')
                            }
                        }
                    });
                }
                return [];

            }
            return [];
        });
    }

    public searchDopRec(criteries: any[], {top, orderby, skip}): Promise<any> {
        const vaslues = JSON.parse(criteries[0].DOP_REC);
        const newCriteries = {};
        const critName = 'AR_ORGANIZ_VALUE.' + vaslues.API_NAME;
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
            ORGANIZ_CL: {
                criteries: newCriteries
            },
            op: top,
            skip: skip,
            orderby: orderby,
        }).then(_d => {
            return _d;
        });
    }
    public async searchProto(queries: SearchQueryOrganization, {top, skip, orderby}, flagDeleted) {
        const protReq: string = this.protParam.prot(queries.protocol, E_DICTIONARY_ID.ORGANIZ);
        const requestProt = await this.graphQl.query(protReq);
        const protItem = requestProt.data.protsPg ? requestProt.data.protsPg.items : [];
        if (protItem.length) {
            const organizReq = this.organizParam.organiz(protItem, queries, top, skip, orderby, flagDeleted);
            const requestOrganiz = await this.graphQl.query(organizReq);
            const requestTotal = requestOrganiz?.data?.organizClsPg?.totalCount || 0;
            const organiz = requestOrganiz.data.organizClsPg ? requestOrganiz.data.organizClsPg.items : [];
            if (organiz.length) {
                const ans = this.converter.organizReq(organiz);
                ans['TotalRecords'] = requestTotal;
                return ans;
            } else {
                return [];
            }
        } else {
            return [];
        }
    }

    async getData(query?: any, order?: string, limit?: number, skip?: number): Promise<any[]> {
        if (!this.dopRec.length) {
            await this.ar_Descript();
        }
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
        if (skip) {
            req.skip = skip;
        }
        // if (this.id === 'organization') {
        // req.expand = 'CONTACT_List';
        // }

        return this.apiSrv.read(req)
        .then((Organiz) => {
            const organiz: ORGANIZ_CL[] = this.prepareForEdit(Organiz);
            this.totalRecords = Organiz['TotalRecords'];
            organiz['TotalRecords'] = Organiz['TotalRecords'];
            return organiz;
        })
        
        // const extendsOrganiz: ORGANIZ_EXTENDS[] = await this.extendsData(organiz);
        // return extendsOrganiz;
    }
    async getChildren(query: ORGANIZ_CL, order?: string, limit?: number, skip?: number, q?: any): Promise<any[]> {
        let _children = {
            ISN_HIGH_NODE: query.ISN_NODE + ''
        };
        if (q) {
            _children = q;
        }
        return this.getData({ criteries: _children }, order, limit, skip)
        .then(async (Organiz) => {
            if (this.sevOrg && this.sevOrg.length > 0) {
                Organiz.forEach((org: ORGANIZ_CL) => {
                    const index = this.sevOrg.findIndex((sev_) => sev_.OBJECT_ID === org.DUE);
                    if (index !== -1) {
                        org['sev'] = this.sevOrg[index];
                    }
                })
            }
            return Organiz;
        });
    }

    ar_Descript(): Promise<any> {
        return this.apiSrv.read({
            AR_DESCRIPT: {
                criteries: {
                    OWNER: 'O',
                }
            },
            orderby: 'AR_CATEGORY.WEIGHT', expand: 'AR_VALUE_LIST_List', foredit: true, reload: true
        }).then(_descript => {
            this.dopRec = _descript;
            return this.dopRec;
        });
    }

    addContacts(newContacts: any[], orgDUE: string): Promise<IRecordOperationResult[]> {
        return this.apiSrv.read<ORGANIZ_CL>({ ORGANIZ_CL: orgDUE, expand: 'CONTACT_List' })
            .then(([org]) => {
                const results: IRecordOperationResult[] = [];
                if (org) {
                    // console.log('adding contacts to organizaztion', org);
                    this.apiSrv.entityHelper.prepareForEdit(org);
                    const contacts = org.CONTACT_List || [];
                    newContacts.forEach((contact) => {
                        const existContact = contacts.find((exContact) =>
                            exContact['SURNAME'] === contact['SURNAME'] &&
                            exContact['DUTY'] === contact['DUTY'] &&
                            exContact['DEPARTMENT'] === contact['DEPARTMENT']
                        );
                        if (!existContact) {
                            const _isn = this.apiSrv.sequenceMap.GetTempISN();
                            contact['ISN_CONTACT'] = _isn;
                            this.apiSrv.entityHelper.prepareAdded<CONTACT>(contact, 'CONTACT');
                            contacts.push(contact);
                            // Object.assign(contact, _contact);
                            results.push({
                                success: true,
                                record: contact
                            });
                        } else {
                            contact['ISN_CONTACT'] = existContact['ISN_CONTACT'];
                            results.push({
                                record: contact,
                                success: false,
                                error: new RestError({
                                    isLogicException: true,
                                    message: 'Контакт существует!'
                                })
                            });
                        }
                    });
                    const changes = this.apiSrv.changeList([org]);
                    if (changes) {
                        return this.apiSrv.batch(changes, '')
                            .then((resp) => this.createNewContactsSEV(newContacts, resp))
                            .then((sevResults) => results.concat(sevResults));
                    } else {
                        return results;
                    }
                }
                return results;
            });
    }

    public getConfigOpenGopRc(flag: boolean, node: EosDictionaryNode, nodeId: string, paramsMode) {
        const config = {
            classif: 'gop_rc',
            id: 'ORGANIZ_dict',
            from_classif: true,
        };
        if (flag) {
            config['user_id'] = -1;
            config['folder_due'] = nodeId;
        } else {
            config['user_id'] = node.getFieldValue(node._descriptor.fieldsMap.get('ISN_NODE') as any);
            config['folder_due'] = nodeId;
            config['due'] = node.id;
            if (!paramsMode) {
                config['editMode'] = true;
            }
        }
        return config;
    }

    public getRelatedFields2(tables: { table: string, order?: string }[], nodes: EosDictionaryNode[], loadAll: boolean, ignoreMetadata = false): Promise<any> {
        return super.getRelatedFields2(tables, nodes, loadAll, ignoreMetadata).then(result => {
            if (result.hasOwnProperty('ADDR_CATEGORY_CL')) {
                result['ADDR_CATEGORY_CL'] = result['ADDR_CATEGORY_CL'].filter((data: ADDR_CATEGORY_CL) => {
                    return data.ISN_LCLASSIF > 0;
                });
            }
            return result;
        });
    }

    public updateUncheckCitizen(nodes: EosDictionaryNode[]): Promise<any> {
        const change = [];
        nodes.forEach(node => {
            if (node.data.rec.NEW_RECORD === 1) {
                change.push({
                    method: 'MERGE',
                    requestUri: `ORGANIZ_CL('${node.id}')`,
                    data: {
                        NEW_RECORD: 0
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
        this.record = new OrganizRecord(this, data);
    }

    /**
     * мы ориентировались на то что такого класса логику пишем на клиенте.
     * больше чтобы понять как минимизировать АПИ. (c) В. Люкевич
     */
    private createNewContactsSEV(newContacts: any[], createResp: any[]): Promise<IRecordOperationResult[]> {
        const contactsWithSev = [];
        // console.log('createNewContactsSEV', newContacts, createResp);
        createResp.forEach((newIsn) => {
            const contact = newContacts
                .find((_contact) => _contact.SEV && _contact['ISN_CONTACT'] === newIsn.TempID);
            if (contact) {
                contact.ISN_CONTACT = newIsn.ID;
                contactsWithSev.push(contact);
            }
        });

        // const contactsWithSev = newContacts.filter((contact) => contact && contact.SEV && contact['ISN_CONTACT'] > 0);

        const req = contactsWithSev.map((contact) => SevIndexHelper.CompositePrimaryKey(contact['ISN_CONTACT'], 'CONTACT'));

        // console.log('checking sevs', contactsWithSev, req);

        if (req.length) {
            return this.apiSrv.read<SEV_ASSOCIATION>({ SEV_ASSOCIATION: PipRX.criteries({ OBJECT_NAME: 'CONTACT' }) })
                .then((sevs) => {
                    // console.log('found sevs', sevs);
                    const changes = [];
                    const results: IRecordOperationResult[] = [];

                    contactsWithSev.forEach((contact) => {
                        const existSev = sevs.find((sev) =>
                            sev.GLOBAL_ID === contact['SEV']);
                        if (existSev) {
                            results.push(<IRecordOperationResult>{
                                record: contact,
                                success: false,
                                error: new RestError({
                                    isLogicException: true,
                                    message: 'Для данного справочника уже существует индекс СЭВ с таким значением.'
                                })
                            });
                        } else {
                            const sevRec = this.apiSrv.entityHelper.prepareForEdit<SEV_ASSOCIATION>(undefined, 'SEV_ASSOCIATION');
                            // console.log('new sev', sevRec);
                            sevRec.GLOBAL_ID = contact['SEV'];
                            if (SevIndexHelper.PrepareForSave(sevRec, Object.assign(contact, { 'ISN_LCLASSIF': contact.ISN_CONTACT }))) {
                                changes.push(sevRec);
                            }
                        }
                    });

                    if (changes.length) {
                        // console.log('SEV changes', changes);
                        return this.apiSrv.batch(this.apiSrv.changeList(changes), '')
                            .then(() => results);
                    } else {
                        return results;
                    }
                });
        } else {
            return Promise.resolve([]);
        }
    }

    private protNamenCreatorParam(param: string) {
        const queryParam = `{value: "${param}"}`;
        return ` protNamesPg(filter: {tableId: {in: [${queryParam}]}}, first: 100, orderby: {describtion: Asc}) {
            items {
                describtion
                operDescribe
            }
        }`
    }

    // private async extendsData(organiz: ORGANIZ_CL[]): Promise<ORGANIZ_EXTENDS[]>{
    //     const contactsReq = this.createFetchParam.contacts(organiz);
    //     const extOrganiz: ORGANIZ_EXTENDS[] = organiz;
    //     try {
    //         const responseContacts = await this.graphQl.query(contactsReq);
    //         if (responseContacts.ok) {
    //             const contacts = await responseContacts.json();
    //             contacts.data.contactsPg.items.forEach(el => {
    //                 extOrganiz.forEach(orgEl => {
    //                     if(orgEl.ISN_NODE === el.isnOrganiz ) {
    //                         orgEl.ID_CERTIFICATE = el.idCertificate;
    //                         orgEl.E_MAIL = el.eMail
    //                         orgEl.GLOBAL_ID = el.sevIndex
    //                     }
    //                 })
    //             }) 
    //         } else {
    //             console.error('Error: status request: ', responseContacts.status);
    //         }
    //     } catch(err){
    //         console.error('Error: Error when trying to extend standard data.')
    //         console.log(err)
    //     }

    //     return extOrganiz;
    // }
}
