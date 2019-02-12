import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { IParamUserCl, IInputParamControl, IInputParamControlForIndexRight } from 'eos-user-params/shared/intrfaces/user-parm.intterfaces';
import { NodeDocsTree } from 'eos-user-params/shared/list-docs-tree/node-docs-tree';
import { UserParamApiSrv } from 'eos-user-params/shared/services/user-params-api.service';
import { USERCARD, DEPARTMENT, DOCGROUP_CL } from 'eos-rest';
import { NodeRightInFileCard } from '../node-in-file-card';
import { UserParamsService } from 'eos-user-params/shared/services/user-params.service';
import { EosMessageService } from 'eos-common/services/eos-message.service';
import { RestError } from 'eos-rest/core/rest-error';
import { DOCUMENT_GROUPS, RESTRICT_REGISTRATION_FILING } from '../../shared-rights-delo/consts/card-index-rights.consts';
import { E_FIELD_TYPE } from 'eos-dictionaries/interfaces';
import { FormGroup } from '@angular/forms';
import { InputParamControlService } from 'eos-user-params/shared/services/input-param-control.service';
// import { RightSideDocGroupInFileCardNode } from './right-side-doc-group-in-file-card-node';
import { WaitClassifService } from 'app/services/waitClassif.service';
import { OPEN_CLASSIF_DOCGR } from '../../../../eos-user-select/shered/consts/create-user.consts';
import { LimitedAccesseService } from '../../../shared/services/limited-access.service';
// import { ITechUserClassifConst } from 'eos-user-params/rights-delo/shared-rights-delo/interfaces/tech-user-classif.interface';

@Component({
    selector: 'eos-right-side-doc-group-and-restriction-in-file-card',
    templateUrl: 'right-side-doc-group-and-restriction-in-file-card.component.html'
})

export class RightSideDocGroupAndRestrictionInFileCardComponent implements OnInit {
    @Input() selectedNode2: NodeRightInFileCard;
    @Input() curentUser: IParamUserCl;
    @Output() Changed = new EventEmitter();
    isLoading: boolean = true;
    arrayNadzorRight: string[];
    list: NodeDocsTree[] = [];
  //  listClassif: RightSideDocGroupInFileCardNode[] = [];
    stringForQuery = [];
    curentNode: NodeDocsTree;
    userCard: Map<string, USERCARD>;
    isShell: Boolean = false;
    bacgHeader: boolean;
  // listRestrictRegistrationFiling = [];
    listCards: IInputParamControl[] = DOCUMENT_GROUPS;
    listRestrictRegistrationFiling: IInputParamControl[] = RESTRICT_REGISTRATION_FILING;
   // listCards: NodeRightInFileCard[] = [];
    fields: IInputParamControlForIndexRight[];
    tmpUserCardDocgroup = [];
    arrayUserCardDocgroupWithCurrentFunclist = [];
    arrayDataDocumentsForMergeFirst = [];
    arrayDataDocumentsForMerge = [];
    arrayDataDocumentsForPost = [];
    inputs;
    form: FormGroup;
    allData = [];
    listAllData = [];
    private quaryDepartment = {
        DEPARTMENT: {
            criteries: {
                CARD_FLAG: '1'
            }
        }
    };
    constructor(
        private apiSrv: UserParamApiSrv,
        private _userParamsSetSrv: UserParamsService,
        private _msgSrv: EosMessageService,
        private _inputCtrlSrv: InputParamControlService,
        private _waitClassifSrv: WaitClassifService,
        private _limitservise: LimitedAccesseService
    ) {
      //  console.log(this.selectedNode2);
      //  console.log('Paris');
        const due: string[] = [];
        this.userCard = new Map<string, USERCARD>();
        this.curentUser = this._userParamsSetSrv.curentUser;
        this.curentUser['USERCARD_List'].forEach((card: USERCARD) => {
            this.userCard.set(card['DUE'], card);
            due.push(card['DUE']);
        });
        this.quaryDepartment.DEPARTMENT.criteries['DUE'] = due.join('||');
    }

    ngOnInit() {
        this._init();
    }

