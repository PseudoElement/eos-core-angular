import { Component, Injector, NgZone, OnInit, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { BaseCardEditDirective } from './base-card-edit.component';
import { WaitClassifService } from '../../app/services/waitClassif.service';
import { EosDictService } from '../services/eos-dict.service';
import { OPEN_CLASSIF_DOCGROUP_FOR_FILE_CAT } from '../../app/consts/query-classif.consts';
import { EosMessageService } from '../../eos-common/services/eos-message.service';
import { WARN_NO_BINDED_DOCGROUP } from '../consts/messages.consts';
import { FileCategoryDictionaryDescriptor } from '../core/file-category-dictionary-descriptor';

@Component({
    selector: 'eos-file-category-card-edit',
    templateUrl: 'file-categories-card-edit.component.html',
    styleUrls: ['./file-categories-card-edit.component.scss']
})
export class FileCategoryCardEditComponent extends BaseCardEditDirective implements OnChanges, OnInit {
    @Output() formChanged: EventEmitter<any> = new EventEmitter<any>();

    get isDocGroup(): boolean {
        return !!this.data.rec['DOC_GROUP_NAMES'];
    }

    constructor(
        injector: Injector,
        private _classifService: WaitClassifService,
        private _dictService: EosDictService,
        private _zone: NgZone,
        private _msgService: EosMessageService,
    ) {
        super(injector);
    }

    ngOnInit(): void {
        const DESC = this._dictService.currentDictionary.descriptor as FileCategoryDictionaryDescriptor;
        if (this.data.rec.DG_FILE_CATEGORY_List) {
            DESC.setDocGroupNames([this.data.rec]).then(resp => this.inputs['rec.DOC_GROUP_NAMES'].value = resp[0]['DOC_GROUP_NAMES']);
        } else {
            this.inputs['rec.DOC_GROUP_NAMES'].value = '';
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        if (this.form) {
            this.unsubscribe();
            this.formChanges$ = this.form.valueChanges.subscribe((formChanges) => this._updateForm(formChanges));
        }
    }

    selectDocGroup() {
        if (this.editMode) {
            this._zone.runOutsideAngular(() => {
                return this._classifService.openClassif(OPEN_CLASSIF_DOCGROUP_FOR_FILE_CAT).then((dues: string) => {
                    if (dues && dues.length > 0) {
                        this._zone.run(() => this._bindDocGroups(dues));
                    }
                })
                    .catch((err) => {
                    });
            });
        }
    }

    clearDocGroup() {
        if (this.isDocGroup) {
            this._bindDocGroups(null);
        } else {
            this._msgService.addNewMessage(WARN_NO_BINDED_DOCGROUP);
        }
    }

    protected setValue(path: string, value: any, emit = true) {
        const control = this.form.controls[path];
        if (control) {
            control.setValue(value, { emitEvent: emit });
        }
    }

    private _bindDocGroups(dues: any) {
        if (this.isNewRecord || !this.data.__relfield) {
            this.data.__relfield = {};
        }
        this.data.__relfield['DUE_NODE_DG'] = dues;
        this._dictService.bindDocGroups(dues).then(docGroups => this._setDocGroupNames(docGroups));
    }

    private _setDocGroupNames(docGroups) {
        if (docGroups) {
            const NAMES = docGroups.map(item => item.CLASSIF_NAME);
            this.inputs['rec.DOC_GROUP_NAMES'].value = NAMES.join(', ');
            this.form.controls['rec.DOC_GROUP_NAMES'].patchValue(NAMES.join(', '));
        } else {
            this.inputs['rec.DOC_GROUP_NAMES'].value = null;
            this.form.controls['rec.DOC_GROUP_NAMES'].patchValue(null);
        }

    }

    private _updateForm(formChanges) {
    }

}
