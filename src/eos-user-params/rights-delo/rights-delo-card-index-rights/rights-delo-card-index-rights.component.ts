import { Component, OnInit } from '@angular/core';
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
// import { PARM_SUCCESS_SAVE } from '../shared-rights-delo/consts/eos-user-params.const';

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
                });
        }).then(() => {
            this.servApi.getData(this.quaryDocgroupCl)
                .then(data3 => {
                    this.dataDocgroupCl = data3;
                }).then(() => {
                    const firstEvent = {
                        target: {
                           value: this.fieldsForSelect[0]['DUE']
                        }
                    };
                    this.selectInputOnChange(firstEvent);
                    this.isLoading = false;
                });
        });
    }
    oldElement(data, oldIndex) {
        const tmp = this.userCard.get(data[oldIndex][0]);
        this.strForSubscribe = '';
        for (const key11 of Object.keys(this.dataForm)) {
            for (const key22 of Object.keys(this.booleanFromSubscribe)) {
            if (key11 !== key22) {
                this.arrayOfIndexesOfModifiedPositions.push();
            }
            }
        }
        for (const key of Object.keys(this.booleanFromSubscribe)) {
            if (this.booleanFromSubscribe[key] === true) {
                this.strForSubscribe += '1';
            } else {
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
          //   copyFunclist += copyFunclist.charAt(i) =
           // this.listNode[i]['value'] = false; !!
         }

        /* for (let j = 0; j < this.listDocumentGroups.length; j++) {
             this.listDocumentGroups[j]['value'] =
         }*/
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
                    })
                    .catch(data2 => console.log(data2));
                   // this.prepareData.rec = Object.assign({}, this.newData.rec);
                   // this.msgSrv.addNewMessage(PARM_SUCCESS_SAVE);
                    this._userParamsSetSrv.getUserIsn('' + this.userCard.get(Array.from(this.userCard)[0][0])['ISN_LCLASSIF']);
                })
                // tslint:disable-next-line:no-console
                .catch(data => console.log(data));
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
        this.oldElement(Array.from(this.userCard), this.oldIndex);

        for (let i = 0; i < this.userCard.size; i++) {
            const tmp = this.userCard.get(Array.from(this.userCard)[i][0]);
            if (tmp.hasOwnProperty('NEW_FUNCLIST')) {
            req.push({
                method: 'MERGE',
                requestUri: `USER_CL(${tmp['ISN_LCLASSIF']})/USERCARD_List(\'${tmp['ISN_LCLASSIF']} ${tmp['DUE']}\')/USER_CARD_DOCGROUP_List(\'${tmp['ISN_LCLASSIF']} ${tmp['DUE']} '0.'\')`,
                data: {
                    ALLOWED: 1
                }
            });
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
        this.booleanFromSubscribe = this.dataForm;
        this.form.valueChanges
             .subscribe(data => {
                 this.booleanFromSubscribe = data;
                 this.newDataFlag = true;
             });
    }
}
