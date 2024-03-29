import { Component } from '@angular/core';

import { BaseNodeInfoComponent } from './base-node-info';
import { E_DICTIONARY_ID } from '../consts/dictionaries/enum/dictionaryId.enum';

@Component({
    selector: 'eos-cabinet-node-info',
    templateUrl: 'cabinet-node-info.component.html',
})
export class CabinetNodeInfoComponent extends BaseNodeInfoComponent {
    update: boolean;

    get cabinetName(): string {
        return this.nodeDataShort.rec['FULLNAME'] || this.nodeDataShort.rec['CABINET_NAME'];
    }
    get cabinetNameFull(): string {
        return this.nodeDataFull.rec['FULLNAME'] || this.nodeDataFull.rec['CABINET_NAME'];
    }

    get departmentName(): string {
        return this.nodeDataFull.department['CLASSIF_NAME'];
    }

    get routerLinkUser(): string {
        // return this._routerLink('users', isn_user);
        return '/user-params-set/base-param';
    }

    routerLinkDepartment(due): string {
        return this._routerLink(E_DICTIONARY_ID.DEPARTMENTS, due);
    }

    isOwner(owner): boolean {
        return this.nodeDataFull.rec['ISN_CABINET'] === owner['ISN_CABINET'];
    }

    private _routerLink(dict, key): string {
        return '/spravochniki/' + dict + '/' + key + '/view';
    }
}
