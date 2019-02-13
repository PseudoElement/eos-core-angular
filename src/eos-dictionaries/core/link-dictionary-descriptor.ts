import { EosUtils } from '../../eos-common/core/utils';
import { ALL_ROWS } from '../../eos-rest/core/consts';
import { PipRX } from '../../eos-rest/services/pipRX.service';
import { IDictionaryDescriptor, IRecordOperationResult } from '../interfaces';
import { DictionaryDescriptor } from './dictionary-descriptor';
import {ConfirmWindowService} from '../../eos-common/confirm-window/confirm-window.service';
import {CONFIRM_LINK_CHECK_CATEGORY} from '../consts/confirm.consts';
import { LINK_CL } from 'eos-rest';

const LINK_TYPE = 'LINK_TYPE';
const ISN_LCLASSIF = 'ISN_LCLASSIF';

export class LinkDictionaryDescriptor extends DictionaryDescriptor {

    private _findedNodes: any;

    constructor(
        descriptor: IDictionaryDescriptor,
        apiSrv: PipRX,
    ) {
        super(descriptor, apiSrv);
    }

    getData(query?: any, order?: string, limit?: number): Promise<any[]> {
        if (!query) {
            query = ALL_ROWS;
        }

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
                const newData = [];
                data.forEach((rec) => {
                    if (rec[ISN_LCLASSIF] <= rec['ISN_PARE_LINK']) {
                        rec['LINK'] = rec['CLASSIF_NAME'];
                        rec['TYPE'] = rec['LINK_TYPE'];
                        data.forEach((pair) => {
                            if (rec['ISN_PARE_LINK'] === pair[ISN_LCLASSIF]) {
                                rec['PAIR_LINK'] = pair['CLASSIF_NAME'];
                            }
                        });
                        newData.push(rec);
                    }
                });
                return newData;
            });
    }

    addRecord(data: any, _useless: any, isProtected = false, isDeleted = false): Promise<any> {
        const results: IRecordOperationResult[] = [];
        let _newRec = this.preCreate(isProtected, isDeleted);
        _newRec = this.apiSrv.entityHelper.prepareAdded<any>(_newRec, this.apiInstance);
        Object.assign(_newRec, data.rec);

        let _newPare = this.preCreate(isProtected, isDeleted);
        _newPare = this.apiSrv.entityHelper.prepareAdded<any>(_newPare, this.apiInstance);
        Object.assign(_newPare, data['PARE_LINK_Ref']);

        _newRec[ISN_LCLASSIF] = this.apiSrv.sequenceMap.GetTempISN();
        _newPare[ISN_LCLASSIF] = this.apiSrv.sequenceMap.GetTempISN();

        _newRec['ISN_PARE_LINK'] = _newPare[ISN_LCLASSIF];
        _newPare['ISN_PARE_LINK'] = _newRec[ISN_LCLASSIF];
        _newPare['LINK_TYPE'] = _newRec['LINK_TYPE'];

        const changes = this.apiSrv.changeList([_newRec, _newPare]);

        if (changes) {
            this._appendCategoryOldChange(changes);
            return this.apiSrv.batch(changes, '')
                .then((res) => {
                    res.forEach((r) => {
                        results.push({success: true, record: r.ID});
                        }
                    );

                    return results;
                });
        } else {
            return Promise.resolve(results);
        }
    }

    updateRecord(originalData: any, updates: any): Promise<IRecordOperationResult[]> {
        const changeData = [];
        const results: IRecordOperationResult[] = [];
        Object.keys(updates).forEach((key) => {
            if (updates[key]) {
                if (key.indexOf('_') !== 0) {
                    const data = EosUtils.deepUpdate(originalData[key], updates[key]);
                    changeData.push(data);
                }
            }
        });

        const record = EosUtils.deepUpdate(originalData.rec, updates.rec);
        const changes = this.apiSrv.changeList(changeData);
        if (changes.length) {
            this._appendCategoryOldChange(changes);
            return this.apiSrv.batch(changes, '')
                .then(() => {
                    results.push({success: true, record: record});
                    return results;
                });
        } else {
            return Promise.resolve(results);
        }
    }

    markBooleanData(records: any[], fieldName: string, boolValue, cascade = false): Promise<any[]> {
        records.forEach((record) => record[fieldName] = +boolValue);
        const changes = this.apiSrv.changeList(records);

        if (changes.length) {
            records.forEach((record) =>{
                changes.push(Object.assign(EosUtils.deepUpdate({}, changes[0]), {
                    requestUri: 'LINK_CL(' + record.ISN_PARE_LINK +')'}));
            });
        }
    
        return this.apiSrv.batch(changes, '');
    }

    confirmSave(nodeData: any, confirmSrv: ConfirmWindowService): Promise<boolean> {
        const linkType = this._getRecField(nodeData, LINK_TYPE);
        if (linkType) {
            return this.apiSrv.read<LINK_CL>({LINK_CL: PipRX.criteries({LINK_TYPE: linkType.toString()})})
                .then((records) => {
                    const isn = this._getRecField(nodeData, ISN_LCLASSIF);
                    const findCurrent = records.find((rec) => rec[ISN_LCLASSIF] === isn);
                    if (records.length && !findCurrent) {
                        this._findedNodes = records;
                        return this._confimDuplCategory(linkType, confirmSrv);
                    }
                    return true;
                });
        }
        return Promise.resolve(true);
    }

    private _appendCategoryOldChange(changes) {
        const changeData = [];
        if (this._findedNodes) {
            this.prepareForEdit(this._findedNodes);
            this._findedNodes.forEach(el => {
                changeData.push(Object.assign(el, {LINK_TYPE: null, LINK_DIR: null}));
            });

            changes.push(...this.apiSrv.changeList(changeData));
            this._findedNodes = null;
        }
    }

    private _getRecField(data: any, fieldName: string): any {
        return data['rec'] ? data['rec'][fieldName] : null;
    }

    private _confimDuplCategory(index: string, confirmSrv: ConfirmWindowService): Promise<boolean> {
        return confirmSrv.confirm(CONFIRM_LINK_CHECK_CATEGORY)
            .then((doSave) => {
                return doSave;
            });
    }
}


