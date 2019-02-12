import { Component, OnInit, Injector, EventEmitter, Output } from '@angular/core';
import { UserParamApiSrv } from 'eos-user-params/shared/services/user-params-api.service';
import { CARD_INDEXS_RIGHTS, DOCUMENT_GROUPS, RESTRICT_REGISTRATION_FILING, ALL_DOCUMENTS } from '../shared-rights-delo/consts/card-index-rights.consts';
import { UserParamsService } from 'eos-user-params/shared/services/user-params.service';
import { IParamUserCl, IInputParamControlForIndexRight, IInputParamControl } from 'eos-user-params/shared/intrfaces/user-parm.intterfaces';
import { USERCARD } from 'eos-rest';
import { FormGroup } from '@angular/forms';
import { InputParamControlService } from 'eos-user-params/shared/services/input-param-control.service';
import { EosMessageService } from 'eos-common/services/eos-message.service';
import { PARM_SUCCESS_SAVE, PARM_ERROR_ON_BACKEND } from '../shared-rights-delo/consts/eos-user-params.const';
import { Subscription } from 'rxjs/Rx';
import { NodeDocsTree } from 'eos-user-params/shared/list-docs-tree/node-docs-tree';
import { NodeRightInFileCard } from './node-in-file-card';
import { RightSideListCardComponent } from './right-side-list-card/right-side-list-card.component';

@Component({
    selector: 'eos-rights-delo-card-index-rights',
    templateUrl: 'rights-delo-card-index-rights.component.html'
})

export class RightsDeloCardIndexRightsComponent implements OnInit {
    @Output() formChanged = new EventEmitter();
    rightSideListCardComponent: RightSideListCardComponent;
    list: NodeDocsTree[] = [];
    dataForm;
    curentUser: IParamUserCl;
    selectedNode2: NodeRightInFileCard;
    listRight: NodeRightInFileCard[] = [];
    arrayNadzorRight: string[];
    arrayNEWNadzorRight: string[];
    fields: IInputParamControlForIndexRight[];
    subForm: Subscription;
    indexForRightFileCard = -1;
    selectedNode: IInputParamControlForIndexRight;
    selectedNodeOnTheRigthSide: IInputParamControlForIndexRight;
    btnDisabled: boolean = false;
    isChangeForm = false;
    flagAddDocuments = false;
    flagRemoveDocuments = false;
    flagForTheNextRequest = false;
    flagForOpenFolder = false;
    flagCardFileAvailability = true;
    flagForHidenCheckboxRestrictRegistrationFiling = false;
    lastKeyForSelect;
    listNode: IInputParamControlForIndexRight[] = CARD_INDEXS_RIGHTS;
    listDocumentGroups: IInputParamControl[] = DOCUMENT_GROUPS;
    listRestrictRegistrationFiling: IInputParamControl[] = RESTRICT_REGISTRATION_FILING;
    allDocuments: IInputParamControl[] = ALL_DOCUMENTS;
    oldLastAllDocuments;
    listConcatRigthSide = [];
    treeHierarchyOnTheRightSide = [];
    allData = [];
    startAllData = [];
    userCard: Map<string, USERCARD>;
    msgSrv: EosMessageService;
    subscriptions: Subscription;
    newDataAttach;
    fieldsForRightSideCards;
    inputs;
    booleanFromSubscribe;
    booleanDataForm;
    arrayOfNewChanges = [];
    currentElementsForCards = [];
    arrayDataDocumentsForPost = [];
    arrayDataDocumentsForDelete = [];
    btnAddHiden = true;
    btnMinusHiden = true;
    strForSubscribe = '';
    form: FormGroup;
    isLoading = false;
    bacgHeader: boolean;
    flagToDisplayTheRightSide;
    oldIndex = [];
    reqq = [];
    lastIndex;
    arrayOfIndexesOfModifiedPositions = [];
    indexForCards;
    prepDataAttach = {};
    dataUserCardDocgroup;
    dataDocgroupCl;
    titleHeader: string;
    private quaryDepartment = {
        DEPARTMENT: {
            criteries: {
                CARD_FLAG: '1'
            }
        }
    };
    constructor(
        injector: Injector,
        private _userParamsSetSrv: UserParamsService,
        private servApi: UserParamApiSrv,
        private _inputCtrlSrv: InputParamControlService
    ) {
        this.init();
        const due: string[] = [];
        this.userCard = new Map<string, USERCARD>();
        this.curentUser['USERCARD_List'].forEach((card: USERCARD) => {
            this.userCard.set(card['DUE'], card);
            due.push(card['DUE']);
        });
        this.quaryDepartment.DEPARTMENT.criteries['DUE'] = due.join('||');
        this.msgSrv = injector.get(EosMessageService);
    }
    init() {
        this.curentUser = this._userParamsSetSrv.curentUser;
        if (this.curentUser['USERCARD_List'].length === 0) {
            this.flagCardFileAvailability = false;
        }
        this.titleHeader = `${this._userParamsSetSrv.curentUser.SURNAME_PATRON} - Права в картотеках`;
        this.curentUser['FUNCLIST'] = this.curentUser['FUNCLIST'] || '0'.repeat(21);
        this.arrayNadzorRight = this.curentUser['FUNCLIST'].split('');
        this.arrayNEWNadzorRight = this.curentUser['FUNCLIST'].split('');
        this.fields = this._writeValue(CARD_INDEXS_RIGHTS);
        this.inputs = this._inputCtrlSrv.generateInputs(this.fields);
        this.form = this._inputCtrlSrv.toFormGroup(this.inputs);
        this.listRight = this._createListRight(CARD_INDEXS_RIGHTS);
       /* this.subForm = this.form.valueChanges
            .subscribe(data => console.log(data));*/
    }

