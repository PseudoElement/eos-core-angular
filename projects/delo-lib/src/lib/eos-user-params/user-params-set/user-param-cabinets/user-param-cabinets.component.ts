import { Component, OnDestroy, OnInit, Input, Output, EventEmitter/* , ViewChild */ } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router, ActivatedRoute, RouterStateSnapshot } from '@angular/router';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FormHelperService } from '../../shared/services/form-helper.services';
import { UserParamsService } from '../../shared/services/user-params.service';
import {
    // @task163710
    // CABINETS_USER_INFORMER,
    CABINETS_USER_NOTIFICATOR,
    SEND_ORDER_TO_FOR_ARM,
    CABINETS_USER_FOLDERS, 
    CABINETS_USER_ASSIGMENTS
} from '../shared-user-param/consts/cabinets.consts';
import { EosDataConvertService } from '../../../eos-dictionaries/services/eos-data-convert.service';
import { InputControlService } from '../../../eos-common/services/input-control.service';
import { WaitClassifService } from '../../../app/services/waitClassif.service';
import { AppContext, PipRX, USER_PARMS } from '../../../eos-rest';
import { EosMessageService } from '../../../eos-common/services/eos-message.service';
import { ErrorHelperServices } from '../../shared/services/helper-error.services';
import { RECENT_URL } from '../../../app/consts/common.consts';
import { EosStorageService } from '../../../app/services/eos-storage.service';
// import { CabinetsInformerComponent } from './cabinets-informer/cabinets-informer.component';
import { IUserSettingsModes } from '../../../eos-user-params/shared/intrfaces/user-params.interfaces';
declare function notifyOpener();

@Component({
    selector: 'eos-user-param-cabinets',
    templateUrl: 'user-param-cabinets.component.html',
    providers: [FormHelperService]
})

export class UserParamCabinetsComponent implements OnDestroy, OnInit {
    @Input() defaultTitle: string;
    @Input() defaultUser: any;
    @Input() mainUser?;
    @Input() openingTab: number = 0;
    @Input() appMode: IUserSettingsModes;
    @Input() isCurrentSettings?: boolean;

    @Output() DefaultSubmitEmit: EventEmitter<any> = new EventEmitter();
    // @ViewChild('informerTabEl') informerTabRef: CabinetsInformerComponent;
    // @ViewChild('defaultNotificatorEl') defaultNotificatorRef: CabinetsInformerComponent;
    userId: string;
    isChanged: boolean;
    prepInputsAttach;
    public bacgHeader: boolean;
    public dueForLink: string;
    public controller: boolean;
    public flagEdit: boolean = false;
    public prepareData;
    public prepareInputs;
    public defoltInputs;
    public inputs;
    public form: FormGroup;
    public currTab: number = 0;
    public allData;
    public mapChanges = new Map();
    public FOLDERCOLORSTATUS = '';
    public newFolderString = '';
    public creatchesheDefault;
    public currentUser;
    public isInformer: boolean = false;
    public logDeletController: boolean = false;
    placementForTooltip: string = 'bottom';
    public lastTabs: string[] = ['Информер', 'Оповещатель'];
    public fieldGroupsForCabinets: string[] = ['Папки', 'Поручения'];
    readonly fieldsKeys: Map<string, number> = new Map([
        ['FOLDERCOLORSTATUS_RECEIVED', 0],
        ['FOLDERCOLORSTATUS_FOR_EXECUTION', 1], 
        ['FOLDERCOLORSTATUS_UNDER_CONTROL', 2], 
        ['FOLDERCOLORSTATUS_HAVE_LEADERSHIP', 3],
        ['FOLDERCOLORSTATUS_FOR_CONSIDERATION', 4], 
        ['FOLDERCOLORSTATUS_INTO_THE_BUSINESS', 5], 
        ['FOLDERCOLORSTATUS_PROJECT_MANAGEMENT', 6],
        ['FOLDERCOLORSTATUS_ON_SIGHT', 7], 
        ['FOLDERCOLORSTATUS_ON_THE_SIGNATURE', 8]
    ]);
    _ngUnsubscribe: Subject<any> = new Subject();
    public btnDisable: boolean = true;

