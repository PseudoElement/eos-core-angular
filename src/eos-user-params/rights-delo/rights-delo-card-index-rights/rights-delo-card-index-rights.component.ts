import { Component, OnInit, Injector } from '@angular/core';
import { UserParamApiSrv } from 'eos-user-params/shared/services/user-params-api.service';
import { CARD_INDEXS_RIGHTS, DOCUMENT_GROUPS, RESTRICT_REGISTRATION_FILING, ALL_DOCUMENTS } from '../shared-rights-delo/consts/card-index-rights.consts';
// import { InputParamControlService } from 'eos-user-params/shared/services/input-param-control.service';
// import { EosUtils } from 'eos-common/core/utils';
// import { E_FIELD_TYPE } from 'eos-dictionaries/interfaces';
// import { InputParamControlService } from 'eos-user-params/shared/services/input-param-control.service';
import { UserParamsService } from 'eos-user-params/shared/services/user-params.service';
import { IParamUserCl, IInputParamControlForIndexRight, IInputParamControl } from 'eos-user-params/shared/intrfaces/user-parm.intterfaces';
import { USERCARD, DEPARTMENT } from 'eos-rest';
import { FormGroup } from '@angular/forms';
import { E_FIELD_TYPE } from 'eos-dictionaries/interfaces';
import { InputParamControlService } from 'eos-user-params/shared/services/input-param-control.service';
import { EosMessageService } from 'eos-common/services/eos-message.service';
import { E_RIGHT_DELO_ACCESS_CONTENT } from '../shared-rights-delo/interfaces/right-delo.intefaces';
import { PARM_SUCCESS_SAVE, PARM_ERROR_ON_BACKEND } from '../shared-rights-delo/consts/eos-user-params.const';
import { WaitClassifService } from 'app/services/waitClassif.service';
import { OPEN_CLASSIF_DOCGR } from '../../../eos-user-select/shered/consts/create-user.consts';
import {LimitedAccesseService} from '../../shared/services/limited-access.service';

@Component({
    selector: 'eos-rights-delo-card-index-rights',
    templateUrl: 'rights-delo-card-index-rights.component.html'
})

export class RightsDeloCardIndexRightsComponent implements OnInit {
    dataForm;
    curentUser: IParamUserCl;
    selectedNode: IInputParamControlForIndexRight;
    selectedNodeOnTheRigthSide: IInputParamControlForIndexRight;
    btnDisabled: boolean = false;
    listNode: IInputParamControlForIndexRight[] = CARD_INDEXS_RIGHTS;
    listDocumentGroups: IInputParamControl[] = DOCUMENT_GROUPS;
    listRestrictRegistrationFiling: IInputParamControl[] = RESTRICT_REGISTRATION_FILING;
    allDocuments: IInputParamControl[] = ALL_DOCUMENTS;
    listConcatRigthSide = [];
    treeHierarchyOnTheRightSide = [];
    allData = [];
    userCard: Map<string, USERCARD>;
    msgSrv: EosMessageService;
    newDataAttach;
    fieldsForRightSideCards;
    inputs;
    booleanFromSubscribe;
    booleanDataForm;
    arrayOfNewChanges = [];
    strForSubscribe = '';
    form: FormGroup;
    isLoading = false;
    newDataFlag = false;
    bacgHeader: boolean;
    flagToDisplayTheRightSide;
    flagToDisolayRestrictRegistrationFiling;
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
  /*  private quaryUserCardDocgroup = {
        USER_CARD_DOCGROUP: {
            criteries: {
                ISN_LCLASSIF: '73337'
            }
        }
    };*/
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
        private _waitClassifSrv: WaitClassifService,
        private _limitservise: LimitedAccesseService,
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
        this.listDocumentGroups = [];
        this.allDocuments = [];

        // ------------------------------------------------
        for (let e = 0; e < this.listNode.length; e++) {
            this.listNode[e]['data']['isSelected'] = false;
        }
        // ------------------------------------------------

