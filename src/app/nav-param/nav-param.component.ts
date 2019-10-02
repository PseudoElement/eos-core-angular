import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Subject } from 'rxjs';
import { NavParamService } from '../services/nav-param.service';
import { filter, takeUntil } from 'rxjs/operators';

@Component({
    selector: 'eos-nav-param',
    templateUrl: 'nav-param.component.html'
})
export class NavParamComponent implements OnDestroy {
    title: string;
    isWide: boolean = true;
    isRighSendwich: boolean = true;
    emeilUrl: string = '';
    showRigth: boolean = false;
    disableRight: boolean;
    private ngUnsubscribe: Subject<any> = new Subject();
    constructor (
        private _navSrv: NavParamService,
        private _route: ActivatedRoute,
        _router: Router
    ) {
        this._update();
        _router.events
            .pipe(
                filter((evt) => evt instanceof NavigationEnd),
                takeUntil(this.ngUnsubscribe)

            )
            .subscribe(() => this._update());
        this._navSrv.StateRightSandwich$
        .pipe(
            takeUntil(this.ngUnsubscribe)
        )
        .subscribe((data) => {
            this.showRigth = data;
        });
        this._navSrv.StateSandwichRight$
        .pipe(
            takeUntil(this.ngUnsubscribe)
        )
        .subscribe((data) => {
            this.isRighSendwich = data;
        });
        this._navSrv.BlockStateSandwichRight$
        .pipe(
            takeUntil(this.ngUnsubscribe)
        )
        .subscribe((data) => {
            this.disableRight = data;
        });
        if (document.documentElement.clientWidth < 1050) {
            this._navSrv.changeStateSandwich(false);
            this.isWide = false;
        } else {
            this._navSrv.changeStateSandwich(true);
            this.isWide = true;
        }
    }
    ngOnDestroy(): void {
        this.ngUnsubscribe.next(null);
        this.ngUnsubscribe.complete();
    }
    changeState() {
        this.isWide = !this.isWide;
        this._navSrv.changeStateSandwich(this.isWide);
    }
    righSendwich() {
        if (!this.disableRight) {
            this.isRighSendwich = !this.isRighSendwich;
            this._navSrv.changeStateRightSandwich(this.isRighSendwich);
        }
    }
    private _update () {
        let snapshot = this._route.snapshot;
        while (snapshot.firstChild) { snapshot = snapshot.firstChild; }
        if (snapshot.url[0]) {
            this.emeilUrl = snapshot.url[0].path;
            if (this.emeilUrl !== 'email-address') {
                this._navSrv.changeStateRightSandwich(false);
            }
        }
        if (snapshot.data.title) {
            this.title = snapshot.data.title;
        }
    }
}
