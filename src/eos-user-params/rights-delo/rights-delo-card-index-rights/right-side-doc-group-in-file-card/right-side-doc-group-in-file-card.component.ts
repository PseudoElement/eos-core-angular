import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { IParamUserCl, IInputParamControl, IInputParamControlForIndexRight, INodeDocsTreeCfg } from 'eos-user-params/shared/intrfaces/user-parm.intterfaces';
import { NodeDocsTree } from 'eos-user-params/shared/list-docs-tree/node-docs-tree';
import { UserParamApiSrv } from 'eos-user-params/shared/services/user-params-api.service';
import { USERCARD, DEPARTMENT, DOCGROUP_CL } from 'eos-rest';
import { NodeRightInFileCard } from '../node-in-file-card';
import { UserParamsService } from 'eos-user-params/shared/services/user-params.service';
import { EosMessageService } from 'eos-common/services/eos-message.service';
import { RestError } from 'eos-rest/core/rest-error';
import { DOCUMENT_GROUPS } from '../../shared-rights-delo/consts/card-index-rights.consts';
import { E_FIELD_TYPE } from 'eos-dictionaries/interfaces';
import { FormGroup } from '@angular/forms';
import { InputParamControlService } from 'eos-user-params/shared/services/input-param-control.service';
import { WaitClassifService } from 'app/services/waitClassif.service';
import { OPEN_CLASSIF_DOCGR } from '../../../../eos-user-select/shered/consts/create-user.consts';
import { LimitedAccesseService } from '../../../shared/services/limited-access.service';
import { RightsDeloCardIndexRightsComponent } from '../rights-delo-card-index-rights.component';

@Component({
    selector: 'eos-right-side-doc-group-in-file-card',
    templateUrl: 'right-side-doc-group-in-file-card.component.html'
})

export class RightSideDocGroupInFileCardComponent implements OnInit {
    @Input() selectedNode2: NodeRightInFileCard;
    @Input() curentUser: IParamUserCl;
    @Output() Changed = new EventEmitter();
    isLoading: boolean = true;
    arrayNadzorRight: string[];
    list: NodeDocsTree[] = [];
    stringForQuery = [];
    curentNode: NodeDocsTree;
    userCard: Map<string, USERCARD>;
    isShell: Boolean = false;
    bacgHeader: boolean;
    listCards: IInputParamControl[] = DOCUMENT_GROUPS;
    fields: IInputParamControlForIndexRight[];
    inputs;
    form: FormGroup;
    rightsDeloCardIndexRightsComponent: RightsDeloCardIndexRightsComponent;
    allData = [];
    arrayNewData = [];
    listAllData = [];
    tmpUserCardDocgroup = [];
    arrayDataDocumentsForMergeFirst = [];
    arrayDataDocumentsForDelete = [];
    arrayDataDocumentsForMerge = [];
    arrayDataDocumentsForPost = [];
    arrayFuncFileCards = null;
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

    hideToolTip() {
        const element = document.querySelector('.tooltip');
        if (element) {
            element.setAttribute('style', 'display: none');
        }
    }

