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

import { EosDictionaryNode } from '../../eos-dictionaries/core/eos-dictionary-node';
import { RtUserSelectService } from '../../eos-user-select/shered/services/rt-user-select.service';
import { EosAccessPermissionsService, APS_DICT_GRANT } from '../../eos-dictionaries/services/eos-access-permissions.service';
import { TOOLTIP_DELAY_VALUE } from '../../eos-common/services/eos-tooltip.service';
import { AppContext } from '../../eos-rest/services/appContext.service';
import { UserSelectNode } from '../../eos-user-select/list-user-select/user-node-select';
import { Features } from '../../eos-dictionaries/features/features-current.const';

import { E_RECORD_ACTIONS } from '../../eos-dictionaries/';
import { NpCounterOverrideService } from '../../eos-rest';
import { E_DICTIONARY_ID } from '../../eos-dictionaries/consts/dictionaries/enum/dictionaryId.enum';

@Component({
    selector: 'eos-breadcrumb',
    templateUrl: 'breadcrumb.component.html',
    styleUrls: ['./breadcrumb.component.scss']
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
    showUserInfo: boolean = true;
    tooltipDelay = TOOLTIP_DELAY_VALUE;
    isNavigationEnabled: boolean;
    isEditGranted: boolean;
    isEditEnabled: boolean;

    private routeName: number;
    private ngUnsubscribe: Subject<any> = new Subject();

    inlineRightSandwich: boolean = true;
    constructor(
        private _breadcrumbsSrv: EosBreadcrumbsService,
        private _router: Router,
        private _sandwichSrv: EosSandwichService,
        private _route: ActivatedRoute,
        private _dictSrv: EosDictService,
        private _rtSrv: RtUserSelectService,
        private _eaps: EosAccessPermissionsService,
        private _appContext: AppContext,
        private _npOverrideSrv: NpCounterOverrideService
    ) {
        _breadcrumbsSrv.breadcrumbs$
            .pipe(
                takeUntil(this.ngUnsubscribe)
            )
            .subscribe((bc: IBreadcrumb[]) => {
                if (bc && bc[0] && bc[0]['url'] === '/user_param') {
                    this.breadcrumbs = [bc[0]];
                }
            });
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
            .subscribe((state) => {
                this.infoOpened = state[1];
            });

        this._dictSrv.openedNode$
            .pipe(
                takeUntil(this.ngUnsubscribe)
            )
            .subscribe((n) => {
                this.isEditGranted = false;
                this.hasInfoData = !!n;
                this.showUserInfo = true;
                if (this.hasInfoData) {
                    if (this.routeName === -1) {
                        if (this._dictSrv.currentDictionary) {
                            if (this._eaps.isAccessGrantedForDictionary(n.dictionaryId,
                                this._dictSrv.getDueForNode(n)) >= APS_DICT_GRANT.readwrite) {
                                this.isEditGranted = true;
                            }
                        }
                    }
                    this.isEditEnabled = (!n.isDeleted || Features.cfg.canEditLogicDeleted) && this.isEditGranted && this._calcisEditable(n);
                    this.isEditEnabled = this._dictSrv.dictionatyOverrideSrv.accessActionEdit(n,  this.isEditEnabled, this._dictSrv.currentDictionary.id);
                    if (n.dictionaryId === E_DICTIONARY_ID.ORGANIZ) {
                        const allCheck: any = [n];
                        this.isEditEnabled = this._npOverrideSrv.getDisableActionExpandOrganiz(E_RECORD_ACTIONS.edit, this.isEditEnabled, allCheck);
                    }
                }
            });

        this._dictSrv.markInfo$
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe((info) => {
                this.isNavigationEnabled = (info && info.nodes.length > 1);
            });

        this._rtSrv.setFlagBtnHeader
            .pipe(
                takeUntil(this.ngUnsubscribe)
            )
            .subscribe(flag => {
                this.hasInfoData = flag;
                this.isEditEnabled = flag;
            });

        this._rtSrv.subject
            .pipe(
                takeUntil(this.ngUnsubscribe)
            )
            .subscribe(data => {
                this.showUserInfo = !!data;
                if (this._breadcrumbsSrv.currentLink && this._breadcrumbsSrv.currentLink.title === 'Пользователи') {
                    if (this.returnLimitCard(data) && this._appContext.CurrentUser.IS_SECUR_ADM === 0) {
                        this.isEditGranted = true;
                    } else {
                        this.isEditGranted = false;
                    }
                } else {
                    this.isEditGranted = true;
                }
                if (!this._rtSrv.btnDisabled) {
                    this.isNavigationEnabled = true;
                } else {
                    this.isNavigationEnabled = false;
                }
            });
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next(null);
        this.ngUnsubscribe.complete();
    }

    returnLimitCard(data: UserSelectNode): boolean {
        if (this._appContext.limitCardsUser.length > 0 && data && data.dataDeep) {
            if (this._appContext.limitCardsUser.indexOf(data.dataDeep['DEPARTMENT_DUE']) !== -1) {
                return true;
            }
            return false;
        } else {
            if (data && (!data.isEditable || data.deleted)) {
                return false;
            }
        }
        return true;
    }

    actionHandler(action) {
        this._breadcrumbsSrv.sendAction({ action: action });
    }

    treeButtonVisible() {
        return !this._sandwichSrv.treeIsBlocked;
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
        this.inlineRightSandwich = this.showInfoAct && this._sandwichSrv.treeIsBlocked;
    }

}
