import { Component, OnInit, Injector } from '@angular/core';
import { UserParamApiSrv } from 'eos-user-params/shared/services/user-params-api.service';
import { CARD_INDEXS_RIGHTS, DOCUMENT_GROUPS } from '../shared-rights-delo/consts/card-index-rights.consts';
// import { InputParamControlService } from 'eos-user-params/shared/services/input-param-control.service';
// import { EosUtils } from 'eos-common/core/utils';
// import { E_FIELD_TYPE } from 'eos-dictionaries/interfaces';
// import { InputParamControlService } from 'eos-user-params/shared/services/input-param-control.service';
import { UserParamsService } from 'eos-user-params/shared/services/user-params.service';
import { IParamUserCl, IInputParamControl } from 'eos-user-params/shared/intrfaces/user-parm.intterfaces';
import { USERCARD, DEPARTMENT } from 'eos-rest';
import { FormGroup } from '@angular/forms';
import { InputParamControlService } from 'eos-user-params/shared/services/input-param-control.service';
import { EosMessageService } from 'eos-common/services/eos-message.service';
import { E_RIGHT_DELO_ACCESS_CONTENT } from '../shared-rights-delo/interfaces/right-delo.intefaces';
import { PARM_SUCCESS_SAVE, PARM_ERROR_ON_BACKEND } from '../shared-rights-delo/consts/eos-user-params.const';

@Component({
    selector: 'eos-rights-delo-card-index-rights',
    templateUrl: 'rights-delo-card-index-rights.component.html'
})