    select(node: NodeDocsTree, item) {
        if (node.DUE !== '0.') {
            this.curentNode = node;
            item['buttonDisable'] = false;
        } else {
            item['buttonDisable'] = true;
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
        let rightDocGroup;
        let doc;
        let str;
        const arrayDoc = [];

        if (!event.target) {
            rightDocGroup = {
                ISN_LCLASSIF: event.data.rightDocGroup['ISN_LCLASSIF'],
                FUNC_NUM: +this.selectedNode2.key + 1, // +1
                DUE_CARD: event.data.rightDocGroup['DUE_CARD'],
                DUE: event['DUE'],
                ALLOWED: event['isAllowed']
            };

            if (sessionStorage.getItem('arrayDataDocumentsForMerge') !== null) {
                this.arrayDataDocumentsForMerge = JSON.parse(sessionStorage.getItem('arrayDataDocumentsForMerge'));
            } else {
                this.arrayDataDocumentsForMerge = [];
            }

            for (let i = 0; i < this.arrayDataDocumentsForMerge.length; i++) {
                if (this.arrayDataDocumentsForMerge[i]['DUE'] === rightDocGroup['DUE'] &&
                this.arrayDataDocumentsForMerge[i]['DUE_CARD'] === rightDocGroup['DUE_CARD'] &&
                this.arrayDataDocumentsForMerge[i]['FUNC_NUM'] === rightDocGroup['FUNC_NUM']) {
                    this.arrayDataDocumentsForMerge.splice(i, 1);
                    break;
                }
            }

            this.arrayDataDocumentsForMerge.push(rightDocGroup);
            sessionStorage.setItem('arrayDataDocumentsForMerge', JSON.stringify(this.arrayDataDocumentsForMerge));
        } else {
        setTimeout(() => {
            if (sessionStorage.getItem('FuncFileCards') !== null) {
                this.arrayFuncFileCards = JSON.parse(sessionStorage.getItem('FuncFileCards'));
            } else {
                this.arrayFuncFileCards = null;
            }
            if (sessionStorage.getItem('arrayDataDocumentsForMergeFirst') !== null) {
                this.arrayDataDocumentsForMergeFirst = JSON.parse(sessionStorage.getItem('arrayDataDocumentsForMergeFirst'));
            } else {
                this.arrayDataDocumentsForMergeFirst = [];
            }
            if (this.form.controls[item.key].value === true) {
                for (let i = 0; i < this.listAllData.length; i++) {
                    if (this.listAllData[i][0]['key'] === item.key) {
                        for (let j = 0; j < Array.from(this.userCard).length; j++) {
                            if (this.listAllData[i][0]['key'] === Array.from(this.userCard)[j][0]) {
                                if (this.arrayFuncFileCards !== null) {
                                    str = this.arrayFuncFileCards[j][1]['FUNCLIST'];
                                    if (+this.selectedNode2.key > 18 && str.length === 18) {
                                        str += '000';
                                    }
                                    str = this.setCharAt(str, +this.selectedNode2.key, '1');
                                    Array.from(this.userCard)[j][1]['FUNCLIST'] = str;
                                    Array.from(this.userCard)[j][1]['FLAG_NEW_FUNCLIST'] = true;
                                sessionStorage.setItem('FuncFileCards', JSON.stringify(Array.from(this.userCard)));
                                } else {
                                    str = Array.from(this.userCard)[j][1]['FUNCLIST'];
                                    if (+this.selectedNode2.key > 18 && str.length === 18) {
                                        str += '000';
                                    }
                                    str = this.setCharAt(str, +this.selectedNode2.key, '1');
                                    Array.from(this.userCard)[j][1]['FUNCLIST'] = str;
                                    Array.from(this.userCard)[j][1]['FLAG_NEW_FUNCLIST'] = true;
                                    sessionStorage.setItem('FuncFileCards', JSON.stringify(Array.from(this.userCard)));
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
                        this.listAllData[i].push(arrayDoc);
                        this.listAllData[i].push({openDocumentTree: false});
                        this.listAllData[i].push({buttonDisable: true});
                        this.arrayDataDocumentsForMergeFirst.push(rightDocGroup);
                        sessionStorage.setItem('arrayDataDocumentsForMergeFirst', JSON.stringify(this.arrayDataDocumentsForMergeFirst));
                    }
                }
                break;
                }
            }
            } else if (this.form.controls[item.key].value === false) {
                for (let i = 0; i < this.listAllData.length; i++) {
                    if (this.listAllData[i][0]['key'] === item.key) {
                        for (let j = 0; j < Array.from(this.userCard).length; j++) {
                            if (item.key === Array.from(this.userCard)[j][0]) {
                            if (this.arrayFuncFileCards !== null) {
                                str = this.arrayFuncFileCards[j][1]['FUNCLIST'];
                                str = this.setCharAt(str, +this.selectedNode2.key, '0');
                                Array.from(this.userCard)[j][1]['FUNCLIST'] = str;
                                Array.from(this.userCard)[j][1]['FLAG_NEW_FUNCLIST'] = true;
                             //   Array.from(this.userCard)[j][1]['USER_CARD_DOCGROUP_List'] = [];
                                sessionStorage.setItem('FuncFileCards', JSON.stringify(Array.from(this.userCard)));
                            } else {
                                str = Array.from(this.userCard)[j][1]['FUNCLIST'];
                                str = this.setCharAt(str, +this.selectedNode2.key, '0');
                                Array.from(this.userCard)[j][1]['FUNCLIST'] = str;
                                Array.from(this.userCard)[j][1]['FLAG_NEW_FUNCLIST'] = true;
                              //  Array.from(this.userCard)[j][1]['USER_CARD_DOCGROUP_List'] = [];
                                sessionStorage.setItem('FuncFileCards', JSON.stringify(Array.from(this.userCard)));
                            }
                            for (let r = 0; r < this.arrayDataDocumentsForMergeFirst.length; r++) {
                                if (this.arrayDataDocumentsForMergeFirst[r]['DUE_CARD'] === item.key &&
                                this.arrayDataDocumentsForMergeFirst[r]['FUNC_NUM'] === (+this.selectedNode2.key + 1)) {
                                    this.arrayDataDocumentsForMergeFirst.splice(r, 1);
                                    sessionStorage.setItem('arrayDataDocumentsForMergeFirst', JSON.stringify(this.arrayDataDocumentsForMergeFirst));
                                }
                            }
                            }
                        }
                    this.listAllData[i].splice(1, 3);
                    }
                }
            }
    });
}
    }

    openDocumentList(node) {
        node.openDocumentTree = !node.openDocumentTree;
    }

    addDocuments(item): void {
        this.bacgHeader = true;
        let rightDocGroup;
        this._waitClassifSrv.openClassif(OPEN_CLASSIF_DOCGR)
        .then(result_classif => {
            const newClassif = result_classif !== '' || null || undefined ? result_classif : '0.';
            this._limitservise.getCodeNameDOCGROUP(String(newClassif))
            .then(result => {
                if (this._checkRepeat(result, item)) {
                    this._msgSrv.addNewMessage({
                        type: 'warning',
                        title: '',
                        msg: 'Нет документов для добавления'
                    });
                    this.isShell = false;
                    return;
                }
                if (sessionStorage.getItem('ArrayDataDocumentsForPost') !== null) {
                    this.arrayDataDocumentsForPost = JSON.parse(sessionStorage.getItem('ArrayDataDocumentsForPost'));
                } else {
                    this.arrayDataDocumentsForPost = [];
                }
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
                        this.listAllData[i][1].push(this._createNode(rightDocGroup, result[j]));
                        this.arrayDataDocumentsForPost.push(rightDocGroup);
                        sessionStorage.setItem('ArrayDataDocumentsForPost', JSON.stringify(this.arrayDataDocumentsForPost));
                    }
                    }
                }
                this.arrayDataDocumentsForPost = [];
            }).then(() => {
                item[2].openDocumentTree = !item[2].openDocumentTree;
                setTimeout(() => {
                    item[2].openDocumentTree = !item[2].openDocumentTree;
                }, 1);
            });
        })
        .catch(error => {
            this.bacgHeader = false;
        });
    }

    removeDocuments(item) {
     let tmp;
     let flagTmp = false;
        if ((this.curentNode.DUE !== '0.')  && (this.curentNode['data']['rightDocGroup']['DUE_CARD'] === item[0]['key'])) {
            item[3]['buttonDisable'] = true;
            for (let i = 0; i < this.listAllData.length; i++) {
                if (this.listAllData[i][1] !== (null || undefined)) {
                    for (let j = 0; j < this.listAllData[i][1].length; j++) {
                        if (this.listAllData[i][1][j] === this.curentNode) {
                            this.listAllData[i][1].splice(j, 1);
                            this.listAllData[i][2].openDocumentTree = !this.listAllData[i][2].openDocumentTree;
                            for (let a = 0; a < this.arrayDataDocumentsForPost.length; a++) {
                                if (this.arrayDataDocumentsForPost[a]['DUE'] === this.curentNode['DUE']) {
                                    this.arrayDataDocumentsForPost.splice(a, 1);
                                    flagTmp = true;
                                    sessionStorage.setItem('ArrayDataDocumentsForPost', JSON.stringify(this.arrayDataDocumentsForPost));
                                }
                            }
                            for (let a = 0; a < this.arrayDataDocumentsForMerge.length; a++) {
                                if (this.arrayDataDocumentsForMerge[a]['DUE'] === this.curentNode['DUE']) {
                                    this.arrayDataDocumentsForMerge.splice(a, 1);
                                    flagTmp = true;
                                    sessionStorage.setItem('arrayDataDocumentsForMerge', JSON.stringify(this.arrayDataDocumentsForMerge));
                                }
                            }
                            if (!flagTmp) {
                                tmp = {
                                    ISN_LCLASSIF: this.allData[0]['ISN_LCLASSIF'],
                                    FUNC_NUM: +this.selectedNode2.key + 1, // +1
                                    DUE_CARD: this.listAllData[i][0]['key'],
                                    DUE: this.curentNode['DUE'],
                                    ALLOWED: 0
                                    };
                                    if (sessionStorage.getItem('arrayDataDocumentsForDelete') !== null) {
                                        this.arrayDataDocumentsForDelete = JSON.parse(sessionStorage.getItem('arrayDataDocumentsForDelete'));
                                    } else {
                                        this.arrayDataDocumentsForDelete = [];
                                    }
                                    this.arrayDataDocumentsForDelete.push(tmp);
                                    sessionStorage.setItem('arrayDataDocumentsForDelete', JSON.stringify(this.arrayDataDocumentsForDelete));
                                    flagTmp = false;
                            }
                            setTimeout(() => {
                                this.listAllData[i][2].openDocumentTree = !this.listAllData[i][2].openDocumentTree;
                            }, 1);
                        }
                    }
                }
            }
            this.curentNode = null;
        }
    }

    private _init() {
        this.isLoading = true;
        this.listCards = [];
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
            }

            for (let q = 0; q < this.listCards.length; q++) {
                if (this.allData[q]['DUE'] === this.listCards[q]['key']) {
                    this.listCards[q]['value'] = +this.allData[q]['FUNCLIST'].charAt(+this.selectedNode2.key);
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
                                    this.listAllData[i].push({buttonDisable: true});
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
        const cfg: INodeDocsTreeCfg = {
            due: doc.DUE,
            label: doc.CLASSIF_NAME,
            allowed: !!rDoc.ALLOWED,
            data: {
                rightDocGroup: rDoc,
                docGroup: doc
            }
        };
        return new NodeDocsTree(cfg);
    }

    private _checkRepeat(arrDoc, item): boolean {
        for (let i = 0; i < this.listAllData.length; i++) {
            if (this.listAllData[i][1] !== undefined && this.listAllData[i][0]['key'] === item[0]['key']) {
            for (let j = 0; j < this.listAllData[i][1].length; j++) {
                const index = arrDoc.findIndex(doc => doc['DUE'] === this.listAllData[i][1][j]['DUE']);

                if (index !== -1) {
                    this._msgSrv.addNewMessage({
                        type: 'warning',
                        title: '',
                        msg: `Документ \'${arrDoc[index]['CLASSIF_NAME']}\' не будет добавлен так как он уже существует`
                    });
                    arrDoc.splice(index, 1);
                }
            }
        }
    }
            if (arrDoc.length) {
                return false;
            }
        return true;
    }
}
