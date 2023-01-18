import { Component } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { environment } from '../environments/environment';
import { EosUserProfileService } from './services/eos-user-profile.service';

@Component({
    selector: 'eos-root',
    templateUrl: './app.component.html'
})
export class AppComponent {
    version: string;
    isAuthorized = false;
    isHideHeader = false;
    firstLoadAuth = true;
    isLoadedPlugins = false;
    isMode: boolean = false;
    constructor(
        private _profileSrv: EosUserProfileService,
        private _route: ActivatedRoute,

    ) {
        // параметр передается при открытии прилодения из веба. В противном случае нужно скрыть ссылку на переход в main.aspx
        if (window.location.href.match('fromclassif=true')) {
            sessionStorage.setItem('fromclassif', `true`);
        }

        if (/cardFrom/.test(window.location.hash)) {
            this.isHideHeader = true;
        } else {
            this.isHideHeader = false;
        }
        this._profileSrv.authorized$.subscribe((auth) => {
            this.isAuthorized = auth;
            if (auth !== null) {
                this.firstLoadAuth = true;
            }
        });
        this._route.queryParams.subscribe((qParams: Params) => {
            if (qParams.mode) {
                this.isMode = true;
            }
        });
        if (!environment.production) {
            this.version = environment.version;
        }

    }
    checkQueryParams() {
        if (this.isMode) {
            return { 'navbar-current-settings': true };
        }
    }
}
