import { Injectable, Injector } from '@angular/core';
import { EosUtils } from 'eos-common/core/utils';
import { BaseUserSrv } from './base-user.service';
import { FormGroup } from '@angular/forms';
import {  PARM_CANCEL_CHANGE, PARM_SUCCESS_SAVE } from '../consts/eos-user-params.const';
import { E_FIELD_TYPE } from '../../../shared/intrfaces/user-params.interfaces';
import { DIRECTORIES_USER } from '../consts/directories.consts';
// import { EosUtils } from 'eos-common/core/utils';

@Injectable()
export class UserParamDirectoriesSrv extends BaseUserSrv {
    newDataAttach;
    isChangeFormAttach = false;
    dataAttachDb;
    prepDataAttach = {rec: {}};
    inputAttach;
    formAttach: FormGroup;
    prepInputsAttach;
    _currentFormAttachStatus;
    queryFileConstraint = {
        USER_PARMS: {
            criteries: {
                PARM_NAME:
'WINPOS||SORT||SRCH_CONTACT_FIELDS||SRCH_LIMIT_RESULT||SEARCH_CONTEXT_CARD_EMPTY||SEND_DIALOG||DELFROMCAB||MARKDOC||MARKDOCKND',
                ISN_USER_OWNER: '3611'
            }
        }
    };
    constructor( injector: Injector ) {
        super(injector, DIRECTORIES_USER);
        this.init();
       // .then(() => {
            this.prepInputsAttach = this.prepareInputField(DIRECTORIES_USER.fieldsChild);
            this.afterInit();
       /* }).catch(err => {
            if (err.code !== 434) {
                console.log(err);
            }
        });*/
    }
    cancel() {
        this.msgSrv.addNewMessage(PARM_CANCEL_CHANGE);
            this.isChangeForm = false;
            this.isChangeFormAttach = false;
            this.formChanged.emit(false);
            this.ngOnDestroy();
        this.init();
           // .then(() => {
                this.afterInit();
          /*  })
            .catch(err => {
                if (err.code !== 434) {
                    console.log(err);
                }
            });*/
    }
    afterInit() {
        this.userParamApiSrv.getData(Object.assign({}, this.queryFileConstraint))
        .then(data => {
            this.dataAttachDb = data;
            this.prepDataAttachField(data);
            this.inputAttach = this.getInputAttach();
            this.formAttach = this.inputCtrlSrv.toFormGroup(this.inputAttach);
            this.subscriptions.push(
                this.formAttach.valueChanges
                .debounceTime(200)
                .subscribe(newValue => {
                    let changed = false;
                    Object.keys(newValue).forEach(path => {
                        if (this.changeByPathAttach(path, newValue[path])) {
                            changed = true;
                        }
                    });
                    this.formChanged.emit(changed);
                    this.isChangeFormAttach = changed;
                })
            );
            this.subscriptions.push(
                this.formAttach.statusChanges.subscribe(status => {
                    if (this._currentFormAttachStatus !== status) {
                        this.formInvalid.emit(status === 'INVALID');
                    }
                    this._currentFormAttachStatus = status;
                })
            );
        });
    }
   submit() {
          if (this.newData || this.newDataAttach) {
          let dataRes = [];
          this.formChanged.emit(false);
          this.isChangeForm = false;
          this.isChangeFormAttach = false;
          if (this.newData) {
            dataRes = this.createObjRequest();
        }
        if (this.newDataAttach) {
            const req = [];
            let value = '';
            for (const key in this.newDataAttach.rec) {
                if (this.newDataAttach.rec[key]) {
                    value = value || ',';
                    value += key + ',';
                }
            }
            req.push({
                method: 'POST',
                requestUri: `SYS_PARMS_Update?PARM_NAME='SRCH_CONTACT_FIELDS'&PARM_VALUE='${value}'`
            });
        }
        this.userParamApiSrv
                .setData(dataRes)
                .then(data => {
                    if (this.newData) {
                        this.prepareData.rec = Object.assign({}, this.newData.rec);
                    }
                    if (this.newDataAttach) {
                        this.newDataAttach.rec = Object.assign({}, this.newDataAttach.rec);
                    }
                    this.msgSrv.addNewMessage(PARM_SUCCESS_SAVE);
                })
                .catch(data => console.log(data));
        }
    }
    prepDataAttachField(data) {
        data.forEach(field => {
            if (field.PARM_NAME === 'SRCH_CONTACT_FIELDS') {
            this.prepDataAttach.rec['SURNAME'] = field.PARM_VALUE.indexOf('SURNAME') >= 0 ? 'SURNAME' : null;
            this.prepDataAttach.rec['DUTY'] = field.PARM_VALUE.indexOf('DUTY') >= 0 ? 'DUTY' : null;
            this.prepDataAttach.rec['DEPARTMENT'] = field.PARM_VALUE.indexOf('DEPARTMENT') >= 0 ? 'DEPARTMENT' : null;
            }
        });
    }
    getInputAttach() {
        return this.dataSrv.getInputs(this.prepInputsAttach, this.prepDataAttach);
    }
    prepareInputField(fields) {
        const inputs = {_list: [], rec: {}};
        fields.forEach(field => {
            inputs._list.push(field.key);
            inputs.rec[field.key] = {
                title: field.title,
                type: E_FIELD_TYPE[field.type],
                foreignKey: field.key,
                pattern: field.pattern,
                length: field.length,
                options: field.options,
                readonly: field.readonly
            };
        });
        return inputs;
    }
    changeByPathAttach(path: string, value: any) {
       // const key = path.split('_').pop();
        let _value = null;
        _value = value;
        this.newDataAttach = EosUtils.setValueByPath(this.newDataAttach, path, _value);
        const oldValue = EosUtils.getValueByPath(this.prepDataAttach, path, false);

        if (oldValue !== _value) {
            // console.log('changed', path, oldValue, 'to', _value, this.prepDataAttach.rec);
        }
        return _value !== oldValue;
    }
}
