import { DictionaryDescriptor } from './dictionary-descriptor';
import { CABINET, USER_CABINET, DEPARTMENT, USER_CL, FOLDER } from 'eos-rest';
import { PipRX } from 'eos-rest/services/pipRX.service';
import { ALL_ROWS, _ES } from 'eos-rest/core/consts';
import { IRecordOperationResult, IDictionaryDescriptor } from '../interfaces';
import { RecordDescriptor } from './record-descriptor';
import { EosUtils } from 'eos-common/core/utils';
import { CABINET_FOLDERS } from '../consts/dictionaries/cabinet.consts';
import {DictionaryComponent} from '../dictionary/dictionary.component';
import {DANGER_EDIT_ON_ROOT} from '../consts/messages.consts';
import {IMessage} from '../../eos-common/core/message.interface';

export class CabinetRecordDescriptor extends RecordDescriptor {
    constructor(dictionary: CabinetDictionaryDescriptor, data: IDictionaryDescriptor) {
        super(dictionary, data);
        this._initFieldSets(['fullSearchFields'], data);
    }
}

export class CabinetDictionaryDescriptor extends DictionaryDescriptor {

    addRecord(data: any, _parent: any, isProtected = false, isDeleted = false): Promise<any> {
        this.apiSrv.entityHelper.prepareAdded<CABINET>(data.rec, this.apiInstance);
        data.rec['FOLDER_List'].forEach((folder, idx) => {
            folder.ISN_FOLDER = this.apiSrv.sequenceMap.GetTempISN();
            folder.ISN_CABINET = data.rec.ISN_CABINET;
        });
        const changes = this.apiSrv.changeList([data.rec]);
        return this.apiSrv.batch(changes, '')
            .then(([resp]: any[]) => {
                if (resp) {
                    return this.updateOwnersCabinet(data.owners, data.rec.ISN_CABINET, resp.ID)
                        .then(() => resp.ID);
                } else {
                    return null;
                }
            });
    }

    preCreateCheck(dict: DictionaryComponent): IMessage {
        if (dict.treeNode.id === '0.') {
            return DANGER_EDIT_ON_ROOT;
        }
        return null;
    }

    getData(query?: any, order?: string, limit?: number): Promise<any[]> {
        if (!query) {
            query = ALL_ROWS;
        }

        // console.warn('getData', query, order, limit);

        const req = { [this.apiInstance]: query };

        if (limit) {
            req.top = limit;
        }

        if (order) {
            req.orderby = order;
        }

        req.expand = 'FOLDER_List';

        return this.apiSrv
            .read(req)
            .then((data: any[]) => {
                this.prepareForEdit(data);
                data.forEach((rec) => {
                    this.prepareForEdit(rec.FOLDER_List);
                });
                const dues = [];
                data.forEach((rec) => {
                    if (dues.findIndex((due) => due === rec.DUE) < 0) {
                        dues.push(rec.DUE);
                    }
                });
                if (dues.length) {
                    return this.apiSrv.read({ 'DEPARTMENT': dues })
                        .then((departments) => {
                            data.forEach((rec) => {
                                const dept = departments.find((d) => d['DUE'] === rec.DUE);
                                if (dept) {
                                    rec['DEPARTMENT_NAME'] = dept['CLASSIF_NAME'];
                                } else {
                                    rec['DEPARTMENT_NAME'] = '';
                                }
                            });
                            return data;
                        });
                } else {
                    return data;
                }
            });
    }

    getNewRecord(preSetData: any) {
        const rec = super.getNewRecord(preSetData);
        EosUtils.setValueByPath(rec, 'rec.ISN_CABINET', this.getTempISN());
        EosUtils.setValueByPath(rec, 'cabinetAccess', []);
        EosUtils.setValueByPath(rec, 'users', []);
        EosUtils.setValueByPath(rec, 'rec.FOLDER_List',
            CABINET_FOLDERS.map((fConst) =>
                this.apiSrv.entityHelper.prepareAdded<FOLDER>({ FOLDER_KIND: fConst.key, USER_COUNT: 1 }, 'FOLDER')
            )
        );
        return rec;
    }

