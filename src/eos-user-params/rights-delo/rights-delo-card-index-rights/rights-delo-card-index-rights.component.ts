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
        let newArrayDataDocumentsForPost;
        newDataFromLocalStorageFuncFileCards = JSON.parse(sessionStorage.getItem('FuncFileCards'));
        newArrayDataDocumentsForMerge = JSON.parse(sessionStorage.getItem('arrayDataDocumentsForMerge'));
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

        if (newArrayDataDocumentsForPost !== null && newDataFromLocalStorageFuncFileCards !== null) {
            for (let i = 0; i < newArrayDataDocumentsForPost.length; i++) {
                 for (let s = 0; s < newDataFromLocalStorageFuncFileCards.length; s++) {
                    if (newArrayDataDocumentsForPost[i]['DUE_CARD'] === newDataFromLocalStorageFuncFileCards[s][0]) {
                        if (newArrayDataDocumentsForPost[i]['FUNC_NUM'] === 1 && newArrayDataDocumentsForPost[i]['DUE'] !== '0.') {
                            this.flagEmptyAllowedCreateRofD = true;
                        }
                    }
                }
            }
        } else if (newArrayDataDocumentsForMerge !== null) { // Если пользователь захотел убрать checkbox 'Все группы документов'
        loop1:
            for (let t = 0; t < newArrayDataDocumentsForMerge.length; t++) {
                if (newArrayDataDocumentsForMerge[t]['FUNC_NUM'] === 1 && newArrayDataDocumentsForMerge[t]['DUE'] === '0.' && !newArrayDataDocumentsForMerge[t]['ALLOWED']) {
                    for (let s = 0; s < newDataFromLocalStorageFuncFileCards.length; s++) {
                        if (newArrayDataDocumentsForMerge[t]['DUE_CARD'] === newDataFromLocalStorageFuncFileCards[s][0]) {
                            for (let e = 0; e < newDataFromLocalStorageFuncFileCards[s][1]['USER_CARD_DOCGROUP_List'].length; e++) {
                                if ((newDataFromLocalStorageFuncFileCards[s][1]['USER_CARD_DOCGROUP_List'].length - 1) === e && this.flagEmptyAllowedCreateRofD === false) {
                                    this.msgSrv.addNewMessage(EMPTY_ALLOWED_CREATE_REGISTRATION_OF_DOCUMENTS);
                                    return [];
                                }
                                if (newDataFromLocalStorageFuncFileCards[s][1]['USER_CARD_DOCGROUP_List'][e]['FUNC_NUM'] === 1 &&
                                newDataFromLocalStorageFuncFileCards[s][1]['USER_CARD_DOCGROUP_List'][e]['DUE'] !== '0.') {
                                } else if ((newDataFromLocalStorageFuncFileCards[s][1]['USER_CARD_DOCGROUP_List'].length - 1) === e) {
                                    if (newArrayDataDocumentsForPost !== null) { // Если пользователь добавляет документы для регистрации РК и хочет убрать ch с 'ВГД'
                                        for (let i = 0; i < newArrayDataDocumentsForPost.length; i++) {
                                            if (newArrayDataDocumentsForPost[i]['FUNC_NUM'] === 1 && newArrayDataDocumentsForPost[i]['DUE'] !== '0.') {
                                                this.flagEmptyAllowedCreateRofD = true;
                                                break loop1;
                                            }
                                        }
                                    }
                                    this.msgSrv.addNewMessage(EMPTY_ALLOWED_CREATE_REGISTRATION_OF_DOCUMENTS);
                                    this.flagEmptyAllowedCreateRofD = false;
                                    return [];
                                }
                            }
                        }
                    }
                } else if ((newArrayDataDocumentsForMerge.length - 1) === t) {
                    this.flagEmptyAllowedCreateRofD = true;
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
                    ALLOWED: newArrayDataDocumentsForPost[i]['ALLOWED']
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
