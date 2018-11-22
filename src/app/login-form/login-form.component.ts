import {Component, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit} from '@angular/core';
import { environment } from '../../environments/environment';
import { EosUserProfileService } from '../services/eos-user-profile.service';

@Component({
    selector: 'eos-login-form',
    templateUrl: 'login-form.component.html'
})
export class LoginFormComponent implements AfterViewInit {

    inpType = 'password';
    hidePassword: boolean;
    userName: string;
    userPassword: string;
    lockUser: boolean;
    inProcess: boolean;
    haveErr = false;
    @Output() logged: EventEmitter<boolean> = new EventEmitter<boolean>();

    @ViewChild('errTooltip') errTooltip;
    @ViewChild('loginField') private loginElementRef: ElementRef;

    constructor(
        private _profileSrv: EosUserProfileService
    ) {
        if (!environment.production) {
            this.userName = 'tver';
            this.userPassword = 'tver';
            this.hidePassword = true;
        }
    }

    public ngAfterViewInit(): void {
        this.loginElementRef.nativeElement.focus();
    }

    login(event): void {
        if (event && event.key !== 'Enter') {
            return;
        }
        if (!this.inProcess) {
            this.inProcess = true;
            this.haveErr = false;

            this._profileSrv
                .login(this.userName, this.userPassword)
                .then((logged) => {
                    this.inProcess = false;
                    if (logged) {
                        this.errTooltip.hide();
                        this.logged.emit(logged);
                        this.haveErr = false;
                    } else {
                        this.errTooltip.show();
                        this.haveErr = true;
                    }
                })
                .catch(() => {
                    this.inProcess = false;
                    this.haveErr = false;
                });
        }
    }

    cancel() {
        this.logged.emit(false);
    }

    togglePass() {
        this.inpType = this.inpType === 'text' ? 'password' : 'text';
        this.hidePassword = !this.hidePassword;
    }

    showPass() {
        this.inpType = 'text';
        this.hidePassword = false;
    }

    hidePass() {
        this.inpType = 'password';
        this.hidePassword = true;
    }
}
