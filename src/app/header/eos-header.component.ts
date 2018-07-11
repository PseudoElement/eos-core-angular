import { Component, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { APP_MODULES, APP_MODULES_DROPDOWN } from '../consts/app-modules.const';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';

@Component({
    selector: 'eos-header',
    templateUrl: './eos-header.component.html'
})
export class EosHeaderComponent implements OnDestroy {
    modules = APP_MODULES;
    modulesDropdown = APP_MODULES_DROPDOWN;
    breadcrumbView = true;
    navParamView = true;
    private ngUnsubscribe: Subject<any> = new Subject();

    constructor(
        _router: Router,
        private _route: ActivatedRoute,
    ) {
        this.update();
        _router.events.filter((evt) => evt instanceof NavigationEnd)
            .takeUntil(this.ngUnsubscribe)
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
