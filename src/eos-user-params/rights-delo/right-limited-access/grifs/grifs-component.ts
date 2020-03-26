import { Component, OnInit, Output, Input, EventEmitter, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { IInputParamControl } from 'eos-user-params/shared/intrfaces/user-parm.intterfaces';
import { InputParamControlService } from 'eos-user-params/shared/services/input-param-control.service';

import {LimitedAccesseService} from '../../../shared/services/limited-access.service';
@Component({
    selector: 'eos-grifs',
    styleUrls: ['grifs.component.scss'],
    templateUrl: 'grifs.component.html'
})
export class GrifsComponent implements OnInit, OnDestroy {
    Unsub = new Subject();
    @Input () editFlag;
    @Input() grifInput;
    @Input() grifsForm;
    @Output() changeGrifs = new EventEmitter();
    fieldsGrifs: IInputParamControl[] = [];
    fields: IInputParamControl[];
    form: FormGroup;
    inputs;
    checkGrifs;
    listRight: any[] = [];
    constructor(
        private _limitservise: LimitedAccesseService,
        private _inputCtrlSrv: InputParamControlService,
    ) {
        this._limitservise.subscribe
        .pipe(
            takeUntil(this.Unsub)
        )
        .subscribe(data => {
            this.ngOnInit('reset');
        });
        this._limitservise.editEmit
        .pipe(
            takeUntil(this.Unsub)
        )
        .subscribe(() => {
            this.editFlag = true;
            this.editModeForm();
        });
    }
    // в первом то что неизменно
    // в нулевом то что меняется
    ngOnInit(deistvi?) {
            this.fieldsGrifs = [];
            const res = this.grifInput;
            const result = this.grifInput;
            result[1].forEach(elem => {
                this.fieldsGrifs.push(this._limitservise.createElemGrif(elem));
            });
            this.checkGrifs = res[0];
            this.fields = this._limitservise.writeValue(this.fieldsGrifs, this.checkGrifs);
            this.inputs = this._inputCtrlSrv.generateInputs(this.fields);
            this.form = this._inputCtrlSrv.toFormGroup(this.inputs);
            if (this.grifsForm && !deistvi) {
                Object.keys(this.grifsForm.controls).forEach(key => {
                    this.form.get(key).setValue(this.grifsForm.get(key).value);
                });
            }
            this.editModeForm();
    }
    clickLable(event, item: any) {
        event.preventDefault();
        event.stopPropagation();
        if (this.editFlag) { // click to checkbox
        item.value = !item.value;
        this.form.get(item.key).setValue(item.value);
        const data = this.checkChenge(this.form, this.inputs);
        this.changeGrifs.emit( {flag: !data.length, form:  this.form , data: data, });
        }
    }
    checkChenge(form: FormGroup, input: any[]) {
        const returnCheng = [];
        Object.keys(form.controls).forEach(key => {
            if (form.get(key).value !== input[key].value) {
                returnCheng.push(input[key]);
            }
        });
        return returnCheng;
    }
    createGrifs() {

    }
    editModeForm() {
        if (this.editFlag) {
            this.form.enable({emitEvent: false});
        }   else {
            this.form.disable({emitEvent: false});
        }
    }

    ngOnDestroy() {
        this.Unsub.next();
        this.Unsub.complete();
    }
}
