import { Injectable, Injector } from '@angular/core';
import { BaseUserSrv } from './base-user.service';
import { VISUALIZATION_USER } from '../consts/visualization.consts';
import { Subject } from 'rxjs/Subject';
import { EosUtils } from 'eos-common/core/utils';
@Injectable()
export class UserParamVisualizationSrv extends BaseUserSrv {
     _ngUnsubscribe: Subject<any> = new Subject();
    constructor( injector: Injector ) {
        super(injector, VISUALIZATION_USER);
        this.init();
        this._userParamsSetSrv.saveData$
        .takeUntil(this._ngUnsubscribe)
        .subscribe(() => {
            this.submit();
        });
    }
    subscribeChangeForm() {
        this.subscriptions.push(
            this.form.valueChanges
                .debounceTime(200)
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
        this.subscriptions.push(
            this.form.statusChanges.subscribe(status => {
                if (this._currentFormStatus !== status) {
                    this.formInvalid.emit(status === 'INVALID');
                }
                this._currentFormStatus = status;
            })
        );
    }
    private _pushState () {
        this._userParamsSetSrv.setChangeState({isChange: this.isChangeForm});
      }
}
