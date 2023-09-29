import { Component, Output, EventEmitter, OnInit, OnDestroy, ViewChild, ElementRef, ChangeDetectorRef, Inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router, UrlSegment } from '@angular/router';

import { combineLatest, Subject, Subscription } from 'rxjs';
import { takeUntil, debounceTime } from 'rxjs/operators';

import { InputParamControlService } from '../../../eos-user-params/shared/services/input-param-control.service';
import { CREATE_USER_INPUTS, OPEN_CLASSIF_DEPARTMENT, OPEN_CLASSIF_USER_CL } from '../../../eos-user-select/shered/consts/create-user.consts';
import { WaitClassifService } from '../../../app/services/waitClassif.service';
import { PipRX, DEPARTMENT, USER_CL, LIST_ITEMS } from '../../../eos-rest';
import { UserSettingsService } from '../../../eos-rest/services/user-settings.service';

import { EosMessageService } from '../../../eos-common/services/eos-message.service';
import { IMessage, IOpenClassifParams } from '../../../eos-common/interfaces';
import { RestError } from '../../../eos-rest/core/rest-error';
import { UserParamsService } from '../../../eos-user-params/shared/services/user-params.service';
import { UserParamApiSrv } from '../../../eos-user-params/shared/services/user-params-api.service';
import { AppContext } from '../../../eos-rest/services/appContext.service';
import { ErrorHelperServices } from '../../../eos-user-params/shared/services/helper-error.services';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { DOCUMENT } from '@angular/common';

const EMPTY_SEARCH_DL_RESULTS: string = 'Ничего не найдено';
@Component({
    selector: 'eos-param-create-user',
    templateUrl: 'createUser.component.html',
    styleUrls: ['create-windows-cb.scss'],
    providers: [BsModalService],
})
export class CreateUserComponent implements OnInit, OnDestroy {
    @Output() closedModal = new EventEmitter();
    @ViewChild('templatePassword', { static: true }) templatePassword: ElementRef;
    @ViewChild('classifName') classifName: any;
    @ViewChild('SURNAME_PATRON') SURNAME_PATRON;
    @ViewChild('NOTE') NOTE;
    @ViewChild('OS') OS: ElementRef;

    modalRef: BsModalRef;
    isLoading: boolean = true;
    data = {};
    fields = CREATE_USER_INPUTS;
    inputs;
    form: FormGroup;
    titleHeader = 'Новый пользователь';
    btnDisabled: boolean = true;
    isShell: Boolean = false;
    initDue: string;
    departmentData: DEPARTMENT;
    initLogin: string;
    title: string;
    techUser: boolean = false;
    isn_prot: any;
    titleNow: string;
    enterPassword: boolean = false;
    password: string = '';
    repitedPassword: string = '';
    cbBase: boolean;
    loginMaxLength: number = 256;
    techUserTooltip: string = 'К техническим пользователям невозможно привязать должностное лицо';
    type = 'password';
    type_repeat = 'password';
    private ngUnsubscribe: Subject<any> = new Subject();
    private subscriptions: Subscription[] = [];
    private typesUsers = new Map()
        // .set(-1, 'Без права входа в систему')
        .set(0, 'Имя и пароль в БД')
        .set(1, 'ОС - аутентификация')
        .set(2, 'Пользователь в БД')
        .set(3, 'Имя и пароль')
        .set(4, 'ОС - аутентификация на сервере');
    private typesUsersValues2 = new Map()
        // .set(-1, '-1')
        .set(0, '0')
        .set(1, '1')
        .set(2, '2')
        .set(3, '3')
        .set(4, '4');

    private _idsForModalDictDep: string[] = [];
    private _defaultDepDue: string;
    private _sysParamsDueOrganiz: string = undefined;
    private _depDueLinkOrg: string = undefined;
    private _searchLexem: string = '';
    private osChecked: boolean;
    public department = {
        NOTE: null,
        TECH_DUE_DEP: null
    };