    getParentDictionaryId(): string {
        return 'departments';
    }

    getRelated(rec: CABINET): Promise<any> {
        const reqs = [
            this.apiSrv.read({ 'FOLDER': PipRX.criteries({ 'ISN_CABINET': rec.ISN_CABINET + '' }) }),
            this.apiSrv.read({ 'DEPARTMENT': [rec.DUE] })
                .then(([department]: DEPARTMENT[]) => {
                    return this.getOwners(department.DEPARTMENT_DUE)
                        .then((owners) => [department, owners]);
                }),
            this.apiSrv.read({ 'USER_CABINET': PipRX.criteries({ 'ISN_CABINET': rec.ISN_CABINET + '' }) })
                .then((userCabinet: USER_CABINET[]) => {
                    this.prepareForEdit(userCabinet);
                    const userIds = userCabinet.map((u2c) => u2c.ISN_LCLASSIF);
                    if (userIds.length) {
                        return this.apiSrv.read<USER_CL>({ 'USER_CL': userIds })
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

    updateRecord(originalData: any, updates: any): Promise<IRecordOperationResult[]> {
        const changeData = [];
        const results: IRecordOperationResult[] = [];
        Object.keys(updates).forEach((key) => {
            switch (key) {
                case 'owners':
                    updates[key].forEach((item, idx) => {
                        changeData.push(EosUtils.deepUpdate(originalData[key][idx], item));
                    });
                    break;
                case 'rec':
                    changeData.push(EosUtils.deepUpdate(originalData[key], updates[key]));
                    break;
                default: // do nothing
            }
        });
        const changes = this.apiSrv.changeList(changeData);
        if (changes && changes.length) {
            return this.apiSrv.batch(changes, '')
                .then(() => {
                    results.push({ success: true, record: originalData.rec });
                    return results;
                });
        } else {
            return Promise.resolve(results);
        }
    }

    getOwners(depDue: string): Promise<DEPARTMENT[]> {
        return this.apiSrv.read<DEPARTMENT>({ 'DEPARTMENT': PipRX.criteries({ 'IS_NODE': '1', DEPARTMENT_DUE: depDue }) })
            .then((owners) => {
                this.prepareForEdit(owners);
                return owners;
            });
    }

    protected deleteRecord(record: CABINET): Promise<IRecordOperationResult> {
        return this.getOwners(record.DUE)
            .then((owners) => this.updateOwnersCabinet(owners, record.ISN_CABINET, null))
            .then(() => {
                record._State = _ES.Deleted;
                const changes = this.apiSrv.changeList([record]);
                return this.apiSrv.batch(changes, '')
                    .then(() => {
                        return <IRecordOperationResult>{
                            record: record,
                            success: true
                        };
                    });
            }).catch((err) => {
                return <IRecordOperationResult>{
                    record: record,
                    success: false,
                    error: err
                };
            });
    }

    protected _initRecord(data: IDictionaryDescriptor) {
        this.record = new CabinetRecordDescriptor(this, data);
    }

    private updateOwnersCabinet(owners: DEPARTMENT[], oldCabinetIsn: number, newCabinetIsn: number): Promise<any> {
        let pUpdate = Promise.resolve(null);
        if (owners) {
            const updatedOwners = owners
                .filter((owner: DEPARTMENT) => owner.ISN_CABINET === oldCabinetIsn)
                .map((owner) => {
                    owner.ISN_CABINET = newCabinetIsn;
                    return owner;
                });
            const ownersChanges = this.apiSrv.changeList(updatedOwners);
            if (ownersChanges) {
                pUpdate = this.apiSrv.batch(ownersChanges, '');
            }
        }
        return pUpdate;
    }
}
