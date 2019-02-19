import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConfirmWindowService } from 'eos-common/confirm-window/confirm-window.service';
import { CONFIRM_SAVE_ON_LEAVE } from 'eos-dictionaries/consts/confirm.consts';
import { USER_PARMS } from 'eos-rest';
import { UserParamsDescriptorSrv } from '../shared/services/user-params-descriptor.service';

@Component({
    selector: 'eos-params-rights-delo',
    templateUrl: './rights-delo.component.html'
})

export class ParamsRightsDeloComponent implements OnInit {
    userId: string;
    disableSave: boolean;
    isChanged: boolean;
    userParams: USER_PARMS[];
    constructor(
        private _route: ActivatedRoute,
        private _confirmSrv: ConfirmWindowService,
        private _userParamDescSrv: UserParamsDescriptorSrv,
    ) {
        this._route.params.subscribe(param => {
            if (param['sub-field']) {
                this.userId = param['sub-field'];
            } else {
                this.userId = 'card-files';
            }
        });
    }
    ngOnInit() {
       // return this.userParams;
       // console.log(!this.isChanged, this.disableSave);
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
                    if (doSave) { // тут нужно сохранить
                        this._userParamDescSrv.saveDataFromAsk();
                        this.isChanged = false;
                        return true; // временная заглушка
                        // const _data = this.cardEditRef.getNewData();
                        // return this._save(_data).then(node => !!node);
                    } else {
                        this.isChanged = false;
                        return true;
                    }
                })
                .catch((err) => {
                    // tslint:disable-next-line:no-console
                    console.log('cancel reason', err);
                    return false;
                });
        } else {
            return Promise.resolve(true);
        }
    }
}
