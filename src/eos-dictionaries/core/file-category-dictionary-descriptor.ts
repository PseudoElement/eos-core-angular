import { RecordDescriptor } from 'eos-dictionaries/core/record-descriptor';
import { AbstractDictionaryDescriptor } from './abstract-dictionary-descriptor';
import { FieldsDecline } from 'eos-dictionaries/interfaces/fields-decline.inerface';
import { _ES, _T } from 'eos-rest/core/consts';
import { } from 'eos-dictionaries/interfaces';
import { PipRX } from 'eos-rest/services/pipRX.service';
import { ALL_ROWS } from 'eos-rest/core/consts';
import { DOCGROUP_CL, FILE_CATEGORY_CL } from 'eos-rest';
import {
    IDictionaryDescriptor
} from 'eos-dictionaries/interfaces';
import { ILinearCL } from 'eos-rest';

// при готовновности бэка подправить, есть в системе =>
// const techRights: string = '11111111111111111111001111111111111110000'; //  старый вариант - 41 символ
// '1111111111111111111100111111111111111000100'; // новые права  - 43 символа - права технолога

// моки для эмуляции таблицы DG_FILE_CATEGORY
// нет поддержки бэка
const DG_FILE_CATEGORY_MOCKS = [
    { ISN_NODE_DG: 4057024, ISN_FILE_CATEGORY: 1 },
    { ISN_NODE_DG: 4057032, ISN_FILE_CATEGORY: 1 },
    { ISN_NODE_DG: 3672, ISN_FILE_CATEGORY: 1 },
    { ISN_NODE_DG: 4057032, ISN_FILE_CATEGORY: 2 },
    { ISN_NODE_DG: 4057022, ISN_FILE_CATEGORY: 2 },
    { ISN_NODE_DG: 4057030, ISN_FILE_CATEGORY: 2 },
    { ISN_NODE_DG: 4057026, ISN_FILE_CATEGORY: 2 },
    { ISN_NODE_DG: 4057028, ISN_FILE_CATEGORY: 2 },
    { ISN_NODE_DG: 3672, ISN_FILE_CATEGORY: 3 },
    { ISN_NODE_DG: 3674, ISN_FILE_CATEGORY: 3 },
    { ISN_NODE_DG: 3676, ISN_FILE_CATEGORY: 3 },
    { ISN_NODE_DG: 4057022, ISN_FILE_CATEGORY: 3 },
    { ISN_NODE_DG: 4057028, ISN_FILE_CATEGORY: 3 },
    { ISN_NODE_DG: 3684, ISN_FILE_CATEGORY: 4 },
    { ISN_NODE_DG: 4057024, ISN_FILE_CATEGORY: 4 },
    { ISN_NODE_DG: 3684, ISN_FILE_CATEGORY: 4 },
    { ISN_NODE_DG: 4057026, ISN_FILE_CATEGORY: 4 },
    { ISN_NODE_DG: 4057022, ISN_FILE_CATEGORY: 4 },
    { ISN_NODE_DG: 3692, ISN_FILE_CATEGORY: 5 },
    { ISN_NODE_DG: 4057024, ISN_FILE_CATEGORY: 5 },
    { ISN_NODE_DG: 3684, ISN_FILE_CATEGORY: 5 },
    { ISN_NODE_DG: 4057028, ISN_FILE_CATEGORY: 5 },
    { ISN_NODE_DG: 4057022, ISN_FILE_CATEGORY: 5 },
];
class MockService {

    getDGByFileCatIsn(isn: number): any[] {
        return DG_FILE_CATEGORY_MOCKS.filter(x => x.ISN_FILE_CATEGORY === isn);
    }

    getFileCatsByDGIsn(isn: number) {
        return DG_FILE_CATEGORY_MOCKS.filter(x => x.ISN_NODE_DG === isn);
    }

}
export class FileCategoryDescriptor extends RecordDescriptor {
    dictionary: FileCategoryDictionaryDescriptor;
    fullSearchFields: any;

    constructor(dictionary: FileCategoryDictionaryDescriptor, descriptor: IDictionaryDescriptor
    ) {
        super(dictionary, descriptor);
        this.dictionary = dictionary;
        this._initFieldSets(['fullSearchFields'], descriptor);

    }
}

export class FileCategoryDictionaryDescriptor extends AbstractDictionaryDescriptor {
    record: FileCategoryDescriptor;
    private _mockService = new MockService();
    private _docGroupsCache: any[];

    constructor(
        descriptor: IDictionaryDescriptor,
        private _api: PipRX
    ) {
        super(descriptor, _api);
        _api.read({ DOCGROUP_CL: ALL_ROWS }).then(resp => {
            this._docGroupsCache = resp;
        });
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
            .then((resp: any[]) => {
                changeData.length = 0;
                if (resp && resp[0]) {
                    return resp[0].ID;
                } else {
                    return null;
                }
            });
    }

