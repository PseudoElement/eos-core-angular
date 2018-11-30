import {
    IDictionaryDescriptor, ITreeDictionaryDescriptor,
} from 'eos-dictionaries/interfaces';
import {FieldsDecline} from 'eos-dictionaries/interfaces/fields-decline.inerface';

import {PipRX} from 'eos-rest/services/pipRX.service';
import {TreeDictionaryDescriptor} from 'eos-dictionaries/core/tree-dictionary-descriptor';
import {TreeRecordDescriptor} from './tree-dictionary-descriptor';
import {FieldDescriptor} from './field-descriptor';
import {ModeFieldSet} from './record-mode';
import {ALL_ROWS} from '../../eos-rest/core/consts';
import {IFieldView} from '../interfaces';
import {CABINET, DEPARTMENT, IHierCL, USER_CABINET, USER_CL} from '../../eos-rest';
import {DepartmentDictionaryDescriptor} from './department-dictionary-descriptor';
import {DictionaryDescriptorService} from './dictionary-descriptor.service';

export class NomenklRecordDescriptor extends TreeRecordDescriptor {
    dictionary: NomenklDictionaryDescriptor;

    parentField: FieldDescriptor;
    // modeField: FieldDescriptor;
    // modeList: IRecordModeDescription[];
    fullSearchFields: ModeFieldSet | any;
    private _keyField;

    constructor(dictionary: NomenklDictionaryDescriptor, descriptor: ITreeDictionaryDescriptor) {
        super(dictionary, descriptor);

        this.dictionary = dictionary;
        this._setCustomField('parentField', descriptor);
        // this.keyField;
        // this.modeField = this.fieldsMap.get(descriptor.modeField);

        // if (!this.modeField) {
        //     throw new Error('No field decribed for "' + descriptor.modeField + '"');
        // }
        //
        // this.modeList = descriptor.modeList;
        // this._initModeSets([
        //     'fullSearchFields',
        // ], descriptor);
    }

    get keyField() {
        return this._keyField;
    }

    set keyField(value) {
        // value.key = 'DUE';
        value.foreignKey = 'DUE';
        this._keyField = value;
    }


//     parentField: FieldDescriptor;
//     modeField: FieldDescriptor;
//     modeList: IRecordModeDescription[];
//     fullSearchFields: ModeFieldSet | any;
//
//     constructor(dictionary: DepartmentDictionaryDescriptor, descriptor: IDepartmentDictionaryDescriptor) {
//         super(dictionary, descriptor);
//         this.dictionary = dictionary;
//         this._setCustomField('parentField', descriptor);
//         this.modeField = this.fieldsMap.get(descriptor.modeField);
//
//         if (!this.modeField) {
//             throw new Error('No field decribed for "' + descriptor.modeField + '"');
//         }
//
//         this.modeList = descriptor.modeList;
//         this._initModeSets([
//             'fullSearchFields',
//         ], descriptor);
//     }
//
//     filterBy(filters: any, data: any): boolean {
//         let visible = super.filterBy(filters, data);
//         if (visible && filters) {
//             if (filters.hasOwnProperty('date') && filters.date) {
//                 const startDate = data.rec['START_DATE'] ? new Date(data.rec['START_DATE']).setHours(0, 0, 0, 0) : null;
//                 const endDate = data.rec['END_DATE'] ? new Date(data.rec['END_DATE']).setHours(0, 0, 0, 0) : null;
//                 visible = (!startDate || filters.date - startDate >= 0) && (!endDate || endDate - filters.date >= 0);
//             }
//         }
//         return visible;
//     }
//
    getListView(data: any): IFieldView[] {
        const res = super.getListView(data);
        return res;
    }

//     getFieldValue(field: IFieldView, data: any): any {
//         let value = super.getFieldValue(field, data);
//         if (!value) {
//             switch (field.key) {
//                 default:
//                     value = data[field.key] ? data[field.key]['CLASSIF_NAME'] : null;
//             }
//         }
//         return value;
//     }
//
//     protected _getFullSearchFields(): FieldDescriptor[] {
//         let __res = [];
//         Object.keys(this.fullSearchFields).forEach((mode) => {
//             __res = __res.concat(this.fullSearchFields[mode]);
//         });
//         return __res;
//     }
//
//     private _initModeSets(setNames: string[], descriptor: IDepartmentDictionaryDescriptor) {
//         setNames.forEach((setName) => {
//             if (!this[setName]) {
//                 this[setName] = new ModeFieldSet(this, descriptor[setName]);
//             }
//         });
//     }
}

