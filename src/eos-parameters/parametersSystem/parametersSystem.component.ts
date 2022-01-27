import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// import { ConfirmWindowService } from 'eos-common/confirm-window/confirm-window.service';
// import { CONFIRM_SAVE_ON_LEAVE } from 'eos-dictionaries/consts/confirm.consts';
// import { ParamDescriptorSrv } from './shared/service/param-descriptor.service';
import { EOS_PARAMETERS_TAB } from './shared/consts/eos-parameters.const';
import { NavParamService } from 'app/services/nav-param.service';
import { AppContext } from 'eos-rest/services/appContext.service';
import { PipRX, ICancelFormChangesEvent } from 'eos-rest';
import { ErrorHelperServices } from 'eos-user-params/shared/services/helper-error.services';
import { MESSAGE_SAVE_ON_LEAVE } from 'eos-dictionaries/consts/confirm.consts';

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
        private _rout: Router,
        private _appContext: AppContext,
        private _apiSrv: PipRX,
        private _errorSrv: ErrorHelperServices,
        //    private _confirmSrv: ConfirmWindowService,
        //    private _paramDescSrv: ParamDescriptorSrv
    ) {
        this._route.params.subscribe(params => {
            this.paramId = params['id'];
            // проверяем право доступа "Текущая организация"
            const access = this.disabledAutent({ url: this.paramId });
            if (!access) {
                this._rout.navigate(['parameters']);
            }
            const techRights = this._appContext.CurrentUser.TECH_RIGHTS;
            // если нет доступа к параметрам системы, но если есть доступ к "протоколированию" или к "Текущей организации"
            if (techRights && techRights.charAt(25) === '0') {
                // проверка доступа к "протоколированию"
                if ((techRights.charAt(1) === '1' || techRights.charAt(29) === '1') && (this.paramId !== 'now-organiz' && this.paramId !== 'logging')) {
                    this._rout.navigate(['parameters']);
                    return;
                }

            }
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
        const techRights = this._appContext.CurrentUser.TECH_RIGHTS;
        if (techRights && techRights.charAt(25) === '0') {
            const protocolAndUsers = techRights.charAt(29) === '1' && techRights.charAt(0) === '1';
            const nowOrganiz = techRights.charAt(1) === '1';
            if (protocolAndUsers) {
                this._rout.navigate(['parameters/logging']);
                return;
            }
            if (nowOrganiz) {
                this._rout.navigate(['parameters/now-organiz']);
                return;
            }

        }
        // console.log(!this.isChanged, this.disableSave);
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
        if (!this._appContext.cbBase && techRights && techRights.charAt(25) === '0' && param.url !== 'now-organiz' && param.url !== 'logging') {
            return false;
        }
        // проверяем право доступа "Текущая организация"
        if (param.url === 'now-organiz' && (!techRights || (techRights && techRights.charAt(1) === '0'))) {
            return false;
        }
        // проверяем право доступа к Протоколированию и проверяем ограниченность технолога
        const protocolAndUsers = techRights && techRights.charAt(29) === '0' && techRights.charAt(0) === '0';
        // const protocolAndLimitUsers = techRights && techRights.charAt(29) === '0' && this._appContext.limitCardsUser.length;
        if (param.url === 'logging' && (!techRights || protocolAndUsers/*  || protocolAndLimitUsers */)) {
            return false;
        }
        if (this._appContext.cbBase) {
            const limit = this._appContext.limitCardsUser.length;
            const urlName = param.url === 'authentication';
            const userAccess = !!+this._appContext.CurrentUser.TECH_RIGHTS[0];
            const paramAccess = !!+this._appContext.CurrentUser.TECH_RIGHTS[25];
            if (urlName) {
                if (userAccess && !paramAccess) {
                    return true;
                } else if (limit > 0 || !userAccess) {
                    return false;
                } else {
                    return true;
                }
            } else {
                if (!paramAccess) {
                    return false;
                } else if (paramAccess) {
                    return true;
                }
            }
        }

        return true;
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
