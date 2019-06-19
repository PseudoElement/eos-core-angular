import { Component, OnDestroy, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { OTHER_USER_SHABLONY } from '../../shared-user-param/consts/other.consts';
import { UserParamsService } from '../../../shared/services/user-params.service';
import { FormHelperService } from '../../../shared/services/form-helper.services';
import { EosDataConvertService } from 'eos-dictionaries/services/eos-data-convert.service';
import { InputControlService } from 'eos-common/services/input-control.service';
import { RemasterService } from '../../shared-user-param/services/remaster-service';
// import { EosMessageService } from 'eos-common/services/eos-message.service';
@Component({
    selector: 'eos-user-param-shablony',
    templateUrl: 'user-param-shablony.component.html',
    providers: [FormHelperService],
})

export class UserParamShablonyComponent implements OnDestroy, OnInit {
    @Input() defaultValues;
    @Output() pushChange: EventEmitter<any> = new EventEmitter<any>();
    public initShablony: Array<any>;
    public form: FormGroup;
    public inputs: any;
    private _ngUnsebscribe: Subject<any> = new Subject();
    private allData: any;
    private prepareData: any;
    private prepareInputs: any;
    private mapChanges = new Map();
    private defoltInputs: any;
    private flagEdit: boolean = false;
    constructor(
        private _userSrv: UserParamsService,
        private formHelp: FormHelperService,
        private dataConv: EosDataConvertService,
        private inpSrv: InputControlService,
        private remaster: RemasterService,
        // private _msg: EosMessageService,
        // private _errorSrv: ErrorHelperServices,
    ) {
        this.remaster.submitEmit
        .pipe(
            takeUntil(this._ngUnsebscribe)
        )
        .subscribe(() => {
            this.submit();
        });
        this.remaster.cancelEmit
        .pipe(
            takeUntil(this._ngUnsebscribe)
        )
        .subscribe(() => {
            this.cancel();
        });
        this.remaster.defaultEmit
        .pipe(
            takeUntil(this._ngUnsebscribe)
        )
        .subscribe(() => {
            this.default();
        });
        this.remaster.editEmit
        .pipe(
            takeUntil(this._ngUnsebscribe)
        )
        .subscribe(() => {
            this.flagEdit = true;
            this.editMode();
        });
        this.remaster.emitDefaultFalues
        .pipe(
            takeUntil(this._ngUnsebscribe)
        )
        .subscribe((value) => {
            this.defaultValues = value;
            this.initShablony = this.getInitShablony(this.defaultValues);
        });
    }
    ngOnDestroy() {
        this._ngUnsebscribe.next();
        this._ngUnsebscribe.complete();
    }
    ngOnInit() {
        this.allData = this._userSrv.hashUserContext;
        this.inint();
    }
    getInitShablony(result) {
        const arrayDateMain = [];
        let prepareObj = {};
        Object.keys(this.inputs).forEach(el => {
            prepareObj['PARM_NAME'] = el.substr(4);
            prepareObj['PARM_VALUE'] = result[el.substr(4)];
            prepareObj['keyForm'] = el;
            arrayDateMain.push(prepareObj);
            prepareObj = {};
        });
        return arrayDateMain;
    }

    inint() {
        this.prepareData = this.formHelp.parse_Create(OTHER_USER_SHABLONY.fields, this.allData);
        this.prepareInputs = this.formHelp.getObjectInputFields(OTHER_USER_SHABLONY.fields);
        this.inputs = this.dataConv.getInputs(this.prepareInputs, { rec: this.prepareData });
        this.form = this.inpSrv.toFormGroup(this.inputs);
        this.editMode();
        this.formSubscriber();
    }
    formSubscriber() {
        this.form.valueChanges.subscribe(data => {
            this.checkTouch(data);
        });
    }

    checkTouch(data) {
        let countError = 0;
        Object.keys(data).forEach(key => {
            if (this.inputs[key].value !== data[key]) {
                countError += 1;
                this.mapChanges.set(key.substring(4), data[key]);
            } else {
                if (this.mapChanges.has(key.substring(4))) {
                    this.mapChanges.delete(key.substring(4));
                }
            }
        });
        if (countError > 0 || this.mapChanges.size) {
            this.pushChange.emit({
                btn: true,
                data: this.mapChanges
            });
        } else {
            this.pushChange.emit(false);
        }
    }
    prepFormForSave() {
        Object.keys(this.inputs).forEach((key) => {
            const value = this.form.controls[key].value;
            this.inputs[key].value = value;
        });
    }

    prepFormCancel(input, flag) {
        Object.keys(input).forEach((key) => {
            const val = input[key].value;
            this.form.controls[key].patchValue(val, { emitEvent: flag });
        });
    }
    editMode() {
        if (this.flagEdit) {
            this.form.enable({ emitEvent: false });
        } else {
            this.form.disable({ emitEvent: false });
        }
    }
    submit() {
        this.mapChanges.clear();
        this.prepFormForSave();
        this.flagEdit = false;
        this.editMode();
    }
    default(event?) {
        this.prepareData = {};
        this.prepareInputs = {};
        this.prepareData = this.formHelp.parse_Create(OTHER_USER_SHABLONY.fields, this.defaultValues);
        this.prepareInputs = this.formHelp.getObjectInputFields(OTHER_USER_SHABLONY.fields);
        this.defoltInputs = this.dataConv.getInputs(this.prepareInputs, { rec: this.prepareData });
        this.prepFormCancel(this.defoltInputs, true);
    }
    cancel($event?) {
        this.flagEdit = false;
        this.prepFormCancel(this.inputs, false);
        this.mapChanges.clear();
        this.editMode();
    }
}
