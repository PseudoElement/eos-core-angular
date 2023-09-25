import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// import { ConfirmWindowService } from 'eos-common/confirm-window/confirm-window.service';
// import { CONFIRM_SAVE_ON_LEAVE } from 'eos-dictionaries/consts/confirm.consts';
// import { ParamDescriptorSrv } from './shared/service/param-descriptor.service';
import { EOS_PARAMETERS_TAB, E_PARMS_PAGES } from './shared/consts/eos-parameters.const';
import { NavParamService } from '../../app/services/nav-param.service';
import { AppContext } from '../../eos-rest/services/appContext.service';
import { PipRX, ICancelFormChangesEvent } from '../../eos-rest';
import { ErrorHelperServices } from '../../eos-user-params/shared/services/helper-error.services';
import { MESSAGE_SAVE_ON_LEAVE } from '../../eos-dictionaries/consts/confirm.consts';
import { ETypeRule, E_TECH_RIGHTS } from '../../eos-user-params/rights-delo/rights-delo-absolute-rights/absolute-rights-classif/tech-user-classif.interface';

@Component({
    // selector: 'eos-parameters-system',
    templateUrl: 'parametersSystem.component.html'
})
export class ParametersSystemComponent implements OnInit, OnDestroy {
    listParams = EOS_PARAMETERS_TAB;
    disableSave: boolean;
    isChanged: boolean;
    paramId: string;
    isWide: boolean = true;
    private ngUnsubscribe: Subject<any> = new Subject();

    constructor(
        private _navSrv: NavParamService,
        private _route: ActivatedRoute,
        private _appContext: AppContext,
        private _apiSrv: PipRX,
        private _errorSrv: ErrorHelperServices,
        //    private _confirmSrv: ConfirmWindowService,
        //    private _paramDescSrv: ParamDescriptorSrv
    ) {
        this._route.params.subscribe(params => {
            this.paramId = params['id'];
        });
        this._navSrv.StateSandwich$
            .pipe(
                takeUntil(this.ngUnsubscribe)
            )
            .subscribe((state: boolean) => {
                this.isWide = state;
            });

        this._apiSrv.cancelFormChanges$
            .pipe(
                takeUntil(this.ngUnsubscribe)
            )
            .subscribe((event: ICancelFormChangesEvent) => {
                this.isChanged = event.isChanged;
                this._errorSrv.errorHandler(event.error);
            });
    }
    ngOnInit() {
        this.listParams = this.listParams.filter((params) => !(this._appContext.cbBase && (params.url === 'unloading-arch' || params.url === 'sms')));
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
    @HostListener('window:beforeunload', ['$event'])
    canWndUnload(evt: BeforeUnloadEvent): any {
        if (this.isChanged) {
            evt.preventDefault();
            evt.stopPropagation();

            evt.returnValue = MESSAGE_SAVE_ON_LEAVE;
            return MESSAGE_SAVE_ON_LEAVE;
        }
    }
    canDeactivate(_nextState?: any): boolean | Promise<boolean> {
        return this._askForSaving();
    }
    recordChanged(isChanged: boolean) {
        this.isChanged = isChanged;
    }
    turnOffSave(val: boolean) {
        this.disableSave = val;
    }

    disabledAutent(param): boolean {

        const techRights = this._appContext.CurrentUser.TECH_RIGHTS;
        if (!this._appContext.cbBase && techRights && techRights.charAt(E_TECH_RIGHTS.SystemSettings - 1) === ETypeRule.no_right && param.url !== E_PARMS_PAGES['now-organiz']
            && param.url !== E_PARMS_PAGES.logging && param.url !== E_PARMS_PAGES.authentication) {
            return false;
        }
        // проверяем право доступа "Текущая организация"
        if (param.url === E_PARMS_PAGES['now-organiz']) {
            if (techRights && techRights.charAt(E_TECH_RIGHTS.CurrentOrganization - 1) === ETypeRule.no_right) {
                return false;
            }
            return true;
        }
        // проверяем право доступа к Протоколированию и проверяем ограниченность технолога
        if (param.url === E_PARMS_PAGES.logging) {
            if (techRights && techRights[E_TECH_RIGHTS.SettingTheBrowsingProtocol - 1] === ETypeRule.no_right) {
                return false
            }
            return true;
        }

        const paramAccess = !!+this._appContext.CurrentUser.TECH_RIGHTS[E_TECH_RIGHTS.SystemSettings - 1];
        if (param.url === E_PARMS_PAGES.authentication) {
            const userAccess = !!+this._appContext.CurrentUser.TECH_RIGHTS[E_TECH_RIGHTS.Users - 1];
            if (this._appContext.cbBase) {
                const limit = this._appContext.limitCardsUser.length;
                if (!userAccess || userAccess && limit) {
                    return false;
                }
                return true;
            } else {
                return paramAccess;
            }
        }
        return paramAccess;
    }
    private _askForSaving(): Promise<boolean> {
        if (this.isChanged) {
            return new Promise((res, rej) => {
                if (confirm('Возможно, внесенные изменения не сохранятся.')) {
                    this.isChanged = false;
                    return res(true);
                } else {
                    return res(false);
                }
            });
            // if (this.isChanged) {
            //     return this._confirmSrv
            //         .confirm(Object.assign({}, CONFIRM_SAVE_ON_LEAVE, { confirmDisabled: this.disableSave }))
            //         .then(doSave => {
            //             if (doSave) {
            //                 this._paramDescSrv.saveDataFromAsk();
            //                 this.isChanged = false;
            //                 return true;
            //             } else {
            //                 this.isChanged = false;
            //                 return true;
            //             }
            //         })
            //         .catch((err) => {
            //             return false;
            //         });
        } else {
            return Promise.resolve(true);
        }
    }
}
