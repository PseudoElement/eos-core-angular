import {
    // E_DEPT_MODE,
    IDepartmentDictionaryDescriptor,
    IRecordModeDescription,
    IDictionaryDescriptor,
    IFieldView,
} from '../../eos-dictionaries/interfaces';
import { FieldsDecline } from '../../eos-dictionaries/interfaces/fields-decline.inerface';
import { FieldDescriptor } from './field-descriptor';
import { RecordDescriptor } from './record-descriptor';
import { ModeFieldSet } from './record-mode';
import { PipRX } from '../../eos-rest/services/pipRX.service';
import { CB_PRINT_INFO, DEPARTMENT, SEV_ASSOCIATION } from '../../eos-rest/interfaces/structures';
import { TreeDictionaryDescriptor } from '../../eos-dictionaries/core/tree-dictionary-descriptor';
import { IImage } from '../../eos-dictionaries/interfaces/image.interface';
import { IHierCL } from '../../eos-rest';
import { EosDictionaryNode } from './eos-dictionary-node';
import { InjectorInstance } from '../../app/app.static';
import { AppContext, CB_FUNCTIONS } from '../../eos-rest/services/appContext.service';
import { IConfirmWindow2 } from '../../eos-common/confirm-window/confirm-window2.component';
import { WARNING_LIST_MAXCOUNT, CONFIRM_OPERATION_NOT_DATE, CONFIRM_OPERATION_NOT_DATE_ALL } from '../../app/consts/confirms.const';
import { ConfirmWindowService } from '../../eos-common/confirm-window/confirm-window.service';
import { EosUtils } from '../../eos-common/core/utils';
import { CLEAR_EXPORT } from '../../eos-dictionaries/consts/common';

const inheritFiields = [
    'START_DATE',
    'END_DATE'
];
export class DepartmentRecordDescriptor extends RecordDescriptor {
    dictionary: DepartmentDictionaryDescriptor;
    parentField: FieldDescriptor;
    modeField: FieldDescriptor;
    modeList: IRecordModeDescription[];
    fullSearchFields: ModeFieldSet | any;

    constructor(dictionary: DepartmentDictionaryDescriptor, descriptor: IDepartmentDictionaryDescriptor) {
        super(dictionary, descriptor);
        this.dictionary = dictionary;
        this._setCustomField('parentField', descriptor);
        this.modeField = this.fieldsMap.get(descriptor.modeField);

        if (!this.modeField) {
            throw new Error('No field decribed for "' + descriptor.modeField + '"');
        }

        this.modeList = descriptor.modeList;
        this._initModeSets([
            'fullSearchFields',
        ], descriptor);
    }

    filterBy(filters: any, data: any): boolean {
        let visible = super.filterBy(filters, data);
        if (visible && filters) {
            if (filters.hasOwnProperty('date') && filters.date) {
                const startDate = data.rec['START_DATE'] ? new Date(data.rec['START_DATE']).setHours(0, 0, 0, 0) : null;
                const endDate = data.rec['END_DATE'] ? new Date(data.rec['END_DATE']).setHours(0, 0, 0, 0) : null;
                visible = (!startDate || filters.date - startDate >= 0) && (!endDate || endDate - filters.date >= 0);
            }
        }
        return visible;
    }

    getFieldValue(field: IFieldView, data: any): any {
        let value = super.getFieldValue(field, data);
        if (!value) {
            switch (field.key) {
                default:
                    value = data[field.key] ? data[field.key]['CLASSIF_NAME'] : null;
            }
        }
        return value;
    }

    protected _getFullSearchFields(): FieldDescriptor[] {
        let __res = [];
        Object.keys(this.fullSearchFields).forEach((mode) => {
            __res = __res.concat(this.fullSearchFields[mode]);
        });
        return __res;
    }

    private _initModeSets(setNames: string[], descriptor: IDepartmentDictionaryDescriptor) {
        setNames.forEach((setName) => {
            if (!this[setName]) {
                this[setName] = new ModeFieldSet(this, descriptor[setName]);
            }
        });
    }
}

export class DepartmentDictionaryDescriptor extends TreeDictionaryDescriptor {
    record: DepartmentRecordDescriptor;

    getBoss(departmentDue: string): Promise<any> {
        return this.apiSrv.read({
            'DEPARTMENT': PipRX.criteries({
                'DUE': departmentDue + '%',
                'IS_NODE': '1',
                'POST_H': '1',
            })
        })
        .then(([rec]) => rec);
    }
    getAllNodesInParents(departmentDue: string): Promise<any> {
        return this.apiSrv.read({
            'DEPARTMENT': PipRX.criteries({
                'DUE': departmentDue + '|' +departmentDue + '%',
            })
        })
        .then((rec) => rec);
    }

