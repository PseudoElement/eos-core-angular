import { Component, OnInit } from '@angular/core';
import { UserParamApiSrv } from 'eos-user-params/shared/services/user-params-api.service';
import { CARD_INDEXS_RIGHTS } from '../shared-rights-delo/consts/card-index-rights.consts';
// import { InputParamControlService } from 'eos-user-params/shared/services/input-param-control.service';
// import { EosUtils } from 'eos-common/core/utils';
// import { E_FIELD_TYPE } from 'eos-dictionaries/interfaces';
import { UserParamsService } from 'eos-user-params/shared/services/user-params.service';
import { IParamUserCl, IInputParamControl } from 'eos-user-params/shared/intrfaces/user-parm.intterfaces';
import { USERCARD } from 'eos-rest';

@Component({
    selector: 'eos-rights-delo-card-index-rights',
    templateUrl: 'rights-delo-card-index-rights.component.html'
})

export class RightsDeloCardIndexRightsComponent implements OnInit {
    curentUser: IParamUserCl;
    selectedNode: IInputParamControl;
    btnDisabled: boolean = false;
    listNode: IInputParamControl[] = CARD_INDEXS_RIGHTS;
    userCard: Map<string, USERCARD>;


    isLoading = false;

    private quaryDepartment = {
        DEPARTMENT: {
            criteries: {
                CARD_FLAG: '1'
            }
        }
    };
    constructor(
        private _userParamsSetSrv: UserParamsService,
        // private _inputCtrlSrv: InputParamControlService,
        private servApi: UserParamApiSrv
    ) {
        const due: string[] = [];
        this.userCard = new Map<string, USERCARD>();
        this.curentUser = this._userParamsSetSrv.curentUser;
        this.curentUser['USERCARD_List'].forEach((card: USERCARD) => {
            this.userCard.set(card['DUE'], card);
            due.push(card['DUE']);
        });
        this.quaryDepartment.DEPARTMENT.criteries['DUE'] = due.join('||');
    }
    // afterInit() {
    //     const allData = this._userParamsSetSrv.hashUserContextCard;
    //     this.prepDataAttachField(allData);
    //     this.inputAttach = this.getInputAttach();
    //     this.formAttach = this.inputCtrlSrv.toFormGroup(this.inputAttach);
    //     this.subscriptions.push(
    //         this.formAttach.valueChanges
    //             .debounceTime(200)
    //             .subscribe(newVal => {
    //                 let changed = false;
    //                 Object.keys(newVal).forEach(path => {
    //                     if (this.changeByPathAttach(path, newVal[path])) {
    //                         changed = true;
    //                     }
    //                 });
    //                 this.formChanged.emit(changed);
    //                 this.isChangeForm = changed;
    //         })
    //     );
    //     this.subscriptions.push(
    //         this.formAttach.statusChanges.subscribe(status => {
    //             if (this._currentFormStatus !== status) {
    //                 this.formInvalid.emit(status === 'INVALID');
    //             }
    //             this._currentFormStatus = status;
    //         })
    //     );
    // }
    ngOnInit() {
        this.isLoading = true;

        this.servApi.getData(this.quaryDepartment)
        .then(data => {
            console.log(data); // заполнить селект
            this.isLoading = false;
            // вызвать заполнение формы
        });
    }
    submit() {
        console.log('submit()');
    }
    cancel() {
        console.log('cancel()');
    }
    selectNode(node) {
        if (this.selectedNode) {
            this.selectedNode['data']['isSelected'] = false;
        }
        this.selectedNode = node;
        this.selectedNode['data']['isSelected'] = true;
        console.log(node);
    }
}
