import { Component } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Manager } from '@eos/jsplugins-manager';
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
        /* заглушка на загрузку плагинов , убрать когда плагины переведут на новый сборщик */
        new Promise((resolve, reject) => {
            Manager.loadPlugins({ targets: ['tech_tasks', 'tech_tools'] }).then(() => {
                resolve(true);
            });
            setTimeout(() => {
                reject('not loaded some plugins');
            }, 3000);
        }).then(() => {
            this.isLoadedPlugins = true;
        }).catch((e) => {
            console.log(e || e.message);
            this.isLoadedPlugins = true;
        });

    }
    checkQueryParams() {
        if (this.isMode) {
            return { 'navbar-current-settings': true };
        }
    }
}
