import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { IParamUserCl } from 'eos-user-params/shared/intrfaces/user-parm.intterfaces';
import { USERDEP, DEPARTMENT } from 'eos-rest';
import { UserParamApiSrv } from 'eos-user-params/shared/services/user-params-api.service';
import { WaitClassifService } from 'app/services/waitClassif.service';
import { OPEN_CLASSIF_DEPARTMENT_FOR_RIGHT } from 'eos-user-params/rights-delo/shared-rights-delo/consts/absolute-rights.consts';
import { UserParamsService } from 'eos-user-params/shared/services/user-params.service';
import { NodeAbsoluteRight } from '../node-absolute';
import { EosMessageService } from 'eos-common/services/eos-message.service';
import { NodeListDepAbsolute } from './node-list-dep';

@Component({
    selector: 'eos-right-absolute-department',
    templateUrl: 'right-department.component.html'
})
export class RightDepertmentComponent implements OnInit {
    @Input() selectedNode: NodeAbsoluteRight;
    @Input() curentUser: IParamUserCl;
    @Output() Changed = new EventEmitter();

    isLoading: boolean = false;
    userDep: USERDEP[];
    funcNum: number;
    userDepFuncNumber;
    listUserDep: NodeListDepAbsolute[] = [];
    depList: DEPARTMENT[];
    isShell: Boolean = false;
    selectedDep: NodeListDepAbsolute;

    constructor (
        private _msgSrv: EosMessageService,
        private _userParmSrv: UserParamsService,
        private _waitClassifSrv: WaitClassifService,
        private apiSrv: UserParamApiSrv,
    ) {}
    ngOnInit() {
        this.isLoading = true;
        this.userDep = this.curentUser['USERDEP_List'];
        this.funcNum = +this.selectedNode.key + 1;
        this.userDepFuncNumber = this.userDep.filter(i => i['FUNC_NUM'] === this.funcNum);
        const str = this.userDepFuncNumber.map(i => i.DUE);
        this.apiSrv.grtDepartment(str.join('||'))
            .then(data => {
                this.userDepFuncNumber.forEach(ud => {
                    this.listUserDep.push(new NodeListDepAbsolute(ud, data.find(d => d.DUE === ud.DUE)));
                });
                this.isLoading = false;
                if (this.selectedNode.isCreate) {
                    this.addDep();
                }
            });
    }
    selectNode(dep) {
        if (this.selectedDep) {
            this.selectedDep['isSelected'] = false;
        }
        this.selectedDep = dep;
        this.selectedDep['isSelected'] = true;
    }
    addDep() {
        this.isShell = true;
        this._waitClassifSrv.openClassif(OPEN_CLASSIF_DEPARTMENT_FOR_RIGHT)
        .then((data: string) => {
            if (this._checkRepeat(data)) {
                this._msgSrv.addNewMessage({
                    type: 'warning',
                    title: '',
                    msg: 'Такой элемент уже существует'
                });
                return;
            }
            return this._userParmSrv.getDepartmentFromUser(data);
        })
        .then((data: DEPARTMENT[]) => {
            const dep = data[0];
            const newNode = new NodeListDepAbsolute(
                {
                    ISN_LCLASSIF: this._userParmSrv.userContextId,
                    DUE: dep.DUE,
                    FUNC_NUM: this.funcNum,
                    WEIGHT: this._getMaxWeight(),
                    DEEP: 1,
                    ALLOWED: null,
                },
                dep,
                true
            );
            this.curentUser.USERDEP_List.push(newNode.userDep);
            this.listUserDep.push(newNode);
            this.selectedNode.pushChange(newNode);
            this.selectedNode.isCreate = false;
            this.isShell = false;
            this.Changed.emit();
        })
        .catch(() => {
            this.isShell = false;
            if (this.selectedNode.isCreate) {
                this.selectedNode.value = false;
                this._msgSrv.addNewMessage({
                    type: 'warning',
                    title: '',
                    msg: 'Необходимо выбрать элемент'
                });
            }
        });
    }
    DeleteDep() {
        this.curentUser['USERDEP_List'] = this.curentUser['USERDEP_List'].filter(i => i['DUE'] !== this.selectedDep.userDep['DUE']);
        const i = this.listUserDep.findIndex(n => n === this.selectedDep);
        this.listUserDep.splice(i, 1);
        if (!this.listUserDep.length) {
            this.selectedNode.value = false;
        }
        this.selectedDep.createEntity = false;
        this.selectedNode.pushChange(this.selectedDep);
        this.selectedDep = null;
        this.Changed.emit();
    }
    private _getMaxWeight(): number {
        let w = 0;
        this.userDep.forEach(i => {
            if (i.WEIGHT > w) {
                w = i.WEIGHT;
            }
        });
        return w;
    }
    private _checkRepeat(due) {
        return this.listUserDep.findIndex(node => node['userDep']['DUE'] === due) >= 0;
    }
}