    getFullSearchCriteries(data: any): any {
        const _criteries = {};
        const mode = data['srchMode'];
        const _searchFields = this.record.fullSearchFields[mode];
        switch (mode) {
            case 'department':
                _criteries['IS_NODE'] = '0';
                break;
            case 'person':
                _criteries['IS_NODE'] = '1';
                _criteries['ISN_CONTACT'] = 'isnull';

                if (data.person['printInfo.NAME']) {
                    _criteries['CB_PRINT_INFO.NAME'] = '"' + data.person['printInfo.NAME'].trim() + '"';
                }
                if (data.person['printInfo.SURNAME']) {
                    _criteries['CB_PRINT_INFO.SURNAME'] = '"' + data.person['printInfo.SURNAME'].trim() + '"';
                }
                if (data.person['printInfo.PATRON']) {
                    _criteries['CB_PRINT_INFO.PATRON'] = '"' + data.person['printInfo.PATRON'].trim() + '"';
                }

                break;
            case 'cabinet':
                if (data.cabinet['CABINET_NAME']) {
                    _criteries['department.cabinet.CABINET_NAME'] = '"' + data.cabinet['CABINET_NAME'].trim() + '"';
                }
                if (data.cabinet['fullCabinet']) {
                    _criteries['department.cabinet.FULLNAME'] = '"' + data.cabinet['fullCabinet'].trim() + '"';
                }
                break;
        }
        if (mode !== 'cabinet') {
            _searchFields.forEach((fld) => {
                if (data[mode][fld.foreignKey]) {
                    _criteries[fld.foreignKey] = '"' + data[mode][fld.foreignKey].trim() + '"';
                }
            });
        }
        return _criteries;
    }

    getIdByDictionaryMode(mode: number): string {
        switch (mode) {
            case 1:
                return 'cabinet';
            default:
                return this.id;
        }
    }

    checkPreDelete(selectedNodes: EosDictionaryNode[]): Promise<any> {
        const injector = InjectorInstance;
        const appctx = injector.get(AppContext);
        const isCBBase = appctx.getParams(CB_FUNCTIONS) === 'YES';
        const notDateNodes = [];
        const uncheckNodeIsMarked = [];
        const withDateNodes = [];
        const newSelectedNodes = [];
        const confirmSrv = InjectorInstance.get(ConfirmWindowService);
        let cantDeleteWarning: IConfirmWindow2;
        if (isCBBase) {
            for (let i = 0; i < selectedNodes.length; i++) {
                const node = selectedNodes[i];
                if (!node.data.rec['END_DATE'] && node.data.rec['IS_NODE'] === 0) {
                    uncheckNodeIsMarked.push(node);
                    notDateNodes.push(node.title);
                } else {
                    newSelectedNodes.push(node);
                    withDateNodes.push(node.title);
                }
            }
            if (notDateNodes.length) {
                let list;
                if (notDateNodes.length > WARNING_LIST_MAXCOUNT) {
                    list = notDateNodes.slice(0, 9);
                    list.push(`... всего записей ${notDateNodes.length}`);
                } else {
                    list = notDateNodes;
                }
                if (withDateNodes.length) {
                    cantDeleteWarning = CONFIRM_OPERATION_NOT_DATE;
                    cantDeleteWarning.bodyList = list;
                } else {
                    cantDeleteWarning = CONFIRM_OPERATION_NOT_DATE_ALL;
                    cantDeleteWarning.bodyList = list;
                }
                return confirmSrv.confirm2(cantDeleteWarning).then((res) => {
                    if (res && res.result === 2) {
                        uncheckNodeIsMarked.forEach(l => l.isMarked = false);
                        return Promise.resolve({ continueDelete: true, selectdNodeWitwoutDate: newSelectedNodes });
                    } else {
                        return Promise.resolve({ continueDelete: false });
                    }
                });
            }
        }
        return Promise.resolve({ continueDelete: true });
    }

    getRoot(): Promise<any[]> {
        return this.getData({ criteries: { DUE: '0%', LAYER: '0:2'/*, IS_NODE: '0'*/ } }, 'WEIGHT');
    }

    getChildren(record: IHierCL): Promise<any[]> {
        const _children = {
            // DUE: '0%',
            ISN_HIGH_NODE: record.ISN_NODE + '',
        };
        const query = [];
        query.push(this.getData({ criteries: _children }, 'DUE'));
        query.push(this.apiSrv.read<SEV_ASSOCIATION>({SEV_ASSOCIATION: PipRX.criteries({ 'OBJECT_NAME': 'DEPARTMENT' })}));
        return Promise.all(query)
        .then(([department, sev]) => {
            if (sev && sev.length > 0) {
                department.forEach((org: DEPARTMENT) => {
                    const index = sev.findIndex((sev_) => sev_.OBJECT_ID === org.DUE);
                    if (index !== -1) {
                        org['sev'] = sev[index];
                    }
                })
            }
            return department;
        });
    }

