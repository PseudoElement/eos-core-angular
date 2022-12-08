import { Component, TemplateRef } from '@angular/core';
// import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal';

import { EosUserProfileService } from '../services/eos-user-profile.service';
import { ISettingsItem } from '../core/settings-item.interface';
import { ERROR_LOGIN } from 'app/consts/confirms.const';
import { ConfirmWindowService } from 'eos-common/confirm-window/confirm-window.service';
import { URL_LOGIN } from 'app/consts/common.consts';

@Component({
    selector: 'eos-user',
    templateUrl: 'user.component.html',
})
export class UserComponent {
    fullname: string;
    inputName = 'tver';
    inputPassword = 'tver';
    isAuthorized: boolean;
    settings: ISettingsItem[];
    public modalRef: BsModalRef;

    constructor(
        private _profileSrv: EosUserProfileService,
        private _modalSrv: BsModalService,
        // private _router: Router,
        private _confirmSrv: ConfirmWindowService,
    ) {
        this.fullname = this._profileSrv.shortName;
        this._profileSrv.authorized$.subscribe((auth) => this.isAuthorized = auth);
        this._profileSrv.settings$.subscribe((res) => this.settings = res);
    }

    logout() {
        this._confirmSrv
        .confirm2(ERROR_LOGIN)
        .then((confirmed) => {
            if (confirmed) {
                document.location.assign(URL_LOGIN + '?ReturnUrl=' + document.location.href);
            }
        });
    }

    public openModal(template: TemplateRef<any>) {
        this.modalRef = this._modalSrv.show(template);
    }

    saveSettings(): void {
        this.modalRef.hide();
        this._profileSrv.saveSettings(this.settings);
    }
}
