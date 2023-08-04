import { RecordDescriptor } from '../../eos-dictionaries/core/record-descriptor';
import { AbstractDictionaryDescriptor } from './abstract-dictionary-descriptor';
import { FieldsDecline } from '../../eos-dictionaries/interfaces/fields-decline.inerface';
import { _ES, _T } from '../../eos-rest/core/consts';
import { PipRX } from '../../eos-rest/services/pipRX.service';
import { ALL_ROWS } from '../../eos-rest/core/consts';
import { DOCGROUP_CL, FILE_CATEGORY_CL } from '../../eos-rest';
import {
    IDictionaryDescriptor, IRecordOperationResult
} from '../../eos-dictionaries/interfaces';
import { GraphQLService } from '../../eos-dictionaries/services/graphQL.service';
import { ORIGINDATA, ResponseGraphQL } from '../../eos-dictionaries/interfaces/fetch.interface';

export class FileCategoryDescriptor extends RecordDescriptor {
    dictionary: FileCategoryDictionaryDescriptor;
    fullSearchFields: any;

    constructor(
        dictionary: FileCategoryDictionaryDescriptor,
        descriptor: IDictionaryDescriptor
    ) {
        super(dictionary, descriptor);
        this.dictionary = dictionary;
        this._initFieldSets(['fullSearchFields'], descriptor);
    }
}
export class FileCategoryDictionaryDescriptor extends AbstractDictionaryDescriptor {
    record: FileCategoryDescriptor;

    constructor(
        descriptor: IDictionaryDescriptor,
        private _api: PipRX,
        private graphQLService: GraphQLService
    ) {
        super(descriptor, _api);
    }

    public getSubtree(): Promise<any[]> {
        return Promise.resolve([]);
    }

    addRecord(data: any, _useless: any, appendToChanges: any = null, isProtected = false, isDeleted = false): Promise<any> {
        let _newRec = this.preCreate(isProtected, isDeleted);
        if (this.metadata.pk) {
            _newRec[this.metadata.pk] = _newRec.ISN_LCLASSIF;
        }
        _newRec = this.apiSrv.entityHelper.prepareAdded<any>(_newRec, this.apiInstance);
        const changeData = [];
        let updates = this.apiSrv.changeList(changeData);
        if (appendToChanges) {
            updates = updates.concat(appendToChanges);
        }
        return this._postChanges(_newRec, data.rec, updates)
            .then((resp: any) => {
                if (resp && resp[0]) {
                    return this.dgFileCategoryCreate(data, resp[0].ID).then(() => {
                        if (resp) {
                          return resp[0].ID;
                        } else {
                          return null;
                        }
                    });
                } else {
                    return null;
                }
            });
    }

    updateRecord(originalData: ORIGINDATA, updates: any): Promise<IRecordOperationResult[]> {
        const results: IRecordOperationResult[] = [];
        let QUERY_REL = null;
        const queue: Promise<any>[] = [];
        const { rec } = updates;
        const MAIN_CHANGE = {
            ...{ method: 'MERGE', requestUri: `FILE_CATEGORY_CL(${rec.ISN_LCLASSIF})` }, ...{
                data: { NAME: rec.NAME, NOTE: rec.NOTE }
            }
        };
        const QUERY_MAIN = this.apiSrv.batch([MAIN_CHANGE], '');
        queue.push(QUERY_MAIN);

        // формирование запроса к зависимой таблице
        let DUES_NODE_DG: string[] = [];
        if (updates['__relfield'] && updates['__relfield']['DUE_NODE_DG']) {
            DUES_NODE_DG = updates['__relfield']['DUE_NODE_DG'].split('|');
        }
        const OLD_DUES_NODE_DG: string[] = [];
        const { DG_FILE_CATEGORY_List } = updates.rec;
        DG_FILE_CATEGORY_List.forEach(item => OLD_DUES_NODE_DG.push(item.DUE_NODE_DG));

        // избежание дублирования DUE_NODE_DG
        const RESTRICTED_DUES: string[] = [];
        for (const DUE of DUES_NODE_DG) {
            if (OLD_DUES_NODE_DG.includes(DUE)) {
                RESTRICTED_DUES.push(DUE);
            }
        }

        if (DUES_NODE_DG.length >= 0) {
            const CHANGE_LIST: any[] = [];
            for (const DUE of DUES_NODE_DG) {
                if (!RESTRICTED_DUES.includes(DUE)) {
                    const CHANGE = {
                        ...{ method: 'POST', requestUri: `FILE_CATEGORY_CL(${rec.ISN_LCLASSIF})/DG_FILE_CATEGORY_List` }, ...{
                            data: {
                                DUE_NODE_DG: DUE,
                                ISN_FILE_CATEGORY: rec.ISN_LCLASSIF
                            }
                        }
                    };
                    CHANGE_LIST.push(CHANGE);
                } else {
                    continue;
                }
            }
            const DELETED_GROUP_DOC: string[] = [];
            for (const DUE of OLD_DUES_NODE_DG) {
                if (!RESTRICTED_DUES.includes(DUE)) {
                   DELETED_GROUP_DOC.push(this.graphQLService.createDelParams(DUE, originalData));
                } else { continue; }
            }

            const deletet: Promise<Response> | null = DELETED_GROUP_DOC.length ? this.graphQLService.createFetch(DELETED_GROUP_DOC) : null;
            QUERY_REL = this.apiSrv.batch(CHANGE_LIST, '');
            queue.push(QUERY_REL);
            if (deletet) { queue.push(deletet); }
        }

        return Promise.all(queue)
            .then((result) => {
                results.push({ success: true, record: updates.rec });
                if (result.length === 3 ) {
                    if (result[2].ok ) {
                        return result[2].json().then((el123: ResponseGraphQL)  => {
                            return el123.data.deleteDgFileCategory.success ?
                                    results :
                                    [{ success: false, record: updates.rec, error: new Error(el123.data.deleteDgFileCategory.message)}];
                        });
                    } else {
                        return [{ success: false, record: updates.rec, error: new Error(result[2].statusText)}];
                    }
                } else {
                    return results;
                }
            });
    }

