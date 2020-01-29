import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// import { ConfirmWindowService } from 'eos-common/confirm-window/confirm-window.service';
// import { CONFIRM_SAVE_ON_LEAVE } from 'eos-dictionaries/consts/confirm.consts';
// import { ParamDescriptorSrv } from './shared/service/param-descriptor.service';
import { EOS_PARAMETERS_TAB } from './shared/consts/eos-parameters.const';
import { NavParamService } from 'app/services/nav-param.service';
import { AppContext } from 'eos-rest/services/appContext.service';

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
    //    private _confirmSrv: ConfirmWindowService,
    //    private _paramDescSrv: ParamDescriptorSrv
    ) {
        this._route.params.subscribe(params => (this.paramId = params['id']));
        this._navSrv.StateSandwich$
            .pipe(
                takeUntil(this.ngUnsubscribe)
            )
            .subscribe((state: boolean) => {
                this.isWide = state;
            });
    }
    ngOnInit() {
        // console.log(!this.isChanged, this.disableSave);
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
    @HostListener('window:beforeunload', ['$event'])
    canWndUnload(evt: BeforeUnloadEvent): any {
        if (this.isChanged) {
            evt.returnValue = 'Возможно, внесенные изменения не сохранятся.';
            return false;
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
        if (param.url === 'authentication' && (this._appContext.limitCardsUser.length > 0 || this._appContext.CurrentUser.TECH_RIGHTS[0] === '0')) {
            return false;
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