export class NomenklDictionaryDescriptor extends TreeDictionaryDescriptor {
    // record: NomenklRecordDescriptor;
    depDict: DepartmentDictionaryDescriptor;

    constructor(
        descriptor: IDictionaryDescriptor,
        apiSrv: PipRX,
        private dictDescriptorSrv: DictionaryDescriptorService,
    ) {
        // noinspection JSAnnotator
        super(descriptor, apiSrv);

        let descr1: IDictionaryDescriptor;
        descr1 = this.dictDescriptorSrv.getDescriptorData('departments');

        this.depDict = new DepartmentDictionaryDescriptor(descr1, apiSrv);
        // if (descriptor) {
        //     this.id = descriptor.id;
        //     this.title = descriptor.title;
        //     this.type = descriptor.dictType;
        //     this.apiInstance = descriptor.apiInstance;
        //     this._defaultOrder = descriptor.defaultOrder;
        //     this.hideTopMenu = descriptor.hideTopMenu;
        //     this.editOnlyNodes = descriptor.editOnlyNodes;
        //
        //     this.apiSrv = apiSrv;
        //     commonMergeMeta(this);
        //     this._initRecord(descriptor);
        // } else {
        //     return undefined;
        // }
    }


    getBoss(departmentDue: string): Promise<any> {
        return this.apiSrv.read({
            'DEPARTMENT_CL': PipRX.criteries({
                'PARENT_DUE': departmentDue,
                'IS_NODE': '1',
                'POST_H': '1',
            })
        })
            .then(([rec]) => rec);
    }

    // getRoot(): Promise<any[]> {
    //     return this.getData({ criteries: { LAYER: '0:2'/*, IS_NODE: '0'*/ } }, 'DUE');
    // }
    getRoot(): Promise<any[]> {

        return this.depDict.getData().then((d) => {
            return d;
        });

        // return this.getData();
    }

    // getData(query?: any, order?: string, limit?: number): Promise<any[]> {
    //     return Promise.resolve([]);
    // }
    getChildren(record: IHierCL): Promise<any[]> {
        return this.getData();
    }

    getFullRelated(): Promise<any> {
        return super.getFullRelated().then((d) => {
            return d;
        });
    }

    getIdByDictionaryMode(mode: number): string {
        switch (mode) {
            case 1:
                return 'nomenkl';
            default:
                return this.depDict.id;
        }
    }

