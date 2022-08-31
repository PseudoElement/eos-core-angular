import { Component, Injector, NgZone, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { BaseCardEditComponent } from './base-card-edit.component';
import { WaitClassifService } from 'app/services/waitClassif.service';
import { EosDictService } from '../services/eos-dict.service';
import { OPEN_CLASSIF_DOCGROUP_FOR_FILE_CAT } from 'app/consts/query-classif.consts';
import { EosMessageService } from 'eos-common/services/eos-message.service';
import { WARN_NO_BINDED_DOCGROUP } from '../consts/messages.consts';
@Component({
    selector: 'eos-file-category-card-edit',
    templateUrl: 'file-categories-card-edit.component.html',
    styleUrls: ['./file-categories-card-edit.component.scss']
})
export class FileCategoryCardEditComponent extends BaseCardEditComponent implements OnChanges, OnInit {
    docGroupsName: string = '';
    // private _api: PipRX;

    get isDocGroup(): boolean {
        return this.data.__relfield['ISN_NODE_DG'];
    }

    constructor(
        injector: Injector,
        private _classifService: WaitClassifService,
        private _dictService: EosDictService,
        private _zone: NgZone,
        private _msgService: EosMessageService,
    ) {
        super(injector);
        // this._api = injector.get(PipRX);
    }

    ngOnInit(): void {
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
                    console.log(dues);
                    if (dues && dues.length > 0) {
                    this._zone.run(() => this._bindDocGroups(dues));
                    }
                })
                .catch(() => {
                    console.log('window closed');
                });
          });
      }
    }

    unbindDocGroup() {
        if (this.isDocGroup) {
            this._dictService.unbindOrganization();
            this.docGroupsName = '';
            this.data.__relfield['ISN_NODE_DG'] = null;
            // this.setValue('rec.ISN_NODE_DG', null);
        } else {
            this._msgService.addNewMessage(WARN_NO_BINDED_DOCGROUP);
        }
    }

    protected setValue(path: string, value: any, emit = true) {
        const control = this.form.controls[path];
        if (control) {
            control.setValue(value, {emitEvent: emit});
        }
    }

    private _bindDocGroups(dues: string) {
       this._dictService.bindDocGroups(dues).then((groups) => this._setData(groups));
    }

    private _setData(groups) {
        if (groups) {
            if (this.isNewRecord || !this.data.__relfield) {
                this.data.__relfield = { };
            }
            this._setDocGroupsName(groups);
            const ITEMS = [];
            groups.forEach(x => {
                                  ITEMS.push(x.ISN_LCLASSIF);
                                 });
            this.data.__relfield['ISN_NODE_DG'] = ITEMS.join('|');
        }
    }

    private _updateForm(changes: SimpleChanges) {
    }

    private _setDocGroupsName(groups) {
       const NAMES = groups.map(item => item.CLASSIF_NAME);
       this.docGroupsName = NAMES.join(', ');
    }

}
