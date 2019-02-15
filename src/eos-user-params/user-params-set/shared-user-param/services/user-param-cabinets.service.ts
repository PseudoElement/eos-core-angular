import { Injectable, Injector } from '@angular/core';
import { BaseUserSrv } from './base-user.service';
import { CABINETS_USER } from '../consts/cabinets.consts';
import { FormGroup } from '@angular/forms';
import { EosUtils } from 'eos-common/core/utils';
import { PARM_SUCCESS_SAVE, PARM_CANCEL_CHANGE } from '../consts/eos-user-params.const';
import { OPEN_CLASSIF_DEPARTMENT } from 'eos-user-select/shered/consts/create-user.consts';
import { RestError } from 'eos-rest/core/rest-error';
@Injectable()
export class UserParamCabinetsSrv extends BaseUserSrv {
    readonly fieldGroupsForCabinets: string[] = ['Папки', 'Поручения'];
    readonly fieldsKeysForHighlightNewEnntriesInTheFolder: string[] = ['FOLDERCOLORSTATUS_RECEIVED',
'FOLDERCOLORSTATUS_FOR_EXECUTION', 'FOLDERCOLORSTATUS_UNDER_CONTROL', 'FOLDERCOLORSTATUS_HAVE_LEADERSHIP',
'FOLDERCOLORSTATUS_FOR_CONSIDERATION', 'FOLDERCOLORSTATUS_INTO_THE_BUSINESS', 'FOLDERCOLORSTATUS_PROJECT_MANAGEMENT',
'FOLDERCOLORSTATUS_ON_SIGHT', 'FOLDERCOLORSTATUS_ON_THE_SIGNATURE', 'FOLDER_ITEM_LIMIT_RESULT'];
    currTab = 0;
    dataAttachDb;
    inputAttach;
    newDataAttach;
    prepInputsAttach;
    defaultFlag = false;
    isChangeFormAttach = false;
    flagDisabledHiliteResolutionIncrement = false;
    flagDisabledHilitePrjRcIncrement = false;
    dueForLink = '';
    controller = false;
    bacgHeader = false;
    formAttach: FormGroup;
    prepDataAttach = {rec: {}};
    constructor(
        injector: Injector,
         ) {
        super(injector, CABINETS_USER);
        this._userParamsSetSrv.getUserIsn(this._userParamsSetSrv.userContextId.toString()).then(datai => {
            this.getNameSortCabinets().then( sortName => {
                        CABINETS_USER.fields.map(fields => {
                            if (fields.key === 'CABSORT_ISN_DOCGROUP_LIST') {
                                fields.options.splice(0, fields.options.length);
                                    sortName.forEach(element => {
                                        fields.options.push({
                                            value: element.ISN_LIST,
                                            title: element.NAME
                                    });
                                });
                            }
                        });
                        this.init();
                        this.prepInputsAttach = this.getObjectInputFields(CABINETS_USER.fieldsChild);
                        this.afterInit();
                        this.getControlAuthor().then(data => {
                            if (data) {
                                this.form.controls['rec.CONTROLL_AUTHOR'].patchValue(String(data[0]['CLASSIF_NAME']), {emitEvent: false});
                        }
                    });
                });
        }).catch(err => {
            this.cathError(err);
        });

    }