    hideToolTip() {
        const element = document.querySelector('.tooltip');
        if (element) {
            element.setAttribute('style', 'display: none');
        }
    }
    ngOnInit() {
        this.selectNode(this.listRight[0]);
      //  console.log(this.selectedNode2);
     /*   this.isLoading = true;
        this.listDocumentGroups = [];
        this.allDocuments = [];

        // ------------------------------------------------
        for (let e = 0; e < this.listNode.length; e++) {
            this.listNode[e]['data']['isSelected'] = false;
        }
        // ------------------------------------------------

        if (this.curentUser.USERCARD_List.length > 0) {
        this.servApi.getData(this.quaryDepartment)
        .then(data => {
            this.flagCardFileAvailability = true;
            data.forEach((d: DEPARTMENT) => {
                const card = this.userCard.get(d['DUE']);
                card['department'] = d;
                console.log(card);
                this.allData.push(card);
              });
              this.fieldsForRightSideCards = data;
              for (let i = 0; i < this.fieldsForRightSideCards.length; i++) {
                this.listDocumentGroups.push({
                    controlType: E_FIELD_TYPE.boolean,
                    key: this.fieldsForRightSideCards[i]['DUE'],
                    label: this.fieldsForRightSideCards[i]['CARD_NAME'],
                    data: {
                        isSelected: false,
                    }
                 });
                 this.listRestrictRegistrationFiling.push({
                    controlType: E_FIELD_TYPE.boolean,
                    key: this.fieldsForRightSideCards[i]['DUE'] + 'RESTRICT_REGISTRATION_FILING',
                    label: 'Ограничить картотекой регистрации',
                    data: {
                        isSelected: false,
                    }
                 });
              }
              this.prepDataAttachField();
        })
        .then(() => {
            this.servApi.getData(this.quaryDocgroupCl)
                .then(data2 => {
                    this.dataDocgroupCl = data2;
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
                        for (let t = 0; t < this.allData[z]['USER_CARD_DOCGROUP_List'].length; t++) {
                            this.allDocuments.push({
                                controlType: E_FIELD_TYPE.boolean,
                                key: this.allData[z]['USER_CARD_DOCGROUP_List'][t]['DUE_CARD'] + this.allData[z]['USER_CARD_DOCGROUP_List'][t]['DUE'] + this.allData[z]['USER_CARD_DOCGROUP_List'][t]['FUNC_NUM'],
                                label: this.allData[z]['USER_CARD_DOCGROUP_List'][t]['NAME'],
                                data: {
                                    isSelected: false,
                                }
                             });
                             this.allData[z]['USER_CARD_DOCGROUP_List'][t]['DUE_DOCUMENT'] = this.allData[z]['USER_CARD_DOCGROUP_List'][t]['DUE_CARD'] + this.allData[z]['USER_CARD_DOCGROUP_List'][t]['DUE'] +
                             this.allData[z]['USER_CARD_DOCGROUP_List'][t]['FUNC_NUM'];
                             this.allData[z]['USER_CARD_DOCGROUP_List'][t]['INDEX_FOR_SELECT'] = this.allDocuments.length - 1;
                        }
                    }
                }).then(() => {
                    const firstElement = this.listNode[0];
                  //  this.startAllData = this.allData;
                    this.selectNode(firstElement);
                    this.isLoading = false;
                });
        }).catch(data => console.log(data));
    }*/
    }
  /*  updateForm(dataCurrentListNode) {
        this.indexForCards = dataCurrentListNode['key'];
        this.currentElementsForCards = [];
        this.listConcatRigthSide = [];
        this.treeHierarchyOnTheRightSide = [];
        let dataCurrentDocument;

       for (let t = 0; t < this.listDocumentGroups.length; t++) {
           for (let z = 0; z < this.allData.length; z++) {
               if (this.listDocumentGroups[t]['key'] === this.allData[z]['DUE']) {
                  if (this.allData[z]['USER_CARD_DOCGROUP_List'].length > 0) {
                      for (let f = 0; f < this.allData[z]['USER_CARD_DOCGROUP_List'].length; f++) {
                          if ((+dataCurrentListNode.key + 1) === this.allData[z]['USER_CARD_DOCGROUP_List'][f]['FUNC_NUM']) {
                            dataCurrentDocument = [this.allData[z]['USER_CARD_DOCGROUP_List'][f]];
                            break;
                          } else {
                            dataCurrentDocument = null;
                          }
                      }
                  } else {
                    dataCurrentDocument = null;
                  }
                this.treeHierarchyOnTheRightSide.push({
                    card: this.listDocumentGroups[t],
                    openFolder: !this.listDocumentGroups[t]['FLAG_FOR_OPEN_FOLDER'] ? false : true,
                    restrictRegistrationFiling: dataCurrentListNode['data']['rightContent'] === E_RIGHT_DELO_ACCESS_CONTENT.docGroupCard ?
                     this.listRestrictRegistrationFiling[t] : null,
                     documents: dataCurrentDocument
                });
               for (let q = 1; q < this.allData[z]['USER_CARD_DOCGROUP_List'].length; q++) {
                 if (q > 1 && this.treeHierarchyOnTheRightSide[this.treeHierarchyOnTheRightSide.length - 1].documents !== null &&
                    (+dataCurrentListNode.key + 1) === this.allData[z]['USER_CARD_DOCGROUP_List'][q]['FUNC_NUM'] &&
                    this.allData[z]['USER_CARD_DOCGROUP_List'][q]['DUE'] !== '0.') {
                        this.treeHierarchyOnTheRightSide[this.treeHierarchyOnTheRightSide.length - 1].documents.push(this.allData[z]['USER_CARD_DOCGROUP_List'][q]);
                   }
               }
            }
        }
       }

        for (let i = 0; i < Array.from(this.userCard).length; i++) {
            this.currentElementsForCards.push([Array.from(this.userCard)[i][1]['FUNCLIST'].charAt(this.indexForCards), Array.from(this.userCard)[i][1]['DUE']]);
        }


        for (let j = 0; j < this.listDocumentGroups.length; j++) {
            for (let w = 0; w < this.currentElementsForCards.length; w++) {
        if (this.currentElementsForCards[w][1] === this.listDocumentGroups[j].key) {
            this.listDocumentGroups[j]['value'] = +this.currentElementsForCards[w][0];
            if (dataCurrentListNode.data.rightContent === E_RIGHT_DELO_ACCESS_CONTENT.docGroupCard) {
            if (+this.currentElementsForCards[w][0] === 2) {
                this.listRestrictRegistrationFiling[j]['value'] = +this.currentElementsForCards[w][0];
            } else {
                this.listRestrictRegistrationFiling[j]['value'] = false;
            }
        }
    }
    }
 }

        for (let x = 0; x < this.allDocuments.length; x++) {
            for (let g = 0; g < this.treeHierarchyOnTheRightSide.length; g++) {
                if (this.treeHierarchyOnTheRightSide[g].documents !== null) {
                    for (let r = 0; r < this.treeHierarchyOnTheRightSide[g].documents.length; r++) {
                        if (x === this.treeHierarchyOnTheRightSide[g].documents[r]['INDEX_FOR_SELECT']) {
                           this.allDocuments[x]['value'] = +this.treeHierarchyOnTheRightSide[g].documents[r]['ALLOWED'];
                        }
                    }
                }
            }
        }
    }
    prepDataAttachField() {
         for (let i = 0; i < this.listNode.length; i++) {
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
                this.allDocuments = [];

                for (let i = 0; i < result.length; i++) {
                    for (let j = 0; j < this.allData.length; j++) {
                        if ((this.allData[j]['DUE'] === this.selectedNodeOnTheRigthSide.key) &&
                        this.allData[j]['USER_CARD_DOCGROUP_List'].every(elem => elem['DUE'] !== result[i]['DUE'])) {
                            this.allData[j]['USER_CARD_DOCGROUP_List'].push({
                                ALLOWED: 0,
                                DUE: result[i]['DUE'],
                                DUE_CARD: this.allData[j]['DUE'],
                               // DUE_DOCUMENT: this.treeHierarchyOnTheRightSide[j]['card']['key'] + result[i]['DUE'] + (+this.selectedNode.key + 1),
                                FUNC_NUM: (+this.selectedNode.key + 1),
                                ISN_LCLASSIF: this.allData[0]['ISN_LCLASSIF'],
                              //  INDEX_FOR_SELECT:
                                NAME: result[i]['CLASSIF_NAME']
                            });
                            this.arrayDataDocumentsForPost.push({
                                DUE: result[i]['DUE'],
                                DUE_CARD: this.allData[j]['DUE'],
                                FUNC_NUM: (+this.selectedNode.key + 1),
                                ISN_LCLASSIF: this.allData[0]['ISN_LCLASSIF']
                            });
                        this.btnDisabled = false;
                        }
                    }
                }

                this.flagAddDocuments = true;

                this.updateAllDocuments();

            this.updateForm(this.selectedNode);
            this.inputs = this.getInputAttach();
            this.form = this.inputCtrlSrv.toFormGroup(this.inputs);
            });
        }).catch( error => {
            this.bacgHeader = false;
        });
    }
    updateAllDocuments() {
        this.allDocuments = [];
        for (let z = 0; z < this.allData.length; z++) {
              for (let t = 0; t < this.allData[z]['USER_CARD_DOCGROUP_List'].length; t++) {
                  this.allDocuments.push({
                      controlType: E_FIELD_TYPE.boolean,
                      key: this.allData[z]['USER_CARD_DOCGROUP_List'][t]['DUE_CARD'] + this.allData[z]['USER_CARD_DOCGROUP_List'][t]['DUE'] + this.allData[z]['USER_CARD_DOCGROUP_List'][t]['FUNC_NUM'],
                      label: this.allData[z]['USER_CARD_DOCGROUP_List'][t]['NAME'],
                      data: {
                          isSelected: false,
                      }
                   });
                   this.allData[z]['USER_CARD_DOCGROUP_List'][t]['DUE_DOCUMENT'] = this.allData[z]['USER_CARD_DOCGROUP_List'][t]['DUE_CARD'] + this.allData[z]['USER_CARD_DOCGROUP_List'][t]['DUE'] +
                    this.allData[z]['USER_CARD_DOCGROUP_List'][t]['FUNC_NUM'];
                   this.allData[z]['USER_CARD_DOCGROUP_List'][t]['INDEX_FOR_SELECT'] = this.allDocuments.length - 1;
              }
          }
    }
    setCharAt(str, index, chr) {
        if (index > str.length - 1) {
             return str;
            }
        return str.substr(0, index) + chr + str.substr(+index + 1);
    }
    checkData(event, item, type) {
        event.preventDefault();
        event.stopPropagation();
        const newClassif = '0.';
        if (event.target.tagName === 'LABEL') {
            if (type === 'card') {
                this.selectNodeOnTheRightSide(item.card);
            } else if (type === 'restrict') {
                this.selectNodeOnTheRightSide(item.restrictRegistrationFiling);
            } else if (type === 'documents') {
                this.selectNodeOnTheRightSide(item);
            }
        } else {
        if (type === 'card') {
        if (this.form.controls[item.card.key].value === false) {
            for (let i = 0; i < Array.from(this.userCard).length; i++) {
                if (item.card.key === Array.from(this.userCard)[i][0]) {
                    let str = Array.from(this.userCard)[i][1]['FUNCLIST'];
                    if (this.indexForCards > 18 && str.length === 18) {
                        str += '000';
                    }
                    str = this.setCharAt(str, this.indexForCards, '1');
                    Array.from(this.userCard)[i][1]['FUNCLIST'] = str;
                    Array.from(this.userCard)[i][1]['FLAG_NEW_FUNCLIST'] = true;
                }
            }

            for (let j = 0; j < this.allData.length; j++) {
                if (this.allData[j]['DUE'] === item.card.key) {
                    this._limitservise.getCodeNameDOCGROUP(String(newClassif))
                    .then(result => {
                        this.allData[j]['USER_CARD_DOCGROUP_List'] = [];
                        this.allData[j]['USER_CARD_DOCGROUP_List'].push({
                            ALLOWED: 1,
                            DUE: result[0]['DUE'],
                            DUE_CARD: this.allData[j]['DUE'],
                            FUNC_NUM: (+this.selectedNode.key + 1),
                            ISN_LCLASSIF: this.allData[0]['ISN_LCLASSIF'],
                            NAME: result[0]['CLASSIF_NAME']
                        });
                    }).then(() => {
                    this.updateAllDocuments();
                    this.updateForm(this.selectedNode);
                    this.inputs = this.getInputAttach();
                    this.form = this.inputCtrlSrv.toFormGroup(this.inputs);
                    });
                }
            }
            if (this.lastKeyForSelect === item.card.key) {
                this.btnAddHiden = false;
            }
            this.flagForHidenCheckboxRestrictRegistrationFiling = true;
          //  this.flagForButtonAddIfCheck = true;
        } else if (this.form.controls[item.card.key].value === true) {
            for (let i = 0; i < Array.from(this.userCard).length; i++) {
                if (item.card.key === Array.from(this.userCard)[i][0]) {
                    let str = Array.from(this.userCard)[i][1]['FUNCLIST'];
                    str = this.setCharAt(str, this.indexForCards, '0');
                    Array.from(this.userCard)[i][1]['FUNCLIST'] = str;
                    Array.from(this.userCard)[i][1]['FLAG_NEW_FUNCLIST_REMOVE'] = true;
                }
            }
            for (let a = 0; a < this.listDocumentGroups.length; a++) {
                if (this.listDocumentGroups[a].key === item.card.key) {
                  this.listDocumentGroups[a]['value'] = 0;
                }
            }
            for (let j = 0; j < this.allData.length; j++) {
                if (this.allData[j]['DUE'] === item.card.key) {
                    this.allData[j]['USER_CARD_DOCGROUP_List'] = [];
                    this.updateForm(this.selectedNode);
                    this.inputs = this.getInputAttach();
                    this.form = this.inputCtrlSrv.toFormGroup(this.inputs);
                }
            }
            if (this.lastKeyForSelect === item.card.key) {
                this.btnAddHiden = true;
            }
            this.flagForHidenCheckboxRestrictRegistrationFiling = false;
           // this.flagForButtonAddIfCheck = false;
        }
    } else if (type === 'restrict') {
        if (this.form.controls[item.restrictRegistrationFiling.key].value === false) {
            for (let i = 0; i < Array.from(this.userCard).length; i++) {
                if (item.card.key === Array.from(this.userCard)[i][0]) {
                    let str = Array.from(this.userCard)[i][1]['FUNCLIST'];
                    str = this.setCharAt(str, this.indexForCards, '2');
                    Array.from(this.userCard)[i][1]['FUNCLIST'] = str;
                    Array.from(this.userCard)[i][1]['FLAG_NEW_FUNCLIST'] = true;
                }
            }
            this.updateAllDocuments();
                    this.updateForm(this.selectedNode);
                    this.inputs = this.getInputAttach();
                    this.form = this.inputCtrlSrv.toFormGroup(this.inputs);
        } else if (this.form.controls[item.restrictRegistrationFiling.key].value === true) {
            for (let i = 0; i < Array.from(this.userCard).length; i++) {
                if (item.card.key === Array.from(this.userCard)[i][0]) {
                    let str = Array.from(this.userCard)[i][1]['FUNCLIST'];
                    str = this.setCharAt(str, this.indexForCards, '1');
                    Array.from(this.userCard)[i][1]['FUNCLIST'] = str;
                    Array.from(this.userCard)[i][1]['FLAG_NEW_FUNCLIST'] = true;
                }
            }
            this.updateAllDocuments();
                    this.updateForm(this.selectedNode);
                    this.inputs = this.getInputAttach();
                    this.form = this.inputCtrlSrv.toFormGroup(this.inputs);
        }
    } else if (type === 'documents') {
        if (this.form.controls[item.DUE_DOCUMENT].value === false) {
            for (let i = 0; i < Array.from(this.userCard).length; i++) {
                if (item.DUE_CARD === Array.from(this.userCard)[i][0]) {
                    for (let j = 0; j < Array.from(this.userCard)[i][1]['USER_CARD_DOCGROUP_List'].length; j++) {
                        if (Array.from(this.userCard)[i][1]['USER_CARD_DOCGROUP_List'][j]['DUE_DOCUMENT'] === item.DUE_DOCUMENT) {
                            Array.from(this.userCard)[i][1]['USER_CARD_DOCGROUP_List'][j]['ALLOWED'] = 1;
                            Array.from(this.userCard)[i][1]['USER_CARD_DOCGROUP_List'][j]['FLAG_NEW_DATA_DOCUMENTS'] = true;
                        }
                    }
                }
            }
            this.updateAllDocuments();
                    this.updateForm(this.selectedNode);
                    this.inputs = this.getInputAttach();
                    this.form = this.inputCtrlSrv.toFormGroup(this.inputs);
                    this.subscriptions = this.form.valueChanges
            .subscribe(newVal => {
                let changed = false;
                Object.keys(newVal).forEach(path => {
                    if (this.changeByPath(path, newVal[path])) {
                        changed = true;
                    }
                });
                this.formChanged.emit(changed);
                this.isChangeForm = changed;
            });
        } else if (this.form.controls[item.DUE_DOCUMENT].value === true) {
            for (let i = 0; i < Array.from(this.userCard).length; i++) {
                if (item.DUE_CARD === Array.from(this.userCard)[i][0]) {
                    for (let j = 0; j < Array.from(this.userCard)[i][1]['USER_CARD_DOCGROUP_List'].length; j++) {
                        if (Array.from(this.userCard)[i][1]['USER_CARD_DOCGROUP_List'][j]['DUE_DOCUMENT'] === item.DUE_DOCUMENT) {
                            Array.from(this.userCard)[i][1]['USER_CARD_DOCGROUP_List'][j]['ALLOWED'] = 0;
                            Array.from(this.userCard)[i][1]['USER_CARD_DOCGROUP_List'][j]['FLAG_NEW_DATA_DOCUMENTS'] = true;
                        }
                    }
                }
            }
            this.updateAllDocuments();
            this.updateForm(this.selectedNode);
            this.inputs = this.getInputAttach();
            this.form = this.inputCtrlSrv.toFormGroup(this.inputs);
        }
    }
    this.btnDisabled = false;
    }
    }
    changeByPath(path: string, value: any) {
        let _value = null;
        _value = value;
        this.newDataAttach = EosUtils.setValueByPath(this.newDataAttach, path, _value);
        const oldValue = EosUtils.getValueByPath(this.prepDataAttach, path, false);

        if (oldValue !== _value) {
            // console.log('changed', path, oldValue, 'to', _value, this.prepDataAttach.rec);
        }
        return _value !== oldValue;
    } */
    submit() {
            this.servApi
                .setData(this.createObjRequestForAttach())
                .then(data => {
                    this.servApi.setData(this.createObjRequestForAttachAfterBackend2())
                    .then(data2 => {
                       this._userParamsSetSrv.getUserIsn('' + this.userCard.get(Array.from(this.userCard)[0][0])['ISN_LCLASSIF']);
                       this.msgSrv.addNewMessage(PARM_SUCCESS_SAVE);
                    })
                    .catch(data2 => console.log(data2));
                })
                // tslint:disable-next-line:no-console
                .catch(() => this.msgSrv.addNewMessage(PARM_ERROR_ON_BACKEND));
    }
    createObjRequestForAttach() {
        const req = [];
        let newDataFromLocalStorageFuncFileCards;
        newDataFromLocalStorageFuncFileCards = JSON.parse(localStorage.getItem('FuncFileCards'));
        if (newDataFromLocalStorageFuncFileCards) {
        for (let i = 0; i < newDataFromLocalStorageFuncFileCards.length; i++) {
            const tmp = this.userCard.get(newDataFromLocalStorageFuncFileCards[i][0]);
             if (newDataFromLocalStorageFuncFileCards[i][1]['FLAG_NEW_FUNCLIST'] === true ||
             newDataFromLocalStorageFuncFileCards[i][1]['FLAG_NEW_FUNCLIST_REMOVE'] === true) {
                req.push({
                method: 'MERGE',
                requestUri: `USER_CL(${tmp['ISN_LCLASSIF']})/USERCARD_List(\'${tmp['ISN_LCLASSIF']} ${tmp['DUE']}\')`,
                data: {
                    FUNCLIST: tmp['FUNCLIST']
                }
            });
           if (newDataFromLocalStorageFuncFileCards[i][1]['FLAG_NEW_FUNCLIST'] === true) {
            newDataFromLocalStorageFuncFileCards['FLAG_NEW_DOCUMENTS'] = true;
            newDataFromLocalStorageFuncFileCards[i][1]['FLAG_NEW_FUNCLIST'] = false;
           }
        }
    }
}
console.log(req);
        return req;
    }
    createObjRequestForAttachAfterBackend2() {
        const req = [];
        let newDataFromLocalStorageFuncFileCards;
        let newArrayDataDocumentsForPost;
        let newArrayDataDocumentsForMergeFirst;
        let newArrayDataDocumentsForMerge;
        let newArrayDataDocumentsForDelete;
        newDataFromLocalStorageFuncFileCards = JSON.parse(localStorage.getItem('FuncFileCards'));
        newArrayDataDocumentsForPost = JSON.parse(localStorage.getItem('ArrayDataDocumentsForPost'));
        newArrayDataDocumentsForMergeFirst = JSON.parse(localStorage.getItem('arrayDataDocumentsForMergeFirst'));
        newArrayDataDocumentsForMerge = JSON.parse(localStorage.getItem('arrayDataDocumentsForMerge'));
        newArrayDataDocumentsForDelete = JSON.parse(localStorage.getItem('arrayDataDocumentsForDelete'));

      if (newDataFromLocalStorageFuncFileCards && newArrayDataDocumentsForMergeFirst) {
        for (let i = 0; i < newDataFromLocalStorageFuncFileCards.length; i++) {
            const tmp = newDataFromLocalStorageFuncFileCards[i][1];
            for (let j = 0; j < newArrayDataDocumentsForMergeFirst.length; j++) {
                if (newDataFromLocalStorageFuncFileCards[i][0] === newArrayDataDocumentsForMergeFirst[j]['DUE_CARD']) {
                    for (let w = 0; w < newDataFromLocalStorageFuncFileCards[i][1]['USER_CARD_DOCGROUP_List'].length; w++) {
                        if (newDataFromLocalStorageFuncFileCards[i][1]['USER_CARD_DOCGROUP_List'][w]['DUE'] === newArrayDataDocumentsForMergeFirst[j]['DUE'] &&
                        newDataFromLocalStorageFuncFileCards[i][1]['USER_CARD_DOCGROUP_List'][w]['FUNC_NUM'] === (+this.selectedNode2.key + 1)) {
                            req.push({
                                method: 'MERGE',
            requestUri: `USER_CL(${tmp['ISN_LCLASSIF']})/USERCARD_List(\'${tmp['ISN_LCLASSIF']} ${tmp['DUE']}\')` +
            `/USER_CARD_DOCGROUP_List(\'${tmp['ISN_LCLASSIF']} ${tmp['DUE']} ${tmp.USER_CARD_DOCGROUP_List[w]['DUE']} ${tmp.USER_CARD_DOCGROUP_List[w]['FUNC_NUM']}\')`,
                                data: {
                                    ALLOWED: tmp.USER_CARD_DOCGROUP_List[w]['ALLOWED']
                                }
                            });
                        }
                    }
                }
            }
        }
        localStorage.removeItem('FuncFileCards');
        localStorage.removeItem('arrayDataDocumentsForMergeFirst');
    }

    if (newArrayDataDocumentsForPost) {
        for (let i = 0; i < newArrayDataDocumentsForPost.length; i++) {
            req.push({
                method: 'POST',
requestUri: `USER_CL(${newArrayDataDocumentsForPost[i]['ISN_LCLASSIF']})/USERCARD_List(\'${newArrayDataDocumentsForPost[i]['ISN_LCLASSIF']} ${newArrayDataDocumentsForPost[i]['DUE_CARD']}\')/USER_CARD_DOCGROUP_List()`,
                data: {
                    ISN_LCLASSIF: newArrayDataDocumentsForPost[i]['ISN_LCLASSIF'],
                    DUE_CARD: newArrayDataDocumentsForPost[i]['DUE_CARD'],
                    DUE: newArrayDataDocumentsForPost[i]['DUE'],
                    FUNC_NUM: newArrayDataDocumentsForPost[i]['FUNC_NUM'],
                    ALLOWED: newArrayDataDocumentsForPost[i]['ALLOWED']
                }
            });
        }
        localStorage.removeItem('ArrayDataDocumentsForPost');
    }

    if (newArrayDataDocumentsForMerge) {
        for (let t = 0; t < newArrayDataDocumentsForMerge.length; t++) {
                req.push({
                    method: 'MERGE',
requestUri: `USER_CL(${newArrayDataDocumentsForMerge[t]['ISN_LCLASSIF']})/USERCARD_List(\'${newArrayDataDocumentsForMerge[t]['ISN_LCLASSIF']} ${newArrayDataDocumentsForMerge[t]['DUE_CARD']}\')` +
`/USER_CARD_DOCGROUP_List(\'${newArrayDataDocumentsForMerge[t]['ISN_LCLASSIF']} ${newArrayDataDocumentsForMerge[t]['DUE_CARD']} ${newArrayDataDocumentsForMerge[t]['DUE']} ${newArrayDataDocumentsForMerge[t]['FUNC_NUM']}\')`,
                    data: {
                        ALLOWED: newArrayDataDocumentsForMerge[t]['ALLOWED'] === true ? 1 : 0
                    }
                });
        }
        localStorage.removeItem('arrayDataDocumentsForMerge');
    }

    if (newArrayDataDocumentsForDelete) {
        for (let e = 0; e < Array.from(this.userCard).length; e++) {
            const tmp = Array.from(this.userCard)[e][1];
            for (let f = 0; f < tmp['USER_CARD_DOCGROUP_List'].length; f++) {
            for (let t = 0; t < newArrayDataDocumentsForDelete.length; t++) {
                if (newArrayDataDocumentsForDelete[t]['DUE_CARD'] === Array.from(this.userCard)[e][0] &&
                newArrayDataDocumentsForDelete[t]['DUE'] === tmp['USER_CARD_DOCGROUP_List'][f]['DUE']) {
                    req.push({
                        method: 'DELETE',
        requestUri: `USER_CL(${tmp['ISN_LCLASSIF']})/USERCARD_List(\'${tmp['ISN_LCLASSIF']} ${tmp['DUE']}\')` +
        `/USER_CARD_DOCGROUP_List(\'${tmp['ISN_LCLASSIF']} ${tmp['DUE']} ${tmp.USER_CARD_DOCGROUP_List[f]['DUE']} ${tmp.USER_CARD_DOCGROUP_List[f]['FUNC_NUM']}\')`
                    });
                }
            }
        }
        }
        localStorage.removeItem('arrayDataDocumentsForDelete');
    }
    console.log(req);
    return req;
    }

