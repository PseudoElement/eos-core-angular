import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { REGISTRATION_AUTO_SEARCH } from '../../shared-user-param/consts/remaster-email/remaster-email.const';
import { InputControlService } from '../../../../eos-common/services/input-control.service';
import { EosDataConvertService } from '../../../../eos-dictionaries/services/eos-data-convert.service';
import { FormHelperService } from '../../../shared/services/form-helper.services';
import { RemasterService} from '../../shared-user-param/services/remaster-service';
import { LINK_CL } from '../../../../eos-rest/interfaces/structures';
import { IUserSettingsModes } from '../../../../eos-user-params/shared/intrfaces/user-params.interfaces';

 @Component({
    selector: 'eos-auto-search',
    templateUrl: 'remaster-auto-search.conponent.html',
    styleUrls: ['remaster-auto-search.conponent.scss'],
    providers: [FormHelperService],
})
export class RemasterAutoSearchComponent implements OnInit, OnDestroy  {
    @Input() userData;
    @Input() defaultValues;
    @Input() isCurrentSettings?: boolean;
    @Input() appMode: IUserSettingsModes;

    @Output() pushChange: EventEmitter<any> = new EventEmitter();
    public inputs;
    public form: FormGroup;
    public searchString;
    private prepareDefaultForm;
    private prepareInputs;
    private prapareData;
    private countError: number = 0;
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
        .subscribe((tab) => {
            if (tab === 3) {
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
                this.form.disable({emitEvent: false});
            }
        });
        this._RemasterService.editEmit
        .pipe(
            takeUntil(this.ngUnsub)
        )
        .subscribe(data => {
            setTimeout(() => {
                if (this.form) {
                    this.form.enable({emitEvent: false});
                }
            });
        });

    }
    setNewValInputs() {
        Object.keys(this.form.controls).forEach(inp => {
            this.inputs[inp].value = this.form.controls[inp].value;
        });
        if (this.form.controls['rec.LINKS_SORT'].value === 'ORDERNUM') {
            this.userData['LINKS_SORT_ORDER'] = '' + this.form.controls['rec.LINKS_SORT_ORDER1'].value;
        } else {
            this.userData['LINKS_SORT_ORDER'] = '' + this.form.controls['rec.LINKS_SORT_ORDER2'].value;
        }
    }
    ngOnInit() {
        this.searchString = this.userData['DEF_SEARCH_CITIZEN'];
        this._RemasterService.getLink_Type().then((data: LINK_CL[]) => {
           this.fillConstLinkType(data);
            this.pretInputs();
            const orderDefaultValue = this.userData['LINKS_SORT_ORDER'] || '0';
            this.inputs['rec.LINKS_SORT_ORDER1'].value = `${orderDefaultValue}`;
            this.inputs['rec.LINKS_SORT_ORDER2'].value = `${orderDefaultValue}`;
            this.form = this.inpSrv.toFormGroup(this.inputs);
            if (this.isCurrentSettings) {
                this.form.enable({emitEvent: false});
            } else {
                this.form.disable({emitEvent: false});
            }
            this.subscribeChange();
        });
    }
    fillConstLinkType(data: LINK_CL[]) {
        const options: Array<any> = REGISTRATION_AUTO_SEARCH.fields[3].options;
       if (options.length <= 1) {
            if (data.length) {
                data.forEach((value: LINK_CL) => {
                    options.push({
                        value: value.ISN_LCLASSIF,
                        title: value.CLASSIF_NAME
                    });
                });
            }
       }
    }
    pretInputs() {
        this.prapareData =   this.formHelp.parse_Create_Auto_Search(REGISTRATION_AUTO_SEARCH.fields, this.userData);
        this.prepareInputs = this.formHelp.getObjectInputFields(REGISTRATION_AUTO_SEARCH.fields);
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
          const obj = Object.assign({ 'DEF_SEARCH_CITIZEN': this.newDataMap.get('DEF_SEARCH_CITIZEN')}, this.form.value);
            this.pushChange.emit([{
                btn: this.countError > 0,
                data: this.newDataMap
            }, obj]);

        this.countError > 0 ? this.btnDisabled = true : this.btnDisabled = false;
        this.countError = 0;
        });
    }

    checkChanges(data, item: string) {
        const key = item.substring(4);
        const oldValue = this.inputs[item].value;
        if (data[item] !== oldValue) {
            if (this.formHelp._fieldsTypeParce[key] === 'DEV_SEARCH') {
                this.checkDevSearch(data, key);
            } else if (key === 'LINKS_SORT_ORDER1' || key === 'LINKS_SORT_ORDER2') {
                this.checkLinkSort(data, key);
            } else {
              this.checkChangesNext(data, key);
            }
            return false;
        } else {
            if (this.formHelp._fieldsTypeParce[key] === 'DEV_SEARCH') {
                this.checkDevSearch(data, key);
            } else if (key === 'LINKS_SORT_ORDER1' || key === 'LINKS_SORT_ORDER2') {
                this.checkLinkSort(data, key);
            } else {
                if (this.newDataMap.has(key)) {
                    this.newDataMap.delete(key);
                }
            }
        }
        return true;
    }
    checkDevSearch(data, key) {
        const dataVal = this.userData !== null ? this.userData : this.defaultValues;
        const updateString = this.parseDevSearch(data, key);
        if (dataVal['DEF_SEARCH_CITIZEN'] !== updateString) {
            this.newDataMap.set('DEF_SEARCH_CITIZEN', updateString);
        } else {
          this.newDataMap.delete('DEF_SEARCH_CITIZEN');
        }
    }

    checkLinkSort(data, key) {
        if (this.form.controls['rec.LINKS_SORT'].value === 'ORDERNUM' &&
            key === 'LINKS_SORT_ORDER1' &&
            this.userData['LINKS_SORT_ORDER'] !== data['rec.' + key]
        ) {
            this.newDataMap.set('LINKS_SORT_ORDER', data['rec.' + key]);
        }
        if (this.form.controls['rec.LINKS_SORT'].value === 'DOC_DATE' &&
            key === 'LINKS_SORT_ORDER2' &&
            this.userData['LINKS_SORT_ORDER'] !== data['rec.' + key]
        ) {
            this.newDataMap.set('LINKS_SORT_ORDER', data['rec.' + key]);
        }
    }

    parseDevSearch(data, item) {
        const position = this.formHelp.mapKeyPosition.get(item);
        const newString = this.searchString.split('');
        if (typeof data['rec.' + item] === 'boolean') {
            newString.splice(position, 1, data['rec.' + item] ? 1 : 0);
        } else {
            newString.splice(position, 1, data['rec.' + item]);
        }
        this.searchString = newString.join('');
        return  this.searchString;
    }
    checkChangesNext(data, item) {
        if (this.formHelp._fieldsTypeParce[item] === 'number') {
            if (data['rec.' + item] === false) {
                this.newDataMap.set(item, 0);
            } else {
                this.newDataMap.set(item, 1);
            }
        } else if (this.formHelp._fieldsTypeParce[item] === 'string') {
            if (data['rec.' + item] === false) {
                this.newDataMap.set(item, 'NO');
            } else {
                this.newDataMap.set(item, 'YES');
            }
         }  else {
            this.newDataMap.set(item, data['rec.' + item]);
         }

    }

    cancel() {
        if (this.btnDisabled) {
         //   this.pretInputs();
            Object.keys(this.inputs).forEach(input => {
                this.form.controls[input].patchValue(this.inputs[input].value);
            });
        }
        this.form.disable({emitEvent: false});
    }
    default() {
        this.prepareDefaultForm = this.formHelp.parse_Create_Auto_Search(REGISTRATION_AUTO_SEARCH.fields, this.defaultValues);
        Object.keys(this.prepareDefaultForm).forEach((item: string) => {
            if (item.indexOf('LINKS_SORT_ORDER') !== -1) {
                const newValue = this.defaultValues['LINKS_SORT_ORDER'] || '0';
                this.form.controls['rec.' + item].patchValue(newValue);
            } else {
                this.form.controls['rec.' + item].patchValue(this.prepareDefaultForm[item]);
            }
        });
    }
    ngOnDestroy() {
        this.ngUnsub.next();
        this.ngUnsub.complete();
    }
}
