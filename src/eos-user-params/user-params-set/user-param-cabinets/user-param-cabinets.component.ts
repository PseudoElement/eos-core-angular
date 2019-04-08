import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormHelperService } from '../../shared/services/form-helper.services';
import { Subject } from 'rxjs/Subject';
import { UserParamsService } from '../../shared/services/user-params.service';
import { CABINETS_USER } from '../shared-user-param/consts/cabinets.consts';
import { EosDataConvertService } from 'eos-dictionaries/services/eos-data-convert.service';
import { FormGroup } from '@angular/forms';
import { InputControlService } from 'eos-common/services/input-control.service';
import { Router } from '@angular/router';
import { WaitClassifService } from 'app/services/waitClassif.service';
import { OPEN_CLASSIF_DEPARTMENT } from 'eos-user-select/shered/consts/create-user.consts';
import { PipRX, USER_PARMS } from 'eos-rest';
import { EosMessageService } from 'eos-common/services/eos-message.service';
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
    public bacgHeader: boolean;
    public dueForLink: string;
    public controller: boolean;
    public flagEdit: boolean = false;
    public titleHeader;
    public prepareData;
    public prepareInputs;
    public defoltInputs;
    public inputs;
    public form: FormGroup;
    readonly fieldGroupsForCabinets: string[] = ['Папки', 'Поручения'];
    public currTab: number = 0;
    public allData;
    public mapChanges = new Map();
    public FOLDERCOLORSTATUS = '';
    public newFolderString = '';
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
        private _router: Router,
        private _waitClassifSrv: WaitClassifService,
        private _pipRx: PipRX,
        private _msg: EosMessageService,
    ) {
        this.titleHeader = this._userParamsSetSrv.curentUser['SURNAME_PATRON'] + ' - ' + 'Кабинеты';
        this.link = this._userParamsSetSrv.curentUser['ISN_LCLASSIF'];
        this.selfLink = this._router.url.split('?')[0];
        this.allData = this._userParamsSetSrv.hashUserContext;
    }
    ngOnInit() {
        this.init();
        Promise.all([this.getControlAuthor(), this.getNameSortCabinets()]).then(([author, sort]) => {
            CABINETS_USER.fields.map(fields => {
                if (fields.key === 'CABSORT_ISN_DOCGROUP_LIST') {
                    fields.options.splice(0, fields.options.length);
                    sort.forEach(element => {
                        fields.options.push({
                            value: element.ISN_LIST,
                            title: element.NAME
                        });
                    });
                }
            });
            this.init();
            if (author) {
                this.form.controls['rec.CONTROLL_AUTHOR'].patchValue(String(author[0]['CLASSIF_NAME']), { emitEvent: false });
            }
        });
    }
    init() {
        this.pretInputs();
        this.parseInputsFromString();
        this.patchInputFuking();
        this.form = this.inpSrv.toFormGroup(this.inputs);
        this.editMode();
        this.formSubscriber();
    }

    pretInputs(): void {
        this.FOLDERCOLORSTATUS = this.allData['FOLDERCOLORSTATUS'];
        this.newFolderString = this.FOLDERCOLORSTATUS;
        this.prepareData = this.formHelp.parse_Create(CABINETS_USER.fields, this.allData);
        this.prepareInputs = this.formHelp.getObjectInputFields(CABINETS_USER.fields);
        this.inputs = this.dataConv.getInputs(this.prepareInputs, { rec: this.prepareData });
        this.inputs['rec.ADD_ADRESS_REPORGANIZ'].value = !this.inputs['rec.ADD_ADRESS_REPORGANIZ'].value;
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
            if (key.indexOf('FOLDERCOLORSTATUS') !== -1) {
                this.folderColorStatusUp(data, key);
            }
            if (this.inputs[key].value !== data[key] && key.indexOf('FOLDERCOLORSTATUS') === -1 && key !== 'rec.CONTROLL_AUTHOR') {
                countError += 1;
                this.mapChanges.set(key.substring(4), data[key]);
            } else {
                if (this.mapChanges.has(key.substring(4))) {
                    this.mapChanges.delete(key.substring(4));
                }
            }
        });
        if (this.FOLDERCOLORSTATUS !== this.newFolderString) {
            this.mapChanges.set('FOLDERCOLORSTATUS', this.newFolderString);
        } else {
            if (this.mapChanges.has('FOLDERCOLORSTATUS')) {
                this.mapChanges.delete('FOLDERCOLORSTATUS');
            }
        }
        if (countError > 0 || this.mapChanges.size) {
            this.btnDisable = false;
        } else {
            this.btnDisable = true;
        }
        this._pushState();

    }
    folderColorStatusUp(data, key: string) {
        if (key !== 'rec.FOLDERCOLORSTATUS') {
            const znach: boolean = data[key];
            const index = this.fieldsKeys.get(key.substring(4));
            const s: Array<any> = this.newFolderString.split('');
            s.splice(index, 1, znach ? 1 : 0);
            this.newFolderString = s.join('');
        }
    }


    checkDataToDisabled() {
        const val = this.form.controls[`rec.HILITE_RESOLUTION_BOOLEAN`].value;
        const val2 = this.form.controls[`rec.HILITE_PRJ_RC_BOOLEAN`].value;
        if (!val) {
            this.form.controls['rec.HILITE_RESOLUTION'].disable({ onlySelf: true, emitEvent: false });
        } else {
            this.form.controls['rec.HILITE_RESOLUTION'].enable({ onlySelf: true, emitEvent: false });
        }
        if (!val2) {
            this.form.controls['rec.HILITE_PRJ_RC'].disable({ onlySelf: true, emitEvent: false });
        } else {
            this.form.controls['rec.HILITE_PRJ_RC'].enable({ onlySelf: true, emitEvent: false });
        }
    }

    changeIncrementForm(data): boolean {
        let val: boolean = false;
        if (/^([1-9]?[0-9]{0,4}|\W*)$/.test(String(data))) {
            val = true;
        } else {
            val = false;
        }
        return val;
    }

    changeIncrementAttach(data, data1): boolean {
        let val: boolean = false;
        if (/^(-\d{1,2}|[1-9](\d{1,2})?|0|\W*)$/.test(String(data)) && /^(-\d{1,2}|[1-9](\d{1,2})?|0|\W*)$/.test(String(data1))) {
            val = true;
        } else {
            val = false;
        }
        return val;
    }
    get MaxIncrement() {
        const val1 = this.form.controls['rec.HILITE_RESOLUTION'].value;
        const val2 = this.form.controls['rec.HILITE_PRJ_RC'].value;
        const val3 = this.form.controls['rec.FOLDER_ITEM_LIMIT_RESULT'].value;
        const bool1 = this.changeIncrementAttach(val1, val2);
        const bool2 = this.changeIncrementForm(val3);
        if (bool1 && bool2) {
            return false;
        } else {
            return true;
        }
    }
    get getClass() {
        const val = this.form.controls['rec.CONTROLL_AUTHOR'].value;
        return val !== '' && String(val) !== 'null' && this.flagEdit ? 'eos-icon eos-icon-info-blue small' : 'eos-icon eos-icon-info-grey small';
    }
    get getClassClearBtn() {
        const val = this.form.controls['rec.CONTROLL_AUTHOR'].value;
        return val !== '' && String(val) !== 'null' && this.flagEdit ? 'eos-icon eos-icon-close-blue small' : 'eos-icon eos-icon-close-grey small';
    }
    getControlAuthor(): Promise<any> {
        const ControlAuthor = this._userParamsSetSrv.hashUserContext['RESOLUTION_CONTROLLER'];
        this.dueForLink = ControlAuthor;
        if (String(ControlAuthor) === 'null') {
            this.controller = false;
            return Promise.resolve(false);
        } else {
            this.controller = true;
            return this._userParamsSetSrv.getDepartmentFromUser([ControlAuthor]);
        }
    }
    showInfoUser() {
        this._router.navigate(['/spravochniki/departments', this.dueForLink, 'view', '0']);
    }
    clearControlAuthor() {
        const val = this.form.controls['rec.CONTROLL_AUTHOR'].value;
        if (String(val) === 'null' || val === '' || !this.flagEdit) {
            return;
        } else {
            this.form.controls['rec.RESOLUTION_CONTROLLER'].patchValue('');
            this.form.controls['rec.CONTROLL_AUTHOR'].patchValue('');
            this.controller = false;
        }
    }
    openClassifDepartment() {
        if (!this.flagEdit) {
            return;
        }
        this.bacgHeader = true;
        this._waitClassifSrv.openClassif(OPEN_CLASSIF_DEPARTMENT)
            .then((data: string) => {
                this.dueForLink = data;
                return this._userParamsSetSrv.getDepartmentFromUser([data]);
            }).then(data => {
                this.bacgHeader = false;
                if (data) {
                    this.form.controls['rec.RESOLUTION_CONTROLLER'].patchValue(String(this.dueForLink));
                    this.form.controls['rec.CONTROLL_AUTHOR'].patchValue(String(data[0]['CLASSIF_NAME']));
                    this.controller = true;
                }
            })
            .catch(error => {
                this.bacgHeader = false;
            });
    }

    getNameSortCabinets(): Promise<any> {
        const user = this._userParamsSetSrv.userContextId;
        const query = {
            USER_LISTS: {
                criteries: {
                    ISN_LCLASSIF: String(user),
                    CLASSIF_ID: '105'
                }
            },
        };
        return this._pipRx.read(query);
    }
    setTab(i: number) {
        this.currTab = i;
    }

    ngOnDestroy() {
        this._ngUnsubscribe.next();
        this._ngUnsubscribe.complete();
    }
    submit(): Promise<any> {
        if (this.mapChanges.size) {
            const query = this.parseMapForCreate();
            return this._pipRx.batch(query, '').then(() => {
                this._pushState();
                this.prepFormForSave();
                this.FOLDERCOLORSTATUS = this.newFolderString;
                this.btnDisable = true;
                this.flagEdit = false;
                this.editMode();
                this._msg.addNewMessage(this.createMessage('success', '', 'Изменения сохранены'));
            }).catch((error) => {
                console.log(error);
            });
        } else {
            return Promise.resolve(false);
        }
    }
    prepFormForSave() {
        Object.keys(this.inputs).forEach((key) => {
            const value = this.form.controls[key].value;
            this.inputs[key].value = value;
        });
    }
    parseMapForCreate(): Array<any> {
        const arrayQuery = [];
        this.disableUrlCreate1(arrayQuery);
        this.disableUrlCreate2(arrayQuery);
        this.createUrl(arrayQuery);
        this.mapChanges.clear();
        return arrayQuery;
    }
    createUrl(arrayQuery) {
        this.mapChanges.forEach((value, key, arr) => {
            if (
                key === 'ADD_JOURNAL_RESOL_AUTHOR' ||
                key === 'ADD_JOURNAL_CONTROLLER' ||
                key === 'ADD_JOURNAL_RESOL_REPLY' ||
                key === 'SHOW_REPLY_READED' ||
                key === 'SHOW_REPLY_NOTE' ||
                key === 'PLAN_DATE_PARENT' ||
                key === 'CORRECT_CTRL_DATE' ||
                key === 'PARENT_RESOLUTION_TEXT') {
                const val = value ? 1 : 0;
                arrayQuery.push(this.createReq(key, val));
            } else if (key === 'ADD_ADRESS_REPORGANIZ') {
                const val = value ? 0 : 1;
                arrayQuery.push(this.createReq(key, val));
            } else {
                if (key !== 'CONTROLL_AUTHOR') {
                    const val = this.checkTypeValue(value);
                    arrayQuery.push(this.createReq(key, val));
                }
            }
        });
    }
    checkTypeValue(value) {
        if (typeof value === 'boolean') {
            if (value) {
                return 'YES';
            } else {
                return 'NO';
            }
        } else {
            return value;
        }
    }
    disableUrlCreate1(arrayQuery) {
        const val1 = this.form.controls['rec.HILITE_RESOLUTION_BOOLEAN'].value;
        if (val1) {
            const incr = this.form.controls['rec.HILITE_RESOLUTION'].value;
            if (String(incr).trim() === '') {
                this.form.controls['rec.HILITE_RESOLUTION'].patchValue(0, { emitEvent: false });
                arrayQuery.push(this.createReq('HILITE_RESOLUTION', 0));
            } else {
                arrayQuery.push(this.createReq('HILITE_RESOLUTION', incr));
            }
        } else {
            arrayQuery.push(this.createReq('HILITE_RESOLUTION', ''));
            this.form.controls['rec.HILITE_RESOLUTION'].patchValue('', { emitEvent: false });
        }
        this.mapChanges.delete('HILITE_RESOLUTION_BOOLEAN');
        this.mapChanges.delete('HILITE_RESOLUTION');
    }
    disableUrlCreate2(arrayQuery) {
        const val1 = this.form.controls['rec.HILITE_PRJ_RC_BOOLEAN'].value;
        if (val1) {
            const incr = this.form.controls['rec.HILITE_PRJ_RC'].value;
            if (String(incr).trim() === '') {
                this.form.controls['rec.HILITE_PRJ_RC'].patchValue(0, { emitEvent: false });
                arrayQuery.push(this.createReq('HILITE_PRJ_RC', 0));
            } else {
                arrayQuery.push(this.createReq('HILITE_PRJ_RC', incr));
            }
        } else {
            arrayQuery.push(this.createReq('HILITE_PRJ_RC', ''));
            this.form.controls['rec.HILITE_PRJ_RC'].patchValue('', { emitEvent: false });
        }
        this.mapChanges.delete('HILITE_PRJ_RC_BOOLEAN');
        this.mapChanges.delete('HILITE_PRJ_RC');
    }


    createReq(name: string, value: any): any {
        return {
            method: 'MERGE',
            requestUri: `USER_CL(${this._userParamsSetSrv.userContextId})/USER_PARMS_List(\'${this._userParamsSetSrv.userContextId} ${name}\')`,
            data: {
                PARM_VALUE: `${value}`
            }
        };
    }
    cancel($event?) {
        this.flagEdit = false;
        this.prepFormCancel(this.inputs, false);
        this.newFolderString = this.FOLDERCOLORSTATUS;
        this.mapChanges.clear();
        this.btnDisable = true;
        this.flagEdit = false;
        this.editMode();
    }

    prepFormCancel(input, flag) {
        Object.keys(input).forEach((key) => {
            const val = input[key].value;
            this.form.controls[key].patchValue(val, { emitEvent: flag });
        });
    }
    edit($event) {
        this.flagEdit = $event;
        this.editMode();
        this.checkDataToDisabled();
    }
    close(event) {
        this.flagEdit = event;
        this._router.navigate(['user_param', JSON.parse(localStorage.getItem('lastNodeDue'))]);
    }
    editMode() {
        if (this.flagEdit) {
            this.form.enable({ emitEvent: false });
        } else {
            this.form.disable({ emitEvent: false });
        }
    }
    default(event?) {
        this.prepareData = {};
        this.prepareInputs = {};
        const prep = this.getObjQueryInputsFieldForDefault(this.queryparams());
        return this._pipRx.read(prep)
            .then((data: USER_PARMS[]) => {
                this.controller = false;
                this.prepareData = this.formHelp.parse_Create(CABINETS_USER.fields, this.createhash(data));
                this.prepareInputs = this.formHelp.getObjectInputFields(CABINETS_USER.fields);
                this.defoltInputs = this.dataConv.getInputs(this.prepareInputs, { rec: this.prepareData });
                this.defoltInputs['rec.ADD_ADRESS_REPORGANIZ'].value = !this.defoltInputs['rec.ADD_ADRESS_REPORGANIZ'].value;
                this.prepFormCancel(this.defoltInputs, true);
            })
            .catch(err => {
                console.log(err);
            });
    }
    getObjQueryInputsFieldForDefault(inputs: Array<any>) {
        return {
            USER_PARMS: {
                criteries: {
                    PARM_NAME: inputs.join('||'),
                    ISN_USER_OWNER: '-99'
                }
            }
        };
    }
    createhash(data: USER_PARMS[]) {
        const a = {};
        data.forEach((el: USER_PARMS) => {
            a[el.PARM_NAME] = el.PARM_VALUE;
        });
        return a;
    }
    queryparams() {
        const arraQlist = [];
        CABINETS_USER.fieldsDefaultValue.forEach(el => {
            arraQlist.push(el.key);
        });
        return arraQlist;
    }
    createMessage(type, title, msg) {
        return {
            type: type,
            title: title,
            msg: msg,
            dismissOnTimeout: 6000,
        };
    }
    private _pushState () {
        this._userParamsSetSrv.setChangeState({isChange: this.btnDisable || this.MaxIncrement, disableSave: this.MaxIncrement});
      }
}
