import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { REGISTRATION_SEB } from '../../shared-user-param/consts/remaster-email/remaster-email-seb.const';
import { InputControlService } from '../../../../eos-common/services/input-control.service';
import { EosDataConvertService } from '../../../../eos-dictionaries/services/eos-data-convert.service';
import { FormHelperService } from '../../../shared/services/form-helper.services';
import { RemasterService } from '../../shared-user-param/services/remaster-service';
import { IUserSettingsModes } from '../../../../eos-user-params/shared/intrfaces/user-params.interfaces';
@Component({
    selector: 'eos-remaster-seb',
    templateUrl: 'remaster-seb.component.html',
    providers: [FormHelperService]
})
export class RemasterSebComponent implements OnInit, OnDestroy {
    @Input() userData;
    @Input() defaultValues;
    @Input() appMode: IUserSettingsModes;
    @Input() isCurrentSettings?: boolean;

    @Output() pushChange: EventEmitter<any> = new EventEmitter<any>();
    public inputs;
    public form: FormGroup;
    flagEdit: boolean = false;
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
        private _RemasterService: RemasterService
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
        .subscribe((tab) => {
            if (tab === 'СЭВ') {
                this.default();
            }
        });

        this._RemasterService.submitEmit
        .pipe(
            takeUntil(this.ngUnsub)
        )
        .subscribe(() => {
            this.setNewValInputs();
            if (!this.isCurrentSettings) {
                this.flagEdit = false;
                this.form.disable({emitEvent: false});
            }
            
        });

        this._RemasterService.editEmit
        .pipe(
            takeUntil(this.ngUnsub)
        )
        .subscribe(data => {
            this.flagEdit = true;
            this.form.enable({emitEvent: false});
        });
    }

    setNewValInputs() {
        Object.keys(this.form.controls).forEach(inp => {
            this.inputs[inp].value = this.form.controls[inp].value;
        });
    }

    ngOnInit() {
        this.pretInputs();
        this.form = this.inpSrv.toFormGroup(this.inputs);
        if (this.isCurrentSettings) {
            this.form.enable({emitEvent: false});
        } else {
            this.form.disable({emitEvent: false});
        }
        this.subscribeChange();
    }

    pretInputs() {
        this.prapareData =  this.formHelp.parse_Create(REGISTRATION_SEB.fields, this.userData);
        this.prepareInputs = this.formHelp.getObjectInputFields(REGISTRATION_SEB.fields);
        this.inputs = this.dataConv.getInputs(this.prepareInputs, {rec: this.prapareData});
    }
    subscribeChange() {
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

          if (this.countError) {
               this.pushChange.emit([{
                btn: this.countError > 0,
                data: this.newDataMap
            }, this.form.value]);
          } else {
            this.pushChange.emit(false);
          }
        this.countError > 0 ? this.btnDisabled = true : this.btnDisabled = false;
        this.countError = 0;
        });
    }

    checkChanges(data, item: string) {
        const key = item.substring(4);
        const oldValue = this.inputs[item].value;
        if (data[item] !== oldValue) {
            if (this.formHelp._fieldsTypeParce[key] === 'all') {
                this.newDataMap.set(key, data[item]);
            }  else {
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

    checkChangesNext(data, item) {
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
    cancel() {
        if (this.btnDisabled) {
            Object.keys(this.inputs).forEach(input => {
                this.form.controls[input].patchValue(this.inputs[input].value);
            });
        }
        this.flagEdit = false;
        this.form.disable({emitEvent: false});
    }
    default() {
        this.prepareDefaultForm = this.formHelp.parse_Create(REGISTRATION_SEB.fields, this.defaultValues);
        Object.keys(this.prepareDefaultForm).forEach((item: string) => {
            this.form.controls['rec.' + item].patchValue(this.prepareDefaultForm[item]);
        });
    }
    ngOnDestroy() {
        this.ngUnsub.next();
        this.ngUnsub.complete();
    }


}
