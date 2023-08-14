import { Component, OnDestroy, OnChanges } from '@angular/core';
import { BaseNodeInfoComponent } from './base-node-info';
import { E_FIELD_TYPE } from '../../eos-dictionaries/interfaces';
import { IRelationDef } from '../../eos-rest';
import { EosDictService } from '../../eos-dictionaries/services/eos-dict.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AppContext } from '../../eos-rest/services/appContext.service';
import { E_DICTIONARY_ID } from '../consts/dictionaries/enum/dictionaryId.enum';

@Component({
    selector: 'eos-node-info',
    templateUrl: 'node-info.component.html',
})

export class NodeInfoComponent extends BaseNodeInfoComponent implements OnDestroy, OnChanges {
    private unSubscribe = new Subject();
    constructor(private dictSrv: EosDictService, private _appCtx: AppContext) {
        super();
        this.dictSrv.updateRigth.pipe(takeUntil(this.unSubscribe)).subscribe(r => {
            this.ngOnChanges();
        });
    }
    ngOnChanges() {
        super.ngOnChanges();
        this.updateFields(); //  костыль к багу 116332, переделать
    }
    updateFields() {
        if (this.dictSrv.currentDictionary.id  === E_DICTIONARY_ID.PARTICIPANT_SEV) {
            if (this._appCtx.cbBase && this.fieldsDescriptionFull.rec) {
                delete this.fieldsDescriptionFull.rec['CRYPT'];
            }
        }
        if (this.dictSrv.currentDictionary.id  === E_DICTIONARY_ID.RULES_SEV && Object.keys(this.nodeDataFull).length > 0 && this.node) {
            this.nodeDataFull.rec['DUE_DOCGROUP_NAME'] = this.node.data.DOCGROUP_Ref[0]['CLASSIF_NAME'];
            this.fieldsDescriptionFull.rec['DUE_DOCGROUP_NAME'].logDelet = this.node.data.DOCGROUP_Ref[0]['DELETED'];
        }
    }
    // TODO: объеденить  loadRelated и loadOptionsDictionary во что то одно внятное.
    value(key): string {
        if (this.values.hasOwnProperty(key)) {
            return this.values[key];
        }
        if (!this.node) {
            return null;
        }
        let res = this.nodeDataFull.rec[key];

        const field = this.fieldsDescriptionFull.rec[key];
        if ((field.type === E_FIELD_TYPE.select || field.type === E_FIELD_TYPE.buttons || field.type === E_FIELD_TYPE.radio)) {
            let f = null;
            if (field.options.length) {
                f = field.options.find((op) => op.value === res);
            }

            if (f) {
                res = f.title;
            } else {
                // TODO: Убрать\модернизировать related и options
                const relations: IRelationDef[] = this.node.dictionary.descriptor.getMetadata().relations;
                const rel: IRelationDef = relations.find(r => r.__type === field.dictionaryId);
                if (rel) {
                    const rec = this.node.data[rel.name];
                    if (rec && rec.length) {
                        res = rec[0]['CLASSIF_NAME'];
                    }
                }
            }
        }
        this.values[key] = res;
        return res;
    }
    ngOnDestroy() {
        this.unSubscribe.next();
        this.unSubscribe.complete();
    }
}
