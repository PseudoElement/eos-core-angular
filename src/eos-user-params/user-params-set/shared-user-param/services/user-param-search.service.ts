import { Injectable, Injector } from '@angular/core';
import { BaseUserSrv } from './base-user.service';
import { SEARCH_USER } from '../consts/search.consts';
import { Subject } from 'rxjs/Subject';
import { EosUtils } from 'eos-common/core/utils';
import { PARM_SUCCESS_SAVE, PARM_CANCEL_CHANGE } from '../consts/eos-user-params.const';
@Injectable()
export class UserParamSearchSrv extends BaseUserSrv {
    dataAttachDb;
    inputAttach;
    prepInputsAttach;
    prepDataAttach = {rec: {}};
     _ngUnsubscribe: Subject<any> = new Subject();
     flagEdit: boolean = false;
    constructor( injector: Injector ) {
        super(injector, SEARCH_USER);
        this.init();
        this.editMode();
        this._userParamsSetSrv.saveData$
        .takeUntil(this._ngUnsubscribe)
        .subscribe(() => {
            this._userParamsSetSrv.submitSave = this.submit();
        });
    }
    afterInitUserSearch() {
        this.userParamApiSrv.getData(Object.assign({}, {a: 1}))
        .then(data => {
            this.dataAttachDb = data;
            this.inputAttach = this.getInputAttach();
        });
    }
    getInputAttach() {
        return this.dataSrv.getInputs(this.prepInputsAttach, this.prepDataAttach);
    }

    default() {
        const changed = true;
        this.queryObjForDefault = this.getObjQueryInputsFieldForDefault(this.prepInputs._list);
        return this.getData(this.queryObjForDefault).then(data => {
                this.prepareData = this.convDataForDefault(data);
                this.checkLimitSRCH(data);
                this.inputs = this.getInputs();
                this.form = this.inputCtrlSrv.toFormGroup(this.inputs);
                this.formChanged.emit(changed);
                this.isChangeForm = changed;
                this.subscribeChangeForm();
                this._pushState();
            })
            .catch(err => {
                throw err;
            });
    }
    cancel() {
        if (this.isChangeForm) {
           this.msgSrv.addNewMessage(PARM_CANCEL_CHANGE);
           this.init();
           this.isChangeForm = false;
           this.formChanged.emit(false);
        }
        this.flagEdit = false;
        setTimeout(() => {
            this.editMode();
        });
        this._pushState();
    }
    checkLimitSRCH(data) {
        if (String(data[1]['PARM_VALUE']) === 'null' ) {
            this.prepareData.rec['SRCH_LIMIT_RESULT'] = '';
        }
    }
    subscribeChangeForm() {
        this.subscriptions.push(
            this.form.valueChanges.subscribe(newVal => {
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
    submit(): Promise<any> {
        if (this.newData || this.prepareData) {
            const userId = '' + this._userParamsSetSrv.userContextId;
            this.formChanged.emit(false);
            this.isChangeForm = false;

            // this._userParamsSetSrv.getUserIsn();
            if (this.newData) {
        return    this.userParamApiSrv
                .setData(this.createObjRequest())
                .then(data => {
                   // this.prepareData.rec = Object.assign({}, this.newData.rec);
                    this.msgSrv.addNewMessage(PARM_SUCCESS_SAVE);
                 return   this._userParamsSetSrv.getUserIsn(userId);
                })
                // tslint:disable-next-line:no-console
                .catch(data => console.log(data));
            } else if (this.prepareData) {
            return    this.userParamApiSrv
                .setData(this.createObjRequestForDefaultValues())
                .then(data => {
                    this.msgSrv.addNewMessage(PARM_SUCCESS_SAVE);
                 return   this._userParamsSetSrv.getUserIsn(userId);
                })
                // tslint:disable-next-line:no-console
                .catch(data => console.log(data));
            }
        }   else {
            this.flagEdit = false;
            this.editMode();
            return Promise.resolve();
        }
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