export class RightsDeloCardIndexRightsComponent implements OnInit {
    dataForm;
    curentUser: IParamUserCl;
    selectedNode: IInputParamControl;
    btnDisabled: boolean = false;
    listNode: IInputParamControl[] = CARD_INDEXS_RIGHTS;
    listDocumentGroups: IInputParamControl[] = DOCUMENT_GROUPS;
    userCard: Map<string, USERCARD>;
    msgSrv: EosMessageService;
    newDataAttach;
    fieldsForSelect;
    inputs;
    booleanFromSubscribe;
    booleanDataForm;
    arrayOfNewChanges = [];
    strForSubscribe = '';
    form: FormGroup;
    isLoading = false;
    newDataFlag = false;
    oldIndex;
    lastIndex;
    arrayOfIndexesOfModifiedPositions = [];
    prepDataAttach = {};
    dataUserCardDocgroup;
    dataDocgroupCl;
    private quaryDepartment = {
        DEPARTMENT: {
            criteries: {
                CARD_FLAG: '1'
            }
        }
    };
    private quaryUserCardDocgroup = {
        USER_CARD_DOCGROUP: {
            criteries: {
                ISN_LCLASSIF: '3611'
            }
        }
    };
    private quaryDocgroupCl = {
        DOCGROUP_CL: {
            criteries: {
            }
        }
    };
    constructor(
        injector: Injector,
        private _userParamsSetSrv: UserParamsService,
        // private _inputCtrlSrv: InputParamControlService,
        private servApi: UserParamApiSrv,
        private inputCtrlSrv: InputParamControlService,
        // private _inputCtrlSrv: InputParamControlService,
    ) {
        const due: string[] = [];
        this.userCard = new Map<string, USERCARD>();
        this.curentUser = this._userParamsSetSrv.curentUser;
        this.curentUser['USERCARD_List'].forEach((card: USERCARD) => {
            this.userCard.set(card['DUE'], card);
            due.push(card['DUE']);
        });
        this.quaryDepartment.DEPARTMENT.criteries['DUE'] = due.join('||');
        this.msgSrv = injector.get(EosMessageService);
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
            data.forEach((d: DEPARTMENT) => {
                const card = this.userCard.get(d['DUE']);
                card['department'] = d;
              });
              this.fieldsForSelect = data;
              this.prepDataAttachField();
        }).then(() => {
            this.servApi.getData(this.quaryUserCardDocgroup)
                .then(data2 => {
                    this.dataUserCardDocgroup = data2;
                   // this.isLoading = false;
                }).then(() => {
                    const firstEvent = {
                        target: {
                           value: this.fieldsForSelect[0]['DUE']
                        }
                    };
                    this.selectInputOnChange(firstEvent);
                    this.isLoading = false;
                });
        }).then(() => {
            this.servApi.getData(this.quaryDocgroupCl)
                .then(data3 => {
                    this.dataDocgroupCl = data3;
                });
        });
    }
    oldElement(data, oldIndex) {
        const tmp = this.userCard.get(data[oldIndex][0]);
        this.strForSubscribe = '';
        if (this.booleanFromSubscribe === undefined) {
            this.booleanFromSubscribe = this.booleanDataForm;
        }

        for (const key of Object.keys(this.booleanFromSubscribe)) {
            if (this.booleanFromSubscribe[key] === true) {
                this.strForSubscribe += '1';
            } else if (this.booleanFromSubscribe[key] === false) {
                this.strForSubscribe += '0';
            }
        }
        tmp['NEW_FUNCLIST'] = this.strForSubscribe;
    }
    updateForm(data, index) {
        const arrayFuclist = data[index][1]['FUNCLIST'].split('');
        if (this.oldIndex !== undefined) {
           this.oldElement(data, this.oldIndex);
        }
        for (let i = 0; i < this.listNode.length; i++) {
             this.listNode[i]['value'] = +arrayFuclist[this.listNode[i]['key']];
         }
    }
    prepDataAttachField() {
         for (let i = 0; i < this.listNode.length; i++) {
            // this.listNode[i]['value'] = +arrayFuclist[this.listNode[i]['key']];
            this.listNode[i]['value'] = false;
         }
     }
    getInputAttach() {
         return this.inputCtrlSrv.generateInputs(this.listNode);
     }
    submit() {
        if (this.newDataFlag) {
            this.servApi
                .setData(this.createObjRequestForAttach())
                .then(data => {
                    this.servApi.setData(this.createObjRequestForAttachAfterBackend())
                    .then(data2 => {
                       this._userParamsSetSrv.getUserIsn('' + this.userCard.get(Array.from(this.userCard)[0][0])['ISN_LCLASSIF']);
                       this.msgSrv.addNewMessage(PARM_SUCCESS_SAVE);
                    })
                    .catch(data2 => console.log(data2));
                })
                // tslint:disable-next-line:no-console
                .catch(() => this.msgSrv.addNewMessage(PARM_ERROR_ON_BACKEND));
            }
    }
    createObjRequestForAttach() {
        const req = [];
        this.oldElement(Array.from(this.userCard), this.oldIndex);

        for (let i = 0; i < this.userCard.size; i++) {
            const tmp = this.userCard.get(Array.from(this.userCard)[i][0]);
            if (tmp.hasOwnProperty('NEW_FUNCLIST')) {
                req.push({
                method: 'MERGE',
                requestUri: `USER_CL(${tmp['ISN_LCLASSIF']})/USERCARD_List(\'${tmp['ISN_LCLASSIF']} ${tmp['DUE']}\')`,
                data: {
                    FUNCLIST: tmp['NEW_FUNCLIST']
                }
            });
            delete tmp['NEW_FUNCLIST'];
        }
      }

        return req;
    }
    createObjRequestForAttachAfterBackend() {
        const req = [];
        this.arrayOfNewChanges = [];
        this.oldElement(Array.from(this.userCard), this.oldIndex);
        for (let i = 0; i < this.userCard.size; i++) {
            const tmp = this.userCard.get(Array.from(this.userCard)[i][0]);
            if (tmp.hasOwnProperty('NEW_FUNCLIST')) {
                for (const key of Object.keys(this.booleanDataForm)) {
                    if (this.booleanDataForm[key] !== this.booleanFromSubscribe[key]) {
                        this.listNode[key]['valueCheck'] =  this.booleanFromSubscribe[key];
                        this.arrayOfNewChanges.push(this.listNode[key]);
                    }
                }
                for (let z = 0; z < this.arrayOfNewChanges.length; z++) {
                     if (this.arrayOfNewChanges[z].data.rightContent !== E_RIGHT_DELO_ACCESS_CONTENT.none) {
                         if (this.arrayOfNewChanges[z]['valueCheck'] === true) {
                        req.push({
                            method: 'MERGE',
requestUri: `USER_CL(${tmp['ISN_LCLASSIF']})/USERCARD_List(\'${tmp['ISN_LCLASSIF']} ${tmp['DUE']}\')/USER_CARD_DOCGROUP_List(\'${tmp['ISN_LCLASSIF']} ${tmp['DUE']} ${'0.'} ${+this.arrayOfNewChanges[z]['key'] + 1}\')`,
                            data: {
                                ALLOWED: 1
                            }
                        });
                    } else {
                        req.push({
                            method: 'DELETE',
requestUri: `USER_CL(${tmp['ISN_LCLASSIF']})/USERCARD_List(\'${tmp['ISN_LCLASSIF']} ${tmp['DUE']}\')/USER_CARD_DOCGROUP_List(\'${tmp['ISN_LCLASSIF']} ${tmp['DUE']} ${'0.'} ${+this.arrayOfNewChanges[z]['key'] + 1}\')`
                        });
                    }
                    }
                }
            delete tmp['NEW_FUNCLIST'];
        }
      }
        return req;
    }

    cancel() {
        this.form.patchValue(this.dataForm);
    }
    selectNode(node) {
        if (this.selectedNode) {
            this.selectedNode['data']['isSelected'] = false;
        }
        this.selectedNode = node;
        this.selectedNode['data']['isSelected'] = true;
    }
    selectInputOnChange(event) {
        const dataUserCard = Array.from(this.userCard);
        for (let i = 0; i < dataUserCard.length; i++) {
            if (dataUserCard[i][0] === event.target.value) {
                this.updateForm(Array.from(this.userCard), i);
                this.oldIndex = i;
               // this.prepDataAttachField(Array.from(this.userCard), i);
            }
        }
        this.inputs = this.getInputAttach();
        this.form = this.inputCtrlSrv.toFormGroup(this.inputs);
        this.dataForm = this.form.value;
        this.booleanDataForm = this.dataForm;
        this.form.valueChanges
             .subscribe(data => {
                 this.booleanFromSubscribe = data;
                 this.newDataFlag = true;
             });
    }
}