    init() {
        this.prepareDataParam();
              const allData = this._userParamsSetSrv.hashUserContext;
              this.sortedData = this.linearSearchKeyForData(this.constUserParam.fields, allData);
              this.prepareData = this.convData(this.sortedData);
              this.inputs = this.getInputs();
              this.form = this.inputCtrlSrv.toFormGroup(this.inputs);
              this.subscribeChangeForm();
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
                    this.isChangeForm = changed;
                    if ((this.isChangeFormAttach || this.isChangeForm) === true) {
                        this.formChanged.emit(true);
                    } else {
                           this.formChanged.emit(false);
                }
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
    setTab(i: number) {
        this.currTab = i;
    }
    getControlAuthor(): Promise<any> {
        const ControlAuthor = this._userParamsSetSrv.hashUserContext['RESOLUTION_CONTROLLER'];
        this.dueForLink = ControlAuthor;
        if (String(ControlAuthor) === 'null') {
            this.controller = false;
            return Promise.resolve(false);
        } else {
            this.controller = true;
            return  this._userParamsSetSrv.getDepartmentFromUser([ControlAuthor]);
        }
    }

    getNameSortCabinets(): Promise<any> {
        const user =  this._userParamsSetSrv.userContextId;
        const query = {
            USER_LISTS: {
                criteries: {
                    ISN_LCLASSIF: String(user),
                    CLASSIF_ID: '105'
                }
            },
        };
      return  this.userParamApiSrv.getData(query);
    }
    openClassifDepartment() {
        this.bacgHeader = true;
        this._waitClassifSrv.openClassif(OPEN_CLASSIF_DEPARTMENT)
        .then((data: string) => {
            this.dueForLink = data;
            return this._userParamsSetSrv.getDepartmentFromUser([data]);
        }).then(data => {
            this.bacgHeader = false;
            if  (data) {
                this.form.controls['rec.RESOLUTION_CONTROLLER'].patchValue(String(this.dueForLink));
                this.form.controls['rec.CONTROLL_AUTHOR'].patchValue(String(data[0]['CLASSIF_NAME']));
                this.controller = true;
            }
        })
        .catch(error => {
            this.bacgHeader = false;
        });
    }

    clearControlAuthor() {
        const val = this.form.controls['rec.CONTROLL_AUTHOR'].value;
        if (String(val) === 'null' || val === '') {
            return;
        }   else {
            this.form.controls['rec.RESOLUTION_CONTROLLER'].patchValue('');
            this.form.controls['rec.CONTROLL_AUTHOR'].patchValue('');
            this.controller = false;
        }
    }
    showInfoUser() {
        this._router.navigate(['/spravochniki/departments', this.dueForLink, 'view', '0']);
    }
    afterInit() {
        const allData = this._userParamsSetSrv.hashUserContext;
        this.sortedData = this.linearSearchKeyForData(this.constUserParam.fields, allData);
        this.prepareData = this.convData(this.sortedData);
        this.prepDataAttachField(this.prepareData.rec);
        this.inputAttach = this.getInputAttach();
        this.formAttach = this.inputCtrlSrv.toFormGroup(this.inputAttach);
        if (this.flagDisabledHiliteResolutionIncrement) {
            this.formAttach.controls['rec.HILITE_RESOLUTION_INCREMENT'].enable();
        } else {
            this.formAttach.controls['rec.HILITE_RESOLUTION_INCREMENT'].disable();
        }

        if (this.flagDisabledHilitePrjRcIncrement) {
            this.formAttach.controls['rec.HILITE_PRJ_RC_INCREMENT'].enable();
        } else {
            this.formAttach.controls['rec.HILITE_PRJ_RC_INCREMENT'].disable();
        }
        if (this.form.controls['rec.FOLDER_ITEM_LIMIT_RESULT'].value === 'null') {
            this.form.controls['rec.FOLDER_ITEM_LIMIT_RESULT'].patchValue('', {emitEvent: false});
        }
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
                   this.isChangeFormAttach = changed;
                    if ((this.isChangeFormAttach || this.isChangeForm) === true) {
                        this.formChanged.emit(true);
                    } else {
                           this.formChanged.emit(false);
                }
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
    prepDataAttachField(data) {
        for (const key of Object.keys(data)) {
            if (key === 'FOLDERCOLORSTATUS') {
              if (data[key] !== null) {
                this.prepDataAttach.rec['FOLDERCOLORSTATUS_RECEIVED'] = data[key].charAt(0) === '1' ? true : false;
                this.prepDataAttach.rec['FOLDERCOLORSTATUS_FOR_EXECUTION'] = data[key].charAt(1) === '1' ? true : false;
                this.prepDataAttach.rec['FOLDERCOLORSTATUS_UNDER_CONTROL'] = data[key].charAt(2) === '1' ? true : false;
                this.prepDataAttach.rec['FOLDERCOLORSTATUS_HAVE_LEADERSHIP'] = data[key].charAt(3) === '1' ? true : false;
                this.prepDataAttach.rec['FOLDERCOLORSTATUS_FOR_CONSIDERATION'] = data[key].charAt(4) === '1' ? true : false;
                this.prepDataAttach.rec['FOLDERCOLORSTATUS_INTO_THE_BUSINESS'] = data[key].charAt(5) === '1' ? true : false;
                this.prepDataAttach.rec['FOLDERCOLORSTATUS_PROJECT_MANAGEMENT'] = data[key].charAt(6) === '1' ? true : false;
                this.prepDataAttach.rec['FOLDERCOLORSTATUS_ON_SIGHT'] = data[key].charAt(7) === '1' ? true : false;
                this.prepDataAttach.rec['FOLDERCOLORSTATUS_ON_THE_SIGNATURE'] = data[key].charAt(8) === '1' ? true : false;
              }
            } else if (key === 'HILITE_RESOLUTION') {
                this.prepDataAttach.rec['HILITE_RESOLUTION_BOOLEAN'] = typeof data[key] === 'string'
                && data[key] !== '' && data[key] !== 'undefined' && data[key] !== 'null' ? true : false;
                if (typeof data[key] === 'string' && data[key] !== '' && data[key] !== 'undefined' && data[key] !== 'null') {
                    this.prepDataAttach.rec['HILITE_RESOLUTION_INCREMENT'] = data[key];
                    this.flagDisabledHiliteResolutionIncrement = true;
                } else {
                    this.prepDataAttach.rec['HILITE_RESOLUTION_INCREMENT'] = '0';
                    this.flagDisabledHiliteResolutionIncrement = false;
                }
            } else if (key === 'HILITE_PRJ_RC') {
                this.prepDataAttach.rec['HILITE_PRJ_RC_BOOLEAN'] = typeof data[key] === 'string'
                && data[key] !== '' && data[key] !== 'undefined' && data[key] !== 'null' ? true : false;
                if (typeof data[key] === 'string' && data[key] !== '' && data[key] !== 'undefined' && data[key] !== 'null') {
                    this.prepDataAttach.rec['HILITE_PRJ_RC_INCREMENT'] = data[key];
                    this.flagDisabledHilitePrjRcIncrement = true;
                } else {
                    this.prepDataAttach.rec['HILITE_PRJ_RC_INCREMENT'] = '0';
                    this.flagDisabledHilitePrjRcIncrement = false;
                }
            }
        }
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

    checkDataToDisabled(keyField, value) {
        const keyFieldDisabled = keyField === 'HILITE_RESOLUTION_BOOLEAN' ?
        'HILITE_RESOLUTION_INCREMENT' : keyField === 'HILITE_PRJ_RC_BOOLEAN' ?
        'HILITE_PRJ_RC_INCREMENT' : null;
        if (this.formAttach.controls['rec.' + keyField].value === value) {
            this.disabledField = true;
            this.formAttach.controls['rec.' + keyFieldDisabled].disable();
        } else {
            this.disabledField = false;
            this.formAttach.controls['rec.' + keyFieldDisabled].enable();
    }
    }

    cancel() {
        let val = null;
        if (this.isChangeForm || this.isChangeFormAttach) {
            this._userParamsSetSrv.getUserIsn(this._userParamsSetSrv.userContextId.toString()).then(datai => {
            this.msgSrv.addNewMessage(PARM_CANCEL_CHANGE);
            this.isChangeForm = false;
            this.isChangeFormAttach = false;
            this.formChanged.emit(false);
            this.ngOnDestroy();
            this.init();
            this.afterInit();
            this.getControlAuthor().then(data => {
                if (data) {
                    this.form.controls['rec.CONTROLL_AUTHOR'].patchValue(String(data[0]['CLASSIF_NAME']), {emitEvent: false});
            }
            val = this.form.controls['rec.CONTROLL_AUTHOR'].value;
            if (val !== '' &&  val !== null) {
                this.controller = true;
            }   else {
                this.controller = false;
            }
        });
        }).catch(err => {
            this.cathError(err);
        });
    }
    }

    submit() {
        if (this.newData || this.newDataAttach || this.prepareData) {
            this.formChanged.emit(false);
            this.isChangeForm = false;
            // this._userParamsSetSrv.getUserIsn();
            if (this.defaultFlag) {
                this.defaultFlag = false;
                this.userParamApiSrv
                .setData(this.createObjRequestForDefaultValues())
                .then(data => {
                    this.msgSrv.addNewMessage(PARM_SUCCESS_SAVE);
                })
                // tslint:disable-next-line:no-console
                .catch(data => console.log(data));
            } else if (this.newData && this.newDataAttach) {
                this.userParamApiSrv
                .setData(this.createObjRequestForAll())
                .then(data => {
                  //  this.prepareData.rec = Object.assign({}, this.newData.rec);
                    this.msgSrv.addNewMessage(PARM_SUCCESS_SAVE);
                })
                // tslint:disable-next-line:no-console
                .catch(data => console.log(data));
            } else if (this.newData) {
            this.userParamApiSrv
                .setData(this.createObjRequest())
                .then(data => {
                  //  this.prepareData.rec = Object.assign({}, this.newData.rec);
                    this.msgSrv.addNewMessage(PARM_SUCCESS_SAVE);
                })
                // tslint:disable-next-line:no-console
                .catch(data => console.log(data));
            } else if (this.newDataAttach) {
                this.userParamApiSrv
                .setData(this.createObjRequestForAttach())
                .then(data => {
                   // this.prepareData.rec = Object.assign({}, this.newData.rec);
                    this.msgSrv.addNewMessage(PARM_SUCCESS_SAVE);
                })
                // tslint:disable-next-line:no-console
                .catch(data => console.log(data));
                }
            }
        }
        createObjRequestForAll() {
            const req = this.createObjRequest();
            const reqAttach = this.createObjRequestForAttach();
            const newReq = req.concat(reqAttach[0]).concat(reqAttach[1]).concat(reqAttach[2]);
            return newReq;
        }
        createObjRequestForAttach(): any[] {
            let valueDef = '';
            const arrayOfKeysFoldercolorstatus = ['FOLDERCOLORSTATUS_RECEIVED', 'FOLDERCOLORSTATUS_FOR_EXECUTION',
        'FOLDERCOLORSTATUS_UNDER_CONTROL', 'FOLDERCOLORSTATUS_HAVE_LEADERSHIP', 'FOLDERCOLORSTATUS_FOR_CONSIDERATION',
        'FOLDERCOLORSTATUS_INTO_THE_BUSINESS', 'FOLDERCOLORSTATUS_PROJECT_MANAGEMENT', 'FOLDERCOLORSTATUS_ON_SIGHT',
        'FOLDERCOLORSTATUS_ON_THE_SIGNATURE'];
            const arrayOfKeysHiliteReolution = ['HILITE_RESOLUTION_BOOLEAN', 'HILITE_RESOLUTION_INCREMENT'];
            const arrayOfKeysHilitePrjRc = ['HILITE_PRJ_RC_BOOLEAN', 'HILITE_PRJ_RC_INCREMENT'];
            const req = [];
            const keysForCabinets = ['FOLDERCOLORSTATUS', 'HILITE_RESOLUTION', 'HILITE_PRJ_RC'];
            const userId = this._userParamsSetSrv.userContextId;
            // tslint:disable-next-line:forin
            for (let key = 0; key < keysForCabinets.length; key++) {
                const arrayKeys = keysForCabinets[key] === 'FOLDERCOLORSTATUS'
                 ? arrayOfKeysFoldercolorstatus : keysForCabinets[key] === 'HILITE_RESOLUTION' ?
                 arrayOfKeysHiliteReolution : arrayOfKeysHilitePrjRc;
                for (let i = 0; i < arrayKeys.length; i++) {
                 // if ()
                    if (typeof this.newDataAttach.rec[arrayKeys[i]] === 'boolean') {
                        if (this.newDataAttach.rec[arrayKeys[i]] === true) {
                            valueDef += '1';
                        } else {
                            valueDef += '0';
                        }
                    } else {
                        valueDef = '';
                        valueDef += this.newDataAttach.rec[arrayKeys[i]];
                    }
                }
                req.push({
                    method: 'MERGE',
                    requestUri: `USER_CL(${userId})/USER_PARMS_List(\'${userId} ${keysForCabinets[key]}\')`,
                    data: {
                        PARM_VALUE: `${valueDef}`
                    }
                });
               // valueDefSearchCitizen = '';
        }
            return req;
        }
        default() {
            const changed = true;
            this.defaultFlag = true;
            this.queryObjForDefault = this.getObjQueryInputsFieldForDefault(this.prepInputs._list);
            return this.getData(this.queryObjForDefault)
            .then(data => {
                    this.prepareData = this.convDataForDefault(data);
                    this.prepDataAttachField(this.prepareData.rec);
                    this.inputAttach = this.getInputAttach();
                    this.inputs = this.getInputs();
                    this.form = this.inputCtrlSrv.toFormGroup(this.inputs);
                    this.formAttach = this.inputCtrlSrv.toFormGroup(this.inputAttach);
                    this.formChanged.emit(changed);
                    this.controller = false;
                    this.isChangeForm = changed;
                    this.subscribeChangeForm();
                })
                .catch(err => {
                   this.cathError(err);
                });
        }
        cathError(e) {
                if (e instanceof RestError && (e.code === 434 || e.code === 0)) {
                    return undefined;
                } else {
                    const errMessage = e.message ? e.message : e;
                    this.msgSrv.addNewMessage({
                        type: 'danger',
                        title: 'Ошибка обработки. Ответ сервера:',
                        msg: errMessage
                    });
                    return null;
                }
        }
        get getClass() {
            return this.controller ? 'eos-icon eos-icon-info-blue small' : 'eos-icon eos-icon-info-grey small';
        }
        get getClassClearBtn() {
            const val = this.form.controls['rec.CONTROLL_AUTHOR'].value;
            return    val !== '' && String(val) !== 'null' ? 'eos-icon eos-icon-close-blue small' : 'eos-icon eos-icon-close-grey small';
        }
}
