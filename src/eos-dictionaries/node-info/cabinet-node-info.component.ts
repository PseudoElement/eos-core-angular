import { Component } from '@angular/core';

import { BaseNodeInfoComponent } from './base-node-info';

@Component({
    selector: 'eos-cabinet-node-info',
    templateUrl: 'cabinet-node-info.component.html',
})
export class CabinetNodeInfoComponent extends BaseNodeInfoComponent {
    update: boolean;

    get cabinetName(): string {
        return this.nodeDataShort.rec['FULLNAME'] || this.nodeDataShort.rec['CABINET_NAME'];
    }

    get departmentName(): string {
        return this.nodeDataFull.department['FULLNAME'] || this.nodeDataFull.department['CLASSIF_NAME'];
    }

    routerLinkDepartment(due): string {
        return this._routerLink('departments', due);
    }

    routerLinkUser(isn_user): string {
        return this._routerLink('users', isn_user);
    }

    isOwner(owner): boolean {
        return this.nodeDataFull.rec['ISN_CABINET'] === owner['ISN_CABINET'];
    }

    private _routerLink(dict, key): string {
        return '/spravochniki/' + dict + '/' + key + '/view';
    }
}
