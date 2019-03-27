import { Injectable, Injector } from '@angular/core';
import { BaseUserSrv } from './base-user.service';
import { VISUALIZATION_USER } from '../consts/visualization.consts';
import { Subject } from 'rxjs/Subject';
import { EosUtils } from 'eos-common/core/utils';
import {PARM_CANCEL_CHANGE } from '../consts/eos-user-params.const';
@Injectable()
export class UserParamVisualizationSrv extends BaseUserSrv {
     _ngUnsubscribe: Subject<any> = new Subject();
     flagEdit: boolean = false;
    constructor( injector: Injector ) {
        super(injector, VISUALIZATION_USER);
        this.init();
        this.editMode();
        this._userParamsSetSrv.saveData$
        .takeUntil(this._ngUnsubscribe)
        .subscribe(() => {
            this.submit();
        });
    }
    subscribeChangeForm() {
        this.subscriptions.push(
            this.form.valueChanges
                .subscribe(newVal => {
                    let changed = false;
                    Object.keys(newVal).forEach(path => {
                        this.oldValue = EosUtils.getValueByPath(this.prepareData, path, false);
                         if (this.changeByPath(path, newVal[path])) {
                            changed = true;
                         }
                    });
                this.formChanged.emit(changed);
                this.isChangeForm = changed;
                this._pushState();
            })
        );
    }
    submit() {
        super.submit();
        this.flagEdit = false;
        this.editMode();
    }
    cancel() {
        this.flagEdit = false;
        if (this.isChangeForm) {
           this.msgSrv.addNewMessage(PARM_CANCEL_CHANGE);
           this.isChangeForm = false;
           this.formChanged.emit(false);
           this.init();
        }

       setTimeout(() => {
        this.editMode();
       });
    }
    editMode() {
        if (this.flagEdit) {
            this.form.enable({emitEvent: false});
        }   else {
            this.form.disable({emitEvent: false});
        }
    }
    private _pushState () {
        this._userParamsSetSrv.setChangeState({isChange: this.isChangeForm});
      }
}
