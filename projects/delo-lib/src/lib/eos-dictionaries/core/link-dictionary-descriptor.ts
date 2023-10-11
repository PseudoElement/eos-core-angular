import {EosUtils} from '../../eos-common/core/utils';
import {ALL_ROWS} from '../../eos-rest/core/consts';
import {PipRX, SEV_ASSOCIATION} from '../../eos-rest';
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
        const queryAll = [];
        queryAll.push(this.apiSrv.read(req));
        queryAll.push(this.apiSrv.read<SEV_ASSOCIATION>({SEV_ASSOCIATION: PipRX.criteries({ 'OBJECT_NAME': 'LINK_CL' })}));
        return Promise.all(queryAll)
            .then(([data, sev]) => {
                this.prepareForEdit(data);
                const newData = [];
                data.forEach((rec) => {
                    if (sev && sev.length > 0) {
                        data.forEach((link: LINK_CL) => {
                            const index = sev.findIndex((sev_) => +sev_.OBJECT_ID.split('#')[1] === +link.ISN_LCLASSIF);
                            if (index !== -1) {
                                link['sev'] = sev[index];
                            }
                        })
                    }
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

    addRecord(data: any, _useless: any, appendToChanges: any = null, isProtected = false, isDeleted = false): Promise<any> {
        const results: IRecordOperationResult[] = [];
        let _newRec = this.preCreate(isProtected, isDeleted);
        _newRec = this.apiSrv.entityHelper.prepareAdded<any>(_newRec, this.apiInstance);
        Object.assign(_newRec, data.rec);


        _newRec[ISN_LCLASSIF] = this.apiSrv.sequenceMap.GetTempISN();
        let _newPare = null;
        if (data['PARE_LINK_Ref']['CLASSIF_NAME'] === data['rec']['CLASSIF_NAME']
            || !data['PARE_LINK_Ref']['CLASSIF_NAME']) {
            _newRec['ISN_PARE_LINK'] = _newRec[ISN_LCLASSIF];

        } else {
            _newPare = this.preCreate(isProtected, isDeleted);
            _newPare = this.apiSrv.entityHelper.prepareAdded<any>(_newPare, this.apiInstance);
            Object.assign(_newPare, data['PARE_LINK_Ref']);
            _newPare[ISN_LCLASSIF] = this.apiSrv.sequenceMap.GetTempISN();

            _newRec['ISN_PARE_LINK'] = _newPare[ISN_LCLASSIF];
            _newPare['ISN_PARE_LINK'] = _newRec[ISN_LCLASSIF];
            _newPare['LINK_TYPE'] = _newRec['LINK_TYPE'];
        }



        let pSev: Promise<boolean> = Promise.resolve(true);
        const changeData = [];
        if (data['sev']) {
            pSev = this.presaveSevRoutine(data['sev'], _newRec, changeData, results);
        }

        return pSev.then(() => {
            const t = [_newRec];
            if (_newPare) {
                t.push(_newPare);
            }
            const changes = this.apiSrv.changeList(t.concat(...changeData));
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

        });



    }

    updateRecord(originalData: any, updates: any): Promise<IRecordOperationResult[]> {
        const changeData = [];
        let pSev: Promise<boolean> = Promise.resolve(true);
        const results: IRecordOperationResult[] = [];
        Object.keys(updates).forEach((key) => {
            if (updates[key]) {
                switch (key) {
                    case 'sev': // do nothing handle sev later
                        const d = EosUtils.deepUpdate(originalData[key], updates[key]);
                        pSev = this.presaveSevRoutine(d, originalData.rec, changeData, results);
                        break;
                    case 'rec':
                    case 'sev':
                    case 'PARE_LINK_Ref':
                        const data = EosUtils.deepUpdate(originalData[key], updates[key]);
                        changeData.push(data);
                        break;
                }
            }
        });

        const record = EosUtils.deepUpdate(originalData.rec, updates.rec);
        return pSev.then((cont) => {
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
        });
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


    search(criteries: any[]): Promise<any[]> {
        const _search = criteries.map((critery) => this._findRawData(PipRX.criteries(critery)));

        return Promise.all(_search)
            .then((results) => {
                return [].concat(...results);
            }
        );
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

    private _findRawData(query?: any, order?: string, limit?: number): Promise<any[]> {
        if (!query) {
            query = ALL_ROWS;
        }
        const req = {[this.apiInstance]: query};

        return this.apiSrv
            .read(req)
            .then((data: any[]) => {
                const id_list = [];
                data.forEach((rec) => {
                    id_list.push(rec[ISN_LCLASSIF]);
                    id_list.push(rec['ISN_PARE_LINK']);
                });

                const q1 = Array.from(new Set(id_list));
                if (q1.length > 0) {
                    return this.getData(q1, order, limit);
                } else {
                    return Promise.resolve([]);
                }
            });
    }

}

