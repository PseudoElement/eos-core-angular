import { Component, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { APP_MODULES, APP_MODULES_DROPDOWN } from '../consts/app-modules.const';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';


@Component({
    selector: 'eos-header',
    templateUrl: './eos-header.component.html'
})
export class EosHeaderComponent implements OnDestroy {
    modules = APP_MODULES;
    modulesDropdown = APP_MODULES_DROPDOWN;
    breadcrumbView = true;
    navParamView = false;
    private ngUnsubscribe: Subject<any> = new Subject();

    constructor(
        _router: Router,
        private _route: ActivatedRoute,
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

    private update() {
        let _actRoute = this._route.snapshot;
        while (_actRoute.firstChild) { _actRoute = _actRoute.firstChild; }
        this.breadcrumbView = _actRoute.data && _actRoute.data.showBreadcrumb;
        this.navParamView = _actRoute.data && _actRoute.data.showNav;
    }
}
