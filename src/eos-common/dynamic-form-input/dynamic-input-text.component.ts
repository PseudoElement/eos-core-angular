import { Component, HostListener } from '@angular/core';
import { WaitClassifService } from 'app/services/waitClassif.service';
import { IOpenClassifParams } from 'eos-common/interfaces';
/* import { AppContext } from 'eos-rest/services/appContext.service'; */
import { DynamicInputBase } from './dynamic-input-base';

@Component({
    selector: 'eos-dynamic-input-text',
    templateUrl: 'dynamic-input-text.component.html'
})
export class DynamicInputTextComponent extends DynamicInputBase {
    /* public isShowText = false; */
    constructor(private _waitCl: WaitClassifService/* , private appCtx: AppContext */) {
        super();
    }
    get getOverflou(): boolean {
        const el = document.getElementById(this.input.key);
        if (el) {
            return el.scrollHeight > el.clientHeight;
        }
        return false;
    }
    @HostListener('keydown', ['$event'])
    openStdText($event) {
        if (this.isFocused && $event.keyCode === 45) {
            this.openClassif();
        }
    }
    openClassif() {
        const param: IOpenClassifParams = {
            classif: 'StdText',
            idText: this.input.key,
            formText: this.input.key,
            selected: true
        };
        this._waitCl.openClassif(param).then(data => {
            this.form.controls[this.input.key].setValue(this.getValueFromForm() + data);
        }).catch(error => {
            // this.isShowText = false;
        });
    }
    getValueFromForm(): string {
        if (!this.form.controls[this.input.key] || !this.form.controls[this.input.key].value) {
            return '';
        }
        return this.form.controls[this.input.key].value;
    }
}

