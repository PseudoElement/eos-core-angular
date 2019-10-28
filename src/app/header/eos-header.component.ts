import { Component, OnDestroy, HostListener } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { APP_MODULES, APP_MODULES_DROPDOWN } from '../consts/app-modules.const';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { ExportImportClService } from './../services/export-import-cl.service';
import { TOOLTIP_DELAY_VALUE } from 'eos-common/services/eos-tooltip.service';

@Component({
    selector: 'eos-header',
    templateUrl: './eos-header.component.html'
})
export class EosHeaderComponent implements OnDestroy {
    modules = APP_MODULES;
    modulesDropdown = APP_MODULES_DROPDOWN;
    breadcrumbView = true;
    navParamView = false;
    tooltipDelay = TOOLTIP_DELAY_VALUE;
    width = 0;
    openProtocols: Array<any> = [];
    private ngUnsubscribe: Subject<any> = new Subject();

    constructor(
        _router: Router,
        private _route: ActivatedRoute,
        private _eiCl: ExportImportClService,
    ) {
        this.width = window.innerWidth;
        this.update();
        _router.events
            .pipe(
                filter((evt) => evt instanceof NavigationEnd),
                takeUntil(this.ngUnsubscribe)
            )
            .subscribe(() => this.update());
    }
    @HostListener('window:resize')
    resize($event) {
        this.width = window.innerWidth;
       // console.log(window.innerWidth);
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next(null);
        this.ngUnsubscribe.complete();
    }

    eiCl(id: any) {
        if (id === 'export') {
            this._eiCl.openExport('all').then().catch(err => { });
        } else {
            this._eiCl.openImport('all', 'all').then().catch(err => { });
        }
    }

    getProtocol(protocol: string): void {
        if (this.openProtocols.indexOf(protocol) === -1) {
            const newWindow = window.open(`../Protocol/Pages/ProtocolView.html?type=${protocol}`, '_blank', 'width=900,height=700');
            this.openProtocols.push(protocol);
            newWindow.onbeforeunload  = () => {
                this.openProtocols = this.openProtocols.filter(prot => prot !== protocol);
            };
        }
    }


    private update() {
        let _actRoute = this._route.snapshot;
        while (_actRoute.firstChild) { _actRoute = _actRoute.firstChild; }
        this.breadcrumbView = _actRoute.data && _actRoute.data.showBreadcrumb;
        this.navParamView = _actRoute.data && _actRoute.data.showNav;
    }
}
