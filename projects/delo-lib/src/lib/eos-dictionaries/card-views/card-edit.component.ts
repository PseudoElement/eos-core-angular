import {
    Component,
    Output,
    Input,
    EventEmitter,
    ViewChild,
    OnChanges,
    OnDestroy,
    SimpleChanges,
    HostListener,
} from '@angular/core';
import { BaseCardEditDirective } from './base-card-edit.component';
import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { EosUtils } from '../../eos-common/core/utils';
import { InputControlService } from '../../eos-common/services/input-control.service';
import { EosDataConvertService } from '../services/eos-data-convert.service';
import { DictionaryDescriptorService } from '../core/dictionary-descriptor.service';
import { EosBroadcastChannelService } from '../services/eos-broadcast-channel.service';
import { EosSevRulesService } from '../services/eos-sev-rules.service';
import { RUBRICATOR_DICT } from '../../eos-dictionaries/consts/dictionaries/rubricator.consts';
import { PipRX, ICancelFormChangesEvent  } from '../../eos-rest';
import { MESSAGE_SAVE_ON_LEAVE } from '../../eos-dictionaries/consts/confirm.consts';
import { DOCGROUP_DICT } from '../../eos-dictionaries/consts/dictionaries/docgroup.consts';
import { COLLISIONS_SEV_DICT } from '../../eos-dictionaries/consts/dictionaries/sev/sev-collisions';
import { SEV_COLLISION_OPTIONS } from '../../eos-dictionaries/consts/dictionaries/sev/templates-sev.consts';
import { ErrorHelperServices } from '../../eos-user-params/shared/services/helper-error.services';
import { EosCommonOverriveService } from '../../app/services/eos-common-overrive.service';
import { E_DICTIONARY_ID } from '../consts/dictionaries/enum/dictionaryId.enum';

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

    @ViewChild('cardEditEl', { static: false }) baseCardEditRef: BaseCardEditDirective;

    form: FormGroup;
    inputs: any;
    newData: any = {};
    isChanged: boolean;

    private _currentFormStatus;
    private _initialData: any = {};
    private subscriptions: Subscription[];

    constructor(
        private _dataSrv: EosDataConvertService,
        private _inputCtrlSrv: InputControlService,
        private _dictSrv: DictionaryDescriptorService,
        private _channelSrv: EosBroadcastChannelService,
        private _rulesSrv: EosSevRulesService,
        private _apiSrv: PipRX,
        private _errorSrv: ErrorHelperServices,
        private _eosCommonOverride: EosCommonOverriveService
    ) {
        this.subscriptions = [];
    }
    /**
     * return new data, used by parent component
     */

    get expression() {
        return this._eosCommonOverride.checkCardElementFroCardEditComponent(this.dictionaryId);
    }
    getNewData(): any {
        // console.log('getNewData')
        this._setInitialData();
        const newData = EosUtils.deepUpdate(Object.assign({}, this.data), this.newData);
        if (this.dictionaryId === E_DICTIONARY_ID.BROADCAST_CHANNEL) {
            this._channelSrv.data = newData.rec;
            newData.rec['PARAMS'] = this._channelSrv.toXml();
        } else if (this.dictionaryId === E_DICTIONARY_ID.ORGANIZ) {
            if (newData.rec['ISN_ADDR_CATEGORY'] !== null) {
                newData.rec['ISN_ADDR_CATEGORY'] = +newData.rec['ISN_ADDR_CATEGORY'];
            }
            if (newData.rec['ISN_REGION'] !== null) {
                newData.rec['ISN_REGION'] = +newData.rec['ISN_REGION'];
            }
        } else if (this.dictionaryId === E_DICTIONARY_ID.RULES_SEV) {
            this._rulesSrv.data = newData.rec;
            newData.rec['SCRIPT_CONFIG'] = this._rulesSrv.scriptConfigToXml();
            newData.rec['FILTER_CONFIG'] = this._rulesSrv.filterConfigToXml();
        } else if (this.dictionaryId === DOCGROUP_DICT.id) {
            /*  вся эта конструкция из-за особенностей данного поля, у него 3 возможных значения
            0 - нет возможности редактирования и галочка снята
            1 - галочка снята но возможности редактирования есть
            2 - галочка стоит и есть возможность редактирования */
            if (!newData.rec['SHABLON'] || newData.rec['SHABLON'].indexOf('{2}') === -1) {
                newData.rec['PRJ_AUTO_REG'] = 0;
            } else {
                if (this.form.controls['rec.PRJ_AUTO_REG'] && this.form.controls['rec.PRJ_AUTO_REG'].value) {
                    newData.rec['PRJ_AUTO_REG'] = 2;
                } else {
                    newData.rec['PRJ_AUTO_REG'] = 1;
                }
            }
        } else if (this.dictionaryId === E_DICTIONARY_ID.DEPARTMENTS) {
            if (newData.printInfo['SURNAME'] === null && newData.rec['SURNAME']) {
                newData.printInfo['SURNAME'] = newData.rec['SURNAME'].split(' ')[0];
            }
        }
        return newData;
    }
    resetData() {
        if (this.dictionaryId === E_DICTIONARY_ID.DEPARTMENTS) {
            Object.keys(this.data).forEach((key) => {
                if (this.data[key] && this.data[key]._orig) {
                    Object.assign(this.data[key], this.data[key]._orig);
                } else if (this.data[key] && this._initialData[key]) {
                    this.data[key] = {};
                    Object.assign(this.data[key], this._initialData[key]);
                }
            });
        } else {
            Object.assign(this.data.rec, this.data.rec._orig);
        }
    }

    confirmSave(): Promise<boolean> {
        if (this.baseCardEditRef) {
            return this.baseCardEditRef.confirmSave();
        }
        return Promise.resolve(true);
    }

    @HostListener('window:beforeunload', ['$event'])
    canWndUnload(evt: BeforeUnloadEvent): any {
        if (this.isChanged) {
            evt.preventDefault();
            evt.stopPropagation();

            evt.returnValue = MESSAGE_SAVE_ON_LEAVE;
            return MESSAGE_SAVE_ON_LEAVE;
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        if ((changes.fieldsDescription || changes.data) && this.fieldsDescription && this.data) {
            this.unsubscribe();
            console.log('onChanges_channelSrv', this._channelSrv)
            const inputs = this._dataSrv.getInputs(this.fieldsDescription, this.data, this.editMode, this._dictSrv, this._channelSrv);
            const isNode = this.data.rec && this.data.rec.IS_NODE;
            this.form = this._inputCtrlSrv.toFormGroup(inputs, isNode);
            this.inputs = inputs;
            this.afterGetForm(inputs);

            this.subscriptions.push(this._apiSrv.cancelFormChanges$
                .subscribe((event: ICancelFormChangesEvent) => {
                    this.isChanged = event.isChanged;
                    this._errorSrv.errorHandler(event.error);
                }));

            this.subscriptions.push(this.form.valueChanges
                .subscribe((newVal) => {
                    let changed = false;
                    const allOwners = [];
                    Object.keys(newVal).forEach((path) => {
                        if (this.changeByPath(path, newVal[path])) {
                            // console.warn('changed by', path);
                            changed = true;
                            this.isChanged = true;
                        }
                        if (path.indexOf('owners[') !== -1 && path.indexOf('].ISN_CABINET') !== -1) {
                            const open = path.indexOf('[');
                            const close = path.indexOf(']');
                            const index = path.slice(open + 1, close);
                            allOwners.push(this.newData.owners[+index]);
                        }
                    });
                    if (this.dictionaryId === E_DICTIONARY_ID.CABINET) {
                        this.newData.owners = allOwners;
                    }
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

    getCardTitle(): any {
            if (this.baseCardEditRef) {
                return this.baseCardEditRef.getCardTitle();
            }
            return '';
    }


    afterGetForm(inputs: any): any {
        if (this.dictionaryId === RUBRICATOR_DICT.id) {
            const input = inputs['rec.CLASSIF_NAME'];
            if (input) {
                const req = {
                    USER_PARMS: {
                        criteries: {
                            ISN_USER_OWNER: '-99',
                            PARM_NAME: 'UNIQ_RUBRIC_CL'
                        }
                    }
                };
                return this._apiSrv.read(req)
                    .then(r => {
                        if (r && r[0] && r[0]['PARM_VALUE'] === 'YES') {
                            const v = [this._inputCtrlSrv.unicValueValidator(input.key, input.uniqueInDict)];
                            if (this.form.controls['rec.CLASSIF_NAME'].validator) {
                                v.push(this.form.controls['rec.CLASSIF_NAME'].validator);
                            }
                            this.form.controls['rec.CLASSIF_NAME'].setValidators(v);
                        }
                    }).catch(e => {
                        this._errorSrv.errorHandler(e);
                    });
            }
        }
        if (this.dictionaryId === COLLISIONS_SEV_DICT.id) {
            if (inputs['rec.COLLISION_CODE']) {
                this.setOptionsForCollisions(inputs, inputs['rec.COLLISION_CODE'].value);
            }
        }
        return Promise.resolve(null);
    }
    setOptionsForCollisions(input, num: number) {
        input['rec.RESOLVE_TYPE'].options = [];
        if (SEV_COLLISION_OPTIONS.hasOwnProperty(+num)) {
            const options = SEV_COLLISION_OPTIONS[+num];
            input['rec.RESOLVE_TYPE'].options.push(...options);
        }
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
        if (path === 'rec.PRJ_AUTO_REG') {
            if (!this.form.controls['rec.SHABLON'] || (this.form.controls['rec.SHABLON'].value && this.form.controls['rec.SHABLON'].value.indexOf('{2}') === -1)) {
                _value = 0;
            } else {
                if (_value === 0) {
                    _value = 1;
                } else {
                    _value = 2;
                }
            }
        }

        this.newData = EosUtils.setValueByPath(this.newData, path, _value);
        let oldValue = EosUtils.getValueByPath(this.data, path, false);
        if (oldValue === '' || oldValue === undefined) { // fix empty strings in IE
            oldValue = null;
        }


        if (typeof value === 'boolean' && !oldValue ) {
            oldValue = 0;
        }
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
    private _setInitialData() {
        if (this.dictionaryId === E_DICTIONARY_ID.DEPARTMENTS && this.data.rec && !this.data.rec._orig) {
            Object.keys(this.data).forEach((key) => {
                if (this.data[key] && !this.data[key]._orig) {
                    this._initialData[key] = {...this.data[key]};
                }
            });
        }
    }
}
