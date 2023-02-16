import { Component, OnDestroy, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { OTHER_USER_ADDRESSES } from '../../shared-user-param/consts/other.consts';
import { UserParamsService } from '../../../shared/services/user-params.service';
import { Subject } from 'rxjs';
import { FormHelperService } from '../../../shared/services/form-helper.services';
import { EosDataConvertService } from 'eos-dictionaries/services/eos-data-convert.service';
import { UntypedFormGroup } from '@angular/forms';
import { InputControlService } from 'eos-common/services/input-control.service';
import { RemasterService } from '../../shared-user-param/services/remaster-service';
import { PipRX, DEPARTMENT, DELIVERY_CL } from 'eos-rest';
import {IOpenClassifParams} from '../../../../eos-common/interfaces';
import {WaitClassifService} from '../../../../app/services/waitClassif.service';
import { EosMessageService } from 'eos-common/services/eos-message.service';
import {PARM_ERROR_SEND_FROM} from '../../shared-user-param/consts/eos-user-params.const';
import { AppContext } from 'eos-rest/services/appContext.service';
import { IUserSettingsModes } from 'eos-user-params/shared/intrfaces/user-params.interfaces';
@Component({
    selector: 'eos-user-param-addresses',
    templateUrl: 'user-param-addresses.component.html',
    providers: [FormHelperService],
})

export class UserParamAddressesComponent implements OnDestroy, OnInit {
    @Input() defaultValues;
    @Input() defaultUser: any;
    @Input() appMode: IUserSettingsModes;
    @Input() isCurrentSettings?: boolean;

    @Output() pushChange: EventEmitter<any> = new EventEmitter<any>();
    public form: UntypedFormGroup;
    public inputs: any;
    public flagBacground: boolean = false;
    public sendFrom: string = '';
    public cBase: boolean = false;
    public flagInternalAdr: boolean = false;
    public flagEdit: boolean = false;
    private sendFromOrigin: string = '';
    private _ngUnsebscribe: Subject<any> = new Subject();
    private allData: any;
    private prepareData: any;
    private prepareInputs: any;
    private mapChanges = new Map();
    private defoltInputs: any;
    constructor(
        private _userSrv: UserParamsService,
        private formHelp: FormHelperService,
        private dataConv: EosDataConvertService,
        private inpSrv: InputControlService,
        private remaster: RemasterService,
        private _pipRx: PipRX,
        private _msg: EosMessageService,
        private _appContext: AppContext,
        private   _waitClassifSrv: WaitClassifService,
        // private _errorSrv: ErrorHelperServices,
    ) {

        this.remaster.submitEmit.subscribe(() => {
            this.submit();
        });
        this.remaster.cancelEmit.subscribe(() => {
            this.cancel();
        });
        this.remaster.defaultEmit.subscribe((tab) => {
            if (tab === 1) {
                this.default();
            }
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
        if (this.defaultUser) {
            const ADDR_EXP = String(this.defaultUser['ADDR_EXPEDITION']);
            Promise.all([this.getList(), this.getDepartMentName(ADDR_EXP, true)]).then(result => {
                const dep = result[1] as DEPARTMENT[];
                if (dep.length > 0) {
                    this.sendFromOrigin = dep[0].CLASSIF_NAME;
                    this.sendFrom = dep[0].CLASSIF_NAME;
                }
                this.updateOptionsForConst(result[0] as DELIVERY_CL[]);
                this.allData = this.defaultUser;
                this.inint();
            });
        } else {
            const ADDR_EXP = String(this._userSrv.hashUserContext['ADDR_EXPEDITION']);
            this.allData = this._userSrv.hashUserContext;
            Promise.all([this.getList(), this.getDepartMentName(ADDR_EXP, true)]).then(result => {
                const dep = result[1] as DEPARTMENT[];
                if (dep.length > 0) {
                    this.sendFromOrigin = dep[0].CLASSIF_NAME;
                    this.sendFrom = dep[0].CLASSIF_NAME;
                }
                this.updateOptionsForConst(result[0] as DELIVERY_CL[]);
                this.inint();
            });
        }
    }
    updateOptionsForConst(data: DELIVERY_CL[]) {
        OTHER_USER_ADDRESSES.fields.map(field => {
            if (field.key === 'RS_OUTER_DEFAULT_DELIVERY' && field.options.length === 1) {
                data.forEach((item: DELIVERY_CL) => {
                    field.options.push(
                        { value: item.ISN_LCLASSIF, title: item.CLASSIF_NAME },
                    );
                });
            }
            return field;
        });
    }
    inint() {
        if (this._appContext.cbBase) {
            this.cBase = true;
            OTHER_USER_ADDRESSES.fields.push(
                {
                    key: 'RS_OUTER_DEFAULT_SENDING_TYPE',
                    type: 'radio',
                    title: '',
                    readonly: false,
                    options: [
                        {value: '1', title: 'Централизовано'},
                        {value: '2', title: 'В департаменте'},
                    ]
                }
            );
        }
        this.prepareData = this.formHelp.parse_Create(OTHER_USER_ADDRESSES.fields, this.allData);
        this.prepareInputs = this.formHelp.getObjectInputFields(OTHER_USER_ADDRESSES.fields);
        this.inputs = this.dataConv.getInputs(this.prepareInputs, { rec: this.prepareData });
        this.form = this.inpSrv.toFormGroup(this.inputs);
        this.flagInternalAdr = !this.appMode.tkDoc;
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
            this.pushChange.emit([{
                btn: true,
                data: this.mapChanges
            }, this.form.value]);
        } else {
            this.pushChange.emit(false);
        }
    }
    prepFormForSave() {
        Object.keys(this.inputs).forEach(key => {
            const value = this.form.controls[key].value;
            this.inputs[key].value = value;
        });
    }

    prepFormCancel(input, flag) {
        Object.keys(input).forEach(key => {
            const val = input[key].value;
            this.form.controls[key].patchValue(val, { emitEvent: flag });
        });
    }
    editMode() {
        if (this.form) {
            if ((this.flagEdit || this.isCurrentSettings)) {
                this.form.enable({ emitEvent: false });
            } else {
                this.form.disable({ emitEvent: false });
            }
        }
    }
    submit() {
        this.sendFromOrigin = this.sendFrom;
        this.mapChanges.clear();
        this.prepFormForSave();
        this.flagEdit = false;
        this.editMode();
    }
    default(event?) {
        this.sendFrom = '';
        this.prepareData = {};
        this.prepareInputs = {};
        const ADDR_EXP = this.defaultValues['ADDR_EXPEDITION'] ? String(this.defaultValues['ADDR_EXPEDITION']) : null;
        Promise.all([this.getList(), this.getDepartMentName(ADDR_EXP, true)]).then(result => {
            const dep = result[1] as DEPARTMENT[];
            if (dep.length > 0) {
                this.sendFromOrigin = dep[0].CLASSIF_NAME;
                this.sendFrom = dep[0].CLASSIF_NAME;
            }
        });
        this.prepareData = this.formHelp.parse_Create(OTHER_USER_ADDRESSES.fields, this.defaultValues);
        this.prepareInputs = this.formHelp.getObjectInputFields(OTHER_USER_ADDRESSES.fields);
        this.defoltInputs = this.dataConv.getInputs(this.prepareInputs, { rec: this.prepareData });
        this.prepFormCancel(this.defoltInputs, true);
    }
    cancel($event?) {
        this.flagEdit = false;
        this.sendFrom = this.sendFromOrigin;
        this.prepFormCancel(this.inputs, true);
        this.mapChanges.clear();
        this.editMode();
    }
    sendFromChoose() {
        this.flagBacground = true;
        const params: IOpenClassifParams = {
            classif: 'DEPARTMENT',
            selectMulty: false,
            selectLeafs: false,
            selectNodes: true,
            return_due: true
        };
        this._waitClassifSrv.openClassif(params).then(isn => {
            this.flagBacground = false;
            this.getDepartMentName(String(isn)).then((res: DEPARTMENT[]) => {
                this.setFillSendFrom(res);
            });
        }).catch(error => {
            this.flagBacground = false;
        });
    }
    clearSendFrom() {
        const val = this.form.controls['rec.ADDR_EXPEDITION'].value;
        if (val !== '' && String(val) !== 'null') {
            this.sendFrom = '';
            this.form.controls['rec.ADDR_EXPEDITION'].patchValue('');
        }

        this.sendFrom = '';
    }
    private getDepartMentName(param: string, flagWhatToChoose?: boolean): Promise<any> {
        if (param) {
            const query = {
                DEPARTMENT: [param]
            };
            return this._pipRx.read(query);
        }
        return Promise.resolve([4]);
    }
    private getList(): Promise<any> {
        const query = {
            DELIVERY_CL: {
                criteries: {
                    DELETED: '0',
                },
            },
            orderby: 'WEIGHT asc',
        };
        return this._pipRx.read(query);
    }
    private  setFillSendFrom(res: DEPARTMENT[]) {
        if (res.length > 0) {
            const depart = res[0];
            if (depart.EXPEDITION_FLAG <= 0) {
                this._msg.addNewMessage(PARM_ERROR_SEND_FROM);
            } else {
                this.sendFrom = depart.CLASSIF_NAME;
                this.form.controls['rec.ADDR_EXPEDITION'].patchValue(depart.DUE);
            }
        }
    }

}
