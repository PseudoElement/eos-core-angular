import { Component, OnInit, Injector, EventEmitter, Output } from '@angular/core';
import { UserParamApiSrv } from 'eos-user-params/shared/services/user-params-api.service';
import { CARD_INDEXS_RIGHTS, DOCUMENT_GROUPS, RESTRICT_REGISTRATION_FILING, ALL_DOCUMENTS } from '../shared-rights-delo/consts/card-index-rights.consts';
import { UserParamsService } from 'eos-user-params/shared/services/user-params.service';
import { IParamUserCl, IInputParamControlForIndexRight, IInputParamControl } from 'eos-user-params/shared/intrfaces/user-parm.intterfaces';
import { USERCARD } from 'eos-rest';
import { FormGroup } from '@angular/forms';
import { InputParamControlService } from 'eos-user-params/shared/services/input-param-control.service';
import { EosMessageService } from 'eos-common/services/eos-message.service';
import { Subscription } from 'rxjs/Rx';
import { NodeDocsTree } from 'eos-user-params/shared/list-docs-tree/node-docs-tree';
import { NodeRightInFileCard } from './node-in-file-card';
import { RightSideListCardComponent } from './right-side-list-card/right-side-list-card.component';
import { SUCCESS_SAVE_MESSAGE_SUCCESS } from 'eos-common/consts/common.consts';
import { EMPTY_ALLOWED_CREATE_REGISTRATION_OF_DOCUMENTS } from 'app/consts/messages.consts';
import { RightSideDocGroupAndRestrictionInFileCardComponent } from './right-side-doc-group-and-restriction-in-file-card/right-side-doc-group-and-restriction-in-file-card.component';

@Component({
    selector: 'eos-rights-delo-card-index-rights',
    templateUrl: 'rights-delo-card-index-rights.component.html'
})

