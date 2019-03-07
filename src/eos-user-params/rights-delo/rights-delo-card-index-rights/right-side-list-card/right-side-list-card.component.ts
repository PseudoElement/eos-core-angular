import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { IParamUserCl, IInputParamControl, IInputParamControlForIndexRight } from 'eos-user-params/shared/intrfaces/user-parm.intterfaces';
import { NodeDocsTree } from 'eos-user-params/shared/list-docs-tree/node-docs-tree';
import { UserParamApiSrv } from 'eos-user-params/shared/services/user-params-api.service';
import { USERCARD, DEPARTMENT } from 'eos-rest';
import { NodeRightInFileCard } from '../node-in-file-card';
import { UserParamsService } from 'eos-user-params/shared/services/user-params.service';
import { EosMessageService } from 'eos-common/services/eos-message.service';
import { RestError } from 'eos-rest/core/rest-error';
import { DOCUMENT_GROUPS } from '../../shared-rights-delo/consts/card-index-rights.consts';
import { E_FIELD_TYPE } from 'eos-dictionaries/interfaces';
import { FormGroup } from '@angular/forms';
import { InputParamControlService } from 'eos-user-params/shared/services/input-param-control.service';

@Component({
    selector: 'eos-right-side-list-card',
    templateUrl: 'right-side-list-card.component.html'
})

export class RightSideListCardComponent implements OnInit {
    @Input() selectedNode2: NodeRightInFileCard;
    @Input() curentUser: IParamUserCl;
    @Output() Changed = new EventEmitter();
    isLoading: boolean = true;
    arrayNadzorRight: string[];
    list: NodeDocsTree[] = [];
    curentSelectedNode: NodeDocsTree;
    userCard: Map<string, USERCARD>;
    isShell: Boolean = false;
    listCards: IInputParamControl[] = DOCUMENT_GROUPS;
    fields: IInputParamControlForIndexRight[];
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
        private _inputCtrlSrv: InputParamControlService
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

    select(node: NodeDocsTree) {
        if (node.DUE !== '0.') {
            this.curentSelectedNode = node;
        } else {
            this.curentSelectedNode = null;
        }
    }

    setCharAt(str, index, chr) {
        if (index > str.length - 1) {
             return str;
            }
        return str.substr(0, index) + chr + str.substr(+index + 1);
    }

    checkedNode(event, item) {
        this.form.valueChanges.subscribe(() => {
        let str;
        if (event.target.tagName === 'LABEL') {} else {
            if (this.form.controls[item.key].value === true) {
                for (let i = 0; i < this.listAllData.length; i++) {
                    if (this.listAllData[i][0]['key'] === item.key) {
                        for (let j = 0; j < Array.from(this.userCard).length; j++) {
                            if (this.listAllData[i][0]['key'] === Array.from(this.userCard)[j][0]) {
                                str = Array.from(this.userCard)[j][1]['FUNCLIST'];
                                if (+this.selectedNode2.key > 18 && str.length === 18) {
                                    str += '000';
                                }
                                str = this.setCharAt(str, +this.selectedNode2.key, '1');
                                Array.from(this.userCard)[j][1]['FUNCLIST'] = str;
                                Array.from(this.userCard)[j][1]['FLAG_NEW_FUNCLIST'] = true;
                                sessionStorage.setItem('FuncFileCards', JSON.stringify(Array.from(this.userCard)));
                            }
                        }
                        break;
                }
            }
            } else if (this.form.controls[item.key].value === false) {
                for (let i = 0; i < this.listAllData.length; i++) {
                    if (this.listAllData[i][0]['key'] === item.key) {
                        for (let j = 0; j < Array.from(this.userCard).length; j++) {
                            if (this.listAllData[i][0]['key'] === Array.from(this.userCard)[j][0]) {
                                str = Array.from(this.userCard)[j][1]['FUNCLIST'];
                                str = this.setCharAt(str, +this.selectedNode2.key, '0');
                                Array.from(this.userCard)[j][1]['FUNCLIST'] = str;
                                Array.from(this.userCard)[j][1]['FLAG_NEW_FUNCLIST'] = true;
                                sessionStorage.setItem('FuncFileCards', JSON.stringify(Array.from(this.userCard)));
                            }
                        }
                    this.listAllData[i].splice(1, 2);
                    }
                }
            }
            }
            this.Changed.emit();
        });
    }

createObjRequestForAttach() {
    const req = [];
    for (let i = 0; i < Array.from(this.userCard).length; i++) {
        const tmp = this.userCard.get(Array.from(this.userCard)[i][0]);
         if (Array.from(this.userCard)[i][1]['FLAG_NEW_FUNCLIST'] === true ||
         Array.from(this.userCard)[i][1]['FLAG_NEW_FUNCLIST_REMOVE'] === true) {
            req.push({
            method: 'MERGE',
            requestUri: `USER_CL(${tmp['ISN_LCLASSIF']})/USERCARD_List(\'${tmp['ISN_LCLASSIF']} ${tmp['DUE']}\')`,
            data: {
                FUNCLIST: tmp['FUNCLIST']
            }
        });
       if (Array.from(this.userCard)[i][1]['FLAG_NEW_FUNCLIST'] === true) {
       Array.from(this.userCard)[i][1]['FLAG_NEW_DOCUMENTS'] = true;
       Array.from(this.userCard)[i][1]['FLAG_NEW_FUNCLIST'] = false;
       }
    }
  }

    return req;
}

    openDocumentList(node) {
        node.openDocumentTree = !node.openDocumentTree;
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
                this.listAllData[q] = [];
                if (this.allData[q]['DUE'] === this.listCards[q]['key']) {
                    this.listCards[q]['value'] = +this.allData[q]['FUNCLIST'].charAt(+this.selectedNode2.key);
                }
                this.listAllData[q].push(this.listCards[q]);
            }

            this.inputs = this._inputCtrlSrv.generateInputs(this.listCards);
                this.form = this._inputCtrlSrv.toFormGroup(this.inputs);
                this.isLoading = false;
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
}
