import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormHelperService } from '../../shared/services/form-helper.services';
import { Subject } from 'rxjs/Subject';
import { UserParamsService } from '../../shared/services/user-params.service';
import { CABINETS_USER } from '../shared-user-param/consts/cabinets.consts';
import { EosDataConvertService } from 'eos-dictionaries/services/eos-data-convert.service';
import { FormGroup } from '@angular/forms';
import { InputControlService } from 'eos-common/services/input-control.service';
@Component({
    selector: 'eos-user-param-cabinets',
    templateUrl: 'user-param-cabinets.component.html',
    providers: [FormHelperService]
})

export class UserParamCabinetsComponent implements OnDestroy, OnInit {
    userId: string;
    isChanged: boolean;
    prepInputsAttach;
    selfLink;
    link;
    public prapareData;
    public prepareInputs;
    public inputs;
    public form: FormGroup;
    readonly fieldGroupsForCabinets: string[] = ['Папки', 'Поручения'];
    public currTab: number = 0;
    public allData;
    public mapChanges = new Map();
    readonly fieldsKeys: Map<string, number> = new Map([['FOLDERCOLORSTATUS_RECEIVED', 0],
    ['FOLDERCOLORSTATUS_FOR_EXECUTION', 1], ['FOLDERCOLORSTATUS_UNDER_CONTROL', 2], ['FOLDERCOLORSTATUS_HAVE_LEADERSHIP', 3],
    ['FOLDERCOLORSTATUS_FOR_CONSIDERATION', 4], ['FOLDERCOLORSTATUS_INTO_THE_BUSINESS', 5], ['FOLDERCOLORSTATUS_PROJECT_MANAGEMENT', 6],
    ['FOLDERCOLORSTATUS_ON_SIGHT', 7], ['FOLDERCOLORSTATUS_ON_THE_SIGNATURE', 8]]);
    _ngUnsubscribe: Subject<any> = new Subject();

    private btnDisable: boolean = true;
    constructor(
        private _userParamsSetSrv: UserParamsService,
        private formHelp: FormHelperService,
        private dataConv: EosDataConvertService,
        private inpSrv: InputControlService,
    ) {
        this.allData = this._userParamsSetSrv.hashUserContext;
    }
    ngOnInit() {
        this.pretInputs();
        this.parseInputsFromString();
        this.patchInputFuking();
        this.form = this.inpSrv.toFormGroup(this.inputs);
        this.formSubscriber();
    }

    pretInputs(): void {
        this.prapareData = this.formHelp.parse_Create(CABINETS_USER.fields, this.allData);
        this.prepareInputs = this.formHelp.getObjectInputFields(CABINETS_USER.fields);
        this.inputs = this.dataConv.getInputs(this.prepareInputs, { rec: this.prapareData });
    }

    parseInputsFromString() {
        this.fieldsKeys.forEach((val, key, arr) => {
            this.inputs['rec.' + key].value = this.getValueForString(val, key);
        });
    }
    getValueForString(val, key): boolean {
        const str = this.allData['FOLDERCOLORSTATUS'];
        return str.charAt(val) === '1' ? true : false;
    }
    patchInputFuking() {
        if (String(this.inputs['rec.HILITE_PRJ_RC'].value).trim() !== '') {
            this.inputs['rec.HILITE_PRJ_RC_BOOLEAN'].value = true;
        } else {
            this.inputs['rec.HILITE_PRJ_RC_BOOLEAN'].value = false;
        }

        if (String(this.inputs['rec.HILITE_RESOLUTION'].value).trim() !== '') {
            this.inputs['rec.HILITE_RESOLUTION_BOOLEAN'].value = true;
        } else {
            this.inputs['rec.HILITE_RESOLUTION_BOOLEAN'].value = false;
        }
    }
    formSubscriber() {
        this.form.valueChanges.subscribe(data => {
            this.checkTouch(data);
        });
    }

    checkTouch(data) {
        let countError = 0;
        Object.keys(data).forEach(key => {
            // if (key !== 'rec.HILITE_PRJ_RC_BOOLEAN'  && key !==  'rec.HILITE_RESOLUTION_BOOLEAN' && key !==  'rec.HILITE_RESOLUTION' && key !==  'rec.HILITE_PRJ_RC') {
                if (this.inputs[key].value !== data[key]) {
                    countError += 1;
                    this.mapChanges.set(key, data[key]);
                } else {
                    if (this.mapChanges.has(key)) {
                        this.mapChanges.delete(key);
                    }
                }
        });
        if (countError > 0 || this.mapChanges.size) {
            this.btnDisable = false;
        } else {
            this.btnDisable = true;
        }
    }


    checkDataToDisabled() {
        const val = this.form.controls[`rec.HILITE_RESOLUTION_BOOLEAN`].value;
        const val2 = this.form.controls[`rec.HILITE_PRJ_RC_BOOLEAN`].value;
        if (!val) {
            this.form.controls['rec.HILITE_RESOLUTION'].disable({emitEvent: false});
        }   else {
            this.form.controls['rec.HILITE_RESOLUTION'].enable({emitEvent: false});
        }
        if (!val2) {
            this.form.controls['rec.HILITE_PRJ_RC'].disable({emitEvent: false});
        }   else {
            this.form.controls['rec.HILITE_PRJ_RC'].enable({emitEvent: false});
        }
    }
    setTab(i: number) {
        this.currTab = i;
    }
    edit(event) {

    }
    cancel(event?) {

    }
    ngOnDestroy() {
        this._ngUnsubscribe.next();
        this._ngUnsubscribe.complete();
    }
    // cancel($event?) {
    //     this.flagEdit = false;
    //     super.cancel();
    // }
    // edit($event) {
    //     this.flagEdit = $event;
    //     this.editMode();
    // }
    // close(event) {
    //     this.flagEdit = event;
    //     this._router.navigate(['user_param', JSON.parse(localStorage.getItem('lastNodeDue'))]);
    // }
}
