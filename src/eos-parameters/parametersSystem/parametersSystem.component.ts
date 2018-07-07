import { Component, OnChanges, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '../../../node_modules/@angular/router';
import { ConfirmWindowService } from 'eos-common/confirm-window/confirm-window.service';
import { CONFIRM_SAVE_ON_LEAVE } from 'eos-dictionaries/consts/confirm.consts';

@Component({
    // selector: 'eos-parameters-system',
    templateUrl: 'parametersSystem.component.html'
})
export class ParametersSystemComponent implements OnChanges {
    disableSave = false;
    isChanged: boolean;
    paramId: string;
    constructor(
        private _route: ActivatedRoute,
        private _confirmSrv: ConfirmWindowService
    ) {
        this._route.params.subscribe(params => (this.paramId = params['id']));
    }
    ngOnChanges(changes: SimpleChanges) {
        console.log('Changes param system', changes);
    }
    canDeactivate(_nextState?: any): boolean | Promise<boolean> {
        return this._askForSaving();
    }
    recordChanged(isChanged: boolean) {
        this.isChanged = isChanged;
    }

    private _askForSaving(): Promise<boolean> {
        if (this.isChanged) {
            return this._confirmSrv
                .confirm(Object.assign({}, CONFIRM_SAVE_ON_LEAVE, { confirmDisabled: this.disableSave }))
                .then(doSave => {
                    if (doSave) { // тут нужно сохранить
                        return true;
                        // const _data = this.cardEditRef.getNewData();
                        // return this._save(_data).then(node => !!node);
                    } else {
                        return true;
                    }
                })
                .catch(() => {
                    // console.log('cancel reason', err);
                    return false;
                });
        } else {
            return Promise.resolve(true);
        }
    }
}