    dgFileCategoryCreate(data: any, idFileCategory: number): Promise<any> {
        let DUES_NODE_DG: string[] = [];
        if (data['__relfield'] && data['__relfield']['DUE_NODE_DG']) {
            DUES_NODE_DG = data['__relfield']['DUE_NODE_DG'].split('|');
        }
        if (DUES_NODE_DG.length > 0) {
            const CHANGE_LIST: any[] = [];
            const BASE = { method: 'POST', requestUri: `FILE_CATEGORY_CL(${idFileCategory})/DG_FILE_CATEGORY_List` };
            for (const DUE of DUES_NODE_DG) {
                const CHANGE = {
                    ...BASE, ...{
                        data: {
                            DUE_NODE_DG: DUE,
                            ISN_FILE_CATEGORY: idFileCategory
                        }
                    }
                };
                CHANGE_LIST.push(CHANGE);
            }
            return this.apiSrv.batch(CHANGE_LIST, '');
        } else {
            return Promise.resolve(null);
        }
    }

    public getChildren(): Promise<FILE_CATEGORY_CL[]> {
        return this.getData().then(items =>
            this.setDocGroupNames(items)
        );
    }

    setDocGroupNames(items: FILE_CATEGORY_CL[]): Promise<FILE_CATEGORY_CL[]> {
        const ISNS_NODE_DG: number[] = [];
        items.forEach(item => item.DG_FILE_CATEGORY_List.forEach(dg => ISNS_NODE_DG.push(dg.ISN_NODE_DG)));
        if (ISNS_NODE_DG.length > 0) {
            const pairs = new Map();
            return this.apiSrv.read<DOCGROUP_CL>({
                DOCGROUP_CL: {
                    criteries: {
                        ISN_NODE: ISNS_NODE_DG.join('|')
                    }
                }
            }).then(dgItems => {
                dgItems.forEach(x => pairs.set(x.ISN_NODE, x.CLASSIF_NAME));
                items.forEach(item => {
                    const dgNames: string[] = [];
                    item.DG_FILE_CATEGORY_List.forEach(dg => {
                        dgNames.push(pairs.get(dg.ISN_NODE_DG));
                    });
                    item['DOC_GROUP_NAMES'] = dgNames.join(', ');
                });
                return items;
            });
        } else {
            return Promise.resolve(items);
        }
    }

    getRoot(): Promise<FILE_CATEGORY_CL[]> {
        return Promise.resolve([]);
    }

    getData(query?: any, order?: string, limit?: number): Promise<FILE_CATEGORY_CL[]> {
        return this.apiSrv.read<FILE_CATEGORY_CL>({
            FILE_CATEGORY_CL: ALL_ROWS,
            expand: 'DG_FILE_CATEGORY_List',
        }).then(data => {
            super.prepareForEdit(data);
              return data;
        });
    }

    onPreparePrintInfo(dec: FieldsDecline): Promise<any[]> {
        return Promise.reject('Type of dictionary not true!');
    }

    getFullSearchCriteries(data: any): any {
        return data;
    }