    getRelated(rec: any, orgDUE: string, refresh: boolean = false): Promise<any> {
        const pUser = this.apiSrv
            .read({ 'USER_CL': PipRX.criteries({ 'DUE_DEP': rec['DUE'] }) })
            .then((items) => this.apiSrv.entityHelper.prepareForEdit(items[0]));
        if (refresh) {
            this.apiSrv.cache.clear({ ORGANIZ_CL: [orgDUE] });
        }
        const pOrganization = (orgDUE) ? this.getCachedRecord({ ORGANIZ_CL: [orgDUE] }) : Promise.resolve(null);
        const pCabinet = (rec['ISN_CABINET']) ? this.getCachedRecord({ 'CABINET': rec['ISN_CABINET'] }) : Promise.resolve(null);
        const pCabinets = this.getCachedRecord({ 'CABINET': { 'criteries': { DUE: rec.DUE } } });
        const pReplace = this.apiSrv
            .read({ 'DEP_REPLACE': PipRX.criteries({ DUE: rec.DUE }) })
            .then(items => {
                const replace = items[0];
                if (replace && replace['DUE_REPLACE']) {
                    return this.apiSrv.read({ 'DEPARTMENT': PipRX.criteries({ DUE: replace['DUE_REPLACE'] }) })
                        .then(dep => {
                            if (dep.length && dep[0]['CLASSIF_NAME']) {
                                replace['DUE_REPLACE_NAME'] = dep[0]['CLASSIF_NAME'];
                            }
                            if (dep.length && dep[0]) {
                                replace['DELETED_DUE_REPLACE_NAME'] = +dep[0]['DELETED'];
                            }
                            return this.apiSrv.entityHelper.prepareForEdit(replace, 'DEP_REPLACE');
                        });
                }
                return this.apiSrv.entityHelper.prepareForEdit(replace, 'DEP_REPLACE');
            });

        let owner = rec['ISN_NODE'].toString();
        if (!rec['IS_NODE'] && rec['ISN_HIGH_NODE'] !== undefined && rec['ISN_HIGH_NODE'] !== null) {
            owner += '|' + rec['ISN_HIGH_NODE'].toString();
        }

        const pPrintInfo = this.apiSrv
            .read<CB_PRINT_INFO>({
                CB_PRINT_INFO: PipRX.criteries({
                    ISN_OWNER: owner,
                    OWNER_KIND: '104'
                })
            })
            .then((items) => {
                const info = items.find((item) => item.ISN_OWNER === rec['ISN_NODE']);
                return this.apiSrv.entityHelper.prepareForEdit<CB_PRINT_INFO>(info || items[0], 'CB_PRINT_INFO');
            });

        const pPhotoImg = (rec['ISN_PHOTO']) ? this.apiSrv.read({ DELO_BLOB: rec['ISN_PHOTO'] }) : Promise.resolve([]);

        return Promise.all([pUser, pOrganization, pCabinet, pPrintInfo, pCabinets, pPhotoImg, pReplace])
            .then(([user, org, cabinet, printInfo, cabinets, photoImgs, replace]) => {
                const img = (photoImgs[0]) ? <IImage>{
                    data: photoImgs[0]['CONTENTS'],
                    extension: photoImgs[0]['EXTENSION'],
                    url: `url(data:image/${photoImgs[0]['EXTENSION']};base64,${photoImgs[0]['CONTENTS']})`
                } : null;
                return {
                    user: user,
                    organization: org,
                    cabinet: cabinet,
                    cabinets: cabinets,
                    printInfo: printInfo,
                    photo: img,
                    replace: replace,
                };
            });
    }

    getContacts(orgISN: string): Promise<any> {
        return this.apiSrv.read({ 'CONTACT': PipRX.criteries({ 'ISN_ORGANIZ': orgISN }) });
    }

    getNewRecord(preSetData: {}, parentNode: EosDictionaryNode): {} {
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

    markBooleanData(records: any[], fieldName: string, boolValue, cascade = false): Promise<any[]> {
        if (fieldName === 'DELETED' && boolValue) {
            records.forEach((record) => record.POST_H = 0);
        }

        return super.markBooleanData(records, fieldName, boolValue, cascade);
    }

    public onPreparePrintInfo(dec: FieldsDecline): Promise<any[]> {
        return this.apiSrv.read({ PreparePrintInfo: PipRX.args(dec) });
    }

    protected _initRecord(data: IDictionaryDescriptor) {
        this.record = new DepartmentRecordDescriptor(this, <IDepartmentDictionaryDescriptor>data);
    }
    public async updateRecord(originalData, updates, appendToChanges): Promise<any> {
        if (updates && updates.replace && updates.replace['CLEAR_ROWS_SET_HISTORY'] === CLEAR_EXPORT) {
            await this.apiSrv.batch([{
                method: 'MERGE',
                    requestUri: `DEP_REPLACE('${updates.replace.DUE}')`,
                    data: {
                        DUE_REPLACE: null,
                        END_DATE: null,
                        REASON: null,
                        START_DATE: null
                    }
            }], '');
            updates.replace['_orig']['DUE_REPLACE'] = null;
            updates.replace['_orig']['END_DATE'] = null;
            updates.replace['_orig']['REASON'] = null;
            updates.replace['_orig']['START_DATE'] = null;
        }
        return super.updateRecord(originalData, updates, appendToChanges);
    }
}
