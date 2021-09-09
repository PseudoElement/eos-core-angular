import { Component, HostListener } from '@angular/core';
import { WaitClassifService } from 'app/services/waitClassif.service';
import { IOpenClassifParams } from 'eos-common/interfaces';
import { AppContext } from 'eos-rest/services/appContext.service';
import { DynamicInputBase } from './dynamic-input-base';

@Component({
    selector: 'eos-dynamic-input-text',
    templateUrl: 'dynamic-input-text.component.html'
})
export class DynamicInputTextComponent extends DynamicInputBase {
    public isShowText = false;
    constructor(private _waitCl: WaitClassifService, private appCtx: AppContext) {
        super();
    }
    @HostListener('keydown', ['$event'])
    openStdText($event) {
        if (this.isFocused && $event.keyCode === 45) {
            this.isShowText = true;
            const param: IOpenClassifParams = {
                classif: 'StdText',
                isn_user: this.appCtx.CurrentUser.ISN_LCLASSIF,
            };
            this._waitCl.openClassif(param).then(data => {
                this.isShowText = false;
            }).catch(error => {
                this.isShowText = false;
            });
        }
    }
}