  /*  createObjRequestForAttachAfterBackend() {
        const req = [];
        this.arrayOfNewChanges = [];
        for (let i = 0; i < this.userCard.size; i++) {
            const tmp = this.userCard.get(Array.from(this.userCard)[i][0]);
            if (this.flagForTheNextRequest) {
                for (let j = 0; j < tmp.USER_CARD_DOCGROUP_List.length; j++) {
                    for (let k = 0; k < this.arrayDataDocumentsForPost.length; k++) {
                    if (this.arrayDataDocumentsForPost[k]['DUE'] === tmp.USER_CARD_DOCGROUP_List[j]['DUE'] &&
                    this.arrayDataDocumentsForPost[k]['DUE_CARD'] === tmp.USER_CARD_DOCGROUP_List[j]['DUE_CARD']) {
                    req.push({
                        method: 'POST',
    requestUri: `USER_CL(${tmp['ISN_LCLASSIF']})/USERCARD_List(\'${tmp['ISN_LCLASSIF']} ${tmp['DUE']}\')/USER_CARD_DOCGROUP_List()`,
                        data: {
                            ISN_LCLASSIF: tmp['ISN_LCLASSIF'],
                            DUE_CARD: tmp['DUE'],
                            DUE: tmp.USER_CARD_DOCGROUP_List[j]['DUE'],
                            FUNC_NUM: tmp.USER_CARD_DOCGROUP_List[j]['FUNC_NUM'],
                            ALLOWED: tmp.USER_CARD_DOCGROUP_List[j]['ALLOWED']
                        }
                    });
                }
            }
            }
            } else if (this.flagRemoveDocuments) {
                for (let j = 0; j < this.arrayDataDocumentsForDelete.length; j++) {
                    req.push({
                        method: 'DELETE',
requestUri: `USER_CL(${this.arrayDataDocumentsForDelete[j]['ISN_LCLASSIF']})/USERCARD_List(\'${this.arrayDataDocumentsForDelete[j]['ISN_LCLASSIF']} ${this.arrayDataDocumentsForDelete[j]['DUE_CARD']}\')` +
`/USER_CARD_DOCGROUP_List(\'${this.arrayDataDocumentsForDelete[j]['ISN_LCLASSIF']} ${this.arrayDataDocumentsForDelete[j]['DUE_CARD']} ${this.arrayDataDocumentsForDelete[j]['DUE']} ${this.arrayDataDocumentsForDelete[j]['FUNC_NUM']}\')`
                    });
                }
                this.flagRemoveDocuments = false;
            } else {
            if (Array.from(this.userCard)[i][1]['FLAG_NEW_DOCUMENTS'] === true) {
                for (let j = 0; j < tmp.USER_CARD_DOCGROUP_List.length; j++) {
                req.push({
                    method: 'MERGE',
requestUri: `USER_CL(${tmp['ISN_LCLASSIF']})/USERCARD_List(\'${tmp['ISN_LCLASSIF']} ${tmp['DUE']}\')` +
`/USER_CARD_DOCGROUP_List(\'${tmp['ISN_LCLASSIF']} ${tmp['DUE']} ${tmp.USER_CARD_DOCGROUP_List[j]['DUE']} ${tmp.USER_CARD_DOCGROUP_List[j]['FUNC_NUM']}\')`,
                    data: {
                        ALLOWED: 1
                    }
                });
            }
            Array.from(this.userCard)[i][1]['FLAG_NEW_DOCUMENTS'] = false;
        } else if (Array.from(this.userCard)[i][1]['FLAG_NEW_FUNCLIST_REMOVE'] === true) {
            for (let j = 0; j < tmp.USER_CARD_DOCGROUP_List.length; j++) {
            req.push({
                method: 'DELETE',
requestUri: `USER_CL(${tmp['ISN_LCLASSIF']})/USERCARD_List(\'${tmp['ISN_LCLASSIF']} ${tmp['DUE']}\')` +
`/USER_CARD_DOCGROUP_List(\'${tmp['ISN_LCLASSIF']} ${tmp['DUE']} ${tmp.USER_CARD_DOCGROUP_List[j]['DUE']} ${tmp.USER_CARD_DOCGROUP_List[j]['FUNC_NUM']}\')`
            });
        }
        } else {
            for (let j = 0; j < Array.from(this.userCard)[i][1]['USER_CARD_DOCGROUP_List'].length; j++) {
            if (Array.from(this.userCard)[i][1]['USER_CARD_DOCGROUP_List'][j]['FLAG_NEW_DATA_DOCUMENTS']) {
                req.push({
                    method: 'MERGE',
requestUri: `USER_CL(${tmp['ISN_LCLASSIF']})/USERCARD_List(\'${tmp['ISN_LCLASSIF']} ${tmp['DUE']}\')` +
`/USER_CARD_DOCGROUP_List(\'${tmp['ISN_LCLASSIF']} ${tmp['DUE']} ${tmp.USER_CARD_DOCGROUP_List[j]['DUE']} ${tmp.USER_CARD_DOCGROUP_List[j]['FUNC_NUM']}\')`,
                    data: {
                        ALLOWED: tmp.USER_CARD_DOCGROUP_List[j]['ALLOWED']
                    }
                });
            }
        }
        }
    }
}
    return req;
    } */

