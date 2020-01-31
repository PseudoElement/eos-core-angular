
import { Component, Injector, NgZone, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { BaseCardEditComponent } from './base-card-edit.component';
import { EosMessageService } from 'eos-common/services/eos-message.service';
import { WARN_NO_BINDED_ORGANIZATION } from '../consts/messages.consts';
import {AbstractControl, ValidatorFn, Validators} from '@angular/forms';
import { DynamicInputBase } from 'eos-common/dynamic-form-input/dynamic-input-base';
import { Features } from 'eos-dictionaries/features/features-current.const';
import { StampBlobFormComponent } from 'eos-dictionaries/shablon-blob-form/stamp-blob-form.component';
import { BsModalService } from 'ngx-bootstrap';
import { EosAccessPermissionsService, APS_DICT_GRANT } from 'eos-dictionaries/services/eos-access-permissions.service';
import { DEPARTMENTS_DICT } from 'eos-dictionaries/consts/dictionaries/department.consts';

@Component({
    selector: 'eos-departments-card-edit-department',
    templateUrl: 'departments-card-edit-department.component.html',
})
export class DepartmentsCardEditDepartmentComponent extends BaseCardEditComponent implements OnChanges, OnInit {

    featuresDep = Features.cfg.departments;
    isStampEnable = Features.cfg.departments.stamp;
    directGrant;

    private _orgName = '';
    private previousValues: SimpleChanges;

    constructor(private injector: Injector, private _zone: NgZone, private msgSrv: EosMessageService) {
        super(injector);
        this.previousValues = {};
    }

    get hasStamp(): boolean {
        return this.getValue('rec.ISN_STAMP');
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

    ngOnInit () {
        // super.ngOnInit();
        const v = this.featuresDep.numcreation ? [this.validatorNumcreationFlag()] : [];
        if (this.form.controls['rec.DEPARTMENT_INDEX'].validator) {
            v.push(this.form.controls['rec.DEPARTMENT_INDEX'].validator);
        }
        this.form.controls['rec.DEPARTMENT_INDEX'].setValidators(v);
        const  _eaps = this.injector.get(EosAccessPermissionsService);
        if (this.isNewRecord) {
            this.directGrant = APS_DICT_GRANT.denied;
        } else {
            this.directGrant = _eaps.isAccessGrantedForDictionary(DEPARTMENTS_DICT.id, this.data.rec.DUE);
        }

        if (this.isCBBase && this.isNewRecord) {
            const control = this.form.controls['rec.START_DATE'];
            if (control) {
                this.inputs['rec.START_DATE'].required = true;
                control.setValidators(
                    [control.validator, Validators.required]
                );
            }
        }
    }

    validatorNumcreationFlag(): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } => {
            let error = null;
            if (this.form.controls['rec.NUMCREATION_FLAG'].value) {
                if (!this.form.controls['rec.DEPARTMENT_INDEX'].value) {
                    error = 'Отсутствует индекс при активном "Номерообразовании НП"';
                }
            }
            return error ? {valueError: error} : null;
        };
    }

    stampClick() {
        const isn = this.data.rec['ISN_STAMP'];
        const _modalSrv = this.injector.get(BsModalService);
        const modalWindow = _modalSrv.show(StampBlobFormComponent, { class: 'department-stamp-form' });
        (<StampBlobFormComponent>modalWindow.content).init(isn);
        if (modalWindow) {
            const subscription = (<StampBlobFormComponent>modalWindow.content).onClose.subscribe((savedisn) => {
                subscription.unsubscribe();
                this.setValue('rec.ISN_STAMP', savedisn);
            });
        }
    }

    clickNumcreation () {
        const dib: DynamicInputBase = this.inputs['rec.indexDep'].dib;
        dib.forceTooltip();
        const c = this.form.controls['rec.DEPARTMENT_INDEX'];
        c.markAsDirty();
    }

    chooseOrganiz() {
        const config = this.dictSrv.getApiConfig();
        if (config) {
            const pageUrl = config.webBaseUrl + '/Pages/Classif/ChooseClassif.aspx?';
            const params = 'Classif=CONTACT&value_id=__ClassifIds&app=nadzor&skip_deleted=True&select_multy=False&select_nodes=False&select_leaf=True&return_due=True&search-filter={"CONT.NOT_LINK_DEPARTMENT":"Null"}"';
            // &search-filter={"CONT.NOT_LINK_DEPARTMENT":"Null"}"
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
                    if (this.isNewRecord || !this.data.__relfield) {
                        this.data.__relfield = {};
                    }
                    this.data.__relfield['ORGANIZ_CL'] = org;
                    this._orgName = org['CLASSIF_NAME'];
                    this.setValue('rec.DUE_LINK_ORGANIZ', org.DUE);
                }
            });
    }

    unbindOrganization() {
        if (this.hasOrganization) {
            this.dictSrv.unbindOrganization();
            this._orgName = '';
            this.data.organization = null;
            this.data.__relfield['ORGANIZ_CL'] = null;
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
        if (this.previousValues['rec.CARD_FLAG'] !== formChanges['rec.CARD_FLAG']) {
            this.previousValues['rec.CARD_FLAG'] = formChanges['rec.CARD_FLAG'];
            if (!formChanges['rec.CARD_FLAG']) {
                if (!!this.hasOrganization) {
                    this._zone.run(() => this.unbindOrganization());
                }
                this.setValue('rec.CARD_NAME', null);
                this.form.controls['rec.CARD_NAME'].disable();
            } else {
                this.form.controls['rec.CARD_NAME'].enable();
            }

        }

        if (this.previousValues['rec.NUMCREATION_FLAG'] !== formChanges['rec.NUMCREATION_FLAG']) {
            this.previousValues['rec.NUMCREATION_FLAG'] = formChanges['rec.NUMCREATION_FLAG'];
            this.form.controls['rec.DEPARTMENT_INDEX'].updateValueAndValidity();
        }
    }
}