    constructor(
        public _apiSrv: UserParamApiSrv,
        private _userParamSrv: UserParamsService,
        private _msgSrv: EosMessageService,
        private _router: Router,
        private _inputCtrlSrv: InputParamControlService,
        private _waitClassifSrv: WaitClassifService,
        private _pipeSrv: PipRX,
        private _appContext: AppContext,
        private _errorSrv: ErrorHelperServices,
        private modalService: BsModalService,
        private changeDetection: ChangeDetectorRef,
        private _userSettingsService: UserSettingsService,
        @Inject(DOCUMENT) private readonly documentRef: Document,
    ) { }

    get validPassword() {
        return this.password.length && (this.password === this.repitedPassword);
    }

    get isTechUser() {
        return this.form.get('teсhUser').value;
    }

    get disabledSubmit() {
        if (this.cbBase) {
            if (this.form && (this.form.controls['classifName'].value.trim() === '' || this.form.controls['SURNAME_PATRON'].value.trim() === '')) {
                if (this.form && (this.form.controls['classifName'].value).trim() === '') {
                    this.form.get('classifName').setErrors({ errorPattern: true });
                }
                if (this.form.controls['SURNAME_PATRON'].value.trim() === '') {
                    this.form.get('SURNAME_PATRON').setErrors({ errorPattern: true });
                }
                return true;
            }
            return false
        } else {
            if (this.form && (this.form.controls['classifName'].value).trim() === '') {
                this.form.get('classifName').setErrors({ errorPattern: true });
            }
            return this.btnDisabled || this.form.get('classifName').invalid;
        }
    }

    get checkUnreadFlag(): boolean {
        if (this.departmentData) {
            return !!this.departmentData.UNREAD_FLAG;
        }
    }

    ngOnInit() {
        this.cbBase = this._appContext.cbBase;
        this.inputs = this._inputCtrlSrv.generateInputs(this.fields);
        this.inputs['SELECT_ROLE'].options = [];
        this.inputs['DUE_DEP_NAME'].options = [];
        this.isLoading = true;
        const query1 = this._pipeSrv.read({
            USER_PARMS: {
                criteries: {
                    ISN_USER_OWNER: '-99',
                    PARM_NAME: 'CATEGORIES_FOR_USER|SUPPORTED_USER_TYPES'
                }
            }
        });
        const query2 = this._pipeSrv.read({
            USER_LISTS: {
                criteries: {
                    ISN_LCLASSIF: '-99',
                    NAME: '$USERTEMPLATES',
                    CLASSIF_ID: '104',
                    LIST_KIND: '1'
                }
            }, expand: 'LIST_ITEMS_List'
        });
        Promise.all([query1, query2])
            .then(([data, list]) => {
                let roles = [];
                let types: string[] = [];
                data.forEach((d) => {
                    if (d['PARM_NAME'] === 'CATEGORIES_FOR_USER') {
                        roles = d['PARM_VALUE'].split(';');
                    }
                    if (d['PARM_NAME'] === 'SUPPORTED_USER_TYPES') {
                        types = d['PARM_VALUE'].split(',');
                    }
                });
                const index = types.indexOf('-1');
                if (index !== -1) {
                    types.splice(index, 1);
                }
                const defaultTypes = types[0] ? types[0] : '0';
                let isnDepartments,
                    listI: LIST_ITEMS[],
                    mapDep: Map<number, any>;
                if (list.length && list[0]['LIST_ITEMS_List'].length) {
                    listI = list[0]['LIST_ITEMS_List'];
                    isnDepartments = listI.map(_l => _l.REF_ISN);
                    mapDep = new Map();
                    this.loadUsersTemplats(isnDepartments, mapDep).then(_users => {
                        const options = [{ title: '...', value: '', disabled: false }];
                        listI.forEach(_l => {
                            const { userId } = mapDep.get(_l.REF_ISN);
                            options.push({ title: _l.NOTE, value: userId, disabled: userId === 'not_user' });
                        });
                        this.inputs['USER_TEMPLATES'].options = options;
                    });
                }
                roles.forEach(i => {
                    this.inputs['SELECT_ROLE'].options.push({ title: i, value: i });
                });
                this.inputs['USER_TYPE'].options = [{ title: '...', value: '' }];
                types.forEach(i => {
                    this.inputs['USER_TYPE'].options.push({ title: this.typesUsers.get(+i), value: this.typesUsersValues2.get(+i) });
                });

                this.form = this._inputCtrlSrv.toFormGroup(this.inputs, false);
                if (this.initDue) {
                    this.data['dueDL'] = this.initDue;
                    this._userParamSrv.getDepartmentFromUser([this.initDue]).then((dt) => {
                        this.form.controls['DUE_DEP_NAME'].patchValue(dt[0]['SURNAME'], { emitEvent: false });
                    });
                }
                if (this.initLogin) {
                    this.form.controls['classifName'].patchValue(this.initLogin.substr(0, 12));
                }
                this.form.controls['USER_TYPE'].patchValue(defaultTypes);
                this.form.controls['USER_TEMPLATES'].patchValue('');
                this.isLoading = false;
                this._subscribe();
            })
            .catch(e => {
                this._errorSrv.errorHandler(e);
                this.closedModal.emit();
            });

        this._userSettingsService.readDepartments()
            .then(x => {
                const { sections } = x;
                this._defaultDepDue = this._existsMainFolder(sections) ? this._getDueDepFefault(sections) : '';
                if (this._defaultDepDue.length === 0) {
                    this._pipeSrv.read({
                        DELO_OWNER: 1
                    }).then(org => {
                        if (org.length > 0) {
                            this._sysParamsDueOrganiz = org[0]['DUE_ORGANIZ'];
                            this._readSysParamsOrg();
                        }
                    });
                }
            });
    }

