import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FormHelperService } from 'eos-user-params/shared/services/form-helper.services';
import { CABINETS_USER_NOTIFICATOR, CABINETS_USER_INFORMER } from 'eos-user-params/user-params-set/shared-user-param/consts/cabinets.consts';
import { EosDataConvertService } from 'eos-dictionaries/services/eos-data-convert.service';
import { InputControlService } from 'eos-common/services/input-control.service';
import { E_FIELD_TYPE } from 'eos-dictionaries/interfaces';
import { PipRX } from 'eos-rest';

@Component({
    selector: 'eos-cabinets-informer',
    templateUrl: 'cabinets-informer.component.html',
    providers: [FormHelperService]
})
export class CabinetsInformerComponent implements OnInit, OnDestroy {
    @Input() userData;
    @Input() flagEdit: boolean;
    @Input() isInformer: boolean;
    @Input() isnClassif;
    @Output() pushState: EventEmitter<any> = new EventEmitter();
    @Output() formError: EventEmitter<any> = new EventEmitter();
    public prepareData;
    public prepareInputs;
    public inputs;
    public defaultInputs;
    public form: FormGroup;
    readonly informerFoldersFieldsKeys: Map<string, number> = new Map ([
        ['INFORMER_FOLDERS_RECEIVED', 0],
        ['INFORMER_FOLDERS_FOR_EXECUTION', 1],
        ['INFORMER_FOLDERS_UNDER_CONTROL', 2],
        ['INFORMER_FOLDERS_HAVE_LEADERSHIP', 3],
        ['INFORMER_FOLDERS_FOR_CONSIDERATION', 4],
        ['INFORMER_FOLDERS_INTO_THE_BUSINESS', 5],
        ['INFORMER_FOLDERS_PROJECT_MANAGEMENT', 6],
        ['INFORMER_FOLDERS_ON_SIGHT', 7],
        ['INFORMER_FOLDERS_ON_THE_SIGNATURE', 8],
    ]);
    readonly informerIncrementCheckboxKeys: Map<string, string[]> = new Map([
        ['rec.INFORMER_REPLY_OVER_CHECK_ON', ['rec.INFORMER_REPLY_OVER_CHECK', 'rec.INFORMER_REPLY_OVER_NOTIFY']],
        ['rec.INFORMER_REPLY_DELTA_CHECK_ON', ['rec.INFORMER_REPLY_DELTA_CHECK', 'rec.INFORMER_REPLY_DELTA_NOTIFY']],
        ['rec.INFORMER_CTRL_OVER_CHECK_ON', ['rec.INFORMER_CTRL_OVER_CHECK', 'rec.INFORMER_CTRL_OVER_NOTIFY']],
        ['rec.INFORMER_CTRL_DELTA_CHECK_ON', ['rec.INFORMER_CTRL_DELTA_CHECK', 'rec.INFORMER_CTRL_DELTA_NOTIFY']],
        ['rec.INFORMER_TIMER_ON', ['rec.INFORMER_TIMER', 'rec.INFORMER_SOUND', 'rec.INFORMER_SOUND_PATH']],
    ]);
    private tabFields = [...CABINETS_USER_NOTIFICATOR.fields];
    private cabinetsSelect = {
        selectKey: 'INFORMER_CABINET',
        selectInputKey: 'rec.INFORMER_CABINET',
        radioKey: 'INFORMER_CABINET_RADIO',
        radioInputKey: 'rec.INFORMER_CABINET_RADIO',
        allCabinets: 'ALL',
        cabinet: 'CABINET',
    };
    private newDataMap: Map<string, any> = new Map();
    private newInformerFoldersString: string;
    private _ngUnsubscribe$: Subject<any> = new Subject();

