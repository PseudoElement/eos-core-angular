import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { REGISTRATION_SCAN } from '../../shared-user-param/consts/remaster-email/remaster-email.const';
import { InputControlService } from '../../../../eos-common/services/input-control.service';
import { EosDataConvertService } from '../../../../eos-dictionaries/services/eos-data-convert.service';
import { FormHelperService } from '../../../shared/services/form-helper.services';
import { RemasterService } from '../../shared-user-param/services/remaster-service';
import { AppContext } from '../../../../eos-rest/services/appContext.service';
import { IUserSettingsModes } from '../../../shared/intrfaces/user-params.interfaces';
@Component({
    selector: 'eos-remaster-scan',
    templateUrl: 'remaster-scan.conponent.html',
    providers: [FormHelperService]
})


export class RemasterScanComponent implements OnInit, OnDestroy {
    @Input() userData;
    @Input() defaultValues;
    @Input() accessSustem;
    @Input() isCurrentSettings?: boolean;
    @Input() appMode: IUserSettingsModes;
    @Output() pushChenge = new EventEmitter<any>();
    @Output() errorSave = new EventEmitter<boolean>();
    public inputs;
    public form: FormGroup;
    public isCbBase: boolean = false;
    public openAcord = false;
    public openAcordSecond = false;
    private prepareInputs;
    private prapareData;
    private countError: number = 0;
    private prepareDefaultForm;
    private ngUnsub: Subject<any> = new Subject();
    private newDataMap: Map<string, any> = new Map();
    // private btnDisabled: boolean = false;
    constructor(
        private formHelp: FormHelperService,
        private inpSrv: InputControlService,
        private dataConv: EosDataConvertService,
        private _RemasterService: RemasterService,
        private appCtx: AppContext,
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
                if (tab === 2) {
                    this.default();
                }
            });
        this._RemasterService.submitEmit
            .pipe(
                takeUntil(this.ngUnsub)
            )
            .subscribe(() => {
                if (!this.isCurrentSettings) {
                    this.form.disable({ emitEvent: false });
                }
                this.setNewValInputs();
            });
        this._RemasterService.editEmit
            .pipe(
                takeUntil(this.ngUnsub),
            )
            .subscribe(data => {
                setTimeout(() => {
                    if (this.form) {
                        this.form.enable({ emitEvent: false });
                    }
                });

            });
    }
    get getIcon() {
        const location = this.form.controls['rec.BARCODE_LOCATION'].value;
        const orientation = this.form.controls['rec.ORIENTATION_TYPE'].value;
        let iconFirst = orientation === '0' ? 'portrait' : 'landscape';
        let iconSecond = location === '0' || location === '2' ? 'bottom' : 'top';
        let iconThree = location === '2' || location === '3' ? 'left' : 'right';
        return 'eos-adm-icon-{0}-{1}-{2}'.replace('{0}', iconFirst).replace('{1}', iconSecond).replace('{2}', iconThree);
    }
    ngOnInit() {
        this.isCbBase = this.appCtx.cbBase;
        Promise.all([]).then((data) => {
            this.pretInputs();
            this.form = this.inpSrv.toFormGroup(this.inputs);
            if (this.isCurrentSettings) {
                this.form.enable({emitEvent: false});
                const def = {};
                Object.keys(this.prapareData).forEach((key) => {
                    def['rec.' + key] = this.prapareData[key];
                });
            } else {
                this.form.disable({emitEvent: false});
            }
            this.subscribeChange();
        }).catch((error => {
            console.log(error);
        }));
    }
    openAccordion() {
        this.openAcord = !this.openAcord;
    }
    openAccordionSecond() {
        this.openAcordSecond = !this.openAcordSecond;
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
                  if (this.countError) {
                        this.pushChenge.emit([{
                          btn: this.countError > 0,
                          data: this.newDataMap
                      }, this.form.value]);
                } else {
                  this.pushChenge.emit(false);
                }
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
         //   this.pretInputs();
        Object.keys(this.inputs).forEach(input => {
            this.form.controls[input].patchValue(this.inputs[input].value);
        });
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
