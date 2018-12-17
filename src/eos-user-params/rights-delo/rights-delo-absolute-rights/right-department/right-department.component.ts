import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { IParamUserCl } from 'eos-user-params/shared/intrfaces/user-parm.intterfaces';
import { USERDEP, DEPARTMENT } from 'eos-rest';
import { UserParamApiSrv } from 'eos-user-params/shared/services/user-params-api.service';
import { WaitClassifService } from 'app/services/waitClassif.service';
import { OPEN_CLASSIF_DEPARTMENT_FOR_RIGHT } from 'eos-user-params/rights-delo/shared-rights-delo/consts/absolute-rights.consts';
import { UserParamsService } from 'eos-user-params/shared/services/user-params.service';

@Component({
    selector: 'eos-right-absolute-department',
    templateUrl: 'right-department.component.html'
})
export class RightDepertmentComponent implements OnInit {
    @Input() selectedNode;
    @Input() curentUser: IParamUserCl;
    @Output() Changed = new EventEmitter();

    isLoading: boolean = false;
    userDep: USERDEP[];
    funcNum: number;
    userDepFuncNumber;
    depList: DEPARTMENT[];
    isShell: Boolean = false;
    selectedDep;

    constructor (
        private _userParmSrv: UserParamsService,
        private _waitClassifSrv: WaitClassifService,
        private apiSrv: UserParamApiSrv,
    ) {
    }
    ngOnInit() {
        this.isLoading = true;
        this.userDep = this.curentUser['USERDEP_List'];
        this.funcNum = +this.selectedNode.key + 1;
        this.userDepFuncNumber = this.userDep.filter(i => i['FUNC_NUM'] === this.funcNum);
        const str = this.userDepFuncNumber.map(i => i.DUE);
        this.apiSrv.grtDepartment(str.join('||'))
            .then(data => {
                // console.log(data);
                this.userDepFuncNumber.forEach(ud => {
                    ud['department'] = data.find(d => d.DUE === ud.DUE);
                    ud['isSelected'] = false;
                });
                this.depList = data;
                this.isLoading = false;
            });
        // console.log(this.funcNum);
        // console.log(this.userDepFuncNumber);
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
            return this._userParmSrv.getDepartmentFromUser(data);
        })
        .then((data: DEPARTMENT[]) => {
            const dep = data[0];
            const newNode = {
                ISN_LCLASSIF: this._userParmSrv.userContextId,
                DUE: dep.DUE,
                FUNC_NUM: this.funcNum,
                WEIGHT: this._getMaxWeight(),
                DEEP: 1,
                ALLOWED: null,
                department: dep
            };
            this.userDepFuncNumber.push(newNode);
            this._pullChenge(newNode, true);
            this.isShell = false;
            // this.form.get('USER_COPY').patchValue(data[0]['SURNAME_PATRON']);
        })
        .catch(() => {
            this.isShell = false;
        });
    }
    DeleteDep() {
        this._pullChenge(this.selectedDep);
        const i = this.userDepFuncNumber.findIndex(n => n === this.selectedDep);
        this.userDepFuncNumber.splice(i, 1);
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
    private _pullChenge(node, newDep: boolean = false) {
        const data = {
            node,
            newDep
        };
        this.Changed.emit(data);
    }
}