        this.servApi.getData(this.quaryDepartment)
        .then(data => {
            data.forEach((d: DEPARTMENT) => {
                const card = this.userCard.get(d['DUE']);
                card['department'] = d;
                this.allData.push(card);
              });
              this.fieldsForRightSideCards = data;
              console.log(this.allData);
             /* console.log(data);
              console.log(this.fieldsForRightSideCards);
              console.log(this.curentUser);*/
              for (let i = 0; i < this.fieldsForRightSideCards.length; i++) {
                this.listDocumentGroups.push({
                    controlType: E_FIELD_TYPE.boolean,
                    key: this.fieldsForRightSideCards[i]['DUE'],
                    label: this.fieldsForRightSideCards[i]['CARD_NAME'],
                    data: {
                        isSelected: false,
                       // rightContent: E_RIGHT_DELO_ACCESS_CONTENT.docGroupCard
                    }
                 });
                 this.listRestrictRegistrationFiling.push({
                    controlType: E_FIELD_TYPE.boolean,
                    key: this.fieldsForRightSideCards[i]['DUE'] + 'RESTRICT_REGISTRATION_FILING',
                    label: 'Ограничить картотекой регистрации',
                    data: {
                        isSelected: false,
                       // rightContent: E_RIGHT_DELO_ACCESS_CONTENT.docGroupCard
                    }
                 });
              }
              this.prepDataAttachField();
        })
       /* .then(() => {
            this.servApi.getData(this.quaryUserCardDocgroup)
                .then(data2 => {
                    this.dataUserCardDocgroup = data2;
                   // this.isLoading = false;
                });
        })*/
        .then(() => {
            this.servApi.getData(this.quaryDocgroupCl)
                .then(data2 => {
                    this.dataDocgroupCl = data2;
                    console.log(this.dataDocgroupCl);
                    for (let i = 0; i < this.allData.length; i++) {
                        for (let j = 0; j < this.allData[i]['USER_CARD_DOCGROUP_List'].length; j++) {
                            for (let x = 0; x < this.dataDocgroupCl.length; x++) {
                                if (this.allData[i]['USER_CARD_DOCGROUP_List'][j]['DUE'] === this.dataDocgroupCl[x]['DUE']) {
                                    this.allData[i]['USER_CARD_DOCGROUP_List'][j]['NAME'] = this.dataDocgroupCl[x]['CLASSIF_NAME'];
                                }
                            }
                        }
                    }


                    for (let z = 0; z < this.allData.length; z++) {
                      //  this.allDocuments.push([]);
                        for (let t = 0; t < this.allData[z]['USER_CARD_DOCGROUP_List'].length; t++) {
                            this.allDocuments.push({
                                controlType: E_FIELD_TYPE.boolean,
                                key: this.allData[z]['USER_CARD_DOCGROUP_List'][t]['DUE_CARD'] + this.allData[z]['USER_CARD_DOCGROUP_List'][t]['DUE'] + z + t,
                                label: this.allData[z]['USER_CARD_DOCGROUP_List'][t]['NAME'],
                                data: {
                                    isSelected: false,
                                   // rightContent: E_RIGHT_DELO_ACCESS_CONTENT.docGroupCard
                                }
                             });
                             this.allData[z]['USER_CARD_DOCGROUP_List'][t]['DUE_DOCUMENT'] = this.allData[z]['USER_CARD_DOCGROUP_List'][t]['DUE_CARD'] + this.allData[z]['USER_CARD_DOCGROUP_List'][t]['DUE'] + z + t;
                             this.allData[z]['USER_CARD_DOCGROUP_List'][t]['INDEX_FOR_SELECT'] = this.allDocuments.length - 1;
                        }
                    }

                    console.log(this.allDocuments);
                    console.log(this.listDocumentGroups);
                 /*   for (let i = 0; i < this.allData.length; i++) {
                        for (let j = 0; j < this.dataDocgroupCl.length; j++) {
                            if (this.allData[i]['USER_CARD_DOCGROUP_List'][0] === this.dataDocgroupCl)
                        }
                    }*/
                  /*  for (let i = 0; i < this.dataDocgroupCl.length; i++) {
                        if ()
                    }*/
                }).then(() => {
                    const firstElement = this.listNode[0];
                    this.selectNode(firstElement);
                    this.isLoading = false;
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
    updateForm(dataCurrentListNode) {
        const indexForCards = dataCurrentListNode['key'];
        const currentElementsForCards = [];
        let flag = true;
        this.listConcatRigthSide = [];
        this.treeHierarchyOnTheRightSide = [];
    //    console.log(this.dataUserCardDocgroup);
   //     console.log(this.dataDocgroupCl);
       // const arrayFuclist = Array.from(this.userCard) // this.listNode[indexForCards][1]['FUNCLIST'].split('');

       console.log(this.listDocumentGroups);

       for (let t = 0; t < this.listDocumentGroups.length; t++) {
        flag = true;
           for (let z = 0; z < this.allData.length; z++) {
               flag = true;
               console.log(flag);
               if (this.listDocumentGroups[t]['key'] === this.allData[z]['DUE']) {
                this.treeHierarchyOnTheRightSide.push({
                    card: this.listDocumentGroups[t],
                    openFolder: false,
                    restrictRegistrationFiling: dataCurrentListNode['data']['rightContent'] === E_RIGHT_DELO_ACCESS_CONTENT.docGroupCard ?
                     this.listRestrictRegistrationFiling[t] : null,
                     documents: this.allData[z]['USER_CARD_DOCGROUP_List'].length ? (+dataCurrentListNode.key + 1) === this.allData[z]['USER_CARD_DOCGROUP_List'][0]['FUNC_NUM'] ? [this.allData[z]['USER_CARD_DOCGROUP_List'][0]] : null : null
                });
               for (let q = 1; q < this.allData[z]['USER_CARD_DOCGROUP_List'].length; q++) {
                   console.log(flag);
                /* if (flag) {
                     console.log(this.treeHierarchyOnTheRightSide);
                    this.treeHierarchyOnTheRightSide.push({
                        card: this.listDocumentGroups[t],
                        restrictRegistrationFiling: dataCurrentListNode['data']['rightContent'] === E_RIGHT_DELO_ACCESS_CONTENT.docGroupCard ?
                         this.listRestrictRegistrationFiling[t] : null,
                         documents: (+dataCurrentListNode.key + 1) === this.allData[z]['USER_CARD_DOCGROUP_List'][q]['FUNC_NUM'] ? [this.allData[z]['USER_CARD_DOCGROUP_List'][q]] : null
                    });
                    flag = false;
                 } else */
                 if (q > 0 && this.treeHierarchyOnTheRightSide[this.treeHierarchyOnTheRightSide.length - 1].documents !== null &&
                    (+dataCurrentListNode.key + 1) === this.allData[z]['USER_CARD_DOCGROUP_List'][q]['FUNC_NUM']) {
                   //    console.log(this.treeHierarchyOnTheRightSide[this.treeHierarchyOnTheRightSide.length - 1].documents);
                    this.treeHierarchyOnTheRightSide[this.treeHierarchyOnTheRightSide.length - 1].documents.push(this.allData[z]['USER_CARD_DOCGROUP_List'][q]);
                   }
         //  console.log(this.allData[z]['USER_CARD_DOCGROUP_List'][0]['FUNC_NUM']);
         //  console.log([this.allData[z]['USER_CARD_DOCGROUP_List']]);
        }
        }
        }
       }

       console.log(dataCurrentListNode);
       console.log(this.treeHierarchyOnTheRightSide);
     //  console.log(((+dataCurrentListNode.key + 1) + ''));

     /*  for (let t = 0; t < this.listDocumentGroups.length * 2; t++) {
           if (t % 2 === 0) {
            console.log(t);
            this.listConcatRigthSide.splice(t, 0, this.listDocumentGroups[t]);
           } else {
            console.log(t);
            this.listConcatRigthSide.splice(t, 0, this.listRestrictRegistrationFiling[t]);
           }
       }*/

   //   console.log(this.listConcatRigthSide);
      // this.listConcatRigthSide =  this.listDocumentGroups.concat(this.listRestrictRegistrationFiling);

        for (let i = 0; i < Array.from(this.userCard).length; i++) {
            currentElementsForCards.push([Array.from(this.userCard)[i][1]['FUNCLIST'].charAt(indexForCards), Array.from(this.userCard)[i][1]['DUE']]);
        }

        console.log(Array.from(this.userCard));
        console.log(indexForCards);
        console.log(this.listDocumentGroups);
        console.log(currentElementsForCards);

        for (let j = 0; j < this.listDocumentGroups.length; j++) {
            for (let w = 0; w < currentElementsForCards.length; w++) {
          //  console.log(currentElementsForCards[j]);
        //    console.log(this.listDocumentGroups[j]);
        if (currentElementsForCards[w][1] === this.listDocumentGroups[j].key) {
            this.listDocumentGroups[j]['value'] = +currentElementsForCards[w][0];
            if (dataCurrentListNode.data.rightContent === E_RIGHT_DELO_ACCESS_CONTENT.docGroupCard) {
            if (+currentElementsForCards[w][0] === 2) {
                this.listRestrictRegistrationFiling[j]['value'] = +currentElementsForCards[w][0];
            } else {
                this.listRestrictRegistrationFiling[j]['value'] = false;
            }
        }
    }
    }
        }

        console.log(this.allDocuments);

        for (let x = 0; x < this.allDocuments.length; x++) {
            for (let g = 0; g < this.treeHierarchyOnTheRightSide.length; g++) {
                if (this.treeHierarchyOnTheRightSide[g].documents !== null) {
                 //   console.log(this.treeHierarchyOnTheRightSide[g].documents);
                    for (let r = 0; r < this.treeHierarchyOnTheRightSide[g].documents.length; r++) {
                      //  console.log(this.treeHierarchyOnTheRightSide[g].documents[r]['INDEX_FOR_SELECT']);
                        if (x === this.treeHierarchyOnTheRightSide[g].documents[r]['INDEX_FOR_SELECT']) {
                            console.log(x);
                            console.log(this.allDocuments[x]);
                            console.log(this.treeHierarchyOnTheRightSide[g].documents[r]);
                            console.log(this.treeHierarchyOnTheRightSide[g].documents[r]['ALLOWED']);
                           this.allDocuments[x]['value'] = +this.treeHierarchyOnTheRightSide[g].documents[r]['ALLOWED'];
                        }
                    }
                }
            }
        }
       /* if (this.oldIndex !== undefined) {
           this.oldElement(data, this.oldIndex);
        }
        for (let i = 0; i < this.listNode.length; i++) {
             this.listNode[i]['value'] = +arrayFuclist[this.listNode[i]['key']];
        }*/
    }
    prepDataAttachField() {
         for (let i = 0; i < this.listNode.length; i++) {
            // this.listNode[i]['value'] = +arrayFuclist[this.listNode[i]['key']];
            this.listNode[i]['value'] = false;
         }
     }
    getInputAttach() {
         const forArgumentGenerateInputs = this.listDocumentGroups.concat(this.listRestrictRegistrationFiling).concat(this.allDocuments);
         return this.inputCtrlSrv.generateInputs(forArgumentGenerateInputs);
    }
    OpenClassiv(): void {
        this.bacgHeader = true;
        this._waitClassifSrv.openClassif(OPEN_CLASSIF_DOCGR, true)
        .then(result_classif => {
            const newClassif = result_classif !== '' || null || undefined ? result_classif : '0.';
            this._limitservise.getCodeNameDOCGROUP(String(newClassif))
            .then(result => {
                console.log(result);
                console.log(this.selectedNodeOnTheRigthSide);
                console.log(this.selectedNode);
                console.log(this.treeHierarchyOnTheRightSide);

              /*  for (let i = 0; i < this.treeHierarchyOnTheRightSide.length; i++) {
                    if (this.treeHierarchyOnTheRightSide[i]['card']['key'] === this.selectedNodeOnTheRigthSide.key) {
                        if (this.treeHierarchyOnTheRightSide[this.treeHierarchyOnTheRightSide.length - 1].documents !== null || undefined) {
                         //   this.treeHierarchyOnTheRightSide[this.treeHierarchyOnTheRightSide.length - 1].documents.push(this.allData[z]['USER_CARD_DOCGROUP_List'][q]);
                        }
                    }
                }*/

              //  this.treeHierarchyOnTheRightSide[this.treeHierarchyOnTheRightSide.length - 1].documents.push(this.allData[z]['USER_CARD_DOCGROUP_List'][q]);
              /* const arrData = this.checkfield(result);
               arrData.forEach(el => {
                     const newField = {
                        NAME: el.CLASSIF_NAME,
                        DUE: el.DUE,
                        ALLOWED: el.ALLOWED
                    };
                    this.umailsInfo.push(newField);
                    this.addFormControls(newField, false, true);
                    this.currentIndex = this.umailsInfo.length - 1;
                    this.statusBtnSub = false;
                    this.bacgHeader = false;
                });*/
            });
        }).catch( error => {
            this.bacgHeader = false;
        });
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
        if (node.data.rightContent !== E_RIGHT_DELO_ACCESS_CONTENT.none) {
            if (node.data.rightContent === E_RIGHT_DELO_ACCESS_CONTENT.docGroupCard) {
                this.flagToDisolayRestrictRegistrationFiling = true;
            } else {
                this.flagToDisolayRestrictRegistrationFiling = false;
            }
            this.flagToDisplayTheRightSide = true;
            this.updateForm(node);
            const firstElement = this.treeHierarchyOnTheRightSide[0]['card'];
            this.selectNodeOnTheRightSide(firstElement);
        } else {
            this.flagToDisplayTheRightSide = false;
            this.flagToDisolayRestrictRegistrationFiling = false;
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

    selectNodeOnTheRightSide(node) {
        if (node['INDEX_FOR_SELECT'] !== undefined || null) {
            if (this.selectedNodeOnTheRigthSide) {
                this.selectedNodeOnTheRigthSide['data']['isSelected'] = false;
            }
            this.selectedNodeOnTheRigthSide = this.allDocuments[node['INDEX_FOR_SELECT']];
            this.selectedNodeOnTheRigthSide['data']['isSelected'] = true;
        } else {
        if (this.selectedNodeOnTheRigthSide) {
            this.selectedNodeOnTheRigthSide['data']['isSelected'] = false;
        }
        this.selectedNodeOnTheRigthSide = node;
        this.selectedNodeOnTheRigthSide['data']['isSelected'] = true;
    }
    }

    openFolder(evt: Event, item) {
        evt.stopPropagation();
        if (item.openFolder) {
            item.openFolder = false;
        } else {
            item.openFolder = true;
        }
      /*  if (node.isExpanded) {
            node.isExpanded = false;
        } else {
            node.updating = true;
            this._dictSrv.expandNode(node.id)
                .then((_node) => {
                    _node.isExpanded = true;
                    node.updating = false;
                });
        }*/
    }
  //  selectInputOnChange(elem) {
      //  const dataUserCard = Array.from(this.userCard);
     //   for (let i = 0; i < dataUserCard.length; i++) {
           // if (dataUserCard[i][0] === event.target.value) {
              //  this.updateForm(Array.from(this.userCard), i);
              //  this.oldIndex = i;
               // this.prepDataAttachField(Array.from(this.userCard), i);
          //  }
       // }
      /*  this.inputs = this.getInputAttach();
        this.form = this.inputCtrlSrv.toFormGroup(this.inputs);
        this.dataForm = this.form.value;
        this.booleanDataForm = this.dataForm;
        this.form.valueChanges
             .subscribe(data => {
                 this.booleanFromSubscribe = data;
                 this.newDataFlag = true;
             }); */
  //  }
}