    getData(query?: any, order?: string, limit?: number): Promise<FILE_CATEGORY_CL[]> {
        return super.getData(query, order, limit)
            .then(list => {
                list.forEach(item => item.DG_NAMES = this._getDGNames(item));
                return list;
            });
    }

    getChildren(params): Promise<any> {
        return this.getData();
    }

    getRoot(): Promise<any> {
        return this.getData({
            FILE_CATEGORY_CL: ALL_ROWS
        });
    }

    getSubtree(params): Promise<any[]> {
        return Promise.resolve([]);
    }

    onPreparePrintInfo(dec: FieldsDecline): Promise<any[]> {
        return Promise.reject('Type of dictionary not true!');
    }

    search(criteries: any[]): Promise<any> {
        const QUERY = criteries[0];
        if (QUERY['ISN_LCLASSIF']) {
            const DOCGROUP_CL_PROMISE = this._api.read<DOCGROUP_CL>({ 'DOCGROUP_CL': PipRX.criteries({ CLASSIF_NAME: QUERY['ISN_LCLASSIF'] }) });
            const FILE_CAT_PROMISE = this.getData(QUERY);
            return Promise.all([DOCGROUP_CL_PROMISE, FILE_CAT_PROMISE]).then(resp => { // из первой выборки берем ISNS => по ним отбор из второй выборки
                const DG_LIST = resp[0];
                const FILE_CAT_ISNS = this._getFileCatsIsnsByDocGroupLexem(DG_LIST);
                const SELECTED_FILE_CATS = resp[1].filter(file_cat => FILE_CAT_ISNS.some(item => item === file_cat.ISN_LCLASSIF));
                const RETS = SELECTED_FILE_CATS.filter(item => {
                    let ret: boolean = true;
                    if (QUERY.CLASSIF_NAME) {
                        ret = item.NAME.indexOf(QUERY['CLASSIF_NAME']) >= 0;
                    }
                    if (QUERY.NOTE) {
                        ret = item.NAME.indexOf(QUERY['NOTE']) >= 0;
                    }
                    return ret;
                }
                );
                return RETS;
            });
        } else {
            return super.search([QUERY]);
        }
    }

    getFullSearchCriteries(data: any) {
        const objCrit: any = {};
        if (data.CLASSIF_NAME) {
            objCrit['CLASSIF_NAME'] = data['CLASSIF_NAME'];
        }
        if (data.NOTE) {
            objCrit['NOTE'] = data['NOTE'];
        }
        if (data.DG_NAMES) {
            objCrit['ISN_LCLASSIF'] = data['DG_NAMES'];
        }
        return objCrit;
    }

    _getFileCatsIsnsByDocGroupLexem(list): number[] { // по лексеме группы доков вернуть массив ISNS категорий файлов
        const DG_ISNS = list.map(x => x.ISN_NODE);
        const FILE_CAT_ISNS = []; // получаем id файлов категорий из DG_FILE_CATEGORY
        DG_ISNS.forEach(item => {
            const BUF = this._mockService.getFileCatsByDGIsn(item);
            BUF.forEach(y => {
                if (!FILE_CAT_ISNS.includes(y.ISN_FILE_CATEGORY)) {
                    FILE_CAT_ISNS.push(y.ISN_FILE_CATEGORY);
                }
            }
            );
        });
        // кидаем id файлов категории в критерий поиска для БД
        return FILE_CAT_ISNS;
    }

    protected preCreate(isProtected = false, isDeleted = false): ILinearCL {
        const _isn = this.apiSrv.sequenceMap.GetTempISN();
        const _res: ILinearCL = {
            ISN_LCLASSIF: _isn,
            PROTECTED: (isProtected ? 1 : 0),
            DELETED: (isDeleted ? 1 : 0),
            CLASSIF_NAME: '',
            NOTE: null,
        };
        return _res;
    }

    protected _initRecord(data: IDictionaryDescriptor) {
        this.record = new FileCategoryDescriptor(this, data);
    }

    private _getDGNames(item): string {
        item.DOC_GROUP_NAMES = item.CLASSIF_NAME;
        const SELECTED_MOCK_RECS: any[] = this._mockService.getDGByFileCatIsn(item.ISN_LCLASSIF);
        const DOC_GROUP_NAMES = [];
        for (const REC of SELECTED_MOCK_RECS) { // идем по зависимой таблице
            const GROUP_DOC_NAME = this._getDocGroupName(REC.ISN_NODE_DG);
            DOC_GROUP_NAMES.push(GROUP_DOC_NAME);
        }
        const BUF = DOC_GROUP_NAMES.join(', ');
        return BUF;
    }

    private _getDocGroupName(isn: number): string {
        const ITEM = this._docGroupsCache.filter(x => x.ISN_NODE === isn);
        return ITEM[0].CLASSIF_NAME;
    }

}

