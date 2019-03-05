import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import {REGISTRATION_AUTO_SEARCH} from '../../../user-params-set/shared-user-param/consts/remaster-email.const';
import {InputControlService } from 'eos-common/services/input-control.service';
import { EosDataConvertService } from 'eos-dictionaries/services/eos-data-convert.service';
import {FormHelperService} from '../../../shared/services/form-helper.services';
import {FormGroup} from '@angular/forms';
import {RemasterService} from '../../shared-user-param/services/remaster-service';
import {Subject} from 'rxjs/Subject';
 @Component({
    selector: 'eos-auto-search',
    templateUrl: 'remaster-auto-search.conponent.html',
    styleUrls: ['remaster-auto-search.conponent.scss'],
    providers: [FormHelperService],
})
export class RemasterAutoSearchComponent implements OnInit, OnDestroy  {
    @Input() userData;
    @Input() defaultValues;
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
        this._RemasterService.cancelEmit.takeUntil(this.ngUnsub).subscribe(() => {
            this.cancel();
        });
        this._RemasterService.defaultEmit.takeUntil(this.ngUnsub).subscribe(() => {
            this.default();
        });
        this._RemasterService.submitEmit.takeUntil(this.ngUnsub).subscribe(() => {
            this.setNewValInputs();
        });
        this._RemasterService.editEmit.takeUntil(this.ngUnsub).subscribe(data => {
            this.form.enable({emitEvent: false});
        });

    }
    setNewValInputs() {
        Object.keys(this.form.controls).forEach(inp => {
            this.inputs[inp].value = this.form.controls[inp].value;
        });
    }
    ngOnInit() {
        this.searchString = this.userData['DEF_SEARCH_CITIZEN'];
        this._RemasterService.getLink_Type().then(data => {
            this.pretInputs();
            this.form = this.inpSrv.toFormGroup(this.inputs);
            this.form.disable({emitEvent: false});
            this.subscribeChange();
        });
    }
    pretInputs() {
        this.prapareData =   this.formHelp.parse_Create_Auto_Search(REGISTRATION_AUTO_SEARCH.fields, this.userData);
        this.prepareInputs = this.formHelp.getObjectInputFields(REGISTRATION_AUTO_SEARCH.fields);
        this.inputs = this.dataConv.getInputs(this.prepareInputs, {rec: this.prapareData});
    }
    subscribeChange() {
        this.form.valueChanges.takeUntil(this.ngUnsub).subscribe(data => {
          Object.keys(data).forEach(item => {
            if (!this.checkChanges(data, item)) {
                this.countError++;
            }
          });

            this.pushChange.emit({
             btn: this.countError > 0,
             data: this.newDataMap
         });

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
            }  else {
              this.checkChangesNext(data, key);
            }
            return false;
        } else {
            if (this.formHelp._fieldsTypeParce[key] === 'DEV_SEARCH') {
                this.checkDevSearch(data, key);
            } else {
                if (this.newDataMap.has(key)) {
                    this.newDataMap.delete(key);
                }
            }
        }
        return true;
    }
    checkDevSearch(data, key) {
        const updateString = this.parseDevSearch(data, key);
        if (this.userData['DEF_SEARCH_CITIZEN'] !== updateString) {
            this.newDataMap.set('DEF_SEARCH_CITIZEN', updateString);
        } else {
          this.newDataMap.delete('DEF_SEARCH_CITIZEN');
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
            this.pretInputs();
            Object.keys(this.inputs).forEach(input => {
                this.form.controls[input].patchValue(this.inputs[input].value);
            });
        }
        this.form.disable({emitEvent: false});
    }
    default() {
        this.prepareDefaultForm = this.formHelp.parse_Create_Auto_Search(REGISTRATION_AUTO_SEARCH.fields, this.defaultValues);
        Object.keys(this.prepareDefaultForm).forEach((item: string) => {
            this.form.controls['rec.' + item].patchValue(this.prepareDefaultForm[item]);
        });
    }
    ngOnDestroy() {
        this.ngUnsub.next();
        this.ngUnsub.complete();
    }
}