    loadUsersTemplats(params: Array<number>, map: Map<number, any>): Promise<any> {
        const isns = params.join('|');
        return this._pipeSrv.read<DEPARTMENT>({
            DEPARTMENT: {
                criteries: {
                    ISN_NODE: isns
                }
            }
        }).then((_d: DEPARTMENT[]) => {
            return this._pipeSrv.read<USER_CL>({
                USER_CL: {
                    criteries: {
                        DUE_DEP: _d.map(_d1 => _d1['DUE']).join('|')
                    }
                }
            }).then((_users: USER_CL[]) => {
                _d.forEach(department => {
                    const user = _users.filter(_u => _u.DUE_DEP === department.DUE)[0];
                    map.set(department.ISN_NODE, { userId: user ? user.ISN_LCLASSIF : 'not_user' });
                });
            });
        });
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    startSubmit() {
        this.submit().then(() => {
            console.log('ok');
        }).catch(e => {
            this.checkError(e);
        });
    }

    async submit() {
        const _combine = combineLatest([
            this.modalService.onShow,
            this.modalService.onShown,
            this.modalService.onHide,
            this.modalService.onHidden,
        ]).subscribe(() => this.changeDetection.markForCheck());

        if (this.cbBase) {
            this.createUserCB(_combine);
        } else {
            this.createUserDelo(_combine);
        }
    }

    async createUserDelo(_combine: Subscription) {
        if (this.accessCreateUser()) {
            const url = this._createUrlForSop();
            this.btnDisabled = true;
            this.isLoading = true;
            const userType = this.data['USER_TYPE'];
            if (userType === '0' || userType === '3') {
                const objConfig = {
                    ignoreBackdropClick: true,
                    keyboard: false,
                    class: 'gray modal-sm passModal'
                }
                this.enterPassword = true;

                this.subscriptions.push(this.modalService.onHidden.subscribe(async (reason: string) => {
                    this.enterPassword = false;
                    if (this.validPassword) {
                        await this.addUser(url, true);
                    }
                    this.unsubscribe();
                }));

                this.subscriptions.push(_combine);
                this.modalRef = this.modalService.show(this.templatePassword, objConfig);
                this.documentRef.getElementById('inpPass').focus();

            } else if (userType === '2') {
                await this.addUser(url, true);
            } else if (userType === '1' || userType === '4') {

                if (!this.form.controls['classifName'].value.includes('\\')) {
                    const m: IMessage = {
                        type: 'warning',
                        title: 'Предупреждение',
                        msg: 'Имя пользователя не соответствует шаблону для ОС-авторизации.',
                    };
                    this.isLoading = false;
                    this._msgSrv.addNewMessage(m);
                    return;
                }
                await this.addUser(url, true);
            }
        } else {
            const m: IMessage = {
                type: 'warning',
                title: 'Предупреждение',
                msg: 'Укажите пользователя техническим или добавьте должностное лицо',
            };
            this._msgSrv.addNewMessage(m);
        }
    }

    async createUserCB(_combine: Subscription) {
        if (this.OS.nativeElement.checked && !this.form.controls['classifName'].value.includes('\\')) {
            const m: IMessage = {
                type: 'warning',
                title: 'Предупреждение',
                msg: 'Имя пользователя не соответствует шаблону для ОС-авторизации.',
            };
            this._msgSrv.addNewMessage(m);
            return;
        }

        this.osChecked = this.OS.nativeElement.checked;
        const url = this.createUrlForCB();
        await this.addUser(url)
    }

    accessCreateUser(): boolean {
        const d = this.data;
        if (d['dueDL'] === undefined && !this.techUser) {
            return false;
        }
        return true;
    }

    private _createUrlForSop() {
        const d = this.data;
        let url = 'CreateUserCl?';
        url += `classifName='${d['classifName'] ? encodeURI(('' + d['classifName']).toUpperCase()) : ''}'`;
        url += `&dueDL='${d['dueDL'] ? d['dueDL'] : ''}'`;
        url += `&role='${d['SELECT_ROLE'] ? encodeURI(d['SELECT_ROLE']) : ''}'`;
        // url += `&isn_user_copy_from=${isn_user_copy_from}`; // если не выбран пользователь для копирования передаем '0'
        url += `&isn_user_copy_from=0`; // если не выбран пользователь для копирования передаем '0'
        url += `&userType=${d['USER_TYPE'] ? d['USER_TYPE'] : 0}`;
        return url;
    }

    private createUrlForCB() {
        let url = 'CreateUserCl?';
        url += `classifName='${encodeURI(this.form.controls['classifName'].value.toUpperCase())}'`;
        url += `&SURNAME_PATRON=${this.form.controls['SURNAME_PATRON'].value}`
        url += `&role='...'`;

        url += this.department.NOTE ? `&NOTE=${this.department.NOTE}` : '';
        url += this.department.TECH_DUE_DEP ? `&techDue=${this.department.TECH_DUE_DEP}` : '';
        url += `&isn_user_copy_from=0`;
        url += `&userType=${(this.osChecked ? '4' : '3')}`
        return url;
    }

    async addUser(addUrl: string, withLogin: boolean = false) {
        try {
            const createRequest = {
                method: 'POST',
                requestUri: addUrl,
            };

            const id: any = await this._pipeSrv.batch([createRequest], '');
            const isn = Number(id) || id[0].value || id[0].value[0];

            if (withLogin) {
                const changeLoginUrl = this._createUrlChangeLOgin(isn);
                const changeLoginRequest = {
                    method: 'POST',
                    requestUri: changeLoginUrl,
                };
                await this._pipeSrv.batch([changeLoginRequest], '');
            }

            this.afterCreate(isn);
        } catch (e) {
            this.checkError(e);
        }
    };

    private _createUrlChangeLOgin(id: number): string {
        const d = this.data;
        let url = 'ChangeLogin?';
        url += `isn_user=${id}`;
        if (this.cbBase) {
            url += `&userType=${(this.osChecked ? '4' : '3')}`
        } else {
            url += `&userType=${d['USER_TYPE'] ? d['USER_TYPE'] : 0}`;
        }
        url += `&classifName='${d['classifName'] ? encodeURI(('' + d['classifName']).toUpperCase()) : ''}'`;
        if (this.password) {
            url += `&pass='${this.password}'`;
        }
        return url;
    }

    afterCreate(isn: number) {
        const copyId = (this.data['ISN_USER_COPY'] || this.data['USER_TEMPLATES']);
        let promise: Promise<any> = Promise.resolve();
        if (copyId && isn) {
            const request = {
                method: 'POST',
                requestUri: this._createUrlForCopySop(isn, +copyId)
            };
            promise = this._pipeSrv.batch([request], '');
        }
        promise.then(() => {
            this.password = '';
            this.repitedPassword = '';
            this.isn_prot = isn;
            this._userParamSrv.ProtocolService(this.isn_prot, 3);
            this.btnDisabled = false;
            this.isLoading = false;
            this.closedModal.emit();
            if (!this.cbBase) {
                this._router.navigate(['user-params-set'], {
                    queryParams: { isn_cl: isn, is_create: true }
                });
            }

        })
            .catch((e) => {
                this.checkError(e);
                this._userParamSrv.ProtocolService(this.isn_prot, 3);
                this.closedModal.emit();
                if (!this.cbBase) {
                    this._router.navigate(['user-params-set'], {
                        queryParams: { isn_cl: isn, is_create: true }
                    });
                }
            });
    }

    private _createUrlForCopySop(isn: number, copyId: number): string {
        const url = `UserRightsCopy?users=${isn}&user=${copyId}&rights=1010111100`;
        return url;
    }

    checkError(e) {
        const m: IMessage = {
            type: 'danger',
            title: 'Ошибка создания пользователя',
            msg: '',
        };
        if (e instanceof RestError && (e.code === 401 || e.code === 0)) {
            this._errorSrv.errorHandler(e);
            this.closedModal.emit();
        }
        if (e instanceof RestError && e.code === 500) {
            m.msg = e.message || 'Пользователь с таким логином уже существует';
        } else {
            m.msg = e.message ? e.message : e;
        }
        this._msgSrv.addNewMessage(m);
        this.btnDisabled = false;
        this.isLoading = false;
        this.enterPassword = false;
    }

    closeSubModal() {
        this.password = '';
        this.repitedPassword = '';
        this.btnDisabled = false;
        this.isLoading = false;
        this.enterPassword = false;
        this.modalRef.hide();
    }

    unsubscribe() {
        this.subscriptions.forEach((subscription: Subscription) => {
            subscription.unsubscribe();
        });
        this.subscriptions = [];
    }

    cancel() {
        this.closedModal.emit();
    }

    cleanDue() {
        this.form.controls['DUE_DEP_NAME'].patchValue('');
        this.departmentData = null;
        delete this.data['dueDL'];
    }

    cleanDueCopy() {
        this.data['ISN_USER_COPY'] = undefined;
        this.form.get('USER_COPY').patchValue('');
    }

    selectDepartment(status) {
        if (status) {
            this.showDepChoose();
        }
    }

    delSelectUser($event?) {
        if ($event && $event.keyCode === 46 && this.data['ISN_USER_COPY']) {
            this.data['ISN_USER_COPY'] = undefined;
            this.form.get('USER_COPY').patchValue('');
        } else if (!$event) {
            this.data['ISN_USER_COPY'] = undefined;
            this.form.get('USER_COPY').patchValue('');
        }
    }

    selectUser(access) {
        if (!access) {
            const openUserCl = {
                ...OPEN_CLASSIF_USER_CL,
                selectMulty: false,
                skipDeleted: null,
            };
            this.isShell = true;
            this._waitClassifSrv.openClassif(openUserCl, true)
                .then(data => {
                    this.data['ISN_USER_COPY'] = data;
                    return this._getUserCl(data);
                })
                .then(data => {
                    this.isShell = false;
                    this.form.get('USER_COPY').patchValue(data[0]['SURNAME_PATRON']);
                })
                .catch(() => {
                    this.isShell = false;
                });
        }
    }

    setVision(flag?) {
        flag ? this.type = 'text' : this.type_repeat = 'text';
    }

    resetVision(flag?) {
        flag ? this.type = 'password' : this.type_repeat = 'password';
    }

    searchDL() {
        this._searchLexem = this.form.get(this.inputs['DUE_DEP_NAME'].key).value;
        if (this._defaultDepDue.length > 0) {
            this._searchEmpInDep(this._searchLexem, this._defaultDepDue);
        } else {
            this._searchDLinSysParamsOrg();
        }
    }

    showDepChoose() {
        const ITEM = this._getCurrentItem();
        const FOCUSED_ITEM_DUE = ITEM.length === 0 ? '' : ITEM[0].due;
        if (this._idsForModalDictDep.length > 0) {
            if (this._idsForModalDictDep[0] !== FOCUSED_ITEM_DUE) {
                this._idsForModalDictDep[0] = FOCUSED_ITEM_DUE;
            }
        }
        this.isShell = true;
        OPEN_CLASSIF_DEPARTMENT.curdue = this._urlSegment();
        OPEN_CLASSIF_DEPARTMENT.selectMulty = false;
        OPEN_CLASSIF_DEPARTMENT['selected'] = '';
        if (this._isFromList(this._searchLexem)) { // выбрано что-то из выпадашки
            if (this._idsForModalDictDep.length > 0) {
                OPEN_CLASSIF_DEPARTMENT['selected'] = this._idsForModalDictDep[0];
            }
        } else {  // просто задана лексема и значение не выбрано
            OPEN_CLASSIF_DEPARTMENT.search_query = this._searchLexem;
        }
        this._waitClassifSrv.openClassif(OPEN_CLASSIF_DEPARTMENT, true)
            .then((data: string) => {
                this._setDepartment(data);
            })
            .catch(() => {
                this.isShell = false;
            });
    }

    showDepChooseEmpty() {
        this.isShell = true;
        OPEN_CLASSIF_DEPARTMENT.curdue = this._urlSegment();
        OPEN_CLASSIF_DEPARTMENT.selectMulty = false;
        OPEN_CLASSIF_DEPARTMENT['selected'] = '';
        OPEN_CLASSIF_DEPARTMENT.search_query = this._searchLexem;
        this._waitClassifSrv.openClassif(OPEN_CLASSIF_DEPARTMENT, true)
            .then((data: string) => {
                this._setDepartment(data);
            })
            .catch(() => {
                this.isShell = false;
            });

    }

    private _urlSegment(): string {
        const segment: UrlSegment[] = this._router.parseUrl(this._router.url).root.children.primary.segments;
        if (!segment[1] || segment[1].path === "0.") {
            return undefined;//Убрать curdue из queryParams
        }
        return segment[1].path;
    }

    private _getDueDepFefault(obj): string {
        return obj.window.mainFolder;
    }

    private _existsMainFolder(obj): boolean {
        if (obj.window) {
            if (obj.window.mainFolder) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    private _searchDLinSysParamsOrg() {
        this._searchLexem = this.form.get(this.inputs['DUE_DEP_NAME'].key).value;
        this._searchEmpInDep(this._searchLexem, this._depDueLinkOrg);
    }

    private _readSysParamsOrg() {
        this._pipeSrv.read<any>({ DEPARTMENT: PipRX.criteries({ DUE_LINK_ORGANIZ: this._sysParamsDueOrganiz }) }).then(items => {
            const DUE = items[0].DEPARTMENT_DUE;
            this._depDueLinkOrg = DUE.length <= 2 ? undefined : DUE;
        });
    }

    private _isSymbolsCorrect(value): boolean {
        const REGEXP = new RegExp(/^[а-яА-ЯёЁA-Za-z0-9]+$/);
        return REGEXP.test(value);
    }

    private _getSafeQueryLexem(lexem): string {
        const AR = lexem.split('');
        for (let i = 0; i < AR.length; i++) {
            if (!this._isSymbolsCorrect(AR[i])) {
                AR[i] = '%';
            }
        }
        return AR.join('');
    }

    private _searchEmpInDep(empLexem, due) {
        this.inputs['DUE_DEP_NAME'].dib.hideDropDown();
        empLexem = empLexem.substring(0, 1).toUpperCase() + empLexem.substring(1).toLowerCase();
        const BASE_VALUES = { IS_NODE: 1, DELETED: 0, CLASSIF_NAME: `%${this._getSafeQueryLexem(empLexem)}%` };
        let VALUES;
        if (due) {
            const ADD = { ISN_HIGH_NODE: due };
            VALUES = { ...BASE_VALUES, ...ADD };
        } else {
            VALUES = BASE_VALUES;
        }
        const CRIT = { DEPARTMENT: { criteries: VALUES } };
        this._pipeSrv.read<DEPARTMENT>(CRIT).then(empItems => {
            if (empItems.length > 0) {
                const DEP_IDS = empItems.map(x => x.DEPARTMENT_DUE);
                VALUES = { DUE: DEP_IDS.join('|'), DELETED: 0, IS_NODE: 0 };
                const DEP_CRIT = { DEPARTMENT: { criteries: VALUES } };
                this._pipeSrv.read<DEPARTMENT>(DEP_CRIT).then(depItems => {
                    this.inputs['DUE_DEP_NAME'].options = [];
                    empItems.forEach(empItem => {// формируем список выпадашки @task161934
                        const { CLASSIF_NAME } = depItems.filter(({ DUE }) => empItem.DEPARTMENT_DUE === DUE)[0];
                        if (empItem.CLASSIF_NAME.toLocaleLowerCase().indexOf(this._searchLexem.toLocaleLowerCase()) >= 0) { // более строгая проверка на формирование dsgflfirb
                            const LIST_ITEM_NAME = `${empItem.CLASSIF_NAME} - ${CLASSIF_NAME}`;
                            this.inputs['DUE_DEP_NAME'].options.push({ title: LIST_ITEM_NAME, value: empItem.CLASSIF_NAME, due: empItem.DUE });
                        }
                    });
                    // ставим активную первую запись @task161934 - в случае найденности чего либо
                    if (this.inputs['DUE_DEP_NAME'].options.length > 0 && this.inputs['DUE_DEP_NAME'].options[0].due !== '-1') {
                        this.inputs['DUE_DEP_NAME'].dib.toggleDropdown();
                    }
                    this._idsForModalDictDep = [empItems[0].DUE];
                });
            } else {
                this.inputs['DUE_DEP_NAME'].options = [{
                    title: EMPTY_SEARCH_DL_RESULTS, value: EMPTY_SEARCH_DL_RESULTS, due: '-1',
                    disabled: true
                }];
                this.inputs['DUE_DEP_NAME'].dib.toggleDropdown();
                this._idsForModalDictDep = [];
            }
        }).catch(err => { throw err; });
    }

    private _setDepartment(due?: string) {
        let dueDep = '';
        if (due === '') {
            throw new Error();
        }
        due = (due.split('|'))[0];
        if (this._apiSrv.configList.shooseTab === 0) {
            if (this.privateParseDue(due)) {
                dueDep = due;
            } else {
                this._msgSrv.addNewMessage({
                    type: 'warning',
                    title: 'Предупреждение',
                    msg: 'Должностное лицо не соответствует текущему подразделению',
                    dismissOnTimeout: 6000,
                });
                throw new Error();
            }
        } else {
            dueDep = due;
        }
        this._userParamSrv.getDepartmentFromUser([dueDep]).then((data: DEPARTMENT[]) => {
            if (this._apiSrv.configList.shooseTab === 1 && data[0].DEPARTMENT_DUE !== this._apiSrv.dueDep && this._apiSrv.dueDep !== '0.') {
                this._msgSrv.addNewMessage({
                    type: 'warning',
                    title: 'Предупреждение',
                    msg: 'Должностное лицо не принадлежит текущей картотеке',
                    dismissOnTimeout: 6000,
                });
                throw new Error();
            }
            return this._userParamSrv.ceckOccupationDueDep(dueDep, data[0], true);
        })
            .then((dep: DEPARTMENT) => {
                this.isShell = false;
                this.departmentData = dep;
                this.data['dueDL'] = dep['DUE'];
                this.form.get('DUE_DEP_NAME').patchValue(dep['CLASSIF_NAME'], { emitEvent: false });
                this.form.get('teсhUser').patchValue(false, { emitEvent: false });
                this._searchLexem = dep['CLASSIF_NAME'];
                if (!!this.departmentData.UNREAD_FLAG) {
                    this.form.controls['USER_TEMPLATES'].patchValue('', { emitEvent: false });
                    this.form.controls['USER_COPY'].patchValue('', { emitEvent: false });
                }
            }).catch(() => {
                this.isShell = false;
                this.form.get(this.inputs['DUE_DEP_NAME'].key).patchValue(this._searchLexem, { emitEvent: false });
            });
    }

    private privateParseDue(due): boolean {
        const dueD = this._apiSrv.dueDep.split('.').filter(el => el !== '');
        const dueDNew = due.split('.').filter(el => el !== '');
        if (dueD[0] === '0' && dueD.length === 1) {
            return true;
        } else {
            if (dueD.length === dueDNew.length - 1) {
                if (dueD[dueD.length - 1] === dueDNew[dueDNew.length - 2]) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        }
    }

    private _getUserCl(isn) {
        const queryUser = {
            USER_CL: {
                criteries: {
                    ISN_LCLASSIF: isn
                }
            }
        };
        return this._pipeSrv.read<USER_CL>(queryUser);
    }


    private _subscribe() {
        if (!this.cbBase) {
            const f = this.form;
            f.get('teсhUser').valueChanges
                .pipe(
                    takeUntil(this.ngUnsubscribe)
                )
                .subscribe(data => {
                    this.techUser = data;
                    if (data) {
                        this.form.get(this.inputs['DUE_DEP_NAME'].key).patchValue('');
                        delete this.data['dueDL'];
                        this.departmentData = null;
                    } else {
                        f.get('DUE_DEP_NAME').enable();
                    }
                });

            f.valueChanges
                .pipe(
                    takeUntil(this.ngUnsubscribe)
                )
                .subscribe(d => {
                    for (const c in d) {
                        if (c !== 'teсhUser') {
                            this.data[c] = d[c];
                        }
                        this.btnDisabled = this.form.invalid;
                    }
                    if (this.form.controls['classifName'].value.length === this.loginMaxLength) {
                        this.classifName?.show?.();
                    } else {
                        this.classifName?.hide?.();
                    }
                    // const enteredLogin = this.form.controls['classifName'].value;
                    // enteredLogin.length === this.loginMaxLength ? this.classifName.show() : this.classifName.hide();

                    this.loginMaxLength = this.form.get('USER_TYPE') && `${this.form.get('USER_TYPE').value}` === '0' ? 12 : 256;
                });
            this._setDueDeNameSubscription();
        } else {
            const formCB = this.form;
            formCB.valueChanges
                .pipe(takeUntil(this.ngUnsubscribe))
                .subscribe(data => {
                    if (this.classifName && data['classifName'].length === this.loginMaxLength) {
                        this.classifName?.show?.();
                    } else {
                        this.classifName?.hide?.();
                    }

                    if (this.SURNAME_PATRON && data['SURNAME_PATRON'].length === 64) {
                        this.classifName?.show?.();
                    } else {
                        this.classifName?.hide?.();
                    }
                    this.btnDisabled = false;
                })
        }
    }

    changeNote(el: HTMLInputElement) {
        this.department = {
            NOTE: el.value,
            TECH_DUE_DEP: null
        }
    }

    public async chooseDepartment() {
        const params: IOpenClassifParams = {
            classif: 'DEPARTMENT',
            return_due: true,
            skipDeleted: true,
            selectMulty: false,
            selectLeafs: false,
        }
        try {
            const departmentDue: string = await this._waitClassifSrv.openClassif(params);
            const department: DEPARTMENT[] = await this._pipeSrv.read({ DEPARTMENT: { criteries: { DUE: departmentDue } } });
            this.department = {
                NOTE: department[0].CLASSIF_NAME,
                TECH_DUE_DEP: department[0].DUE
            };

        } catch (err) {
            const m: IMessage = {
                type: 'warning',
                title: 'Предупреждение',
                msg: 'Окно было закрыто, до того как было выбрано подразделение!',
            };
            this._msgSrv.addNewMessage(m);
            return '';
        }
    }

    private _setDueDeNameSubscription() {
        this.form.get(this.inputs['DUE_DEP_NAME'].key).valueChanges
            .pipe(
                debounceTime(1200), takeUntil(this.ngUnsubscribe)
            )
            .subscribe(value => this._setDueDepName(value));
    }

    private _setDueDepName(value) {
        if (value.length < 3) { // нет поиска
            this.inputs['DUE_DEP_NAME'].options = [];
            this._idsForModalDictDep = [];
        } else {
            if (this.inputs['DUE_DEP_NAME'].options.length > 0) {
                if (!this._isFromList(value)) { // запуск поиска по лексеме
                    this.searchDL();
                } else { // выбрали из выпадашки значение
                    const ITEM = this.inputs['DUE_DEP_NAME'].options.filter(item => item.value === value);
                    this._idsForModalDictDep = [ITEM[0].due];
                    this._setDepartment(ITEM[0].due);
                }
            } else {
                this.searchDL();
            }
        }
    }

    private _isFromList(value: string): boolean {
        return this.inputs['DUE_DEP_NAME'].options.some(x => value === x.value);
    }

    private _getCurrentItem() {
        return this.inputs['DUE_DEP_NAME'].options.filter(x => this.form.get(this.inputs['DUE_DEP_NAME'].key).value === x.value);
    }

}
