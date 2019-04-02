import { Injectable, Injector } from '@angular/core';
import { BaseUserSrv } from './base-user.service';
import { VISUALIZATION_USER } from '../consts/visualization.consts';
import { Subject } from 'rxjs/Subject';
import { EosUtils } from 'eos-common/core/utils';
import {PARM_CANCEL_CHANGE, PARM_SUCCESS_SAVE } from '../consts/eos-user-params.const';
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
            this._userParamsSetSrv.submitSave = this.submit();
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
    submit(): Promise<any> {
        if (this.newData || this.prepareData) {
            const userId = '' + this._userParamsSetSrv.userContextId;
            this.formChanged.emit(false);
            this.isChangeForm = false;
            this.flagEdit = false;
            this._pushState();
            this.editMode();
            // this._userParamsSetSrv.getUserIsn();
            if (this.newData) {
         return  this.userParamApiSrv
                .setData(this.createObjRequest())
                .then(data => {
                   // this.prepareData.rec = Object.assign({}, this.newData.rec);
                    this.msgSrv.addNewMessage(PARM_SUCCESS_SAVE);
                    this._userParamsSetSrv.getUserIsn(userId);
                })
                // tslint:disable-next-line:no-console
                .catch(data => console.log(data));
            } else if (this.prepareData) {
             return  this.userParamApiSrv
                .setData(this.createObjRequestForDefaultValues())
                .then(data => {
                    this.msgSrv.addNewMessage(PARM_SUCCESS_SAVE);
                    this._userParamsSetSrv.getUserIsn(userId);
                })
                // tslint:disable-next-line:no-console
                .catch(data => console.log(data));
            }
        }
    }
    cancel() {
        this.flagEdit = false;
        if (this.isChangeForm) {
           this.msgSrv.addNewMessage(PARM_CANCEL_CHANGE);
           this.isChangeForm = false;
           this.formChanged.emit(false);
           this.init();
           this._pushState();
        }

       setTimeout(() => {
        this.editMode();
       });
    }
    default() {
        const changed = true;
        this.queryObjForDefault = this.getObjQueryInputsFieldForDefault(this.prepInputs._list);
        return this.getData(this.queryObjForDefault).then(data => {
                this.prepareData = this.convDataForDefault(data);
                this.inputs = this.getInputs();
                this.form = this.inputCtrlSrv.toFormGroup(this.inputs);
                this.formChanged.emit(changed);
                this.isChangeForm = changed;
                this._pushState();
                this.subscribeChangeForm();
            })
            .catch(err => {
                throw err;
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
