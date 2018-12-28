import { Component, Injector, OnInit, OnChanges, SimpleChanges, NgZone } from '@angular/core';
import { BaseCardEditComponent } from './base-card-edit.component';
import {PipRX} from '../../eos-rest';
import { WARN_NO_BINDED_ORGANIZATION } from 'eos-dictionaries/consts/messages.consts';
import { EosMessageService } from 'eos-common/services/eos-message.service';

@Component({
    selector: 'eos-sev-participant-card-edit',
    templateUrl: 'sev-participant-card-edit.component.html',
    styleUrls: ['./sev-participant-card-edit.component.scss'],
})
export class SevParticipantCardEditComponent extends BaseCardEditComponent implements OnChanges, OnInit {
    _orgName: any;
    hasOrganization: any;

    constructor(
        injector: Injector,
        private _apiSrv: PipRX,
        private _zone: NgZone,
        private msgSrv: EosMessageService,
    ) {
        super(injector);
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

    ngOnInit(): void {
        const i = this.inputs['rec.ISN_CHANNEL'];
        i.options = [];

        const req = {'SEV_CHANNEL': []};
        this._apiSrv
            .read(req)
            .then((rdata: any[]) => {
                rdata.forEach((d) => {
                    i.options.push({ title: d['CLASSIF_NAME'], value: d['ISN_LCLASSIF']});
                });
            });

        // const v = [this.endYearValueValidator()];
        // if (this.form.controls['rec.END_YEAR'].validator) {
        //     v.push(this.form.controls['rec.END_YEAR'].validator);
        // }
        // this.form.controls['rec.END_YEAR'].setValidators(v);
        // this.previousValues = {};
        // this.previousValues['rec.END_YEAR'] = this.form.controls['rec.END_YEAR'].value;
        // this.previousValues['rec.YEAR_NUMBER'] = this.form.controls['rec.YEAR_NUMBER'].value;
        // setTimeout(() => {
        //     this._updateButtons();
        // });
    }

    ngOnChanges(changes: SimpleChanges) {
        if (this.form) {
            this.unsubscribe();
            this.formChanges$ = this.form.valueChanges.subscribe((formChanges) => this.updateForm(formChanges));
        }
    }

    chooseOrganiz() {
        const config = this.dictSrv.getApiConfig();
        if (config) {
            const pageUrl = config.webBaseUrl + '/Pages/Classif/ChooseClassif.aspx?';
            const params = 'Classif=CONTACT&value_id=__ClassifIds&skip_deleted=True&select_nodes=False&select_leaf=True&return_due=True';
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
                    this.setValue('rec.DUE_ORGANIZ', org.DUE);
                    this.setValue('rec.CLASSIF_NAME', org['CLASSIF_NAME']);
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


    private updateForm(changes: SimpleChanges) {
        // if ((Number(this.previousValues['rec.END_YEAR']) !== Number(changes['rec.END_YEAR']))) {
        //     this.previousValues['rec.END_YEAR'] = this.form.controls['rec.END_YEAR'].value;
        //     this._updateButtons();
        // }
        // if ((Number(this.previousValues['rec.YEAR_NUMBER']) !== Number(changes['rec.YEAR_NUMBER']))) {
        //     this.previousValues['rec.YEAR_NUMBER'] = this.form.controls['rec.YEAR_NUMBER'].value;
        //     this.form.controls['rec.END_YEAR'].updateValueAndValidity();
        //     this._updateButtons();
        // }
    }

}
