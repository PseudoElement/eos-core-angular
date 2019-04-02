import { Injectable, Injector } from '@angular/core';
import { EosUtils } from 'eos-common/core/utils';
import { BaseUserSrv } from './base-user.service';
import { FormGroup } from '@angular/forms';
import {  PARM_CANCEL_CHANGE, PARM_SUCCESS_SAVE } from '../consts/eos-user-params.const';
// import { E_FIELD_TYPE } from '../../../shared/intrfaces/user-params.interfaces';
import { DIRECTORIES_USER } from '../consts/directories.consts';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class UserParamDirectoriesSrv extends BaseUserSrv {
    newDataAttach;
    isChangeFormAttach = false;
    defaultFlag = false;
    dataAttachDb;
    prepDataAttach = {rec: {}};
    inputAttach;
    formAttach: FormGroup;
    prepInputsAttach;
    _currentFormAttachStatus;
    flagEdit: boolean = false;
   _ngUnsubscribe: Subject<any> = new Subject();
    constructor( injector: Injector ) {
        super(injector, DIRECTORIES_USER);
        this._userParamsSetSrv.getUserIsn().then(() => {
            this.init();
            this.prepInputsAttach = this.getObjectInputFields(DIRECTORIES_USER.fieldsChild);
            this.afterInit();
            this.editMode();
        });
            this._userParamsSetSrv.saveData$
            .takeUntil(this._ngUnsubscribe)
            .subscribe(() => {
                this._userParamsSetSrv.submitSave =  this.submit();
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
    afterInit() {
        const allData = this._userParamsSetSrv.hashUserContext;
        this.sortedData = this.linearSearchKeyForData(this.constUserParam.fields, allData);
        this.prepareData = this.convData(this.sortedData);
        this.prepDataAttachField(this.prepareData.rec);
        this.inputAttach = this.getInputAttach();
        this.formAttach = this.inputCtrlSrv.toFormGroup(this.inputAttach);
        this.subscriptions.push(
            this.formAttach.valueChanges
                .debounceTime(200)
                .subscribe(newVal => {
                    let changed = false;
                    Object.keys(newVal).forEach(path => {
                        if (this.changeByPathAttach(path, newVal[path])) {
                            changed = true;
                        }
                    });
                    this.formChanged.emit(changed);
                    this.isChangeFormAttach = changed;
                    this._pushState();
            })
        );
        this.subscriptions.push(
            this.formAttach.statusChanges.subscribe(status => {
                if (this._currentFormStatus !== status) {
                    this.formInvalid.emit(status === 'INVALID');
                }
                this._currentFormStatus = status;
            })
        );
    }
    cancel() {
        if (this.isChangeForm || this.isChangeFormAttach) {
            this.msgSrv.addNewMessage(PARM_CANCEL_CHANGE);
            this.isChangeForm = false;
            this.isChangeFormAttach = false;
            this.formChanged.emit(false);
            this.ngOnDestroy();
            this.init();
            this.afterInit();
            this.isChangeForm = false;
            this.isChangeFormAttach = false;
            this._pushState();
        }
        setTimeout(() => {
            this.editMode();
        });
    }
    submit(): Promise<any> {
        if (this.newData || this.newDataAttach || this.prepareData) {
            this.formChanged.emit(false);
            this.isChangeForm = false;
            // this._userParamsSetSrv.getUserIsn();
            if (this.defaultFlag) {
                this.defaultFlag = false;
            return    this.userParamApiSrv
                .setData(this.createObjRequestForDefaultValues())
                .then(data => {
                    this.msgSrv.addNewMessage(PARM_SUCCESS_SAVE);
                })
                // tslint:disable-next-line:no-console
                .catch(data => console.log(data));
            } else if (this.newData && this.newDataAttach) {
             return   this.userParamApiSrv
                .setData(this.createObjRequestForAll())
                .then(data => {
                  //  this.prepareData.rec = Object.assign({}, this.newData.rec);
                    this.msgSrv.addNewMessage(PARM_SUCCESS_SAVE);
                })
                // tslint:disable-next-line:no-console
                .catch(data => console.log(data));
            } else if (this.newData) {
            return    this.userParamApiSrv
                .setData(this.createObjRequest())
                .then(data => {
                  //  this.prepareData.rec = Object.assign({}, this.newData.rec);
                    this.msgSrv.addNewMessage(PARM_SUCCESS_SAVE);
                })
                // tslint:disable-next-line:no-console
                .catch(data => console.log(data));
            } else if (this.newDataAttach) {
            return    this.userParamApiSrv
                .setData(this.createObjRequestForAttach())
                .then(data => {
                   // this.prepareData.rec = Object.assign({}, this.newData.rec);
                    this.msgSrv.addNewMessage(PARM_SUCCESS_SAVE);
                })
                // tslint:disable-next-line:no-console
                .catch(data => console.log(data));
                }
            }
            this.isChangeForm = false;
            this.isChangeFormAttach = false;
            this._pushState();
            this.flagEdit = false;
            this.editMode();
            return Promise.resolve();
        }
        createObjRequestForAll() {
            const req = this.createObjRequest();
            const reqAttach = this.createObjRequestForAttach();
            const newReq = req.concat(reqAttach[0]);
            return newReq;
        }
        createObjRequestForAttach(): any[] {
            let valueDef = '';
            const arrayOfKeysSrchContactFields = ['SRCH_CONTACT_FIELDS_SURNAME', 'SRCH_CONTACT_FIELDS_DUTY',
            'SRCH_CONTACT_FIELDS_DEPARTMENT'];
            const arrayForValueSrchContactFields = ['SURNAME', 'DUTY', 'DEPARTMENT'];
            const req = [];
            const userId = this._userParamsSetSrv.userContextId;
            const arrayKeys = arrayOfKeysSrchContactFields;
                for (let i = 0; i < arrayKeys.length; i++) {
                    if (typeof this.newDataAttach.rec[arrayKeys[i]] === 'boolean') {
                        if (this.newDataAttach.rec[arrayKeys[i]] === true) {
                            if (valueDef !== '' && valueDef !== null) {
                                valueDef += ',';
                            }
                            valueDef += arrayForValueSrchContactFields[i];
                        }
                    } else {
                        valueDef = '';
                        valueDef += this.newDataAttach.rec[arrayKeys[i]];
                    }
                }
                req.push({
                    method: 'MERGE',
                    requestUri: `USER_CL(${userId})/USER_PARMS_List(\'${userId} ${'SRCH_CONTACT_FIELDS'}\')`,
                    data: {
                        PARM_VALUE: `${valueDef}`
                    }
                });
            return req;
     }
    prepDataAttachField(data) {
        for (const key of Object.keys(data)) {
            if (key === 'SRCH_CONTACT_FIELDS') {
                if (data[key] !== null) {
                     this.prepDataAttach.rec['SRCH_CONTACT_FIELDS_SURNAME'] = data[key].indexOf('SURNAME')
            >= 0 ? 'SRCH_CONTACT_FIELDS_SURNAME' : '';
            this.prepDataAttach.rec['SRCH_CONTACT_FIELDS_DUTY'] = data[key].indexOf('DUTY') >= 0 ? 'SRCH_CONTACT_FIELDS_DUTY' : '';
            this.prepDataAttach.rec['SRCH_CONTACT_FIELDS_DEPARTMENT'] = data[key].indexOf('DEPARTMENT')
            >= 0 ? 'SRCH_CONTACT_FIELDS_DEPARTMENT' : '';
                }   else {
                    this.prepDataAttach.rec['SRCH_CONTACT_FIELDS_SURNAME'] = '';
                    this.prepDataAttach.rec['SRCH_CONTACT_FIELDS_DUTY'] = '';
                    this.prepDataAttach.rec['SRCH_CONTACT_FIELDS_DEPARTMENT'] = '';
                }

            }
        }
    }
    getInputAttach() {
        return this.dataSrv.getInputs(this.prepInputsAttach, this.prepDataAttach);
    }
    changeByPathAttach(path: string, value: any) {
        let _value = null;
        _value = value;
        this.newDataAttach = EosUtils.setValueByPath(this.newDataAttach, path, _value);
        const oldValue = EosUtils.getValueByPath(this.prepDataAttach, path, false);

        if (oldValue !== _value) {
            // console.log('changed', path, oldValue, 'to', _value, this.prepDataAttach.rec);
        }
        return _value !== oldValue;
    }
    default() {
        const changed = true;
        this.defaultFlag = true;
        this.queryObjForDefault = this.getObjQueryInputsFieldForDefault(this.prepInputs._list);
        return this.getData(this.queryObjForDefault).then(data => {
                this.prepareData = this.convDataForDefault(data);
                this.prepDataAttachField(this.prepareData.rec);
                this.inputAttach = this.getInputAttach();
                this.inputs = this.getInputs();
                this.form = this.inputCtrlSrv.toFormGroup(this.inputs);
                this.formAttach = this.inputCtrlSrv.toFormGroup(this.inputAttach);
                this.formChanged.emit(changed);
                this.isChangeForm = changed;
                this.subscribeChangeForm();
            })
            .catch(err => {
                throw err;
            });
    }
    editMode() {
        if (this.flagEdit) {
            this.form.enable({emitEvent: false});
            this.formAttach.enable({emitEvent: false});
        } else {
            this.form.disable({emitEvent: false});
            this.formAttach.disable({emitEvent: false});
        }
    }
    private _pushState () {
        this._userParamsSetSrv.setChangeState({isChange: this.isChangeForm || this.isChangeFormAttach});
      }
}
