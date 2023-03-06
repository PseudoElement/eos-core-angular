import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Subject } from 'rxjs';
import { NavParamService } from '../services/nav-param.service';
import { filter, takeUntil } from 'rxjs/operators';
import { EosSandwichService } from '../../eos-dictionaries/services/eos-sandwich.service';

const LOCALSTORAGE_NAME = 'search_right_sandwich';
@Component({
    selector: 'eos-nav-param',
    templateUrl: 'nav-param.component.html'
})
export class NavParamComponent implements OnDestroy, OnInit {
    title: string;
    isWide: boolean = true;
    isRighSendwich: boolean = true;
    emeilUrl: string = '';
    showRigth: boolean = false;
    disableRight: boolean;
    isSearchRightSandwich: boolean = false;
    private ngUnsubscribe: Subject<any> = new Subject();

    constructor(
        private _navSrv: NavParamService,
        private _route: ActivatedRoute,
        _router: Router,
        private _sandwichSrv: EosSandwichService
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
        this._sandwichSrv.searchMode$.subscribe((state) => {
            this.isSearchRightSandwich = state;
        });
        if (document.documentElement.clientWidth < 1050) {
            this._navSrv.changeStateSandwich(false);
            this.isWide = false;
        } else {
            this._navSrv.changeStateSandwich(true);
            this.isWide = true;
        }
    }

    ngOnInit() {
        const GET = localStorage.getItem(LOCALSTORAGE_NAME);
        if (GET) {
            this.isSearchRightSandwich = (GET === 'true');
        }
    }

    ngOnDestroy(): void {
        if (this.isSearchRightSandwich) {
            localStorage.setItem(LOCALSTORAGE_NAME, this.isRighSendwich ? 'true' : 'false');
        }
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

    private _update() {
        let snapshot = this._route.snapshot;
        while (snapshot.firstChild) { snapshot = snapshot.firstChild; }
        const isURLforSearchPanel: boolean = snapshot.parent.url[0].path ? snapshot.parent.url[0].path === 'user-params-set' : false;
        if (snapshot.url[0]) {
            this.emeilUrl = snapshot.url[0].path;
            if (isURLforSearchPanel) {
                const IS_SEARCH_PANEL = this._navSrv.searchPages.includes(this.emeilUrl);
                this._navSrv.showRightSandwich(IS_SEARCH_PANEL);
                this._navSrv.changeStateRightSandwich(IS_SEARCH_PANEL);
                this._sandwichSrv.changeSearchMode(IS_SEARCH_PANEL);
            } else {
                this._navSrv.showRightSandwich(false);
                this._navSrv.changeStateRightSandwich(false);
                this._sandwichSrv.changeSearchMode(false);
            }
        }
        if (snapshot.data.title) {
            this.title = snapshot.data.title;
        }
    }

}
