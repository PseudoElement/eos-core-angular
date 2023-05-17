import { Component, OnDestroy, HostListener, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { APP_MODULES } from '../consts/app-modules.const';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { ExportImportClService } from './../services/export-import-cl.service';
import { TOOLTIP_DELAY_VALUE } from '../../eos-common/services/eos-tooltip.service';
import { AppContext } from '../../eos-rest/services/appContext.service';
import { URL_EXIT } from '../../app/consts/common.consts';

@Component({
    selector: 'eos-header',
    templateUrl: './eos-header.component.html',
    styleUrls: ['./eos-header.component.scss']
})
export class EosHeaderComponent implements OnDestroy, OnInit {
    modules = [...APP_MODULES];
    modulesDropdown = [];
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
    get widthHead(): number {
        let width = 0;
        this.modules.forEach((head) => {
            width += head.width;
        });
        return width;
    }
    constructor(
        private _router: Router,
        private _route: ActivatedRoute,
        private _eiCl: ExportImportClService,
        private _appcontext: AppContext,
    ) {
        this.width = window.innerWidth;
        this.updateHead();
        /* Делать переход к последнему открытому только если открываем приложение заного */
        if (localStorage.getItem('lastUrl') && this._router.url === '/desk/system') {
            this._router.navigateByUrl(localStorage.getItem('lastUrl'));
        }
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
        this.updateHead();
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
        sessionStorage.removeItem('fromclassif');
        sessionStorage.removeItem('color-theme');
        document.location.assign(URL_EXIT);
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
    private updateHead() {
        const title =  this.width > 1250 ? 244 : 48;
        const widthHead = this.showtitle ? title + 170 + 95 : 170 + 95;
        const newHead = [];
        let widthTemp = widthHead;
        this.modulesDropdown = [];
        let flag = true; // флаг что больше поместить нельзя
        APP_MODULES.forEach((head) => {
            if (flag && (widthTemp + head.width) <= this.width) {
                widthTemp += head.width;
                newHead.push(head);
            } else {
                flag = false;
                this.modulesDropdown.push(head);
            }
        });
        this.modules = newHead;
    }
    private update() {
        let _actRoute = this._route.snapshot;
        if (_actRoute && _actRoute.children[0]) {
            switch (_actRoute.children[0].routeConfig.path) {
                case 'user-params-set':
                case 'user_param':
                    localStorage.setItem('lastUrl', 'user_param');
                    break;
                case 'parameters':
                    localStorage.setItem('lastUrl', 'parameters');
                    break;
                case 'spravochniki':
                    localStorage.setItem('lastUrl', 'spravochniki');
                    break;
                case 'desk':
                    localStorage.setItem('lastUrl', this._router.url);
                    break;
                default:
                    localStorage.setItem('lastUrl', _actRoute.children[0].routeConfig.path);
                    break;
            }
        }
        while (_actRoute.firstChild) { _actRoute = _actRoute.firstChild; }
        this.breadcrumbView = _actRoute.data && _actRoute.data.showBreadcrumb;
        this.navParamView = _actRoute.data && _actRoute.data.showNav;
    }
}
