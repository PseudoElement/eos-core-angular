import { Component, Injector, OnInit } from '@angular/core';
import { UserParamApiSrv } from 'eos-user-params/shared/services/user-params-api.service';
import { BaseRightsDeloSrv } from '../shared-rights-delo/services/base-rights-delo.service';
import { ABSOLUTE_RIGHTS } from '../shared-rights-delo/consts/absolute-rights.consts';
import { EosUtils } from 'eos-common/core/utils';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { AbsoluteRightsDirectoryComponent } from './absolute-rights-directory-modal/absolute-rights-directory-modal.component';
import { InputParamControlService } from 'eos-user-params/shared/services/input-param-control.service';

@Component({
    selector: 'eos-rights-delo-absolute-rights',
    templateUrl: 'rights-delo-absolute-rights.component.html'
})

export class RightsDeloAbsoluteRightsComponent extends BaseRightsDeloSrv implements OnInit {
    directoryModal: BsModalRef;
    isLoading = false;
    userId = '' + this._userParamsSetSrv.userContextId;
    fields = ABSOLUTE_RIGHTS;
    fieldChildAbsoluteRights = [];
    arrayValuesDeloRights = [];
    prepInputsAttach;
    inputAttach;
    formAttach;
    newDataAttach;
    prepDataAttach = {rec: {}};
    currentSelectedWord;
    private quaryDepartment = {
        USER_CL: {
            criteries: {
                ISN_LCLASSIF: this.userId
            }
        }
    };
    constructor( private _modalSrv: BsModalService, injector: Injector, private servApi: UserParamApiSrv, private _inputCtrlSrv: InputParamControlService, ) {
        super(injector, ABSOLUTE_RIGHTS);
        this.prepInputsAttach = this.getObjectInputFields(ABSOLUTE_RIGHTS);
    }
   /* afterInit() {
        console.log('afterInit');
       // const allData = this.arrayCheckboxforCardIndexRights;
      //  this.prepDataAttachField(allData);
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
                    this.isChangeForm = changed;
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
    }*/
    ngOnInit() {
      //  const allData = this._userParamsSetSrv.hashUserAbsoluteRights;
        this.isLoading = true;
        this.inputs = this._inputCtrlSrv.generateInputs(this.fields);
        this.prepInputs = this.inputs;
        this.servApi.getData(this.quaryDepartment)
        .then(data => {
            this.arrayValuesDeloRights.push(data[0]['DELO_RIGHTS']);
            this.prepDataAttachField(this.arrayValuesDeloRights);
          //  this.init();
            this.isLoading = false;
        }).then(() => {
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
                    this.isChangeForm = changed;
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
        });
    }
    prepDataAttachField(data) {
        for (let i = 0; i < this.fields.length; i++) {
            this.prepDataAttach.rec[this.fields[i].key] = data[0].charAt(this.fields[i].index) === '1' ? '1' : '0';
        }
    }
    getInputAttach() {
        const dataInput = {rec: {}};
        Object.keys(this.prepDataAttach.rec).forEach(key => {
            if (key.substr(key.length - 5) !== 'RADIO') {
                if (this.prepDataAttach.rec[key] === '1') {
                    dataInput.rec[key] = true;
                } else if (this.prepDataAttach.rec[key] === '0') {
                    dataInput.rec[key] = false;
                }
            } else {
                dataInput.rec[key] = this.prepDataAttach.rec[key];
            }
        });
        return this.dataSrv.getInputs(this.prepInputsAttach, dataInput);
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
    selectedNode(word) {
        this.isMarkNode = true;
        for (let i = 0; i < this.fields.length; i++) {
            if (this.fields[i].title === word) {
                this.fields[i].isSelected = true;
            } else {
                this.fields[i].isSelected = false;
            }
        }
        this.currentSelectedWord = word;
    }
    openDirectoryModal() {
        this.directoryModal = this._modalSrv.show(AbsoluteRightsDirectoryComponent, {
            class: 'directory-modal',
            ignoreBackdropClick: true
        });
        this.directoryModal.content.closeCollection.subscribe(() => {
            this.directoryModal.hide();
        });
    }
}
