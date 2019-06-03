import { Component, ViewContainerRef } from '@angular/core';
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

    // private _containerRef: ViewContainerRef;

    constructor(
        viewContainerRef: ViewContainerRef,
        private _profileSrv: EosUserProfileService,
    ) {
        // this._containerRef = viewContainerRef;
        this._profileSrv.authorized$.subscribe((auth) => {
            this.isAuthorized = auth;
            if (auth !== null) {
                this.firstLoadAuth = true;
            }
        });
        if (!environment.production) {
            this.version = environment.version;
        }
    }
}