    private newInformerData: Map<string, any> = new Map();
    private newNotificatorData: Map<string, any> = new Map();
    private formInformerError: boolean = false;
    get titleHeader() {
        if (this.currentUser) {
            if (this.currentUser.isTechUser) {
                return this.defaultTitle ? 'Кабинеты по умолчанию' : this.currentUser.CLASSIF_NAME + '- Кабинеты';
            }
            return this.defaultTitle ? 'Кабинеты по умолчанию' : `${this.currentUser['DUE_DEP_SURNAME']} - Кабинеты`;
        }
        return '';
    }
    get isnClassif() {
        return this.currentUser && this.currentUser['ISN_LCLASSIF'];
    }
    constructor(
        private _userParamsSetSrv: UserParamsService,
        private formHelp: FormHelperService,
        private dataConv: EosDataConvertService,
        private inpSrv: InputControlService,
        private _router: Router,
        private _snap: ActivatedRoute,
        private _waitClassifSrv: WaitClassifService,
        private _pipRx: PipRX,
        private _msg: EosMessageService,
        private _errorSrv: ErrorHelperServices,
        private _storageSrv: EosStorageService,
        public appContext: AppContext
    ) {
        if (this.appContext.cbBase) {
            CABINETS_USER_FOLDERS.fields.push({
                key: 'CBR_LIST_STYLE',
                type: 'radio',
                title: 'Представление перечней документов и проектов:',
                options: [
                    {value: '1', title: 'Лента'},
                    {value: '2', title: 'Таблица'},
                ]
            });
            CABINETS_USER_FOLDERS.fieldsDefaultValue.push({
                key: 'CBR_LIST_STYLE',
                type: '',
                title: '',
            });
        }
        this._snap.queryParams
        .pipe(
            takeUntil(this._ngUnsubscribe)
        )
        .subscribe((data: Object) => {
            if (data.hasOwnProperty('BackCabinets')) {
                this.currTab = 1;
            }
        });
        this._userParamsSetSrv.canDeactivateSubmit$
            .pipe(
                takeUntil(this._ngUnsubscribe)
                )
            .subscribe((rout: RouterStateSnapshot) => {
                this._userParamsSetSrv.submitSave = this.submit();
            });
    }
    ngOnInit() {
        this.onResize();
        this.flagEdit = !!this.isCurrentSettings;
        if (this.openingTab && Number(this.openingTab) && Number(this.openingTab) <= this.fieldGroupsForCabinets.length) {
            this.currTab = Number(this.openingTab) - 1;
        }
        if (this.defaultTitle) {
            this.currentUser = this.defaultUser;
            this.allData = this.defaultUser;
        }
        this.init()
        .catch(error => {});
    }
    init(reload?): Promise<any> {
        if (this.defaultTitle) {
            if (reload) {
                const prep = this.formHelp.getObjQueryInputsField();
                return this._pipRx.read(prep).then((data) => {
                    const defUser = this.formHelp.createhash(data);
                    this.currentUser = defUser;
                    this.allData = defUser;
                    return this.initForm(reload);
                });
            }
            return this.initForm();
        }
        const config = {expand: 'USER_PARMS_List'};
        if (this.mainUser) {
            config['isn_cl'] = this.mainUser;
        }
        return this._userParamsSetSrv.getUserIsn(config)
        .then(() => {
            this.currentUser = this._userParamsSetSrv.curentUser;
            this.allData = this._userParamsSetSrv.hashUserContext;
            return this.initForm(reload);
        });
    }
    initForm(reload?): Promise<any> {
        this.defineLastTab();
        if (!reload && this.openingTab && Number(this.openingTab) && Number(this.openingTab) <= this.fieldGroupsForCabinets.length) {
            this.currTab = Number(this.openingTab) - 1;
        }
        this.pretInputs();
        this.parseInputsFromString(this.inputs, this.allData['FOLDERCOLORSTATUS']);
        this.patchInputValue();
        this.form = this.inpSrv.toFormGroup(this.inputs);
        this.editMode();
        this.formSubscriber();
        return Promise.all([this.getControlAuthor(), this.getNameSortCabinets(), this.getProjectResolution()]).then(([author, sort, projectResol]) => {
            if (author && author[0]) {
                this.logDeletController = Boolean(author[0]['DELETED']);
            } else {
                this.logDeletController = false;
            }
            [...CABINETS_USER_FOLDERS.fields, ...CABINETS_USER_ASSIGMENTS.fields].map(fields => {
                if (fields.key === 'CABSORT_ISN_DOCGROUP_LIST') {
                    fields.options.splice(1, fields.options.length);
                    sort.forEach(element => {
                        fields.options.push({
                            value: element.ISN_LIST,
                            title: element.NAME
                        });
                    });
                }
            });
            if (author) {
                this.form.controls['rec.CONTROLL_AUTHOR'].patchValue(String(author[0]['CLASSIF_NAME']), { emitEvent: false });
            }
            if (projectResol) {
                this.inputs['rec.RESPRJ_PRIORITY_DEFAULT'].options = [];
                projectResol.forEach((opt) => {
                    this.inputs['rec.RESPRJ_PRIORITY_DEFAULT'].options.push({value: opt['ISN_LCLASSIF'], title: opt['CLASSIF_NAME']});
                });
            }
        });
    }