    select(node: NodeDocsTree) {
       // console.log(node);
        if (node.DUE !== '0.') {
            this.curentNode = node;
        } else {
            this.curentNode = null;
        }
    }

    setCharAt(str, index, chr) {
        if (index > str.length - 1) {
             return str;
            }
        return str.substr(0, index) + chr + str.substr(+index + 1);
    }

    checkedNode(event, item) {
 //  console.log(event);
 //  console.log(item);
   let rightDocGroup;
   let doc;
   const arrayDoc = [];
   let str;
   let newDataFromLocalStorageFuncFileCards = null;
//   let flag = true;
 //  let count = 0;

  /* if (node.data) {
   if (node.type === 'click') {
        if (this.form.controls[item.key].value === false) {
           // console.log(node);
           // console.log(item);
        } else {
            node.data['rightDocGroup']['ALLOWED'] = 1;
       }
        if (this.form.controls[item.card.key].value === false) {

        } else
       this.selectedNode2.pushChange({
            method: 'MERGE',
            due: node.DUE,
            data: node.data['rightDocGroup']
        });
        this.Changed.emit();
    }
   } */
   if (!event.target) {
    rightDocGroup = {
      ISN_LCLASSIF: event.data.rightDocGroup['ISN_LCLASSIF'],
      FUNC_NUM: +this.selectedNode2.key + 1, // +1
      DUE_CARD: event.data.rightDocGroup['DUE_CARD'],
      DUE: event['DUE'],
      ALLOWED: event['allowed']
  };
    this.arrayDataDocumentsForMerge.push(rightDocGroup);
    localStorage.setItem('arrayDataDocumentsForMerge', JSON.stringify(this.arrayDataDocumentsForMerge));
} else {
   if (event.target.tagName === 'LABEL') {} else {
    if (localStorage.getItem('FuncFileCards') !== null) {
        newDataFromLocalStorageFuncFileCards = JSON.parse(localStorage.getItem('FuncFileCards'));
    }
  //  console.log(event);
//    console.log(item);
    if (this.form.controls[item.key].value === false) {
        for (let i = 0; i < this.listAllData.length; i++) {
            if (this.listAllData[i][0]['key'] === item.key) {
                for (let j = 0; j < Array.from(this.userCard).length; j++) {
                    if (this.listAllData[i][0]['key'] === Array.from(this.userCard)[j][0]) {
                        if (newDataFromLocalStorageFuncFileCards !== null) {
                            str = newDataFromLocalStorageFuncFileCards[j][1]['FUNCLIST'];
                            if (+this.selectedNode2.key > 18 && str.length === 18) {
                                str += '000';
                            }
                            str = this.setCharAt(str, +this.selectedNode2.key, '1');
                            Array.from(this.userCard)[j][1]['FUNCLIST'] = str;
                            Array.from(this.userCard)[j][1]['FLAG_NEW_FUNCLIST'] = true;
                            localStorage.removeItem('FuncFileCards');
                            localStorage.setItem('FuncFileCards', JSON.stringify(Array.from(this.userCard)));
                          } else {
                            str = Array.from(this.userCard)[j][1]['FUNCLIST'];
                            if (+this.selectedNode2.key > 18 && str.length === 18) {
                                str += '000';
                            }
                            str = this.setCharAt(str, +this.selectedNode2.key, '1');
                            Array.from(this.userCard)[j][1]['FUNCLIST'] = str;
                            Array.from(this.userCard)[j][1]['FLAG_NEW_FUNCLIST'] = true;
                            localStorage.setItem('FuncFileCards', JSON.stringify(Array.from(this.userCard)));
                          }
                    }
                }
                rightDocGroup = {
                    ISN_LCLASSIF: this.allData[i]['ISN_LCLASSIF'],
                    FUNC_NUM: +this.selectedNode2.key + 1, // +1
                    DUE_CARD: item.key,
                    DUE: '0.',
                    ALLOWED: 1
                };
                doc = {
                    ACCESS_MODE: 0,
                    ACCESS_MODE_FIXED: 0,
                    CLASSIF_NAME: 'Все группы документов',
                    CODE: null,
                    DELETED: 1,
                    DOCGROUP_INDEX: null,
                    DOCNUMBER_FLAG: 1,
                    DUE: '0.',
                    EDS_FLAG: null,
                    ENCRYPT_FLAG: null,
                    E_DOCUMENT: 0,
                    FULLNAME: null,
                    INITIATIVE_RESOLUTION: 0,
                    ISN_HIGH_NODE: null,
                    ISN_LCLASSIF: 0,
                    ISN_NODE: 0,
                    IS_COPYCOUNT: 0,
                    IS_NODE: 0,
                    NOTE: null,
                    PARENT_DUE: null,
                    PRJ_APPLY2_EDS: null,
                    PRJ_APPLY_EDS: null,
                    PRJ_APPLY_EXEC_EDS: 0,
                    PRJ_AUTO_REG: null,
                    PRJ_DEL_AFTER_REG: null,
                    PRJ_NUM_FLAG: null,
                    PRJ_SHABLON: null,
                    PRJ_TEST_UNIQ_FLAG: null,
                    PRJ_WEIGHT: null,
                    PROTECTED: 1,
                    PROTECT_DEL_PRJ_STATUS: null,
                    RC_TYPE: 0,
                    SHABLON: null,
                    TEST_UNIQ_FLAG: 0,
                    WEIGHT: 0
                };
                arrayDoc.push(this._createNode(rightDocGroup, doc));
                if (this.listAllData[i].length !== 3) {
                this.listAllData[i].push(arrayDoc);
                this.listAllData[i].push({openDocumentTree: false});
                this.arrayDataDocumentsForMergeFirst.push(rightDocGroup);
                localStorage.setItem('arrayDataDocumentsForMergeFirst', JSON.stringify(this.arrayDataDocumentsForMergeFirst));
                }
                break;
            }
    }
    } else if (this.form.controls[item.key].value === true) {
        for (let i = 0; i < this.listAllData.length; i++) {
            if (this.listAllData[i][0]['key'] === item.key) {
                for (let j = 0; j < Array.from(this.userCard).length; j++) {
                    if (item.key === Array.from(this.userCard)[j][0]) {
                        if (newDataFromLocalStorageFuncFileCards !== null) {
                            str = newDataFromLocalStorageFuncFileCards[j][1]['FUNCLIST'];
                            str = this.setCharAt(str, +this.selectedNode2.key, '0');
                            Array.from(this.userCard)[j][1]['FUNCLIST'] = str;
                            Array.from(this.userCard)[j][1]['FLAG_NEW_FUNCLIST'] = true;
                            localStorage.removeItem('FuncFileCards');
                            localStorage.setItem('FuncFileCards', JSON.stringify(Array.from(this.userCard)));
                          } else {
                            str = Array.from(this.userCard)[j][1]['FUNCLIST'];
                            str = this.setCharAt(str, +this.selectedNode2.key, '0');
                            Array.from(this.userCard)[j][1]['FUNCLIST'] = str;
                            Array.from(this.userCard)[j][1]['FLAG_NEW_FUNCLIST'] = true;
                            localStorage.setItem('FuncFileCards', JSON.stringify(Array.from(this.userCard)));
                          }
                          for (let r = 0; r < this.arrayDataDocumentsForMergeFirst.length; r++) {
                            if (this.arrayDataDocumentsForMergeFirst[r]['DUE_CARD'] === item.key &&
                            this.arrayDataDocumentsForMergeFirst[r]['FUNC_NUM'] === (+this.selectedNode2.key + 1)) {
                                this.arrayDataDocumentsForMergeFirst.splice(r, 1);
                                localStorage.setItem('arrayDataDocumentsForMergeFirst', JSON.stringify(this.arrayDataDocumentsForMergeFirst));
                            }
                          }
                    }
                }
              this.listAllData[i].splice(1, 2);
            }
        }
    }
}
}
}

