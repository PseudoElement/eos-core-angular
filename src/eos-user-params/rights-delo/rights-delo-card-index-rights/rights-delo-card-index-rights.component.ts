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
                       sessionStorage.setItem('FlagToClearData', JSON.stringify(true));
                       sessionStorage.removeItem('FuncFileCards');
                       sessionStorage.removeItem('arrayDataDocumentsForMerge');
                       sessionStorage.removeItem('ArrayDataDocumentsForPost');
                       sessionStorage.removeItem('arrayDataDocumentsForDelete');
                       sessionStorage.removeItem('arrayDataDocumentsForMergeFirst');
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
        newDataFromLocalStorageFuncFileCards = JSON.parse(sessionStorage.getItem('FuncFileCards'));
        newArrayDataDocumentsForMerge = JSON.parse(sessionStorage.getItem('arrayDataDocumentsForMerge'));
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


if (newArrayDataDocumentsForMerge !== null) {
for (let t = 0; t < newArrayDataDocumentsForMerge.length; t++) {
    if (newArrayDataDocumentsForMerge[t]['FUNC_NUM'] === 1 && newArrayDataDocumentsForMerge[t]['DUE'] === '0.' && !newArrayDataDocumentsForMerge[t]['ALLOWED']) {
        this.msgSrv.addNewMessage(EMPTY_ALLOWED_CREATE_REGISTRATION_OF_DOCUMENTS);
        this.flagEmptyAllowedCreateRofD = false;
        return [];
    } else if ((newArrayDataDocumentsForMerge.length - 1) === t) {
        this.flagEmptyAllowedCreateRofD = true;
    }
}
}
    return req;
    }
    createObjRequestForAttachAfterBackend2() {
        const req = [];
        let newDataFromLocalStorageFuncFileCards;
        let newArrayDataDocumentsForPost;
        let newArrayDataDocumentsForMergeFirst;
        let newArrayDataDocumentsForMerge;
        let newArrayDataDocumentsForDelete;
        newDataFromLocalStorageFuncFileCards = JSON.parse(sessionStorage.getItem('FuncFileCards'));
        newArrayDataDocumentsForPost = JSON.parse(sessionStorage.getItem('ArrayDataDocumentsForPost'));
        newArrayDataDocumentsForMergeFirst = JSON.parse(sessionStorage.getItem('arrayDataDocumentsForMergeFirst'));
        newArrayDataDocumentsForMerge = JSON.parse(sessionStorage.getItem('arrayDataDocumentsForMerge'));
        newArrayDataDocumentsForDelete = JSON.parse(sessionStorage.getItem('arrayDataDocumentsForDelete'));

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
            `/USER_CARD_DOCGROUP_List(\'${tmp['ISN_LCLASSIF']} ${tmp['DUE']} ${tmp.USER_CARD_DOCGROUP_List[w]['DUE']} ${newArrayDataDocumentsForMergeFirst[j]['FUNC_NUM']}\')`,
                                data: {
                                    ALLOWED: tmp.USER_CARD_DOCGROUP_List[w]['ALLOWED']
                                }
                            });
                        }
                    }
                }
            }
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
