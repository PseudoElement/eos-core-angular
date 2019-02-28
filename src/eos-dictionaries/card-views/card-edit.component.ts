import {Component, Output, Input, EventEmitter, ViewChild, OnChanges, OnDestroy, SimpleChanges} from '@angular/core';
import { BaseCardEditComponent } from './base-card-edit.component';
import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { EosUtils } from 'eos-common/core/utils';
import { InputControlService } from 'eos-common/services/input-control.service';
import { EosDataConvertService } from '../services/eos-data-convert.service';
import { DictionaryDescriptorService } from '../core/dictionary-descriptor.service';
import {EosBroadcastChannelService} from '../services/eos-broadcast-channel.service';
import {EosSevRulesService} from '../services/eos-sev-rules.service';

@Component({
    selector: 'eos-card-edit',
    templateUrl: 'card-edit.component.html'
})
export class CardEditComponent implements OnChanges, OnDestroy {
    @Input() dictionaryId: string;
    @Input() data: any;
    @Input() editMode: boolean;
    @Input() isNewRecord: boolean;
    @Input() fieldsDescription: any;
    @Input() dutysList: string[];
    @Input() fullNamesList: string[];
    @Output() formChanged: EventEmitter<any> = new EventEmitter<any>();
    @Output() formInvalid: EventEmitter<boolean> = new EventEmitter<boolean>();

    @ViewChild('cardEditEl') baseCardEditRef: BaseCardEditComponent;

    form: FormGroup;
    inputs: any;
    newData: any = {};

    private _currentFormStatus;
    private subscriptions: Subscription[];

    constructor(
        private _dataSrv: EosDataConvertService,
        private _inputCtrlSrv: InputControlService,
        private _dictSrv: DictionaryDescriptorService,
        private _channelSrv: EosBroadcastChannelService,
        private _rulesSrv: EosSevRulesService,
    ) {
        this.subscriptions = [];
     }
    /**
     * return new data, used by parent component
     */
    getNewData(): any {
        const newData = EosUtils.deepUpdate(Object.assign({}, this.data), this.newData);
        if (this.dictionaryId === 'broadcast-channel') {
            this._channelSrv.data = newData.rec;
            newData.rec['PARAMS'] = this._channelSrv.toXml();
        } else if (this.dictionaryId === 'organization') {
            if (newData.rec['ISN_ADDR_CATEGORY'] !== null) {
                newData.rec['ISN_ADDR_CATEGORY'] = +newData.rec['ISN_ADDR_CATEGORY'];
            }
            if (newData.rec['ISN_REGION'] !== null) {
                newData.rec['ISN_REGION'] = +newData.rec['ISN_REGION'];
            }
        } else if (this.dictionaryId === 'sev-rules') {
            this._rulesSrv.data = newData.rec;
            newData.rec['SCRIPT_CONFIG'] = this._rulesSrv.scriptConfigToXml();
            newData.rec['FILTER_CONFIG'] = this._rulesSrv.filterConfigToXml();
        }
        return newData;
    }

    ngOnChanges(changes: SimpleChanges) {
        if ((changes.fieldsDescription || changes.data) && this.fieldsDescription && this.data) {
            this.unsubscribe();
            const inputs = this._dataSrv.getInputs(this.fieldsDescription, this.data, this.editMode, this._dictSrv, this._channelSrv);
            this.afterGetInputs(inputs);
            const isNode = this.data.rec && this.data.rec.IS_NODE;
            this.form = this._inputCtrlSrv.toFormGroup(inputs, isNode);
            this.inputs = inputs;

            this.subscriptions.push(this.form.valueChanges
                .subscribe((newVal) => {
                    let changed = false;
                    Object.keys(newVal).forEach((path) => {
                        if (this.changeByPath(path, newVal[path])) {
                            changed = true;
                        }
                    });
                    this.formChanged.emit(changed);
                }));

            this.subscriptions.push(this.form.statusChanges
                .subscribe((status) => {
                    if (this._currentFormStatus !== status) {
                        this.formInvalid.emit(status === 'INVALID');
                    }
                    this._currentFormStatus = status;
                }));
        }
    }
    afterGetInputs(inputs: any) {
        // if (this.dictionaryId === RUBRICATOR_DICT.id) {
        //     const d: boolean = this._storageSrv.getItem(SI_RUBRICUNOQDISABLE);
        //     if (d) {
        //         inputs['rec.CLASSIF_NAME'].isUnique = false;
        //     }

        // }
    }

    /**
     * unsubscribe on destroy
     */
    ngOnDestroy() {
        this.unsubscribe();
    }

    recordChanged(data: any) {
        this.formChanged.emit(data);
    }

    recordInvalid(data: any) {
        this.formInvalid.emit(data);
    }

    /**
     * Updates value in record data
     * @param path - path in data to property
     * @param value - new value
     */
    private changeByPath(path: string, value: any) {
        let _value = null;
        if (typeof value === 'boolean') {
            _value = +value;
        } else if (value === 'null') {
            _value = null;
        } else if (value instanceof Date) {
            _value = EosUtils.dateToString(value);
        } else if (value === '') { // fix empty strings in IE
            _value = null;
        } else {
            _value = value;
        }
        this.newData = EosUtils.setValueByPath(this.newData, path, _value);
        const oldValue = EosUtils.getValueByPath(this.data, path, false);

        if (oldValue !== _value) {
            // console.warn('changed', path, oldValue, 'to', _value, this.data.rec);
        }
        return _value !== oldValue;
    }

    private unsubscribe() {
        this.subscriptions.forEach((subscr) => {
            if (subscr) {
                subscr.unsubscribe();
            }
        });
        this.subscriptions = [];
    }
}
