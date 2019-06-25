import { Component, OnDestroy } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { EosBreadcrumbsService } from '../services/eos-breadcrumbs.service';
import { EosDictService } from '../../eos-dictionaries/services/eos-dict.service';
import { IBreadcrumb } from '../core/breadcrumb.interface';
import { EosSandwichService } from '../../eos-dictionaries/services/eos-sandwich.service';
import { Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';
import {
    RECORD_ACTIONS_EDIT,
    RECORD_ACTIONS_NAVIGATION_UP,
    RECORD_ACTIONS_NAVIGATION_DOWN
} from '../../eos-dictionaries/consts/record-actions.consts';

import { EosDictionaryNode } from 'eos-dictionaries/core/eos-dictionary-node';
import { RtUserSelectService } from '../../eos-user-select/shered/services/rt-user-select.service';
import { EosAccessPermissionsService, APS_DICT_GRANT } from 'eos-dictionaries/services/eos-access-permissions.service';
import { TOOLTIP_DELAY_VALUE } from 'eos-common/services/eos-message.service';
@Component({
    selector: 'eos-breadcrumb',
    templateUrl: 'breadcrumb.component.html',
})

export class BreadcrumbsComponent implements OnDestroy {
    breadcrumbs: IBreadcrumb[];
    infoOpened: boolean;
    isDictionaryPage = false;

    actionEdit = RECORD_ACTIONS_EDIT;
    actionNavigationUp = RECORD_ACTIONS_NAVIGATION_UP;
    actionNavigationDown = RECORD_ACTIONS_NAVIGATION_DOWN;

    hasInfoData = false;
    showPushpin = false;
    showInfoAct = false;
    tooltipDelay = TOOLTIP_DELAY_VALUE;
    private routeName: number;


    private ngUnsubscribe: Subject<any> = new Subject();
    private _isEditEnabled: boolean;


    constructor(
        private _breadcrumbsSrv: EosBreadcrumbsService,
        private _router: Router,
        private _sandwichSrv: EosSandwichService,
        private _route: ActivatedRoute,
        private _dictSrv: EosDictService,
        private _rtSrv: RtUserSelectService,
        private _eaps: EosAccessPermissionsService,
    ) {
        _breadcrumbsSrv.breadcrumbs$
            .pipe(
                takeUntil(this.ngUnsubscribe)
            )
            .subscribe((bc: IBreadcrumb[]) => this.breadcrumbs = bc);
        this._update();
        this._router.events
            .pipe(
                filter((evt) => evt instanceof NavigationEnd),
                takeUntil(this.ngUnsubscribe)
            )
            .subscribe((evt) => {
                this._update();
            });

        this._sandwichSrv.currentDictState$
            .pipe(
                takeUntil(this.ngUnsubscribe)
            )
            .subscribe((state) => this.infoOpened = state[1]);

        this._dictSrv.openedNode$
            .pipe(
                takeUntil(this.ngUnsubscribe)
            )
            .subscribe((n) => {
                this.hasInfoData = !!n;
                if (this.hasInfoData) {
                    this._isEditEnabled = !n.isDeleted && this._calcisEditable(n);
                }
            });
        this._rtSrv.setFlagBtnHeader
            .pipe(
                takeUntil(this.ngUnsubscribe)
            )
            .subscribe(flag => {
                this.hasInfoData = flag;
                this._isEditEnabled = flag;
            });
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next(null);
        this.ngUnsubscribe.complete();
    }

    actionHandler(action) {
        this._breadcrumbsSrv.sendAction({ action: action });
    }

    treeButtonVisible() {
        return !this._sandwichSrv.treeIsBlocked;
    }

    isNavigationEnabled(): boolean {
        if (this._breadcrumbsSrv.currentLink.title === 'Пользователи' && this._rtSrv.btnDisabled !== true) {
            return true;
        } else {
            return (this._dictSrv.getMarkedNodes().length > 1);
        }
    }

    isEditEnabled() {
        if (this.routeName === -1) {
            if (!this._dictSrv.currentDictionary) {
                return false;
            }
            if (this._eaps.isAccessGrantedForDictionary(this._dictSrv.currentDictionary.id,
                this._dictSrv.treeNodeIdByDict(this._dictSrv.currentDictionary.id)) < APS_DICT_GRANT.readwrite) {
                return false;
            }
        }

        return this._isEditEnabled;
    }

    private _calcisEditable(node: EosDictionaryNode): boolean {
        if (!this._dictSrv || !this._dictSrv.currentDictionary || !this._dictSrv.currentDictionary.descriptor) {
            return false;
        }
        if (this._dictSrv.currentDictionary.descriptor.editOnlyNodes !== undefined) {
            if (this._dictSrv && node) {
                if (!(this._dictSrv.currentDictionary.descriptor.editOnlyNodes && node && node.isNode)) {
                    return false;
                }
            }
        }
        return (node && !node.updating);
    }

    private _update() {
        this.routeName = this._router.url.toString().search('user_param');
        let _actRoute = this._route.snapshot;
        while (_actRoute.firstChild) { _actRoute = _actRoute.firstChild; }
        this.showPushpin = _actRoute.data.showPushpin;
        this.showInfoAct = _actRoute.data && _actRoute.data.showSandwichInBreadcrumb;
    }

}
