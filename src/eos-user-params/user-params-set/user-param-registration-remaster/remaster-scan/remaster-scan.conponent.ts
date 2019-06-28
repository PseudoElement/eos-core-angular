import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { REGISTRATION_SCAN } from '../../../user-params-set/shared-user-param/consts/remaster-email.const';
import { InputControlService } from 'eos-common/services/input-control.service';
import { EosDataConvertService } from 'eos-dictionaries/services/eos-data-convert.service';
import { FormHelperService } from '../../../shared/services/form-helper.services';
import { RemasterService } from '../../shared-user-param/services/remaster-service';
import { FORMAT_CL, DOC_TEMPLATES } from 'eos-rest/interfaces/structures';
import { IFieldDescriptor } from 'eos-dictionaries/interfaces';
@Component({
    selector: 'eos-remaster-scan',
    templateUrl: 'remaster-scan.conponent.html',
    styleUrls: ['remaster-scan.conponent.scss'],
    providers: [FormHelperService]
})


export class RemasterScanComponent implements OnInit, OnDestroy {
    @Input() userData;
    @Input() defaultValues;
    @Input() accessSustem;
    @Output() pushChenge = new EventEmitter<any>();
    public inputs;
    public form: FormGroup;
    private prepareInputs;
    private prapareData;
    private countError: number = 0;
    private prepareDefaultForm;
    private ngUnsub: Subject<any> = new Subject();
    private newDataMap: Map<string, any> = new Map();
    private btnDisabled: boolean = false;
    constructor(
        private formHelp: FormHelperService,
        private inpSrv: InputControlService,
        private dataConv: EosDataConvertService,
        private _RemasterService: RemasterService,
    ) {
        this._RemasterService.cancelEmit
        .pipe(
            takeUntil(this.ngUnsub)
        )
        .subscribe(() => {
            this.cancel();
        });
        this._RemasterService.defaultEmit
        .pipe(
            takeUntil(this.ngUnsub)
        )
        .subscribe(() => {
            this.default();
        });
        this._RemasterService.submitEmit
        .pipe(
            takeUntil(this.ngUnsub)
        )
        .subscribe(() => {
            this.setNewValInputs();
            this.form.disable({ emitEvent: false });
        });
        this._RemasterService.editEmit
        .pipe(
            takeUntil(this.ngUnsub)
        )
        .subscribe(data => {
            this.form.enable({ emitEvent: false });
            this.checkDisableInputs();
        });
    }

    ngOnInit() {
        Promise.all([
            this._RemasterService.getScanShablonBarCode(),
            this._RemasterService.getScanShablonBarCodeL(),
            this._RemasterService.getScanFormatCl(),
        ]).then((data) => {
            this.fillOptionsForConst(data);
            this.fillFormatCl(data[2]);
            this.pretInputs();
            this.form = this.inpSrv.toFormGroup(this.inputs);
            this.form.disable({ emitEvent: false });
            this.subscribeChange();
        }).catch((error => {
            console.log(error);
        }));
    }
    checkDisableInputs() {
        if (+this.accessSustem[3] === 0 && +this.accessSustem[15] === 0) {
            this.form.disable({ emitEvent: false });
            return;
        }
        if (+this.accessSustem[3] === 0 && +this.accessSustem[15] === 1) {
            this.form.controls['rec.LOCKFILE_SSCAN'].disable({onlySelf: true, emitEvent: false});
            return;
        }
        if (+this.accessSustem[3] === 1 && +this.accessSustem[15] === 0) {
            this.form.controls['rec.SHABLONBARCODE'].disable({onlySelf: true, emitEvent: false});
            this.form.controls['rec.SHABLONBARCODEL'].disable({onlySelf: true, emitEvent: false});
            this.form.controls['rec.SAVEFORMAT'].disable({onlySelf: true, emitEvent: false});
            return;
        }
    }
    fillOptionsForConst(data): void {
        REGISTRATION_SCAN.fields.map((field: IFieldDescriptor) => {
            if (field.key === 'SHABLONBARCODE') {
                return this.setOptions(data[0], field);
            }
            if (field.key === 'SHABLONBARCODEL') {
                return this.setOptions(data[1], field);
            }
            return field;
        });
    }
    setOptions(data: DOC_TEMPLATES[], field: IFieldDescriptor) {
        if (data.length && (field.options.length < data.length)) {
            data.forEach((el: DOC_TEMPLATES) => {
                field.options.push({
                    value: el['NAME_TEMPLATE'],
                    title: el['DESCRIPTION']
                });
            });
        }
        return field;
    }
    fillFormatCl(data): void {
        const options: Array<any> = REGISTRATION_SCAN.fields[2].options;
        if (data.length && (options.length <= data.length - 1)) {
            data.forEach((el: FORMAT_CL) => {
                options.push({
                    value: el.ISN_LCLASSIF,
                    title: `${el.NOTE}, ${el.FORMAT_TNAME}`
                });
            });
        }
    }
    setNewValInputs(): void {
        Object.keys(this.form.controls).forEach(inp => {
            this.inputs[inp].value = this.form.controls[inp].value;
        });
    }
    pretInputs(): void {
        this.prapareData = this.formHelp.parse_Create(REGISTRATION_SCAN.fields, this.userData);
        this.prepareInputs = this.formHelp.getObjectInputFields(REGISTRATION_SCAN.fields);
        this.inputs = this.dataConv.getInputs(this.prepareInputs, { rec: this.prapareData });
    }

    subscribeChange(): void {
        this.form.valueChanges
        .pipe(
            takeUntil(this.ngUnsub)
        )
        .subscribe(data => {
            Object.keys(data).forEach(item => {
                if (!this.checkChanges(data, item)) {
                    this.countError++;
                }
            });
            this.pushChenge.emit({
                btn: this.countError > 0,
                data: this.newDataMap
            });
            this.countError > 0 ? this.btnDisabled = true : this.btnDisabled = false;
            this.countError = 0;
        });
    }

    checkChanges(data, item: string): boolean {
        const key = item.substring(4);
        const oldValue = this.inputs[item].value;
        if (data[item] !== oldValue) {
            if (this.formHelp._fieldsTypeParce[key] === 'all') {
                this.newDataMap.set(key, data[item]);
            } else {
                this.checkChangesNext(data, key);
            }
            return false;
        } else {
            if (this.newDataMap.has(key)) {
                this.newDataMap.delete(key);
            }
        }
        return true;
    }
    checkChangesNext(data, item): void {
        if (this.formHelp._fieldsTypeParce[item] === 'number') {
            if (data['rec.' + item] === false) {
                this.newDataMap.set(item, 0);
            } else {
                this.newDataMap.set(item, 1);
            }
        }
        if (this.formHelp._fieldsTypeParce[item] === 'string') {
            if (data['rec.' + item] === false) {
                this.newDataMap.set(item, 'NO');
            } else {
                this.newDataMap.set(item, 'YES');
            }
        }
    }
    cancel(): void {
        if (this.btnDisabled) {
            this.pretInputs();
            Object.keys(this.inputs).forEach(input => {
                this.form.controls[input].patchValue(this.inputs[input].value);
            });
        }
        this.form.disable({ emitEvent: false });
    }
    default(): void {
        this.prepareDefaultForm = this.formHelp.parse_Create(REGISTRATION_SCAN.fields, this.defaultValues);
        Object.keys(this.prepareDefaultForm).forEach((item: string) => {
            this.form.controls['rec.' + item].patchValue(this.prepareDefaultForm[item]);
        });
    }
    ngOnDestroy() {
        this.ngUnsub.next();
        this.ngUnsub.complete();
    }
}
