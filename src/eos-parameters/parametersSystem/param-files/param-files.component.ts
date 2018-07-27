import { FormGroup, FormControl } from '@angular/forms';
import { PARM_CANCEL_CHANGE } from './../shared/consts/eos-parameters.const';
import { FILES_PARAM } from '../shared/consts/files-consts';
import { BaseParamComponent } from '../shared/base-param.component';
import { Component, Injector } from '@angular/core';

@Component({
    selector: 'eos-param-files',
    templateUrl: 'param-files.component.html'
})
export class ParamFielsComponent extends BaseParamComponent {
    hiddenFieldPath = false;
    formAttach: FormGroup;
    formAttachfields = [
        {
            value: 'rc',
            text: 'РК'
        },
        {
            value: 'prj-rc',
            text: 'РКПД'
        }
    ];
    constructor( injector: Injector ) {
        super(injector, FILES_PARAM);
        this.init()
        .then(() => {
            this.afterInit();
        });
    }
    cancel() {
        if (this.isChangeForm) {
            this.msgSrv.addNewMessage(PARM_CANCEL_CHANGE);
            this.isChangeForm = false;
            this.formChanged.emit(false);
            this.ngOnDestroy();
            this.init()
            .then(() => {
                // this.afterInit();
            });
        }
    }
    afterInit() {
        if (this.form.controls['rec.EDMSPARM'].value !== 'STORAGE') {
            this.hiddenFieldPath = true;
        }
        this.formAttach = new FormGroup({
            attachFile: new FormControl('rc')
        });
        this.subscriptions.push(
            this.formAttach.controls.attachFile.valueChanges
                .subscribe(value => {
                    console.log(value);
                })
        );
    }
}