    cancel() {
    }

   /* selectNodeOnTheRightSide(node) {
        if (node['INDEX_FOR_SELECT'] !== undefined || null) {
            this.btnAddHiden = true;
            if (this.selectedNodeOnTheRigthSide) {
                this.selectedNodeOnTheRigthSide['data']['isSelected'] = false;
            }
            this.selectedNodeOnTheRigthSide = this.allDocuments[node['INDEX_FOR_SELECT']];
            this.selectedNodeOnTheRigthSide['data']['isSelected'] = true;
            if (this.selectedNodeOnTheRigthSide.label === 'Все группы документов') {
                this.btnMinusHiden = true;
            } else {
                this.btnMinusHiden = false;
            }
        } else {
        if (this.selectedNodeOnTheRigthSide) {
            this.selectedNodeOnTheRigthSide['data']['isSelected'] = false;
        }
        this.selectedNodeOnTheRigthSide = node;
        if (this.selectedNodeOnTheRigthSide.label === 'Ограничить картотекой регистрации') {
            this.btnAddHiden = true;
            this.btnMinusHiden = true;
        } else if (this.selectedNodeOnTheRigthSide.value === 0) {
            this.btnAddHiden = true;
            this.btnMinusHiden = true;
        } else {
            this.btnAddHiden = false;
            this.btnMinusHiden = true;
        }
        this.lastKeyForSelect = this.selectedNodeOnTheRigthSide.key;
        this.selectedNodeOnTheRigthSide['data']['isSelected'] = true;
    }
    }

    openFolder(evt: Event, item) {
        evt.stopPropagation();
        for (let i = 0; i < this.listDocumentGroups.length; i++) {
        if (item.card.key === this.listDocumentGroups[i].key) {
        if (item.openFolder) {
            item.openFolder = false;
            this.listDocumentGroups[i]['FLAG_FOR_OPEN_FOLDER'] = false;
        } else {
            item.openFolder = true;
            this.listDocumentGroups[i]['FLAG_FOR_OPEN_FOLDER'] = true;
        }
    }
    }
    }

    removeDocuments() {
        for (let i = 0; i < this.allData.length; i++) {
            for (let j = 0; j < this.allData[i]['USER_CARD_DOCGROUP_List'].length; j++) {
                if (this.allData[i]['USER_CARD_DOCGROUP_List'][j]['DUE_DOCUMENT'] === this.selectedNodeOnTheRigthSide.key) {
                    this.flagRemoveDocuments = true;
                    this.arrayDataDocumentsForDelete.push({
                        ISN_LCLASSIF: this.allData[0]['ISN_LCLASSIF'],
                        DUE: this.allData[i]['USER_CARD_DOCGROUP_List'][j]['DUE'],
                        DUE_CARD: this.allData[i]['USER_CARD_DOCGROUP_List'][j]['DUE_CARD'],
                        FUNC_NUM: this.allData[i]['USER_CARD_DOCGROUP_List'][j]['FUNC_NUM'],
                    });
                    this.allData[i]['USER_CARD_DOCGROUP_List'].splice(j, 1);
                    this.btnDisabled = false;
                }
            }
        }

        this.updateAllDocuments();
        this.updateForm(this.selectedNode);
        this.inputs = this.getInputAttach();
        this.form = this.inputCtrlSrv.toFormGroup(this.inputs);
    } */