    pretInputs(): void {
        if (this.appMode.arm) {
            const index = CABINETS_USER_ASSIGMENTS.fields.findIndex(field => {
                if (field.key === 'SEND_ORDER_TO') {
                    this.allData.SEND_ORDER_TO = this.allData.SEND_ORDER_TO === '2' ? 'YES' : 'NO';
                    return true;
                }
            });
            if (index !== -1) {
                CABINETS_USER_ASSIGMENTS.fields[index] = {...SEND_ORDER_TO_FOR_ARM};
            }
        }
        this.FOLDERCOLORSTATUS = this.allData['FOLDERCOLORSTATUS'];
        this.newFolderString = this.FOLDERCOLORSTATUS;
        this.prepareData = this.formHelp.parse_Create([...CABINETS_USER_FOLDERS.fields, ...CABINETS_USER_ASSIGMENTS.fields], this.allData);
        this.prepareInputs = this.formHelp.getObjectInputFields([...CABINETS_USER_FOLDERS.fields, ...CABINETS_USER_ASSIGMENTS.fields]);
        this.inputs = this.dataConv.getInputs(this.prepareInputs, { rec: this.prepareData });
        this.inputs['rec.ADD_ADRESS_REPORGANIZ'].value = !Boolean(+this.inputs['rec.ADD_ADRESS_REPORGANIZ'].value);
    }

