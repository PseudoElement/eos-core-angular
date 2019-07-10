import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PipRX, ORG_TYPE_CL, USER_EDIT_ORG_TYPE } from 'eos-rest';
import { ALL_ROWS } from 'eos-rest/core/consts';
import { IParamUserCl } from 'eos-user-params/shared/intrfaces/user-parm.intterfaces';
import { UserParamsService } from 'eos-user-params/shared/services/user-params.service';
import { NodeAbsoluteRight } from '../node-absolute';


@Component({
    selector: 'eos-organiz-edit-type',
    templateUrl: './organiz-edit-type.component.html',
    styleUrls: ['./organiz-edit-type.component.scss']
})
export class OrganizEditTypeComponent implements OnInit {
    @Input() selectedNode: NodeAbsoluteRight;
    @Input() curentUser: IParamUserCl;
    @Output() Changed: EventEmitter<any> = new EventEmitter<any>();
    public LIstOrgType = [];
    public listUserOrg;
    constructor(
                private _pipRx: PipRX,
                private _userParmSrv: UserParamsService,
    ) { }

    ngOnInit() {
        this.init();
    }

    init() {
        this.listUserOrg = this.curentUser.USER_EDIT_ORG_TYPE_List;
        this.getOrgType().then(data => {
            if (data) {
               this.createListOrgType(data);
            }
        });
    }
    public setChecked(item): void {
        item.checked = !item.checked;
        this.findREpeatList(item);
    }
    createEntity(item) {
        const newUserDep: USER_EDIT_ORG_TYPE = this._userParmSrv.createEntyti<USER_EDIT_ORG_TYPE>({
           ISN_USER: this.curentUser.ISN_LCLASSIF,
           ISN_ORG_TYPE: item.isn
        }, 'USER_EDIT_ORG_TYPE');
        return newUserDep;
    }
    findREpeatList(item) {
        const newUserDep = this.createEntity(item);
       if (item.checked) {
        this.listUserOrg.push({
            ISN_USER: this.curentUser['ISN_LCLASSIF'],
            ISN_ORG_TYPE: item['isn']
        });
        this.selectedNode.pushChange({
            method: 'POST',
            isn_org: newUserDep.ISN_ORG_TYPE,
            data: newUserDep
        });
       } else {
        const index = this.actionUserOrg(item);
        this.listUserOrg.splice(index, 1);
        this.selectedNode.pushChange({
            method: 'DELETE',
            isn_org: newUserDep.ISN_ORG_TYPE,
            data: newUserDep
        });
       }
       this.Changed.emit();
    }
    actionUserOrg(items): number {
        const index = this.listUserOrg.findIndex((item) => item['ISN_USER'] === this.curentUser['ISN_LCLASSIF'] && item['ISN_ORG_TYPE'] === items['isn']);
        return index;
    }
    private getOrgType(): Promise<ORG_TYPE_CL[]> {
        return this._pipRx.read({ 'ORG_TYPE_CL': ALL_ROWS }).then((data: ORG_TYPE_CL[]) => {
            return data;
        }).catch(error => {
            console.log(error);
            return null;
        });
    }
    private createListOrgType(data: ORG_TYPE_CL[]) {
        data.forEach((el: ORG_TYPE_CL) => {
            const obj = {};
            obj['name'] = el.CLASSIF_NAME;
            obj['isn'] = el.ISN_LCLASSIF;
            obj['checked'] = this.setcheked(el.ISN_LCLASSIF);
            this.LIstOrgType.push(obj);
        });
    }
    private setcheked(isn) {
        if (this.listUserOrg.length) {
            const findItem = this.listUserOrg.filter((val) => {
                return val['ISN_ORG_TYPE'] === isn && val['ISN_USER'] === this.curentUser['ISN_LCLASSIF'];
            });
            if (findItem.length) {
                return true;
            } else {
                return false;
            }
        }
        return false;
    }

}
