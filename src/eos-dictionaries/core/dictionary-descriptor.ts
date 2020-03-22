import { AbstractDictionaryDescriptor } from './abstract-dictionary-descriptor';
import { RecordDescriptor } from './record-descriptor';
import { ILinearCL } from 'eos-rest';
import { SEV_ASSOCIATION } from 'eos-rest/interfaces/structures';
import { SevIndexHelper } from 'eos-rest/services/sevIndex-helper';
import { IRecordOperationResult } from 'eos-dictionaries/interfaces';
import { EosDictionaryNode } from './eos-dictionary-node';
import { ConfirmWindowService } from 'eos-common/confirm-window/confirm-window.service';
import { CONFIRM_CHANGE_CONFIDENTIONAL_FLAG } from 'app/consts/confirms.const';

export class DictionaryDescriptor extends AbstractDictionaryDescriptor {
    record: RecordDescriptor;

    addRecord(data: any, _useless: any, appendToChanges: any = null, isProtected = false, isDeleted = false): Promise<any> {
        const results: IRecordOperationResult[] = [];

        let _newRec = this.preCreate(isProtected, isDeleted);
        if (this.metadata.pk) {
            _newRec[this.metadata.pk] = _newRec.ISN_LCLASSIF;
        }
        _newRec = this.apiSrv.entityHelper.prepareAdded<any>(_newRec, this.apiInstance);

        let pSev: Promise<boolean> = Promise.resolve(true);
        const changeData = [];
        if (data['sev']) {
            pSev = this.presaveSevRoutine(data['sev'], _newRec, changeData, results);
        }

        return pSev.then(() => {
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
        });
    }

    getChildren(): Promise<any[]> {
        return this.getData();
    }

    getSubtree(): Promise<any[]> {
        return Promise.resolve([]);
    }

    getRelatedSev(rec: any): Promise<SEV_ASSOCIATION> {
        return this.apiSrv
            .read<SEV_ASSOCIATION>({ SEV_ASSOCIATION: [SevIndexHelper.CompositePrimaryKey(rec['ISN_LCLASSIF'], this.apiInstance)] })
            .then((sev) => this.apiSrv.entityHelper.prepareForEdit<SEV_ASSOCIATION>(sev[0], 'SEV_ASSOCIATION'));
    }

    getRoot(): Promise<any[]> {
        return Promise.resolve([]);
        // return this.getData();
    }
    confirmSave(nodeData: EosDictionaryNode, confirmSrv: ConfirmWindowService, isNewRecord: boolean): Promise<boolean> {
        if (this.id === 'security' && !isNewRecord) {
            if (nodeData['rec'].CONFIDENTIONAL !== nodeData['rec']._orig.CONFIDENTIONAL) {
                const query1 = this.apiSrv.read({ PRJ_RC: { criteries: { SECURLEVEL: nodeData['rec'].SECURLEVEL } } });
                const query2 = this.apiSrv.read({ REF_FILE: { criteries: { SECURLEVEL: nodeData['rec'].SECURLEVEL } } });
                const query3 = this.apiSrv.read({ DOC_RC: { criteries: { SECURLEVEL: nodeData['rec'].SECURLEVEL } } });
                return Promise.all([query1, query2, query3]).then(data => {
                    const findDoc = data.reduce((prev, val) => {
                        if (val.length) {
                            prev += 1;
                        }
                        return prev;
                    }, 0);
                    if (findDoc) {
                        return confirmSrv.confirm2(CONFIRM_CHANGE_CONFIDENTIONAL_FLAG).then(button => {
                            if (button && button['result'] === 2) {
                                return true;
                            }
                            return false;
                        });
                    }
                    return Promise.resolve(true);
                });
            } else {
                return Promise.resolve(true);
            }
        } else {
            return Promise.resolve(true);
        }
    }

    public onPreparePrintInfo(): Promise<any> {
        return Promise.reject('Type of dictionary not true!');
    }

    protected preCreate(isProtected = false, isDeleted = false): ILinearCL {
        const _isn = this.apiSrv.sequenceMap.GetTempISN();
        const _res: ILinearCL = {
            ISN_LCLASSIF: _isn,
            PROTECTED: (isProtected ? 1 : 0),
            DELETED: (isDeleted ? 1 : 0),
            CLASSIF_NAME: '',
            NOTE: null,
            IS_FINAL: 0,
            STATUS: ''
        };
        return _res;
    }
}
