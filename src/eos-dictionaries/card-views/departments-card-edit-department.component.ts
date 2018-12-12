
import { Component, Injector, NgZone, OnChanges } from '@angular/core';
import { BaseCardEditComponent } from './base-card-edit.component';
import { EosMessageService } from 'eos-common/services/eos-message.service';
import { WARN_NO_BINDED_ORGANIZATION } from '../consts/messages.consts';

@Component({
    selector: 'eos-departments-card-edit-department',
    templateUrl: 'departments-card-edit-department.component.html',
})
export class DepartmentsCardEditDepartmentComponent extends BaseCardEditComponent implements OnChanges {
    private _orgName = '';
    constructor(injector: Injector, private _zone: NgZone, private msgSrv: EosMessageService) {
        super(injector);
    }

    get hasCard(): boolean {
        return this.getValue('rec.CARD_FLAG');
    }

    get hasOrganization(): boolean {
        return this.getValue('rec.DUE_LINK_ORGANIZ');
    }

    get orgName(): string {
        if (this._orgName) {
            return this._orgName;
        } else if (this.data && this.data.organization) {
            return this.data.organization.CLASSIF_NAME;
        } else {
            return '';
        }
    }

    chooseOrganiz() {
        const config = this.dictSrv.getApiConfig();
        if (config) {
            const pageUrl = config.webBaseUrl + '/Pages/Classif/ChooseClassif.aspx?';
            const params = 'Classif=ORGANIZ_CL&value_id=__ClassifIds&skip_deleted=True&select_nodes=False&select_leaf=True&return_due=True';
            this._zone.runOutsideAngular(() => {
                window.open(pageUrl + params, 'clhoose', 'width=1050,height=800,resizable=1,status=1,top=20,left=20');
                window['endPopup'] = (due) => {
                    this._zone.run(() => this.bindOrganization(due));
                };
            });
        }
    }

    bindOrganization(orgDue: string) {
        const dues = orgDue ? orgDue.split('|') : [''];
        this.dictSrv.bindOrganization(dues[0])
            .then((org) => {
                if (org) {
                    this._orgName = org['CLASSIF_NAME'];
                    this.setValue('rec.DUE_LINK_ORGANIZ', org.DUE);
                }
            });
    }

    unbindOrganization() {
        if (this.hasOrganization) {
            this._orgName = '';
            this.data.organization = null;
            this.setValue('rec.DUE_LINK_ORGANIZ', null);
        } else {
            this.msgSrv.addNewMessage(WARN_NO_BINDED_ORGANIZATION);
        }
    }

    ngOnChanges() {
        if (this.form) {
            this.unsubscribe();
            this.formChanges$ = this.form.valueChanges.subscribe((formChanges) => this.updateForm(formChanges));
        }
    }

    private updateForm(formChanges: any) {
        const updates = {};
        // toggle CARD_NAME
        this.toggleInput(formChanges['rec.CARD_FLAG'], 'rec.CARD_NAME', formChanges, updates);

        if (Object.keys(updates).length) {
            this.form.patchValue(updates);
        }
    }
}
