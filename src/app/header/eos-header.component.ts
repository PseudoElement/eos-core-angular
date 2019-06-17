import { Component, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { APP_MODULES, APP_MODULES_DROPDOWN } from '../consts/app-modules.const';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { ExportImportClService } from './../services/export-import-cl.service';
import { TOOLTIP_DELAY_VALUE } from 'eos-common/services/eos-message.service';

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
    private ngUnsubscribe: Subject<any> = new Subject();

    constructor(
        _router: Router,
        private _route: ActivatedRoute,
        private _eiCl: ExportImportClService,
    ) {
        this.update();
        _router.events
            .pipe(
                filter((evt) => evt instanceof NavigationEnd),
                takeUntil(this.ngUnsubscribe)
            )
            .subscribe(() => this.update());
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

    private update() {
        let _actRoute = this._route.snapshot;
        while (_actRoute.firstChild) { _actRoute = _actRoute.firstChild; }
        this.breadcrumbView = _actRoute.data && _actRoute.data.showBreadcrumb;
        this.navParamView = _actRoute.data && _actRoute.data.showNav;
    }
}
