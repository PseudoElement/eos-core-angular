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
   // curentNode: NodeDocsTree;
    userCard: Map<string, USERCARD>;
    isShell: Boolean = false;
    listCards: IInputParamControl[] = DOCUMENT_GROUPS;
   // listCards: NodeRightInFileCard[] = [];
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
       // this.curentUser['FUNCLIST'] = this.curentUser['FUNCLIST'] || '0'.repeat(21);
        console.log(this.curentUser);
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

    checkedNode(node, item) {
    //    event.preventDefault();
   //     event.stopPropagation();
   if (node.type === 'click') {
        if (this.form.controls[item.key].value === false) {
            console.log(node);
            console.log(item);
        } else {
            node.data['rightDocGroup']['ALLOWED'] = node.allowed;
       }
     /*   if (this.form.controls[item.card.key].value === false) {

        } else*/
      /*  this.selectedNode2.pushChange({
            method: 'MERGE',
            due: node.DUE,
            data: node.data['rightDocGroup']
        }); */
        this.Changed.emit();
    }
}

    openDocumentList(node) {
        node.openDocumentTree = !node.openDocumentTree;
    }

    private _init() {
        this.isLoading = true;
        this.listCards = [];
      //  const str = [];
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

  /*  private _createNode(rDoc, doc: DOCGROUP_CL): NodeDocsTree {
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
    private _writeValue(constanta: IInputParamControlForIndexRight[]): IInputParamControlForIndexRight[] {
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