    openDocumentList(node) {
        node.openDocumentTree = !node.openDocumentTree;
    }

    addDocuments(item): void {
        this.bacgHeader = true;
        let rightDocGroup;
        this._waitClassifSrv.openClassif(OPEN_CLASSIF_DOCGR, true)
        .then(result_classif => {
            const newClassif = result_classif !== '' || null || undefined ? result_classif : '0.';
            this._limitservise.getCodeNameDOCGROUP(String(newClassif))
            .then(result => {
                for (let i = 0; i < this.listAllData.length; i++) {
                    if (this.listAllData[i][0]['key'] === item[0]['key']) {
                        for (let j = 0; j < result.length; j++) {
                        rightDocGroup = {
                            ISN_LCLASSIF: this.allData[i]['ISN_LCLASSIF'],
                            FUNC_NUM: +this.selectedNode2.key + 1, // +1
                            DUE_CARD: item[0]['key'],
                            DUE: result[j]['DUE'],
                            ALLOWED: 0
                        };
                       // arrayDoc.push(this._createNode(rightDocGroup, result));
                        this.listAllData[i][1].push(this._createNode(rightDocGroup, result[j]));
                        this.arrayDataDocumentsForPost.push(rightDocGroup);
                        localStorage.setItem('ArrayDataDocumentsForPost', JSON.stringify(this.arrayDataDocumentsForPost));
                    }
                    }
                }
               // this.Changed.emit();
              //  this.inputs = this._inputCtrlSrv.generateInputs(this.listAllData);
              //  this.form = this._inputCtrlSrv.toFormGroup(this.inputs);
            }).then(() => {
                item[2].openDocumentTree = !item[2].openDocumentTree;
                this.Changed.emit();
            });
        })
        .catch(error => {
            this.bacgHeader = false;
        });
    }

