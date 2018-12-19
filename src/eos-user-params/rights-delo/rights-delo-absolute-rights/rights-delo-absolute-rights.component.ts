import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserParamApiSrv } from 'eos-user-params/shared/services/user-params-api.service';
import { ABSOLUTE_RIGHTS, CONTROL_ALL_NOTALL } from '../shared-rights-delo/consts/absolute-rights.consts';
// import { EosUtils } from 'eos-common/core/utils';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { AbsoluteRightsDirectoryComponent } from './absolute-rights-directory-modal/absolute-rights-directory-modal.component';
import { InputParamControlService } from 'eos-user-params/shared/services/input-param-control.service';
import { IInputParamControl, IParamUserCl } from 'eos-user-params/shared/intrfaces/user-parm.intterfaces';
import { UserParamsService } from 'eos-user-params/shared/services/user-params.service';
import { FormGroup, FormControl } from '@angular/forms';
import { E_RIGHT_DELO_ACCESS_CONTENT } from '../shared-rights-delo/interfaces/right-delo.intefaces';
import { RadioInput } from 'eos-common/core/inputs/radio-input';
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: 'eos-rights-delo-absolute-rights',
    templateUrl: 'rights-delo-absolute-rights.component.html'
})

export class RightsDeloAbsoluteRightsComponent implements OnInit, OnDestroy {
    curentUser: IParamUserCl;
    btnDisabled: boolean = true;
    directoryModal: BsModalRef;
    arrDeloRight: string[];
    arrNEWDeloRight: string[];
    selectedNode: IInputParamControl;
    fields: IInputParamControl[] = ABSOLUTE_RIGHTS;
    inputs;
    inputAll;
    form: FormGroup;
    formGroupAll: FormGroup;
    subs = {};
    subForm: Subscription;
    queryForSave = [];
    rightContent: boolean;


    constructor (
        private _userParamsSetSrv: UserParamsService,
        private _modalSrv: BsModalService,
        private apiSrv: UserParamApiSrv,
        private _inputCtrlSrv: InputParamControlService,
        ) {
            this.curentUser = this._userParamsSetSrv.curentUser;
            this.arrDeloRight = this.curentUser['DELO_RIGHTS'].split('');
            this.arrNEWDeloRight = this.curentUser['DELO_RIGHTS'].split('');
            this._writeValue(this.fields);
            this.inputs = this._inputCtrlSrv.generateInputs(this.fields);
            this.form = this._inputCtrlSrv.toFormGroup(this.inputs);
            this.subForm = this.form.valueChanges
             .subscribe(data => {
                 // tslint:disable-next-line:forin
                 for (const key in  data) {
                     if (+this.arrNEWDeloRight[key] > 1 && data[key]) {
                         continue;
                     }
                    this.arrNEWDeloRight[key] = (+data[key]).toString();
                 }
                 this._checkChenge();
             });
        }
    ngOnInit() {
        this.selectNode(this.fields[0]);
        this.inputAll = {all: new RadioInput(CONTROL_ALL_NOTALL)};
    }
    ngOnDestroy() {
        this.subForm.unsubscribe();
    }
    submit() {
        this.queryForSave.push({
            method: 'MERGE',
            requestUri: `USER_CL(${this._userParamsSetSrv.userContextId})`,
            data: {
                DELO_RIGHTS: this.arrNEWDeloRight.join('')
            }
        });
        this.apiSrv.setData(this.queryForSave)
        .then(data => {
            this.queryForSave = [];
            this.btnDisabled = true;
        })
        .catch(e => {
            console.log(e);
        });
    }
    cancel() {
        // console.log('cancel()');
        // console.log('new', this.arrNEWDeloRight.join(''));
        // console.log('old', this.arrDeloRight.join(''));
        // this.arrNEWDeloRight.forEach((v, i) => {
        //     if (v !== this.arrDeloRight[i]) {
        //         console.log('было ', this.arrDeloRight[i], 'стало ', v, 'inddex ', i);
        //     }
        // });
    }
    clickLable(event, item: IInputParamControl, control: FormControl) {
        event.preventDefault();
        event.stopPropagation();
        if (event.target.tagName === 'LABEL') {
            this.selectNode(item);
        }
        if (event.target.tagName === 'SPAN') {
            const value = !control.value;
            item.value = value;
            control.patchValue(value);
            if (item === this.selectedNode) {
                this._viewContent();
            }
        }
    }
    selectNode(node: IInputParamControl) {
        if (this.selectedNode !== node) {
            if (this.selectedNode) {
                this.selectedNode.data['isSelected'] = false;
            }
            this.selectedNode = node;
            this.selectedNode.data['isSelected'] = true;
            this._viewContent();
        }
        // console.log(this.selectedNode);
    }
    openClessifModal() {
        this.directoryModal = this._modalSrv.show(AbsoluteRightsDirectoryComponent, {
            class: 'directory-modal',
            ignoreBackdropClick: true
        });
        this.directoryModal.content.closeCollection.subscribe(() => {
            this.directoryModal.hide();
        });
    }
    createBatch(data) {
        // console.log(data);
        const newDep = data['newDep'];
        const d = Object.assign({}, data['node']);
        delete d.department;
        delete d.isSelected;
        const str = newDep ? '' : `('${this._userParamsSetSrv.userContextId} ${d['DUE']} ${d['FUNC_NUM']}')`;
        const batch = {
            method: newDep ? 'POST' : 'DELETE',
            requestUri: `USER_CL(${this._userParamsSetSrv.userContextId})/USERDEP_List${str}`,
        };
        if (newDep) {
            batch['data'] = d;
        }
        // console.log(batch);
        this.queryForSave.push(batch);
        this._checkChenge();
    }
    private _writeValue(fields: IInputParamControl[]) {
        fields.forEach((node: IInputParamControl) => {
            node['value'] = !!+this.arrDeloRight[+node['key']];
        });
    }
    private _viewContent() {
        this.rightContent = false;
        switch (this.selectedNode.data['rightContent']) {
            case E_RIGHT_DELO_ACCESS_CONTENT.all:
                if (this.formGroupAll) {
                    this.subs['all'].unsubscribe();
                    this.formGroupAll = null;
                }
                this.formGroupAll = new FormGroup({
                        all: new FormControl(this.selectedNode.value ? this.arrNEWDeloRight[+this.selectedNode.key] : '0')
                });
                setTimeout(() => {
                    this.selectedNode.value ? this.formGroupAll.enable() : this.formGroupAll.disable();
                }, 0);
                this.subs['all'] = this.formGroupAll.valueChanges
                    .subscribe(data => {
                        this.arrNEWDeloRight[+this.selectedNode.key] = data['all'];
                        this._checkChenge();
                    });
                this.rightContent = true;
                break;
            case E_RIGHT_DELO_ACCESS_CONTENT.department:
            case E_RIGHT_DELO_ACCESS_CONTENT.departmentCardAuthorSentProject:
                    setTimeout(() => {
                        this.rightContent = true;
                    }, 0);
                break;
        }
    }
    private _checkChenge() {
        if (this.arrNEWDeloRight.join('') !== this.arrDeloRight.join('') || this.queryForSave.length) {
            // console.log('chenged');
            this.btnDisabled = false;
        } else {
            this.btnDisabled = true;
        }
    }
}
