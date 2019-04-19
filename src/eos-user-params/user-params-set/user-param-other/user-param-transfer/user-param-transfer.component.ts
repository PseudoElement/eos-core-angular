import { Component, OnDestroy, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { OTHER_USER_TRANSFER } from '../../shared-user-param/consts/other.consts';
import { UserParamsService } from '../../../shared/services/user-params.service';
import { Subject } from 'rxjs/Subject';
import { FormHelperService } from '../../../shared/services/form-helper.services';
import { EosDataConvertService } from 'eos-dictionaries/services/eos-data-convert.service';
import { FormGroup } from '@angular/forms';
import { InputControlService } from 'eos-common/services/input-control.service';
import { RemasterService } from '../../shared-user-param/services/remaster-service';
// import { PipRX } from 'eos-rest';
// import { EosMessageService } from 'eos-common/services/eos-message.service';
// import {ErrorHelperServices} from '../../../shared/services/helper-error.services';
@Component({
    selector: 'eos-user-param-transfer',
    templateUrl: 'user-param-transfer.component.html',
    providers: [FormHelperService],
})

export class UserParamTransferComponent implements OnDestroy, OnInit {
    @Input() defaultValues;
    @Output() pushChange: EventEmitter<any> = new EventEmitter<any>();
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
        private remaster: RemasterService
        // private _pipRx: PipRX,
        // private _msg: EosMessageService,
        // private _errorSrv: ErrorHelperServices,
    ) {
        this.remaster.submitEmit.subscribe(() => {
            this.submit();
        });
        this.remaster.cancelEmit.subscribe(() => {
            this.cancel();
        });
        this.remaster.defaultEmit.subscribe(() => {
            this.default();
        });
        this.remaster.editEmit.subscribe(() => {
            this.flagEdit = true;
            this.editMode();
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
    inint() {
        this.prepareData = this.formHelp.parse_Create(OTHER_USER_TRANSFER.fields, this.allData);
        this.prepareInputs = this.formHelp.getObjectInputFields(OTHER_USER_TRANSFER.fields);
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
        this.prepareData = this.formHelp.parse_Create(OTHER_USER_TRANSFER.fields, this.defaultValues);
        this.prepareInputs = this.formHelp.getObjectInputFields(OTHER_USER_TRANSFER.fields);
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