export class RightsDeloCardIndexRightsComponent implements OnInit {
    @Output() formChanged = new EventEmitter();
    rightSideListCardComponent: RightSideListCardComponent;
    list: NodeDocsTree[] = [];
    dataForm;
    RSDGARIFCC: RightSideDocGroupAndRestrictionInFileCardComponent;
    curentUser: IParamUserCl;
    selectedNode2: NodeRightInFileCard;
    listRight: NodeRightInFileCard[] = [];
    arrayNadzorRight: string[];
    arrayNEWNadzorRight: string[];
    fields: IInputParamControlForIndexRight[];
    subForm: Subscription;
    indexForRightFileCard = -1;
    selectedNode: IInputParamControlForIndexRight;
    btnDisabled: boolean = false;
    isChangeForm = false;
    flagCardFileAvailability = true;
    lastKeyForSelect;
    listNode: IInputParamControlForIndexRight[] = CARD_INDEXS_RIGHTS;
    listDocumentGroups: IInputParamControl[] = DOCUMENT_GROUPS;
    listRestrictRegistrationFiling: IInputParamControl[] = RESTRICT_REGISTRATION_FILING;
    allDocuments: IInputParamControl[] = ALL_DOCUMENTS;
    allData = [];
    userCard: Map<string, USERCARD>;
    msgSrv: EosMessageService;
    subscriptions: Subscription;
    flagEmptyAllowedCreateRofD = true;
    newDataAttach;
    inputs;
    strForSubscribe = '';
    form: FormGroup;
    isLoading = false;
    bacgHeader: boolean;
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
        sessionStorage.clear();
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
    }
    submit() {
            this.servApi
                .setData(this.createObjRequestForAttach())
                .then(data => {
                    if (this.flagEmptyAllowedCreateRofD) {
                    this.servApi.setData(this.createObjRequestForAttachAfterBackend2())
                    .then(data2 => {
                       this._userParamsSetSrv.getUserIsn('' + this.userCard.get(Array.from(this.userCard)[0][0])['ISN_LCLASSIF']);
                       sessionStorage.clear();
                       for (let j = 0; j < Array.from(this.userCard).length; j++) {
                            Array.from(this.userCard)[j][1]['FLAG_NEW_FUNCLIST'] = false;
                       }
                       this.msgSrv.addNewMessage(SUCCESS_SAVE_MESSAGE_SUCCESS);
                    })
                    .catch(data2 => console.log(data2));
                }
                })
                // tslint:disable-next-line:no-console
                .catch(data3 => console.log(data3));
    }
    createObjRequestForAttach() {
        const req = [];
        let newDataFromLocalStorageFuncFileCards;
        let newArrayDataDocumentsForMerge;
        let newArrayDataDocumentsForDelete;
        let newArrayDataDocumentsForPost;
        newDataFromLocalStorageFuncFileCards = JSON.parse(sessionStorage.getItem('FuncFileCards'));
        newArrayDataDocumentsForMerge = JSON.parse(sessionStorage.getItem('arrayDataDocumentsForMerge'));
        newArrayDataDocumentsForDelete = JSON.parse(sessionStorage.getItem('arrayDataDocumentsForDelete'));
        newArrayDataDocumentsForPost = JSON.parse(sessionStorage.getItem('ArrayDataDocumentsForPost'));
        if (newDataFromLocalStorageFuncFileCards) {
            for (let i = 0; i < newDataFromLocalStorageFuncFileCards.length; i++) {
                if (newDataFromLocalStorageFuncFileCards[i][1]['FLAG_NEW_FUNCLIST'] === true) {
                    req.push({
                    method: 'MERGE',
                    requestUri: `USER_CL(${newDataFromLocalStorageFuncFileCards[i][1]['ISN_LCLASSIF']})/USERCARD_List(\'${newDataFromLocalStorageFuncFileCards[i][1]['ISN_LCLASSIF']} ${newDataFromLocalStorageFuncFileCards[i][1]['DUE']}\')`,
                    data: {
                        FUNCLIST: newDataFromLocalStorageFuncFileCards[i][1]['FUNCLIST']
                        }
                    });
                }
            }
        }

        const arrayNewDocumentsForCurrentCurd = [];

        if (newArrayDataDocumentsForPost !== null) {
            for (let i = 0; i < newArrayDataDocumentsForPost.length; i++) {
                for (let j = 0; j < Array.from(this.userCard).length; j++) {
                    if (Array.from(this.userCard)[j][0] === newArrayDataDocumentsForPost[i]['DUE_CARD'] &&
                    newArrayDataDocumentsForPost[i]['FUNC_NUM'] === 1) {
                        newDataFromLocalStorageFuncFileCards[j][1]['USER_CARD_DOCGROUP_List'].push(newArrayDataDocumentsForPost[i]);
                    }
                }
            }
        }

        if (newDataFromLocalStorageFuncFileCards !== null && newArrayDataDocumentsForMerge !== null) {
            for (let i = 0; i < newArrayDataDocumentsForMerge.length; i++) {
                if (newArrayDataDocumentsForMerge[i]['FUNC_NUM'] === 1) {
                for (let j = 0; j < newDataFromLocalStorageFuncFileCards.length; j++) {
                    if (newArrayDataDocumentsForMerge[i]['DUE_CARD'] === newDataFromLocalStorageFuncFileCards[j][0]) {
                        if (arrayNewDocumentsForCurrentCurd.length > 0) {
                        for (let z = 0; z < arrayNewDocumentsForCurrentCurd.length; z++) {
                            if (arrayNewDocumentsForCurrentCurd[z][0]['DUE_CARD'] === newArrayDataDocumentsForMerge[i]['DUE_CARD']) {
                                for (let x = 0; x < arrayNewDocumentsForCurrentCurd[z].length; x++) {
                                    if (arrayNewDocumentsForCurrentCurd[z][x]['DUE'] === newArrayDataDocumentsForMerge[i]['DUE']) {
                                        arrayNewDocumentsForCurrentCurd[z].splice(x, 1, newArrayDataDocumentsForMerge[i]);
                                    }
                                }
                            } else if ((arrayNewDocumentsForCurrentCurd.length - 1) === z) {
                                let flag = true;
                                for (let q = 0; q < newDataFromLocalStorageFuncFileCards[j][1]['USER_CARD_DOCGROUP_List'].length; q++) {
                                    if (newDataFromLocalStorageFuncFileCards[j][1]['USER_CARD_DOCGROUP_List'][q]['FUNC_NUM'] === 1) {
                                        if (flag) {
                                            arrayNewDocumentsForCurrentCurd.push([]);
                                            arrayNewDocumentsForCurrentCurd[arrayNewDocumentsForCurrentCurd.length - 1].push(newDataFromLocalStorageFuncFileCards[j][1]['USER_CARD_DOCGROUP_List'][q]);
                                            flag = false;
                                        } else {
                                            arrayNewDocumentsForCurrentCurd[arrayNewDocumentsForCurrentCurd.length - 1].push(newDataFromLocalStorageFuncFileCards[j][1]['USER_CARD_DOCGROUP_List'][q]);
                                        }
                                    }
                                    if ((newDataFromLocalStorageFuncFileCards[j][1]['USER_CARD_DOCGROUP_List'].length - 1) === q) {
                                        for (let w = 0; w < arrayNewDocumentsForCurrentCurd.length; w++) {
                                            if (arrayNewDocumentsForCurrentCurd[w][0]['DUE_CARD'] === newArrayDataDocumentsForMerge[i]['DUE_CARD']) {
                                                for (let x = 0; x < arrayNewDocumentsForCurrentCurd[w].length; x++) {
                                                    if (arrayNewDocumentsForCurrentCurd[w][x]['DUE'] === newArrayDataDocumentsForMerge[i]['DUE']) {
                                                        arrayNewDocumentsForCurrentCurd[w].splice(x, 1, newArrayDataDocumentsForMerge[i]);
                                                        for (let k = 0; k < Array.from(this.userCard).length; k++) {
                                                            if (Array.from(this.userCard)[k][0] === newArrayDataDocumentsForMerge[i]['DUE_CARD']) {
                                                                for (let h = 0; h < Array.from(this.userCard)[k][1]['USER_CARD_DOCGROUP_List'].length; h++) {
                                                                    if (Array.from(this.userCard)[k][1]['USER_CARD_DOCGROUP_List'][h]['DUE'] === newArrayDataDocumentsForMerge[i]['DUE']) {
                                                                        Array.from(this.userCard)[k][1]['USER_CARD_DOCGROUP_List'].splice(h, 1, newArrayDataDocumentsForMerge[i]);
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    } else {
                        let flag = true;
                        for (let q = 0; q < newDataFromLocalStorageFuncFileCards[j][1]['USER_CARD_DOCGROUP_List'].length; q++) {
                            if (newDataFromLocalStorageFuncFileCards[j][1]['USER_CARD_DOCGROUP_List'][q]['FUNC_NUM'] === 1) {
                                if (flag) {
                                    arrayNewDocumentsForCurrentCurd.push([]);
                                    arrayNewDocumentsForCurrentCurd[arrayNewDocumentsForCurrentCurd.length - 1].push(newDataFromLocalStorageFuncFileCards[j][1]['USER_CARD_DOCGROUP_List'][q]);
                                    flag = false;
                                } else {
                                    arrayNewDocumentsForCurrentCurd[arrayNewDocumentsForCurrentCurd.length - 1].push(newDataFromLocalStorageFuncFileCards[j][1]['USER_CARD_DOCGROUP_List'][q]);
                                }
                            }
                            if ((newDataFromLocalStorageFuncFileCards[j][1]['USER_CARD_DOCGROUP_List'].length - 1) === q) {
                                for (let e = 0; e < arrayNewDocumentsForCurrentCurd.length; e++) {
                                    if (arrayNewDocumentsForCurrentCurd[e][0]['DUE_CARD'] === newArrayDataDocumentsForMerge[i]['DUE_CARD']) {
                                        for (let x = 0; x < arrayNewDocumentsForCurrentCurd[e].length; x++) {
                                            if (arrayNewDocumentsForCurrentCurd[e][x]['DUE'] === newArrayDataDocumentsForMerge[i]['DUE']) {
                                                arrayNewDocumentsForCurrentCurd[e].splice(x, 1, newArrayDataDocumentsForMerge[i]);
                                                for (let k = 0; k < Array.from(this.userCard).length; k++) {
                                                    if (Array.from(this.userCard)[k][0] === newArrayDataDocumentsForMerge[i]['DUE_CARD']) {
                                                        for (let h = 0; h < Array.from(this.userCard)[k][1]['USER_CARD_DOCGROUP_List'].length; h++) {
                                                            if (Array.from(this.userCard)[k][1]['USER_CARD_DOCGROUP_List'][h]['DUE'] === newArrayDataDocumentsForMerge[i]['DUE']) {
                                                                Array.from(this.userCard)[k][1]['USER_CARD_DOCGROUP_List'].splice(h, 1, newArrayDataDocumentsForMerge[i]);
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    }
                }
            }
            }
        }

        if (newArrayDataDocumentsForDelete !== null) {
            for (let i = 0; i < newArrayDataDocumentsForDelete.length; i++) {
                if (arrayNewDocumentsForCurrentCurd.length > 0) {
                    for (let j = arrayNewDocumentsForCurrentCurd.length - 1; j >= 0; j--) {
                        for (let z = arrayNewDocumentsForCurrentCurd[j].length - 1; z >= 0 ; z--) {
                            if (newArrayDataDocumentsForDelete[i]['DUE'] === arrayNewDocumentsForCurrentCurd[j][z]['DUE'] &&
                            newArrayDataDocumentsForDelete[i]['FUNC_NUM'] === 1) {
                                arrayNewDocumentsForCurrentCurd[j].splice(z, 1);
                            }
                        }
                    }
                } else {
                    let flag = true;
                    if (newDataFromLocalStorageFuncFileCards !== null) {
                    for (let v = 0; v < newDataFromLocalStorageFuncFileCards.length; v++) {
                        if (newArrayDataDocumentsForDelete[i]['DUE_CARD'] === newDataFromLocalStorageFuncFileCards[v][0]) {
                            for (let b = 0; b < newDataFromLocalStorageFuncFileCards[v][1]['USER_CARD_DOCGROUP_List'].length; b++) {
                                if (newDataFromLocalStorageFuncFileCards[v][1]['USER_CARD_DOCGROUP_List'][b]['FUNC_NUM'] === 1) {
                                    if (flag) {
                                         arrayNewDocumentsForCurrentCurd.push([]);
                                         arrayNewDocumentsForCurrentCurd[arrayNewDocumentsForCurrentCurd.length - 1].push(newDataFromLocalStorageFuncFileCards[v][1]['USER_CARD_DOCGROUP_List'][b]);
                                         flag = false;
                                     } else {
                                         arrayNewDocumentsForCurrentCurd[arrayNewDocumentsForCurrentCurd.length - 1].push(newDataFromLocalStorageFuncFileCards[v][1]['USER_CARD_DOCGROUP_List'][b]);
                                     }

                                     if ((newDataFromLocalStorageFuncFileCards[v][1]['USER_CARD_DOCGROUP_List'].length - 1) === b) {
                                        for (let s = arrayNewDocumentsForCurrentCurd.length - 1; s >= 0; s--) {
                                            for (let d = arrayNewDocumentsForCurrentCurd[s].length - 1; d >= 0; d--) {
                                                if (newArrayDataDocumentsForDelete[i]['DUE'] === arrayNewDocumentsForCurrentCurd[s][d]['DUE']) {
                                                    arrayNewDocumentsForCurrentCurd[s].splice(d, 1);
                                                }
                                            }
                                        }
                                    }
                                } else if ((newDataFromLocalStorageFuncFileCards[v][1]['USER_CARD_DOCGROUP_List'].length - 1) === b) {
                                    for (let s = arrayNewDocumentsForCurrentCurd.length - 1; s > 0; s--) {
                                        for (let d = arrayNewDocumentsForCurrentCurd[s].length - 1; d > 0; d--) {
                                            if (newArrayDataDocumentsForDelete[i]['DUE'] === arrayNewDocumentsForCurrentCurd[s][d]['DUE']) {
                                                arrayNewDocumentsForCurrentCurd[s].splice(d, 1);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                }
            }
        }

        if (arrayNewDocumentsForCurrentCurd !== null) {
        loop1:
            for (let i = 0; i < arrayNewDocumentsForCurrentCurd.length; i++) {
                for (let j = 0; j < arrayNewDocumentsForCurrentCurd[i].length; j++) {
                    if (arrayNewDocumentsForCurrentCurd[i][j]['ALLOWED']) {
                        this.flagEmptyAllowedCreateRofD = true;
                        continue loop1;
                    } else if ((arrayNewDocumentsForCurrentCurd[i].length - 1) === j) {
                        this.msgSrv.addNewMessage(EMPTY_ALLOWED_CREATE_REGISTRATION_OF_DOCUMENTS);
                        this.flagEmptyAllowedCreateRofD = false;
                        return [];
                    }
                }
            }
    }

        return req;
    }
    createObjRequestForAttachAfterBackend2() {
        const req = [];
        let newArrayDataDocumentsForPost;
        let newArrayDataDocumentsForMergeFirst;
        let newArrayDataDocumentsForMerge;
        let newArrayDataDocumentsForDelete;
        newArrayDataDocumentsForPost = JSON.parse(sessionStorage.getItem('ArrayDataDocumentsForPost'));
        newArrayDataDocumentsForMergeFirst = JSON.parse(sessionStorage.getItem('arrayDataDocumentsForMergeFirst'));
        newArrayDataDocumentsForMerge = JSON.parse(sessionStorage.getItem('arrayDataDocumentsForMerge'));
        newArrayDataDocumentsForDelete = JSON.parse(sessionStorage.getItem('arrayDataDocumentsForDelete'));

        if (newArrayDataDocumentsForMergeFirst) {
            for (let i = 0; i < newArrayDataDocumentsForMergeFirst.length; i++) {
                const tmp = newArrayDataDocumentsForMergeFirst;
                req.push({
                    method: 'MERGE',
requestUri: `USER_CL(${tmp[i]['ISN_LCLASSIF']})/USERCARD_List(\'${tmp[i]['ISN_LCLASSIF']} ${tmp[i]['DUE_CARD']}\')` +
`/USER_CARD_DOCGROUP_List(\'${tmp[i]['ISN_LCLASSIF']} ${tmp[i]['DUE_CARD']} ${tmp[i]['DUE']} ${tmp[i]['FUNC_NUM']}\')`,
                    data: {
                        ALLOWED: tmp[i]['ALLOWED']
                    }
                });
            }
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
                    ALLOWED: newArrayDataDocumentsForPost[i]['ALLOWED'] === true ? 1 : 0
                }
            });
        }
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
    }

    if (newArrayDataDocumentsForDelete) {
            for (let t = 0; t < newArrayDataDocumentsForDelete.length; t++) {
                    req.push({
                        method: 'DELETE',
        requestUri: `USER_CL(${newArrayDataDocumentsForDelete[t]['ISN_LCLASSIF']})/USERCARD_List(\'${newArrayDataDocumentsForDelete[t]['ISN_LCLASSIF']} ${newArrayDataDocumentsForDelete[t]['DUE_CARD']}\')` +
        `/USER_CARD_DOCGROUP_List(\'${newArrayDataDocumentsForDelete[t]['ISN_LCLASSIF']} ${newArrayDataDocumentsForDelete[t]['DUE_CARD']} ${newArrayDataDocumentsForDelete[t]['DUE']} ${newArrayDataDocumentsForDelete[t]['FUNC_NUM']}\')`
                    });
                }
    }

    sessionStorage.clear();
    return req;
    }

    cancel() {
    }

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