    removeDocuments() {
        if (this.curentNode.DUE !== '0.') {
            for (let i = 0; i < this.listAllData.length; i++) {
                if (this.listAllData[i][1] !== (null || undefined)) {
                    for (let j = 0; j < this.listAllData[i][1].length; j++) {
                        if (this.listAllData[i][1][j] === this.curentNode) {
                            this.listAllData[i][1].splice(j, 1);
                        }
                    }
                }
            }
            this.curentNode = null;
            this.Changed.emit();
        }
    }

    private _init() {
        this.isLoading = true;
        this.listCards = [];
        this.listRestrictRegistrationFiling = [];
        this.apiSrv.getData(this.quaryDepartment)
        .then(data => {
            data.forEach((d: DEPARTMENT) => {
                const card = this.userCard.get(d['DUE']);
                card['department'] = d;
                this.allData.push(card);
            });
            for (let i = 0; i < this.allData.length; i++) {
                this.listCards.push({
                    controlType: E_FIELD_TYPE.boolean,
                    key: this.allData[i]['DUE'],
                    label: this.allData[i]['department']['CARD_NAME'],
                    data: {
                        isSelected: false,
                    }
                 });
                 this.listRestrictRegistrationFiling.push({
                    controlType: E_FIELD_TYPE.boolean,
                    key: this.allData[i]['DUE'] + 'RESTRICT_REGISTRATION_FILING',
                    label: 'Ограничить картотекой регистрации',
                    data: {
                        isSelected: false,
                    }
                 });
            }

           /* this.listCards.forEach((item: IInputParamControl) => {
                this.listClassif.push(new RightSideDocGroupInFileCardNode(item, this.curentUser, this.selectedNode2, this));
            });*/

            for (let q = 0; q < this.listCards.length; q++) {
                if (this.allData[q]['DUE'] === this.listCards[q]['key']) {
                    this.listCards[q]['value'] = +this.allData[q]['FUNCLIST'].charAt(+this.selectedNode2.key);
                    this.listRestrictRegistrationFiling[q]['value'] = this.allData[q]['FUNCLIST'].charAt(+this.selectedNode2.key) === '2' ? true : false;
                }
            }

            for (let i = 0; i < this.allData.length; i++) {
                for (let j = 0; j < this.allData[i]['USER_CARD_DOCGROUP_List'].length; j++) {
                    if (this.allData[i]['USER_CARD_DOCGROUP_List'][j]['FUNC_NUM'] === +this.selectedNode2.key + 1) {
                        this.stringForQuery.push(this.allData[i]['USER_CARD_DOCGROUP_List'][j]['DUE']);
                    }
                }
            }

            for (let i = 0; i < this.allData.length; i++) {
                this.listAllData[i] = [];
                this.list = [];
                this.listAllData[i].push(this.listCards[i]);
                this.listAllData[i].push(this.listRestrictRegistrationFiling[i]);
                if (this.allData[i]['USER_CARD_DOCGROUP_List'].length > 0) {
                for (let j = 0; j < this.allData[i]['USER_CARD_DOCGROUP_List'].length; j++) {
                        this.apiSrv.getDocGroup(this.stringForQuery.join('||'))
                        .then((data2: DOCGROUP_CL[]) => {
                            data2.forEach((doc: DOCGROUP_CL) => {
                                if (this.allData[i]['USER_CARD_DOCGROUP_List'][j]['FUNC_NUM'] === +this.selectedNode2.key + 1) {
                                if (this.allData[i]['USER_CARD_DOCGROUP_List'][j]['DUE'] === doc['DUE']) {
                                    const rightDocGroup = {
                                        ISN_LCLASSIF: this.allData[i]['USER_CARD_DOCGROUP_List'][j]['ISN_LCLASSIF'],
                                        FUNC_NUM: +this.allData[i]['USER_CARD_DOCGROUP_List'][j]['DUE'], // +1
                                        DUE_CARD: this.allData[i]['USER_CARD_DOCGROUP_List'][j]['DUE_CARD'],
                                        DUE: this.allData[i]['USER_CARD_DOCGROUP_List'][j]['FUNC_NUM'],
                                        ALLOWED: this.allData[i]['USER_CARD_DOCGROUP_List'][j]['ALLOWED']
                                    };
                                    this.list.push(this._createNode(rightDocGroup, doc));
                                }
                             } else if (j === (this.allData[i]['USER_CARD_DOCGROUP_List'].length - 1) && i === (this.allData.length - 1)) {
                                    this.inputs = this._inputCtrlSrv.generateInputs(this.listCards);
                                    this.form = this._inputCtrlSrv.toFormGroup(this.inputs);
                                    this.isLoading = false;
                                }
                            });
                            })
                            .then(() => {
                                if (j === (this.allData[i]['USER_CARD_DOCGROUP_List'].length - 1) && this.list.length) {
                                    this.listAllData[i].push(this.list);
                                    this.listAllData[i].push({openDocumentTree: false});
                                    this.list = [];
                                }
                                if ((i === (this.allData.length - 1)) && (j === (this.allData[i]['USER_CARD_DOCGROUP_List'].length - 1))) {
                                    this.inputs = this._inputCtrlSrv.generateInputs(this.listCards);
                                    this.form = this._inputCtrlSrv.toFormGroup(this.inputs);
                                    this.isLoading = false;
                                }
                            });
                }
            } else if (i === (this.allData.length - 1)) {
                this.inputs = this._inputCtrlSrv.generateInputs(this.listCards);
                this.form = this._inputCtrlSrv.toFormGroup(this.inputs);
                this.isLoading = false;
            }
            }
            })
            .catch(e => {
                if (e instanceof RestError && (e.code === 434 || e.code === 0)) {
                    return undefined;
                } else {
                    const errMessage = e.message ? e.message : e;
                    this._msgSrv.addNewMessage({
                        type: 'danger',
                        title: 'Ошибка обработки. Ответ сервера:',
                        msg: errMessage
                    });
                    return null;
                }
            });
    }

    private _createNode(rDoc, doc: DOCGROUP_CL): NodeDocsTree {
        return new NodeDocsTree(
            doc.DUE,
            doc.CLASSIF_NAME,
            !!rDoc.ALLOWED,
            {
                rightDocGroup: rDoc,
                docGroup: doc
            }
        );
    }
   /* private _writeValue(constanta: IInputParamControlForIndexRight[]): IInputParamControlForIndexRight[] {
        const fields = [];
        constanta.forEach((node: IInputParamControlForIndexRight) => {
            fields.push(Object.assign({value: !!+this.arrayNadzorRight[+node['key']]}, node));
        });
        return fields;
    }
    private _createListCard(constanta: IInputParamControl[]): NodeRightInFileCard[] {
        const fields = [];
        constanta.forEach((node: IInputParamControl) => {
            fields.push(new NodeRightInFileCard(node, this.form.get(node['key']), this.curentUser));
        });
        return fields;
    }*/
}
