import { AbstractDictionaryDescriptor } from './abstract-dictionary-descriptor';
import { RecordDescriptor } from './record-descriptor';
import { ILinearCL } from 'eos-rest';
import { SEV_ASSOCIATION } from 'eos-rest/interfaces/structures';
import { SevIndexHelper } from 'eos-rest/services/sevIndex-helper';

export class DictionaryDescriptor extends AbstractDictionaryDescriptor {
    record: RecordDescriptor;

    addRecord(data: any, _useless: any, appendToChanges: any = null, isProtected = false, isDeleted = false): Promise<any> {
        let _newRec = this.preCreate(isProtected, isDeleted);
        _newRec = this.apiSrv.entityHelper.prepareAdded<any>(_newRec, this.apiInstance);
        return this._postChanges(_newRec, data.rec, appendToChanges)
            .then((resp: any[]) => {
                if (resp && resp[0]) {
                    return resp[0].ID;
                } else {
                    return null;
                }
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