    parseInputsFromString(inputs, folderString) {
        this.fieldsKeys.forEach((val, key, arr) => {
            inputs['rec.' + key].value = this.getValueForString(val, folderString);
        });
    }
    getValueForString(val, folderString): boolean {
        return folderString.charAt(val) === '1' ? true : false;
    }
    patchInputValue(Defaultdata?: any, Defaultinp?: any) {
        if (Defaultinp !== undefined && Defaultdata !== undefined) {
            if (this._userParamsSetSrv.getParmValueByParmName(Defaultdata, 'HILITE_PRJ_RC') === null) {
                Defaultinp['rec.HILITE_PRJ_RC_BOOLEAN'].value = false;
            } else {
                Defaultinp['rec.HILITE_PRJ_RC_BOOLEAN'].value = true;
            }
            if (this._userParamsSetSrv.getParmValueByParmName(Defaultdata, 'HILITE_RESOLUTION') === null) {
                Defaultinp['rec.HILITE_RESOLUTION_BOOLEAN'].value = false;
            } else {
                Defaultinp['rec.HILITE_RESOLUTION_BOOLEAN'].value = true;
            }
            return Defaultinp;
        } else {
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
    }
    formSubscriber() {
        this.form.valueChanges
        .pipe(
            takeUntil(this._ngUnsubscribe)
        )
        .subscribe(data => {
            this.checkTouch(data);
        });
    }
    routeSubscriber() {
        this._snap.queryParams
        .pipe(
            takeUntil(this._ngUnsubscribe)
        )
        .subscribe((data: Object) => {
            if (data.hasOwnProperty('BackCabinets')) {
                this.currTab = 1;
            }
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
        if (countError > 0 || this.mapChanges.size || this.newInformerData.size || (this.newNotificatorData.size && this.defaultTitle)) {
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
        if (/^([1-9][0-9]{0,4}|\s*)$/.test(String(data))) {
            val = true;
        } else {
            val = false;
        }
        return val;
    }

    changeIncrementAttach(data, data1): boolean {
        let val: boolean = false;
        if (/^(-\d{1,2}|[1-9](\d{1,2})?|0|\s*)$/.test(String(data)) && /^(-\d{1,2}|[1-9](\d{1,2})?|0|\s*)$/.test(String(data1))) {
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
        /* this.formInformerError ошибки в форме информера и оповещения true если есть ошибки, false если ошибок нет */
        if (!this.formInformerError && (bool1 && bool2) ) {
            return false;
        } else {
            return true;
        }
    }
    get getClass() {
        const val = this.form.controls['rec.CONTROLL_AUTHOR'].value;
        return val !== '' && String(val) !== 'null' && this.flagEdit ? 'eos-adm-icon eos-adm-icon-info-blue small' : 'eos-adm-icon eos-adm-icon-info-grey small';
    }
    get getClassClearBtn() {
        const val = this.form.controls['rec.CONTROLL_AUTHOR'].value;
        return val !== '' && String(val) !== 'null' && this.flagEdit ? 'eos-adm-icon eos-adm-icon-close-blue small' : 'eos-adm-icon eos-adm-icon-close-grey small';
    }
    getControlAuthor(): Promise<any> {
        const ControlAuthor = this.form.controls['rec.RESOLUTION_CONTROLLER'].value;
        this.dueForLink = ControlAuthor;
        if (String(ControlAuthor) === 'null' || String(ControlAuthor) === '') {
            this.controller = false;
            return Promise.resolve(false);
        } else {
            this.controller = true;
            return this._userParamsSetSrv.getDepartmentFromUser([ControlAuthor]);
        }
    }
    showInfoUser() {
        this._storageSrv.setItem(RECENT_URL, this._router.url + '?BackCabinets=true');
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
        const param = {
            classif: 'DEPARTMENT',
            return_due: true,
            id: '0.',
            skipDeleted: true,
            selectMulty: false,
            selectLeafs: true,
            selectNodes: false,
        };
        this._waitClassifSrv.openClassif(param)
            .then((data: string) => {
                this.dueForLink = data;
                return this._userParamsSetSrv.getDepartmentFromUser([data]);
            }).then(data => {
                this.bacgHeader = false;
                if (data) {
                    this.form.controls['rec.RESOLUTION_CONTROLLER'].patchValue(String(this.dueForLink));
                    this.form.controls['rec.CONTROLL_AUTHOR'].patchValue(String(data[0]['CLASSIF_NAME']));
                    this.controller = true;
                    if (Array.isArray(data) && data.length > 0) {
                        this.logDeletController = Boolean(data[0]['DELETED']);
                    } else if (typeof(data) === 'object') {
                        this.logDeletController = Boolean(data['DELETED']);
                    }
                }
            })
            .catch(error => {
                this.bacgHeader = false;
            });
    }

    getNameSortCabinets(): Promise<any> {
        let user;
        this.defaultTitle ? user = `-99` : user =  this._userParamsSetSrv.userContextId;
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
    getProjectResolution(): Promise<any[]> {
        const query = {
            RESPRJ_PRIORITY_CL: {
                criteries: {
                    ISN_LCLASSIF: 'isnotnull'
                }
            }
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
        console.log('submit_this.mapChanges', this.mapChanges)
        console.log('submit_this.newInformerData', this.newInformerData)
        console.log('submit_this.newNotificatorData', this.newNotificatorData)
        if (this.MaxIncrement) {
            this._msg.addNewMessage(this.createMessage('warning', '', 'Нельзя сохранить некорректные данные.'));
            return Promise.resolve('error');
        }
        if (this.mapChanges.size || this.newInformerData.size || (this.newNotificatorData.size && this.defaultTitle)) {
            const query = this.parseMapForCreate();
            return this._pipRx.batch(query, '').then(() => {
                this._msg.addNewMessage(this.createMessage('success', '', 'Изменения сохранены'));
                this.ngOnDestroy();
                this.routeSubscriber();
                this.init(true)
                .then(() => {
                    if (!this.isCurrentSettings) {
                        this.btnDisable = true;
                        this.flagEdit = false;
                    }
                    notifyOpener();
                    // this.informerTabRef.submit(this.flagEdit);
                    // if (this.defaultTitle) {
                    //     this.defaultNotificatorRef.submit(this.flagEdit);
                    // }
                    // this._userParamsSetSrv.closeWindowForCurrentSettings(this.isCurrentSettings);
                    this.editMode();
                    this._userParamsSetSrv.setChangeState({ isChange: false, disableSave: this.MaxIncrement });
                    // this._pushState();
                });
            }).catch((error) => {
                this._errorSrv.errorHandler(error);
                this.cancel();
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
        arrayQuery.forEach((query) => {
            if(query.data && query.data['PARM_VALUE']) {
                query.data['PARM_VALUE'] = query.data['PARM_VALUE'] === 'null' ? null : query.data['PARM_VALUE'];
            }
        })
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
                this.defaultUser ? arrayQuery.push(this.createReqDefault(key, val)) : arrayQuery.push(this.createReq(key, val));
            } else if (key === 'ADD_ADRESS_REPORGANIZ') {
                const val = value ? '0' : '1';
                this.defaultUser ? arrayQuery.push(this.createReqDefault(key, val)) : arrayQuery.push(this.createReq(key, val));
            } else if (key === 'SEND_ORDER_TO' && this.appMode.arm) {
                const val = value ? '2' : '1';
                this.defaultUser ? arrayQuery.push(this.createReqDefault(key, val)) : arrayQuery.push(this.createReq(key, val));
            } else if (key === 'APPLY_EDS_RESOLUION_AND_PRJ_RESOLUTION') {
                const val = value ? '1' : '0';
                this.defaultUser ? arrayQuery.push(this.createReqDefault(key, val)) : arrayQuery.push(this.createReq(key, val));
            } else {
                if (key !== 'CONTROLL_AUTHOR') {
                    const val = this.checkTypeValue(value);
                    this.defaultUser ? arrayQuery.push(this.createReqDefault(key, val)) : arrayQuery.push(this.createReq(key, val));
                }
            }
        });
        if (this.defaultTitle) {
            this.newInformerData.forEach((value, key) => {
                arrayQuery.push(this.createReqDefault(key, value));
            });
            this.newNotificatorData.forEach((value, key) => {
                arrayQuery.push(this.createReqDefault(key, value));
            });
        } else {
            this.newInformerData.forEach((value, key) => {
                arrayQuery.push(this.createReq(key, value));
            });
        }
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
                this.defaultUser ? arrayQuery.push(this.createReqDefault('HILITE_RESOLUTION', 0)) : arrayQuery.push(this.createReq('HILITE_RESOLUTION', 0));
            } else {
                this.defaultUser ? arrayQuery.push(this.createReqDefault('HILITE_RESOLUTION', incr)) : arrayQuery.push(this.createReq('HILITE_RESOLUTION', incr));
            }
        } else {
            this.defaultUser ? arrayQuery.push(this.createReqDefault('HILITE_RESOLUTION', '')) : arrayQuery.push(this.createReq('HILITE_RESOLUTION', ''));
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
                this.defaultUser ?  arrayQuery.push(this.createReqDefault('HILITE_PRJ_RC', 0)) :  arrayQuery.push(this.createReq('HILITE_PRJ_RC', 0));
            } else {
                this.defaultUser ?  arrayQuery.push(this.createReqDefault('HILITE_PRJ_RC', incr)) :  arrayQuery.push(this.createReq('HILITE_PRJ_RC', incr));
            }
        } else {
            this.defaultUser ?  arrayQuery.push(this.createReqDefault('HILITE_PRJ_RC', '')) :  arrayQuery.push(this.createReq('HILITE_PRJ_RC', ''));
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
    createReqDefault(name: string, value: any): any {
        return {
            method: 'MERGE',
            requestUri: `SYS_PARMS(-99)/USER_PARMS_List('-99 ${name}')`,
            data: {
                PARM_VALUE: `${value}`
            }
        };
    }
    cancel($event?) {
        this.ngOnDestroy();
        this._userParamsSetSrv.closeWindowForCurrentSettings(this.isCurrentSettings);
        this.routeSubscriber();
        this.init(true)
        .then(() => {
            this.mapChanges.clear();
            this.btnDisable = true;
            this.flagEdit = false;
            // this.informerTabRef.cancel(this.flagEdit);
            // if (this.defaultTitle) {
            //     this.defaultNotificatorRef.cancel(this.flagEdit);
            // }
            this.editMode();
            this._pushState();
        });
    }
    prepFormCancel(input, flag) {
        Object.keys(input).forEach((key) => {
            const val = input[key].value;
            this.form.controls[key].patchValue(val, { emitEvent: flag });
        });
    }
    edit($event) {
        this.flagEdit = $event;
        // this.informerTabRef.edit(this.flagEdit);
        // if (this.defaultTitle) {
        //     this.defaultNotificatorRef.edit(this.flagEdit);
        // }
        this.editMode();
        this.checkDataToDisabled();
    }
    editMode() {
        if (this.flagEdit) {
            this.form.enable({ emitEvent: false });
        } else {
            this.form.disable({ emitEvent: false });
        }
    }

    getCurentTabDefaultFields(tab: number) {
        switch (tab) {
            case 0: {
                return CABINETS_USER_FOLDERS;
            }
            case 1: {
                return CABINETS_USER_ASSIGMENTS;
            }
            /* @task163710
            case 2: {
                return this.fieldGroupsForCabinets[2] === 'Информер' ?
                            this.isInformer && CABINETS_USER_INFORMER :
                            CABINETS_USER_NOTIFICATOR;
            }
            case 3: {
                return CABINETS_USER_NOTIFICATOR;
            }
           */
        }
    }

    default(event?) {
        this.prepareData = {};
        this.prepareInputs = {};
        const curTabParams = this.formHelp.queryparams(this.getCurentTabDefaultFields(this.currTab), 'fieldsDefaultValue');
        const prep = this.formHelp.getObjQueryInputsFieldForDefault(curTabParams);
        return this._pipRx.read<USER_PARMS>(prep)
            .then((data: USER_PARMS[]) => {
                this.controller = false;
                this.creatchesheDefault = this.formHelp.createhash(data);
                switch (this.currTab) {
                    case 0: {
                        this.parseDefaultFields(CABINETS_USER_FOLDERS.fields, data);
                        this.defoltInputs = this.patchInputValue(data, this.defoltInputs);
                        this.parseInputsFromString(this.defoltInputs, this.creatchesheDefault['FOLDERCOLORSTATUS']);
                        this.checkDataToDisabled();
                        this.prepFormCancel(this.defoltInputs, true);
                        return;
                    }
                    case 1: {
                        this.parseDefaultFields(CABINETS_USER_ASSIGMENTS.fields, data);
                        this.defoltInputs['rec.ADD_ADRESS_REPORGANIZ'].value = !Boolean(+this.defoltInputs['rec.ADD_ADRESS_REPORGANIZ'].value);
                        this.prepFormCancel(this.defoltInputs, true);
                        this.getControlAuthor().then((author) => {
                            if (author === false) {
                                this.form.controls['rec.CONTROLL_AUTHOR'].patchValue('', { emitEvent: false });
                            } else {
                                this.form.controls['rec.CONTROLL_AUTHOR'].patchValue(String(author[0]['CLASSIF_NAME']), { emitEvent: false });
                            }
                        });
                        return;
                    }
                    case 2: {
                        // this.informerTabRef.default(this.creatchesheDefault);
                        return;
                    }
                    case 3: {
                        this.parseDefaultFields(CABINETS_USER_NOTIFICATOR.fields, data);
                        this.prepFormCancel(this.defoltInputs, true);
                        return;
                    }
                }
            })
            .catch(err => {
                console.log(err);
            });
    }

    parseDefaultFields(fields, data) {
        this.prepareData = this.formHelp.parse_Create(fields, this.creatchesheDefault);
        this.prepareInputs = this.formHelp.getObjectInputFields(fields);
        this.defoltInputs = this.dataConv.getInputs(this.prepareInputs, { rec: this.prepareData });
    }
    createMessage(type, title, msg) {
        return {
            type: type,
            title: title,
            msg: msg,
            dismissOnTimeout: 6000,
        };
    }
    public emitInformerChanges(event): void {
        if (event.data && event.data.size) {
            this.newInformerData = event.data;
        } else {
            this.newInformerData.clear();
        }
        const emptyObj = {};
        this.checkTouch(emptyObj);
    }
    public emitNotificatorChanges(event): void {
        if (event.data && event.data.size) {
            this.newNotificatorData = event.data;
        } else {
            this.newNotificatorData.clear();
        }
        const emptyObj = {};
        this.checkTouch(emptyObj);
    }
    public emitErrorInformer($event: boolean) {
        this.formInformerError = $event;
    }
    onResize(event?) {
        if (this.isCurrentSettings) {
            if (event) {
                this.placementForTooltip = event.currentTarget.innerWidth > 1250 ? 'bottom' : 'left';
            } else {
                this.placementForTooltip = window.innerWidth > 1250 ? 'bottom' : 'left';
            }
        }

    }

    private defineLastTab() {
        if (!this.appMode || this.appMode.arm || this.appMode.cbr) {
            return;
        }
        /* @task163710
        if (this.defaultTitle) {
            this.isInformer = true;
            if (this.fieldGroupsForCabinets.length < 4) {
                this.fieldGroupsForCabinets = [...this.fieldGroupsForCabinets, ...this.lastTabs];
            }
        } else {
            this.isInformer = this.currentUser['AV_SYSTEMS'][26] === '1';
            /* @task163710
            if (this.fieldGroupsForCabinets.length < 3) {
                const tabName = this.isInformer ? this.lastTabs[0] : this.lastTabs[1];
                this.fieldGroupsForCabinets.push(tabName);
                console.log(this.fieldGroupsForCabinets);
            }
        }
     */

    }

    private _pushState() {
        this._userParamsSetSrv.setChangeState({ isChange: !this.btnDisable || this.MaxIncrement, disableSave: this.MaxIncrement });
    }
}