    get disableGroup() {
        return !this.flagEdit || !this.form.controls['rec.INFORMER_FOLDER_ITEM_CHECK'].value;
    }
    get itDefaultSettingsPage() {
        return !this.isnClassif;
    }
    get isFoldersGroupDisabled() {
        const isDisabled = this.disableGroup;
        if (isDisabled) {
            this.form.controls[this.cabinetsSelect.radioInputKey].disable({ emitEvent: false });
            this.form.controls['rec.INFORMER_MODE'].disable({ emitEvent: false });
        } else {
            this.form.controls[this.cabinetsSelect.radioInputKey].enable({ emitEvent: false });
            this.form.controls['rec.INFORMER_MODE'].enable({ emitEvent: false });
        }
        return isDisabled;
    }
    get isCabinetsSelectDisabled() {
        return this.disableGroup || this.form.controls[this.cabinetsSelect.radioInputKey].value === this.cabinetsSelect.allCabinets;
    }
    get isAllNewDisabled() {
        return this.disableGroup || this.form.controls['rec.INFORMER_MODE'].value !== 'CHECK_NEW';
    }
    get isReplyModeDisabled() {
        const isDisabled = !this.flagEdit ||
            (!this.form.controls['rec.INFORMER_REPLY_OVER_CHECK_ON'].value &&
            !this.form.controls['rec.INFORMER_REPLY_DELTA_CHECK_ON'].value);
        if (isDisabled) {
            this.form.controls['rec.INFORMER_REPLY_MODE'].disable({ emitEvent: false });
        } else {
            this.form.controls['rec.INFORMER_REPLY_MODE'].enable({ emitEvent: false });
        }
        return isDisabled;
    }
    get isNotificatorModeDisabled() {
        const isDisabled = !this.flagEdit;
        if (isDisabled) {
            this.form.controls['rec.NOTIFICATOR_MODE'].disable({ emitEvent: false });
        } else {
            this.form.controls['rec.NOTIFICATOR_MODE'].enable({ emitEvent: false });
        }
        return isDisabled;
    }

