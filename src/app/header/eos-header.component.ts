import { Component, OnDestroy, HostListener, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { APP_MODULES, APP_MODULES_DROPDOWN } from '../consts/app-modules.const';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { ExportImportClService } from './../services/export-import-cl.service';
import { TOOLTIP_DELAY_VALUE } from 'eos-common/services/eos-tooltip.service';
import { AppContext } from 'eos-rest/services/appContext.service';

@Component({
    selector: 'eos-header',
    templateUrl: './eos-header.component.html'
})
export class EosHeaderComponent implements OnDestroy, OnInit {
    modules = APP_MODULES;
    modulesDropdown = APP_MODULES_DROPDOWN;
    breadcrumbView = true;
    navParamView = false;
    tooltipDelay = TOOLTIP_DELAY_VALUE;
    width = 0;
    openProtocols: Array<any> = [];
    openWindows: Array<any> = [];
    headerShow = true;
    currentUser;
    public disabled: boolean = false;

    private ngUnsubscribe: Subject<any> = new Subject();
    private windowRemove: Window;
    private windowChange: Window;
    private windowView: Window;
    private windowScan: Window;
    get tooltip() {
        if (this._appcontext.cbBase) {
            return 'Вернуться в САДД БР-Web';
        }   else {
            return 'Вернуться в Дело-Web';
        }
    }
    get showtitle(): boolean {
        return !!sessionStorage.getItem('fromclassif');
    }
    get isDisabled(): boolean {
        if (+this._appcontext.CurrentUser.DELO_RIGHTS[0]) {
            return false;
        } else {
            return true;
        }
    }
    constructor(
        _router: Router,
        private _route: ActivatedRoute,
        private _eiCl: ExportImportClService,
        private _appcontext: AppContext,
    ) {
        this.width = window.innerWidth;
        this.update();
        _router.events
            .pipe(
                filter((evt) => evt instanceof NavigationEnd),
                takeUntil(this.ngUnsubscribe)
            )
            .subscribe(() => this.update());
            this._appcontext.setHeader.subscribe((data: boolean) => {
                setTimeout(() => {
                    this.headerShow = data;
                });
            });
    }
    @HostListener('window:resize')
    resize($event) {
        this.width = window.innerWidth;
        // console.log(window.innerWidth);
    }
    ngOnInit() {
        this.currentUser = this._appcontext.CurrentUser;
        if (this._appcontext.CurrentUser.DELO_RIGHTS && this._appcontext.CurrentUser.DELO_RIGHTS.length) {
            if (+this._appcontext.CurrentUser.DELO_RIGHTS[0]) {
                this.disabled = false;
            } else {
                this.disabled = true;
            }
        }   else {
            this.disabled = true;
        }
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next(null);
        this.ngUnsubscribe.complete();
    }
    logOut() {
        document.location.assign('../logoff.aspx');
    }
    eiCl(id: any) {
        if (id === 'export') {
            this._eiCl.openExport('all').then().catch(err => { });
        } else {
            this._eiCl.openImport('all', 'all').then().catch(err => { });
        }
    }

    getProtocol(protocol: string): void {
        switch (protocol) {
            case 'scan':
                this.openProtocolScan(protocol);
                break;
            case 'remove':
                this.openProtocolRemove(protocol);
                break;
            case 'change':
                this.openProtocolChange(protocol);
                break;
            case 'view':
                this.openProtocolView(protocol);
                break;
        }
        // if (this.openProtocols.indexOf(protocol) === -1) {
        //     try {
        //         const newWindow = window.open(`../Protocol/Pages/ProtocolView.html?type=${protocol}`, '_blank', 'width=900,height=700');
        //         this.hashWindow.set(protocol, newWindow);
        //         this.openWindows.push(newWindow);
        //         this.openProtocols.push(protocol);
        //         newWindow.blur();
        //         newWindow.addEventListener('beforeunload', () => {
        //             this.openProtocols = this.openProtocols.filter(prot => prot !== protocol);
        //             if (this.hashWindow.has(protocol)) {
        //                 this.hashWindow.delete(protocol);
        //             }
        //         });
        //     } catch (e) {
        //         console.log(e);
        //         console.log('1');
        //     }

        // } else {
        //     try {
        //         const selectWin = this.hashWindow.get(protocol);
        //         console.log(selectWin);
        //         selectWin.focus();
        //     } catch (e) {
        //         console.log(e);
        //         console.log('2');
        //     }
        // }
    }
    openProtocolScan(protocol) {
        if (this.windowScan && !this.windowScan.closed) {
            this.windowScan.focus();
        } else {
            this.windowScan = window.open(`../Protocol/Pages/ProtocolView.html?type=${protocol}`, '_blank', 'width=900,height=700');
            this.windowScan.blur();
        }
    }
    openProtocolRemove(protocol) {
        if (this.windowRemove && !this.windowRemove.closed) {
            this.windowRemove.focus();
        } else {
            this.windowRemove = window.open(`../Protocol/Pages/ProtocolView.html?type=${protocol}`, '_blank', 'width=900,height=700');
            this.windowRemove.blur();
        }
    }
    openProtocolChange(protocol) {
        if (this.windowChange && !this.windowChange.closed) {
            this.windowChange.focus();
        } else {
            this.windowChange = window.open(`../Protocol/Pages/ProtocolView.html?type=${protocol}`, '_blank', 'width=900,height=700');
            this.windowChange.blur();
        }
    }
    openProtocolView(protocol) {
        if (this.windowView && !this.windowView.closed) {
            this.windowView.focus();
        } else {
            this.windowView = window.open(`../Protocol/Pages/ProtocolView.html?type=${protocol}`, '_blank', 'width=900,height=700');
            this.windowView.blur();
        }
    }
    private update() {
        let _actRoute = this._route.snapshot;
        while (_actRoute.firstChild) { _actRoute = _actRoute.firstChild; }
        this.breadcrumbView = _actRoute.data && _actRoute.data.showBreadcrumb;
        this.navParamView = _actRoute.data && _actRoute.data.showNav;
    }
}
