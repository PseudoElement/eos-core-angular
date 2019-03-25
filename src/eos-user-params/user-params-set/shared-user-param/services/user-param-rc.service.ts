import { Injectable, Injector } from '@angular/core';
import { BaseUserSrv } from './base-user.service';
import { RC_USER } from '../consts/rc.consts';
import {IOpenClassifParams} from '../../../../eos-common/interfaces/interfaces';
import { EosUtils } from 'eos-common/core/utils';
import {PARM_CANCEL_CHANGE,  PARM_SUCCESS_SAVE } from '../consts/eos-user-params.const';
import { Subject } from 'rxjs/Subject';
@Injectable()
export class UserParamRCSrv extends BaseUserSrv {
    dataAttachDb;
    inputAttach;
    prepInputsAttach;
    prepDataAttach = {rec: {}};
    dopRec: Array<any>;
    cutentTab: number;
    flagBacground: boolean;
    flagEdit: boolean = false;
    defaultFlag = false;
    disabledFlagDelite = false;
    _ngUnsubscribe: Subject<any> = new Subject();
    constructor( injector: Injector ) {
        super(injector, RC_USER);
        this.flagBacground = false;
        this.cutentTab = 0;
        this.init();
        this.getInfoFroCode(this.form.controls['rec.OPEN_AR'].value).then(() => {
            this.checRcShowRes();
            this.editMode();
        });
        this._userParamsSetSrv.saveData$
        .takeUntil(this._ngUnsubscribe)
        .subscribe(() => {
            this.submit();
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
    setTab(i: number) {
        this.cutentTab = i;
    }

    getInfoFroCode(code: string): Promise<any> {
        if (code && code !== null && code !== 'null') {
             const parsedCode = code.split(',').filter(el =>  (el !== 'null' &&  el !== null)).join('||');
        const query = {
            DOCGROUP_CL: {
                criteries: {
                    DUE: parsedCode
                }
            }
        };
     return   this.userParamApiSrv.getData(query).then(result => {
            this.dopRec = result;
           this.dopRec.length > 0 ?  this.disabledFlagDelite = false : this.disabledFlagDelite = true;
        });
        }else {
             this.disabledFlagDelite = true;
             return Promise.resolve();
        }
    }
    addRcDoc(): void {
        this.flagBacground = true;
        const query: IOpenClassifParams = {
            classif: 'DOCGROUP_CL',
            selectMulty: false,
            selectLeafs: true,
            selectNodes: false,
            return_due: true,
        };
        this._waitClassifSrv.openClassif(query).then(data => {
            this.addRcDocToInput(data);
            this.flagBacground = false;
        }).catch(error => {
            this.flagBacground = false;
            console.log(error);
        });
    }

    deleteRcDoc(): void {
        let updateVield: Array<number>, arrayT: Array<number>;
        let valToSave;
        this.dopRec.splice(this.cutentTab, 1);
        arrayT = [];
        this.dopRec.forEach(value => {
            arrayT.push(value.ISN_NODE);
        });
        updateVield = arrayT;
        this.dopRec.length > 0 ?  this.disabledFlagDelite = false : this.disabledFlagDelite = true;
        updateVield.join(',') === '' ? valToSave = '' : valToSave =  updateVield.join(',');
        this.form.controls['rec.OPEN_AR'].patchValue(valToSave);
    }

    addRcDocToInput(data): void {
      let dateVal: string, newValue = [], checValue: boolean;
       dateVal =  this.form.controls['rec.OPEN_AR'].value;
      if (dateVal) {
          newValue = dateVal.split(',');
      }

      checValue = newValue.some(value => {
          return value === data;
      });
      if (!checValue) {
        newValue.push(data);
        this.form.controls['rec.OPEN_AR'].patchValue(newValue.join(','));
        this.getInfoFroCode(this.form.controls['rec.OPEN_AR'].value).then(() => {
            this.checRcShowRes();
        });
      }
    }
    checRcShowRes(): void {
       const value = this.form.controls['rec.SHOW_RES_HIERARCHY'].value;
        value === 'YES' ? this.disabDefault(true) : this.disabDefault(false);
    }
    cancel() {
        if (this.isChangeForm) {
           this.msgSrv.addNewMessage(PARM_CANCEL_CHANGE);
           this.isChangeForm = false;
           this.formChanged.emit(false);
           this.ngOnDestroy();
           this.init();
           setTimeout(() => {
            this.checRcShowRes();
            this.editMode();
        });
    } else {
        this.editMode();
        }
    }

    disabDefault(flag: boolean): void {
        if (flag) {
            this.form.controls['rec.SHOW_ALL_RES'].disable({onlySelf: true, emitEvent: false});
        } else {
            this.form.controls['rec.SHOW_ALL_RES'].enable({emitEvent: false});
        }
    }

    defaultValues(): void {
        this.default().then(res => {
            this.checRcShowRes();
        });
    }

    submit() {
        this.flagEdit = false;
        if (this.newData || this.prepareData) {
            const userId = '' + this._userParamsSetSrv.userContextId;
            this.formChanged.emit(false);
            this.isChangeForm = false;
            // this._userParamsSetSrv.getUserIsn();
            if (this.defaultFlag) {
                this.userParamApiSrv
                .setData(this.createObjRequestForDefaultValues())
                .then(data => {
                    this.editMode();
                    this.defaultFlag = false;
                    this.msgSrv.addNewMessage(PARM_SUCCESS_SAVE);
                })
                // tslint:disable-next-line:no-console
                .catch(data => console.log(data));
            } else  if (this.newData) {
            this.userParamApiSrv
                .setData(this.createObjRequest())
                .then(data => {
                    this.editMode();
                   // this.prepareData.rec = Object.assign({}, this.newData.rec);
                    this.msgSrv.addNewMessage(PARM_SUCCESS_SAVE);
                    this._userParamsSetSrv.getUserIsn(userId);
                })
                // tslint:disable-next-line:no-console
                .catch(data => console.log(data));
            } else if (this.prepareData) {
                this.userParamApiSrv
                .setData(this.createObjRequestForDefaultValues())
                .then(data => {
                    this.editMode();
                    this.msgSrv.addNewMessage(PARM_SUCCESS_SAVE);
                    this._userParamsSetSrv.getUserIsn(userId);
                })
                // tslint:disable-next-line:no-console
                .catch(data => console.log(data));
            }
        } else {
            this.editMode();
        }
    }
    default() {
        const changed = true;
        this.defaultFlag = true;
        this.queryObjForDefault = this.getObjQueryInputsFieldForDefault(this.prepInputs._list);
        return this.getData(this.queryObjForDefault).then(data => {
                this.prepareData = this.convDataForDefault(data);
                this.inputs = this.getInputs();
                this.form = this.inputCtrlSrv.toFormGroup(this.inputs);
                this.formChanged.emit(changed);
                this.isChangeForm = changed;
                this.subscribeChangeForm();
                setTimeout(() => {
                    this.checRcShowRes();
                });
            })
            .catch(err => {
                throw err;
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