    checkRelev(crit, item: FILE_CATEGORY_CL): boolean {
        let checkName: boolean = true;
        let checkNote: boolean = true;
        if (crit.NAME) {
            checkName = item.NAME.toLocaleLowerCase().indexOf(crit.NAME.toLocaleLowerCase()) >= 0;
        }
        if (crit.NOTE) {
            checkNote = item.NOTE.toLocaleLowerCase().indexOf(crit.NOTE.toLocaleLowerCase()) >= 0;
        }
        return checkName && checkNote;
    }

    search(data): Promise<any> {
        const CRIT = data[0];
        let MAIN_DATA = {};
        let MAIN_QUERY;
        if (!CRIT.NAME && !CRIT.NOTE) {
            MAIN_QUERY = {
                FILE_CATEGORY_CL: ALL_ROWS,
                expand: 'DG_FILE_CATEGORY_List',
            };
        } else {
            if (CRIT.NAME) {
                const nameLexem = this._getSafeQueryLexem(CRIT.NAME.substring(0, 1).toUpperCase() + CRIT.NAME.substring(1).toLowerCase());
                MAIN_DATA = { ...MAIN_DATA, ...{ NAME: `%${nameLexem}%` } };
            }
            if (CRIT.NOTE) {
                const noteLexem = this._getSafeQueryLexem(CRIT.NOTE);
                MAIN_DATA = { ...MAIN_DATA, ...{ NOTE: `%${noteLexem}%` } };
            }
            MAIN_QUERY = {
                FILE_CATEGORY_CL: {
                    criteries: MAIN_DATA
                },
                expand: 'DG_FILE_CATEGORY_List'
            };
        }
        const FILE_CATEGORY_CL_PROMISE = this.apiSrv.read<FILE_CATEGORY_CL>(MAIN_QUERY);
        if (CRIT.DOC_GROUP_NAMES) { // доп поиск по группам документов
            return this._api.read<DOCGROUP_CL>({ // отсечение по критерию лексемы Группы документов
                'DOCGROUP_CL': PipRX.criteries({ CLASSIF_NAME: CRIT.DOC_GROUP_NAMES })
            }).then(dgItems => { // получили нужные ISN DOCGROUP_CL
                const NEED_DOC_GROUP_ISNS = [];
                dgItems.forEach(dg => NEED_DOC_GROUP_ISNS.push(dg.ISN_NODE)); // формирование массива ISN нужных групп документов
                return FILE_CATEGORY_CL_PROMISE.then(list => {
                    const RETS = list.filter(x => {
                        const { DG_FILE_CATEGORY_List } = x;

                        // проверка нужного ISN
                        let flag: boolean = false;
                        for (const item of DG_FILE_CATEGORY_List) {
                            if (NEED_DOC_GROUP_ISNS.includes(item.ISN_NODE_DG)) {
                                flag = true;
                                break;
                            }
                        }
                        return flag;
                    });
                    return RETS.filter(x => this.checkRelev(CRIT, x));
                });

            });
        } else {
            return FILE_CATEGORY_CL_PROMISE.then(resp => {
                return resp.filter(x => this.checkRelev(CRIT, x));
            });
        }
    }

    protected preCreate(isProtected = false, isDeleted = false): any {
        const _isn = this.apiSrv.sequenceMap.GetTempISN();
        const _res: any = {
            ISN_LCLASSIF: _isn,
            PROTECTED: (isProtected ? 1 : 0),
            DELETED: (isDeleted ? 1 : 0),
            NAME: '',
            NOTE: null,
        };
        return _res;
    }

    protected _initRecord(data: IDictionaryDescriptor) {
        this.record = new FileCategoryDescriptor(this, data);
    }

    protected deleteRecord(record: FILE_CATEGORY_CL): Promise<IRecordOperationResult> {

        //       record._State = _ES.Deleted;
        //       record.ISN_LCLASSIF = String(record.ISN_LCLASSIF);
        //        const changes = this.apiSrv.changeList([record]);
        const CHANGE = { method: 'DELETE', requestUri: `FILE_CATEGORY_CL(${String(record.ISN_LCLASSIF)})` };
        return this.apiSrv.batch([CHANGE], '').then(() => {
            return <IRecordOperationResult>{
                record,
                success: true
            };
        }).catch(err => {
            return <IRecordOperationResult>{
                record,
                success: false,
                error: err
            };
        });
    }

    private _isSymbolsCorrect(value): boolean {
        const REGEXP = new RegExp(/^[а-яА-ЯёЁA-Za-z0-9]+$/);
        return REGEXP.test(value);
    }

    private _getSafeQueryLexem(lexem): string {
        const AR = lexem.split('');
        for (let i = 0; i < AR.length; i++) {
            if (!this._isSymbolsCorrect(AR[i])) {
                AR[i] = '%';
            }
        }
        return AR.join('');
    }

}