    getData(query?: any, order?: string, limit?: number): Promise<any[]> {
        if (!query) {
            query = ALL_ROWS;
        }

        // console.warn('getData', query, order, limit);

        const req = {[this.apiInstance]: query};

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

    // getParentDictionaryId(): string {
    //     return 'departments';
    // }

    getOwners(depDue: string): Promise<DEPARTMENT[]> {
        return this.apiSrv.read<DEPARTMENT>({'DEPARTMENT': PipRX.criteries({'IS_NODE': '1', DEPARTMENT_DUE: depDue})})
            .then((owners) => {
                this.prepareForEdit(owners);
                return owners;
            });
    }

    getRelated(rec: CABINET): Promise<any> {
        const reqs = [
            this.apiSrv.read({'FOLDER': PipRX.criteries({'ISN_CABINET': rec.ISN_CABINET + ''})}),
            this.apiSrv.read({'DEPARTMENT': [rec.DUE]})
                .then(([department]: DEPARTMENT[]) => {
                    return this.getOwners(department.DEPARTMENT_DUE)
                        .then((owners) => [department, owners]);
                }),
            this.apiSrv.read({'USER_CABINET': PipRX.criteries({'ISN_CABINET': rec.ISN_CABINET + ''})})
                .then((userCabinet: USER_CABINET[]) => {
                    this.prepareForEdit(userCabinet);
                    const userIds = userCabinet.map((u2c) => u2c.ISN_LCLASSIF);
                    if (userIds.length) {
                        return this.apiSrv.read<USER_CL>({'USER_CL': userIds})
                            .then((users) => [userCabinet, users]);
                    } else {
                        return [userCabinet, []];
                    }
                }),
        ];
        return Promise.all(reqs)
            .then(([folders, [department, owners], [userCabinet, users]]) => {
                this.prepareForEdit(folders);
                const related = {
                    department: department,
                    folders: folders,
                    cabinetAccess: userCabinet,
                    users: users,
                    owners: owners
                };
                return related;
            });
    }

    // getBoss(departmentDue: string): Promise<any> {
    //     return this.apiSrv.read({
    //         'DEPARTMENT_CL': PipRX.criteries({
    //             'PARENT_DUE': departmentDue,
    //             'IS_NODE': '1',
    //             'POST_H': '1',
    //         })
    //     })
    //         .then(([rec]) => rec);
    // }


    // getFullSearchCriteries(data: any): any {
    //     const _criteries = {};
    //     const mode = data['srchMode'];
    //     const _searchFields = this.record.fullSearchFields[mode];
    //     switch (mode) {
    //         case 'department':
    //             _criteries['IS_NODE'] = '0';
    //             break;
    //         case 'person':
    //             _criteries['IS_NODE'] = '1';
    //             break;
    //         case 'cabinet':
    //             _criteries['department.cabinet.CABINET_NAME'] = '"' + data.cabinet['CABINET_NAME'].trim() + '"';
    //             break;
    //     }
    //     if (mode !== 'cabinet') {
    //         _searchFields.forEach((fld) => {
    //             if (data[mode][fld.foreignKey]) {
    //                 _criteries[fld.foreignKey] = '"' + data[mode][fld.foreignKey].trim() + '"';
    //             }
    //         });
    //     }
    //     return _criteries;
    // }

    // getIdByDictionaryMode(mode: number): string {
    //     switch (mode) {
    //         case 1:
    //             return 'cabinet';
    //         case 2:
    //             return 'nomenkl';
    //         default:
    //             return this.id;
    //     }
    // }

    // getRelated(rec: any, orgDUE: string): Promise<any> {
    //     const pUser = this.apiSrv
    //         .read({ 'USER_CL': PipRX.criteries({ 'DUE_DEP': rec['DUE'] }) })
    //         .then((items) => this.apiSrv.entityHelper.prepareForEdit(items[0]));
    //
    //     const pOrganization = (orgDUE) ? this.getCachedRecord({ ORGANIZ_CL: [orgDUE] }) : Promise.resolve(null);
    //
    //     const pCabinet = (rec['ISN_CABINET']) ? this.getCachedRecord({ 'CABINET': rec['ISN_CABINET'] }) : Promise.resolve(null);
    //     const pCabinets = this.getCachedRecord({ 'CABINET': { 'criteries': { DUE: rec.DUE } } });
    //
    //     let owner = rec['ISN_NODE'].toString();
    //     if (!rec['IS_NODE'] && rec['ISN_HIGH_NODE'] !== undefined && rec['ISN_HIGH_NODE'] !== null) {
    //         owner += '|' + rec['ISN_HIGH_NODE'].toString();
    //     }
    //
    //     const pPrintInfo = this.apiSrv
    //         .read<CB_PRINT_INFO>({
    //             CB_PRINT_INFO: PipRX.criteries({
    //                 ISN_OWNER: owner,
    //                 OWNER_KIND: '104'
    //             })
    //         })
    //         .then((items) => {
    //             const info = items.find((item) => item.ISN_OWNER === rec['ISN_NODE']);
    //             return this.apiSrv.entityHelper.prepareForEdit<CB_PRINT_INFO>(info || items[0], 'CB_PRINT_INFO');
    //         });
    //
    //     const pPhotoImg = (rec['ISN_PHOTO']) ? this.apiSrv.read({ DELO_BLOB: rec['ISN_PHOTO'] }) : Promise.resolve([]);
    //
    //     return Promise.all([pUser, pOrganization, pCabinet, pPrintInfo, pCabinets, pPhotoImg])
    //         .then(([user, org, cabinet, printInfo, cabinets, photoImgs]) => {
    //             const img = (photoImgs[0]) ? <IImage>{
    //                 data: photoImgs[0].CONTENTS,
    //                 extension: photoImgs[0].EXTENSION,
    //                 url: `url(data:image/${photoImgs[0].EXTENSION};base64,${photoImgs[0].CONTENTS})`
    //             } : null;
    //
    //             return {
    //                 user: user,
    //                 organization: org,
    //                 cabinet: cabinet,
    //                 cabinets: cabinets,
    //                 printInfo: printInfo,
    //                 photo: img
    //             };
    //         });
    // }

    // getContacts(orgISN: string): Promise<any> {
    //     // return this.apiSrv.read({ 'CONTACT': PipRX.criteries({ 'ISN_ORGANIZ': orgISN }) });
    // }
    // getListView

    public onPreparePrintInfo(dec: FieldsDecline): Promise<any[]> {
        return this.apiSrv.read({PreparePrintInfo: PipRX.args(dec)});
    }

    protected _initRecord(data: IDictionaryDescriptor) {

        this.record = new NomenklRecordDescriptor(this, <ITreeDictionaryDescriptor>data);
    }
}
