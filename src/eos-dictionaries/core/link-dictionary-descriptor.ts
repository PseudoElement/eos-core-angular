import {EosUtils} from '../../eos-common/core/utils';
import {ALL_ROWS} from '../../eos-rest/core/consts';
import {PipRX} from '../../eos-rest';
import {IDictionaryDescriptor, IRecordOperationResult} from '../interfaces';
import {DictionaryDescriptor} from './dictionary-descriptor';
import {RecordDescriptor} from './record-descriptor';
import {LINK_CL} from '../../eos-rest';

const ISN_LCLASSIF = 'ISN_LCLASSIF';

export class LinkRecordDescrtiptor extends RecordDescriptor {
    getEditFieldDescription(): any {
        const fieldDescription = super.getEditFieldDescription();
        fieldDescription['PARE_LINK_Ref'] = fieldDescription['rec'];
        return fieldDescription;
    }
}

export class LinkDictionaryDescriptor extends DictionaryDescriptor {
    record: LinkRecordDescrtiptor;

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
            return this._appendCategoryOldChange(changes, data)
                .then(() => {
                    return this.apiSrv.batch(changes, '')
                        .then((res) => {
                            res.forEach((r) => results.push({success: true, record: r.ID}));
                            return results;
                        });
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
                switch (key) {
                    case 'rec':
                    case 'PARE_LINK_Ref':
                        const data = EosUtils.deepUpdate(originalData[key], updates[key]);
                        changeData.push(data);
                        break;
                }
            }
        });

        const record = EosUtils.deepUpdate(originalData.rec, updates.rec);
        const changes = this.apiSrv.changeList(changeData);
        if (changes.length) {
            return this._appendCategoryOldChange(changes, updates)
                .then(() => {
                    return this.apiSrv.batch(changes, '')
                        .then(() => {
                            results.push({success: true, record: record});
                            return results;
                        });
                });
        } else {
            return Promise.resolve(results);
        }
    }

    markBooleanData(records: any[], fieldName: string, boolValue, cascade = false): Promise<any[]> {
        records.forEach((record) => record[fieldName] = +boolValue);
        const changes = this.apiSrv.changeList(records);

        if (changes.length) {
            records.forEach((record) => {
                changes.push(Object.assign(EosUtils.deepUpdate({}, changes[0]), {
                    requestUri: 'LINK_CL(' + record.ISN_PARE_LINK + ')'}));
            });
        }
        return this.apiSrv.batch(changes, '');
    }

    protected _initRecord(descriptorData: IDictionaryDescriptor) {
        this.record = new LinkRecordDescrtiptor(this, descriptorData);
    }

    private _appendCategoryOldChange(changes, updates: any): Promise<any> {
        const changeData = [];
        const linkType = updates.rec['LINK_TYPE'];
        if (linkType) {
            return this.apiSrv.read<LINK_CL>({LINK_CL: PipRX.criteries({LINK_TYPE: linkType.toString()})})
                .then((records) => {
                    const isn = updates.rec[ISN_LCLASSIF];
                    const findCurrent = records.find((rec) => rec[ISN_LCLASSIF] === isn);
                    if (records.length && !findCurrent) {
                        this.prepareForEdit(records);
                        records.forEach(el => {
                            changeData.push(Object.assign(el, {LINK_TYPE: null, LINK_DIR: null}));
                        });
                        changes.push(...this.apiSrv.changeList(changeData));
                    }
                });
        } else {
            return Promise.resolve(null);
        }
    }
}