    selectNode(node: NodeRightInFileCard) {
        if (this.selectedNode2 !== node) {
            if (this.selectedNode2) {
                this.selectedNode2.isSelected = false;
            }
            this.selectedNode2 = node;
            this.selectedNode2.isSelected = true;
        }
    }

    clickLable(event, item: NodeRightInFileCard) {
        this.selectNode(item);

        for (let i = 0; i < this.listNode.length; i++) {
            if (this.listNode[i].label === event.target.innerText) {
                this.indexForRightFileCard = +this.listNode[i] + 1;
            }
        }
    }

    private _writeValue(constanta: IInputParamControlForIndexRight[]): IInputParamControlForIndexRight[] {
        const fields = [];
        constanta.forEach((node: IInputParamControlForIndexRight) => {
            fields.push(Object.assign({value: !!+this.arrayNadzorRight[+node['key']]}, node));
        });
        return fields;
    }

    private _createListRight(constanta: IInputParamControlForIndexRight[]): NodeRightInFileCard[] {
        const fields = [];
        constanta.forEach((node: IInputParamControlForIndexRight) => {
            fields.push(new NodeRightInFileCard(node, +this.arrayNadzorRight[+node['key']], this.form.get(node['key']), this.curentUser));
        });
        return fields;
    }
}
