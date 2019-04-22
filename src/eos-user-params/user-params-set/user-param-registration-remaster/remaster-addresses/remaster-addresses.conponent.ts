import {Component, OnInit, OnDestroy, Input, Output, EventEmitter} from '@angular/core';
import {REGISTRATION_ADDRESSES} from '../../../user-params-set/shared-user-param/consts/remaster-email.const';
import {InputControlService} from 'eos-common/services/input-control.service';
import {EosDataConvertService} from 'eos-dictionaries/services/eos-data-convert.service';
import {FormHelperService} from '../../../shared/services/form-helper.services';
import {FormGroup} from '@angular/forms';
import {Subject} from 'rxjs/Subject';
import {RemasterService} from '../../shared-user-param/services/remaster-service';
import {IOpenClassifParams} from '../../../../eos-common/interfaces/interfaces';
import { WaitClassifService } from 'app/services/waitClassif.service';
import { EosMessageService } from 'eos-common/services/eos-message.service';
@Component({
    selector: 'eos-remaster-addresses',
    styleUrls: ['remaster-addresses.conponent.scss'],
    templateUrl: 'remaster-addresses.conponent.html',
    providers: [FormHelperService],
})

export class RemasterAddressesComponent implements OnInit, OnDestroy {
    @Input() userData;
    @Input() defaultValues;
    @Output() pushChange: EventEmitter<any> = new EventEmitter();
    public inputs;
    public form: FormGroup;
    public flagBacground: boolean = false;
    public orgName;
    public orgSaveName;
    public flagEdit: boolean = false;

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
        private _waitClassifSrv: WaitClassifService,
        private msgSrv: EosMessageService,
    ) {
        this._RemasterService.cancelEmit.takeUntil(this.ngUnsub).subscribe(() => {
            this.cancel();
        });
        this._RemasterService.defaultEmit.takeUntil(this.ngUnsub).subscribe(() => {
            this.default();
        });
        this._RemasterService.submitEmit.takeUntil(this.ngUnsub).subscribe(() => {
            this.setNewValInputs();
            this.orgSaveName = this.orgName;
            this.flagEdit = false;
            this.form.disable({emitEvent: false});
        });
        this._RemasterService.editEmit.takeUntil(this.ngUnsub).subscribe(data => {
            this.flagEdit = true;
            this.form.enable({emitEvent: false});
        });
    }

    ngOnInit() {
        this.pretInputs();
        this.form = this.inpSrv.toFormGroup(this.inputs);
        this.form.disable({emitEvent: false});
        const orgISN = this.form.controls['rec.ORGGROUP'].value;
        this._RemasterService.getOrgGroupName(orgISN || '-00').then(res => {
            if (res.length) {
                this.orgName = res[0]['CLASSIF_NAME'];
                this.orgSaveName =  res[0]['CLASSIF_NAME'];
            }else {
                this.orgName = '';
                this.orgSaveName = '';
            }
        }).catch(error => {
            this.msgSrv.addNewMessage({
                type: 'danger',
                title: 'Предупреждение',
                msg: 'Ошибка сервера',
                dismissOnTimeout: 5000,
            });
        });
        this.subscribeChange();
    }
    clearField(): void {
        this.orgName = '';
        this.form.controls['rec.ORGGROUP'].patchValue('');
    }
    setNewValInputs(): void {
        Object.keys(this.form.controls).forEach(inp => {
            this.inputs[inp].value = this.form.controls[inp].value;
        });
    }
    pretInputs(): void {
        this.prapareData =  this.formHelp.parse_Create(REGISTRATION_ADDRESSES.fields, this.userData);
        this.prepareInputs = this.formHelp.getObjectInputFields(REGISTRATION_ADDRESSES.fields);
        this.inputs = this.dataConv.getInputs(this.prepareInputs, {rec: this.prapareData});
    }

    subscribeChange(): void {
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

    checkChanges(data, item: string): boolean {
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
            this.pretInputs();
            Object.keys(this.inputs).forEach(input => {
                this.form.controls[input].patchValue(this.inputs[input].value);
            });
            this.orgName = this.orgSaveName;
        }
        this.form.disable({emitEvent: false});
        this.flagEdit = false;
    }
    default() {
        this.prepareDefaultForm = this.formHelp.parse_Create(REGISTRATION_ADDRESSES.fields, this.defaultValues);
        Object.keys(this.prepareDefaultForm).forEach((item: string) => {
            this.form.controls['rec.' + item].patchValue(this.prepareDefaultForm[item]);
        });
        this.orgName = '';
    }
    openClassif() {
        const query: IOpenClassifParams = {
            classif: 'CONTACT',
            selectMulty: false,
            selectLeafs: false,
            selectNodes: true,
        };
        this.flagBacground = true;
        this._waitClassifSrv.openClassif(query)
        .then(data => {
            if (String(data) === '') {
                this.msgSrv.addNewMessage({
                    type: 'warning',
                    title: 'Предупреждение',
                    msg: 'Выберите значение',
                    dismissOnTimeout: 5000,
                });
                throw new Error();
            } else {
                this._RemasterService.getOrgGroupName(data).then(list => {
                    if (list.length) {
                        this.orgName = list[0]['CLASSIF_NAME'];
                        this.form.controls['rec.ORGGROUP'].patchValue(data);
                    }
                   this.flagBacground = false;
                });
            }
        }).catch(error => {
            this.flagBacground = false;
        });
    }

    ngOnDestroy() {
        this.ngUnsub.next();
        this.ngUnsub.complete();
    }

}
