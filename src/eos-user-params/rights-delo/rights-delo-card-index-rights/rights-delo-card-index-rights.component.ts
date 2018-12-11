import { Component, Injector, OnInit } from '@angular/core';
// import { UserParamApiSrv } from 'eos-user-params/shared/services/user-params-api.service';
import { BaseRightsDeloSrv } from '../shared-rights-delo/services/base-rights-delo.service';
import { CARD_INDEXS_RIGHTS } from '../shared-rights-delo/consts/card-index-rights.consts';
import { InputParamControlService } from 'eos-user-params/shared/services/input-param-control.service';
import { EosUtils } from 'eos-common/core/utils';

@Component({
    selector: 'eos-rights-delo-card-index-rights',
    templateUrl: 'rights-delo-card-index-rights.component.html'
})

export class RightsDeloCardIndexRightsComponent extends BaseRightsDeloSrv implements OnInit {
    isLoading = false;
    fieldKeysforCardIndexRights: string[] = [];
    fields = CARD_INDEXS_RIGHTS;
    prepInputsAttach;
    inputAttach;
    formAttach;
    newDataAttach;
    data = {};
    prepDataAttach = {rec: {}};
  /*  private quaryDepartment = {
        DEPARTMENT: {
            criteries: {
                CARD_FLAG: '1'
            }
        }
    };*/
    constructor( injector: Injector, private _inputCtrlSrv: InputParamControlService/*, private servApi: UserParamApiSrv*/ ) {
        super(injector, CARD_INDEXS_RIGHTS);
        this.prepInputsAttach = this.getObjectInputFields(CARD_INDEXS_RIGHTS);
    }
    afterInit() {
        const allData = this._userParamsSetSrv.hashUserContextCard;
        this.prepDataAttachField(allData);
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
    }
    ngOnInit() {
        this.isLoading = true;
      //  const allData = this._userParamsSetSrv.hashUserContextCard;
        this.inputs = this._inputCtrlSrv.generateInputs(this.fields);
        this.prepInputs = this.inputs;
       /* if (CARD_INDEXS_RIGHTS[0]['options'].length > 0) {
            CARD_INDEXS_RIGHTS[0]['options'] = [];
        }*/
     /*   this.servApi.getData(this.quaryDepartment)
        .then(data => {
            for (let i = 0; i < data.length; i++) {
                for (const keyFromUsercard of Object.keys(allData)) {
                    if (data[i]['DUE'] === keyFromUsercard) {
                        CARD_INDEXS_RIGHTS[0]['options'].push(
                            {value: data[i]['DUE'], title: data[i]['CARD_NAME']}
                        );
                    }
                }
            }
        });
        this.afterInit();*/
        this.isLoading = false;
    }
    prepDataAttachField(data) {
        for (const key of Object.keys(data)) {
            for (let i = 0; i < this.fields.length; i++) {
                this.prepDataAttach.rec[this.fields[i].key] = data[key].charAt(this.fields[i].index) === '1' ? '1' : '0';
        }
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
        for (let i = 0; i < this.fields.length; i++) {
            if (this.fields[i]['title'] === word) {
                this.fields[i]['isSelected'] = true;
            } else {
                this.fields[i]['isSelected'] = false;
            }
        }
    }
    selectOnClick(event) {
        const data = this._userParamsSetSrv.hashUserContextCard;
        for (const key of Object.keys(data)) {
            if (event.target.value === key) {
                for (let i = 0; i < this.fields.length; i++)  {
                this.prepDataAttach.rec[this.fields[i].key] = data[key].charAt(this.fields[i].index) === '1' ? '1' : '0';
                 }
            }
        }
        this.inputAttach = this.getInputAttach();
        this.formAttach = this.inputCtrlSrv.toFormGroup(this.inputAttach);
    }
}
