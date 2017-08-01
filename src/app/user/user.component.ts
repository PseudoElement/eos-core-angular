import { Component, TemplateRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';

import { EosUserService } from '../services/eos-user.service';
import { EosUserSettingsService } from '../services/eos-user-settings.service';

@Component({
    selector: 'eos-user',
    templateUrl: 'user.component.html',
})
export class UserComponent {
    fullname: string;
    inputName: string = null;
    inputPassword: string = null;

    settings: any;
    public modalRef: BsModalRef;

    constructor(
        private eosUserService: EosUserService,
        private eosUserSettingsService: EosUserSettingsService,
        private modalService: BsModalService) {
        this.fullname = this.eosUserService.userName();
        this.eosUserSettingsService.settings.subscribe(
            (res) => this.settings = res,
            (err) => alert('err: ' + err)
        );
    }

    public openModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template);
    }

    login(): void {
        this.eosUserService.login(this.inputName, this.inputPassword);
    }

    saveSettings(): void {
        this.modalRef.hide();
        this.eosUserSettingsService.saveSettings(this.settings);
    }
}
