import { Component, ViewContainerRef } from '@angular/core';
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
    firstLoadAuth = true;
    isMode: boolean = false;

    // private _containerRef: ViewContainerRef;

    constructor(
        viewContainerRef: ViewContainerRef,
        private _profileSrv: EosUserProfileService,
        private _route: ActivatedRoute,

    ) {
        // this._containerRef = viewContainerRef;

        const query = new URLSearchParams(window.location.search);
        if (!query.get('fromclassif')) {
            this._profileSrv.openWithCurrentUserSettings = true;
            sessionStorage.setItem('openDeloOrCurSetng', `${this._profileSrv.openWithCurrentUserSettings}`);
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