    constructor(
        private formHelp: FormHelperService,
        private dataConv: EosDataConvertService,
        private inpSrv: InputControlService,
        private _pipRx: PipRX,
    ) {}
    ngOnInit() {
        if (this.isInformer) {
            this.tabFields = [...CABINETS_USER_INFORMER.fields];
        }
        this.init();
    }
    ngOnDestroy() {
        this._ngUnsubscribe$.next();
        this._ngUnsubscribe$.complete();
    }
    public edit(flagEdit) {
        this.flagEdit = flagEdit;
        this.checkIncrementsVisibility();
    }
    public cancel(flagEdit) {
        this.submit(flagEdit);
    }
    public submit(flagEdit) {
        this.flagEdit = flagEdit;
        this.ngOnDestroy();
        this.init();
        this.newDataMap.clear();
        this.formError.emit(this.form.invalid);
        this.pushState.emit({
            data: this.newDataMap,
        });
    }
    public default(defaultData) {
        this.defaultInputs = this.pretInputs(defaultData);
        this.parseInputsFromString(this.defaultInputs, defaultData['INFORMER_FOLDERS']);
        this.patchInputs(this.defaultInputs);
        Object.keys(this.defaultInputs).forEach((key) => {
            const val = this.defaultInputs[key].value;
            this.form.controls[key].setValue(val, { emitEvent: false });
        });
        Object.keys(this.form.controls).forEach((inputKey) => {
            this.compareFormValues(this.form.controls[inputKey].value, inputKey);
        });
        this.updateIncrementRelatedValues();
        this.formError.emit(this.form.invalid);
        this.pushState.emit({
            data: this.newDataMap,
        });
    }
    public checkIncrementsVisibility() {
        if (this.isInformer) {
            this.informerIncrementCheckboxKeys.forEach((relatedKeys, checkboxKey) => {
                relatedKeys.forEach((key) => {
                    if (this.flagEdit && this.form.controls[checkboxKey].value) {
                        this.form.controls[key].enable({emitEvent: false});
                    } else {
                        this.form.controls[key].disable({emitEvent: false});
                    }
                });
            });
            if (this.flagEdit) {
                this.form.controls['rec.INFORMER_LIMIT_RESULT'].enable({emitEvent: false});
            } else {
                this.form.controls['rec.INFORMER_LIMIT_RESULT'].disable({emitEvent: false});
            }
        }
    }
    public checkOnlyIncrementVisibility(inputKey, val) {
        if (this.isInformer) {
            const relatedKeys = this.informerIncrementCheckboxKeys.get(inputKey);
            relatedKeys.forEach((key) => {
                if (this.flagEdit && val) {
                    this.form.controls[key].enable({emitEvent: false});
                } else {
                    this.form.controls[key].disable({emitEvent: false});
                }
            });
        }
    }
    private init(): void {
        this.inputs = this.pretInputs(this.userData);
        this.parseInputsFromString(this.inputs, this.userData['INFORMER_FOLDERS']);
        this.patchInputs(this.inputs);
        this.form = this.inpSrv.toFormGroup(this.inputs);
        this.checkIncrementsVisibility();
        this.addSubscribers();
        if (this.isInformer) {
            this.getCabinets();
        }
    }
    private pretInputs(data) {
        this.prepareData = this.formHelp.parse_Create(this.tabFields, data);
        this.prepareInputs = this.formHelp.getObjectInputFields(this.tabFields);
        return this.dataConv.getInputs(this.prepareInputs, { rec: this.prepareData });
    }
    private patchInputs(inputs): void {
        if (this.isInformer) {
            this.informerIncrementCheckboxKeys.forEach((relatedKeys, checkboxKey) => {
                const actualCheckBoxValue = inputs[relatedKeys[0]].value.trim();
                inputs[checkboxKey].value = actualCheckBoxValue !== '0' && actualCheckBoxValue !== '';
                if (actualCheckBoxValue === '0' || actualCheckBoxValue === '') {
                    inputs[relatedKeys[0]].value = '5';
                }
            });
            if (
                this.userData[this.cabinetsSelect.selectKey] === this.cabinetsSelect.allCabinets ||
                !this.userData[this.cabinetsSelect.selectKey] ||
                this.userData[this.cabinetsSelect.selectKey] === 'null'
            ) {
                inputs[this.cabinetsSelect.radioInputKey].value = this.cabinetsSelect.allCabinets;
            } else {
                inputs[this.cabinetsSelect.radioInputKey].value = this.cabinetsSelect.cabinet;
            }
        }
    }
    private parseInputsFromString(inputs, folderString): void {
        if (this.isInformer) {
            this.informerFoldersFieldsKeys.forEach((val, key) => {
                inputs['rec.' + key].value = this.getValueForString(val, folderString);
            });
        }
    }
    private getValueForString(val, folderString): boolean {
        if (folderString.length > val) {
            return folderString.charAt(val) === '1' ? true : false;
        }
        return true;
    }
    private addSubscribers(): void {
        this.form.valueChanges
        .pipe(
            takeUntil(this._ngUnsubscribe$)
        )
        .subscribe((changes: any) => {
            Object.keys(changes).forEach((inputKey) => {
                this.compareFormValues(changes[inputKey], inputKey);
            });
            this.updateIncrementRelatedValues();
            this.formError.emit(this.form.invalid);
            this.pushState.emit({
                data: this.newDataMap,
            });
        });
    }
    private getCabinets(): Promise<any> {
        if (!this.isnClassif) {
            return Promise.resolve(null);
        }
        const query = {
            USER_CABINET: {
                criteries: {
                    ISN_LCLASSIF: String(this.isnClassif)
                }
            },
        };
        return this._pipRx.read(query)
            .then((data) => {
                if (data && data.length) {
                    let cabList = '';
                    data.forEach(cab => {
                        if (cabList) {
                            cabList = cabList + `|${cab['ISN_CABINET']}`;
                        } else {
                            cabList = cabList + `${cab['ISN_CABINET']}`;
                        }
                    });
                    const q = {
                        CABINET: {
                            criteries: {
                                ISN_CABINET: String(cabList)
                            }
                        },
                    };
                    return this._pipRx.read(q)
                    .then((cabinets) => {
                        CABINETS_USER_INFORMER.fields.map((field) => {
                            if (field.key === this.cabinetsSelect.selectKey && cabinets && cabinets.length) {
                                if (field.options.length <= cabinets.length) {
                                    field.options.splice(1);
                                    cabinets.forEach(cabinet => {
                                        field.options.push({
                                            value: cabinet['ISN_CABINET'],
                                            title: cabinet['CABINET_NAME'],
                                        });
                                    });
                                }
                            }
                        });
                        if (this.userData[this.cabinetsSelect.selectKey] !== this.cabinetsSelect.allCabinets) {
                            this.form.controls[this.cabinetsSelect.selectInputKey].setValue(this.userData[this.cabinetsSelect.selectKey], {emitEvent: false});
                        } else {
                            this.form.controls[this.cabinetsSelect.selectInputKey].setValue('', {emitEvent: false});
                        }
                    });
                }
            })
            .catch((err) => {
                console.log('error: ', err.message);
            });
    }
    private compareFormValues(val, inputKey): void {
        const key = inputKey.substring(4);
        const oldValue = this.inputs[inputKey].value;
        let newValue = val;
        if (this.informerFoldersFieldsKeys.has(key)) {
            this.setInformerFoldersValue(key, newValue);
        } else if (this.informerIncrementCheckboxKeys.has(inputKey)) {
            this.checkOnlyIncrementVisibility(inputKey, val);
        } else if (key.indexOf(this.cabinetsSelect.selectKey) > -1) {
            this.setCabinetsValue(val, key);
        } else if (oldValue !== newValue && !this.form.controls[inputKey].invalid) {
            const isCheckbox = this.inputs[inputKey].controlType === E_FIELD_TYPE.boolean;
            if (isCheckbox) {
                newValue = newValue ? 'YES' : 'NO';
            }
            this.newDataMap.set(key, newValue);
        } else if (this.newDataMap.has(key)) {
            this.newDataMap.delete(key);
        }
    }
    private setCabinetsValue(val, key) {
        const originValue = this.userData[this.cabinetsSelect.selectKey];
        if (val === this.cabinetsSelect.allCabinets && key === this.cabinetsSelect.radioKey) {
            if (originValue !== val) {
                this.newDataMap.set(this.cabinetsSelect.selectKey, val);
            } else if (this.newDataMap.has(this.cabinetsSelect.selectKey)) {
                this.newDataMap.delete(this.cabinetsSelect.selectKey);
            }
        } else if (key === this.cabinetsSelect.selectKey && this.form.controls[this.cabinetsSelect.radioInputKey].value !== this.cabinetsSelect.allCabinets) {
            if (val !== originValue) {
                this.newDataMap.set(key, val);
            } else if (this.newDataMap.has(key)) {
                this.newDataMap.delete(key);
            }
        }
    }
    private setInformerFoldersValue(key, folderValue): void {
        if (this.isInformer) {
            const fieldIndex = this.informerFoldersFieldsKeys.get(key);
            const informerFoldersKey = 'INFORMER_FOLDERS';
            const origInformerFoldersString = this.userData[informerFoldersKey];
            if (!this.newInformerFoldersString) {
                this.newInformerFoldersString = origInformerFoldersString;
            }
            const informerFoldersArray = this.newInformerFoldersString.split('');
            informerFoldersArray[fieldIndex] = folderValue ? '1' : '0';
            this.newInformerFoldersString = informerFoldersArray.join('');
            if (this.newInformerFoldersString !== origInformerFoldersString) {
                this.newDataMap.set(informerFoldersKey, this.newInformerFoldersString);
            } else {
                this.newDataMap.delete(informerFoldersKey);
            }
        }
    }
    private updateIncrementRelatedValues(): void {
        if (this.isInformer) {
            this.informerIncrementCheckboxKeys.forEach((relatedKeys, checkboxKey) => {
                const incrementKey = relatedKeys[0];
                const notifyKey = relatedKeys[1];
                const getKey = (inputKey) => inputKey.substring(4);
                if (!this.form.controls[checkboxKey].value) {
                    if (this.form.controls[incrementKey].value) {
                        this.newDataMap.set(getKey(incrementKey), '');
                    }
                    if (this.form.controls[notifyKey].value) {
                        this.newDataMap.set(getKey(notifyKey), 'NO');
                    }
                }
                if (this.form.controls[incrementKey].invalid && this.newDataMap.has(getKey(incrementKey))) {
                    this.newDataMap.delete(getKey(incrementKey));
                }
                if (this.form.controls[checkboxKey].value) {
                    this.newDataMap.set(getKey(incrementKey), this.form.controls[incrementKey].value);
                }
            });
        }
    }
}
