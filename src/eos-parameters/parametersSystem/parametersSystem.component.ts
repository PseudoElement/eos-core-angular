import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ConfirmWindowService } from 'eos-common/confirm-window/confirm-window.service';
import { CONFIRM_SAVE_ON_LEAVE } from 'eos-dictionaries/consts/confirm.consts';
import { ParamDescriptorSrv } from './shared/service/param-descriptor.service';
import { EOS_PARAMETERS_TAB } from './shared/consts/eos-parameters.const';
import { NavParamService } from 'app/services/nav-param.service';

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
        private _confirmSrv: ConfirmWindowService,
        private _paramDescSrv: ParamDescriptorSrv
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
    canDeactivate(_nextState?: any): boolean | Promise<boolean> {
        return this._askForSaving();
    }
    recordChanged(isChanged: boolean) {
        this.isChanged = isChanged;
    }
    turnOffSave(val: boolean) {
        this.disableSave = val;
    }

    private _askForSaving(): Promise<boolean> {
        if (this.isChanged) {
            return this._confirmSrv
                .confirm(Object.assign({}, CONFIRM_SAVE_ON_LEAVE, { confirmDisabled: this.disableSave }))
                .then(doSave => {
                    if (doSave) {
                        this._paramDescSrv.saveDataFromAsk();
                        this.isChanged = false;
                        return true;
                    } else {
                        this.isChanged = false;
                        return true;
                    }
                })
                .catch((err) => {
                    return false;
                });
        } else {
            return Promise.resolve(true);
        }
    }
}
