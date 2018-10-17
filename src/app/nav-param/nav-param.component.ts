import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { NavParamService } from '../services/nav-param.service';

@Component({
    selector: 'eos-nav-param',
    templateUrl: 'nav-param.component.html'
})
export class NavParamComponent implements OnDestroy {
    title: string;
    isWide: boolean = false;
    private ngUnsubscribe: Subject<any> = new Subject();
    constructor (
        private _navSrv: NavParamService,
        private _route: ActivatedRoute,
        _router: Router
    ) {
        this._update();
        _router.events.filter((evt) => evt instanceof NavigationEnd)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(() => this._update());
    }
    ngOnDestroy(): void {
        this.ngUnsubscribe.next(null);
        this.ngUnsubscribe.complete();
    }
    changeState() {
        this.isWide = !this.isWide;
        this._navSrv.changeStateSandwich(this.isWide);
    }
    private _update () {
        let snapshot = this._route.snapshot;
        while (snapshot.firstChild) { snapshot = snapshot.firstChild; }
        if (snapshot.data.title) {
            this.title = snapshot.data.title;
        }
    }
}
