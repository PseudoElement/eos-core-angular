import { Component, Output, EventEmitter, OnInit, OnDestroy, ViewChild, ElementRef, ChangeDetectorRef, Inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router, UrlSegment } from '@angular/router';

import { combineLatest, Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { InputParamControlService } from 'eos-user-params/shared/services/input-param-control.service';
import { CREATE_USER_INPUTS, OPEN_CLASSIF_DEPARTMENT, OPEN_CLASSIF_USER_CL } from 'eos-user-select/shered/consts/create-user.consts';
import { WaitClassifService } from 'app/services/waitClassif.service';
import { PipRX, DEPARTMENT, USER_CL, LIST_ITEMS } from 'eos-rest';
import { EosMessageService } from 'eos-common/services/eos-message.service';
import { IMessage } from 'eos-common/interfaces';
import { RestError } from 'eos-rest/core/rest-error';
import { UserParamsService } from 'eos-user-params/shared/services/user-params.service';
import { UserParamApiSrv } from 'eos-user-params/shared/services/user-params-api.service';
import { AppContext } from 'eos-rest/services/appContext.service';
import { ErrorHelperServices } from 'eos-user-params/shared/services/helper-error.services';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { DOCUMENT } from '@angular/common';
import { ALL_ROWS } from 'eos-rest/core/consts';
// import { DUE_DEP_OCCUPATION } from 'app/consts/messages.consts';

@Component({
    selector: 'eos-param-create-user',
    templateUrl: 'createUser.component.html',
    providers: [BsModalService],
})
export class CreateUserComponent implements OnInit, OnDestroy {
    @Output() closedModal = new EventEmitter();
    @ViewChild('templatePassword') templatePassword: ElementRef;
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
    loginMaxLength: number = 64;
    private ngUnsubscribe: Subject<any> = new Subject();
    private subscriptions: Subscription[] = [];
    private typesUsers = new Map()
        .set(-1, 'Без права входа в систему')
        .set(0, 'Имя и пароль в БД')
        .set(1, 'ОС - аутентификация')
        .set(2, 'Пользователь в БД')
        .set(3, 'Имя и пароль')
        .set(4, 'ОС - аутентификация на сервере');
    private typesUsersValues2 = new Map()
        .set(-1, '-1')
        .set(0, '0')
        .set(1, '1')
        .set(2, '2')
        .set(3, '3')
        .set(4, '4');
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
        @Inject(DOCUMENT) private readonly documentRef: Document,
    ) {
    }

    get validPassword() {
        return this.password.length && (this.password === this.repitedPassword);
    }
    get disabledSubmit() {
        if (this.form && (this.form.controls['classifName'].value).trim() === '') {
            this.form.get('classifName').setErrors({ errorPattern: true });
        }
        return this.btnDisabled || this.form.get('classifName').invalid;
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
                const roles = data[0] ? data[0]['PARM_VALUE'].split(';') : [];
                const types = data[1] ? data[1]['PARM_VALUE'].split(',') : [];
                const defaultTypes = types[0] ? types[0] : '-1';
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
                        this.form.controls['DUE_DEP_NAME'].patchValue(dt[0]['SURNAME']);
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
    }

    loadUsersTemplats(params: Array<number>, map: Map<number, any>): Promise<any> {
        const isns = params.join('|');
        return this._pipeSrv.read({
            DEPARTMENT: {
                criteries: {
                    ISN_NODE: isns
                }
            }
        }).then((_d: DEPARTMENT[]) => {
            return this._pipeSrv.read({
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

    createUser(): boolean {
        const d = this.data;
        if (d['dueDL'] === undefined && !this.techUser) {
            return false;
        }
        return true;
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
        if (this.createUser() || this.cbBase) {
            const url = this._createUrlForSop();
            this.btnDisabled = true;
            this.isLoading = true;

            const addUser = async (addUrl: string, withLogin: boolean = false) => {
                try {
                    const createRequest = {
                        [addUrl]: ALL_ROWS,
                    };
                    const id: any = await this._pipeSrv.read(createRequest);
                    const isn = Number(id) || id[0].value || id[0].value[0];
                    if (withLogin) {
                        const changeLoginUrl = this._createUrlChangeLOgin(isn);
                        const changeLoginRequest = {
                            [changeLoginUrl]: ALL_ROWS,
                        };
                        await this._pipeSrv.read(changeLoginRequest);
                    }
                    this.afterCreate(isn);
                } catch (e) {
                    this.checkError(e);
                }
            };

            if (this.data['USER_TYPE'] === '0' || this.data['USER_TYPE'] === '3') {
                this.enterPassword = true;
                this.subscriptions.push(this.modalService.onHidden.subscribe(async (reason: string) => {
                    this.enterPassword = false;
                    if (this.validPassword) {
                        await addUser(url, true);
                    }
                    this.unsubscribe();
                }));
                this.subscriptions.push(_combine);
                this.modalRef = this.modalService.show(this.templatePassword, { ignoreBackdropClick: true, keyboard: false, class: 'gray modal-sm passModal' });
                this.documentRef.getElementById('inpPass').focus();
            } else if (this.data['USER_TYPE'] === '-1') {
                await addUser(url, false);
            } else if (this.data['USER_TYPE'] === '2') {
                await addUser(url, true);
            } else if (this.data['USER_TYPE'] === '1' || this.data['USER_TYPE'] === '4') {
                if (this.form.controls['classifName'].value.indexOf('\\') < 0) {
                    const m: IMessage = {
                        type: 'warning',
                        title: 'Предупреждение',
                        msg: 'Имя пользователя не соответствует шаблону для ОС-авторизации.',
                    };
                    this.isLoading = false;
                    this._msgSrv.addNewMessage(m);
                    return;
                }
                await addUser(url, true);
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
    closeSubModal() {
        this.password = '';
        this.repitedPassword = '';
        this.btnDisabled = false;
        this.isLoading = false;
        this.enterPassword = false;
        this.modalRef.hide();
    }
    checkError(e) {
        const m: IMessage = {
            type: 'warning',
            title: 'Предупреждение',
            msg: '',
        };
        if (e instanceof RestError && (e.code === 434 || e.code === 0)) {
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
    afterCreate(isn: number) {
        this.password = '';
        this.repitedPassword = '';
        this.isn_prot = isn;
        this._userParamSrv.ProtocolService(this.isn_prot, 3);
        this.btnDisabled = false;
        this.isLoading = false;
        this.closedModal.emit();
        this._router.navigate(['user-params-set'], {
            queryParams: { isn_cl: isn, is_create: true }
        });
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
        delete this.data['SELECT_ROLE'];
    }

    selectDepartment(status) {
        if (status) {
            this._showDepartment();
        }
    }
    delSelectUser($event?) { // удаление от кого копировать
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
                criteriesName: this._apiSrv.configList.titleDue,
                selectMulty: false,
                skipDeleted: null,
            };
            this.isShell = true;
            this._waitClassifSrv.openClassif(openUserCl)
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
    private _urlSegment(): string {
        const segment: UrlSegment[] = this._router.parseUrl(this._router.url).root.children.primary.segments;
        if (!segment[1]) {
            return '0.';
        }
        return segment[1].path;
    }
    private _showDepartment() {
        this.isShell = true;
        let dueDep = '';
        OPEN_CLASSIF_DEPARTMENT.curdue = this._urlSegment();
        this._waitClassifSrv.openClassif(OPEN_CLASSIF_DEPARTMENT, true)
            .then((data: string) => {
                if (data === '') {
                    throw new Error();
                }
                if (this._apiSrv.configList.shooseTab === 0) {
                    if (this.privateParseDue(data)) {
                        dueDep = data;
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
                    dueDep = data;
                }
                return this._userParamSrv.getDepartmentFromUser([dueDep]);
            })
            .then((data: DEPARTMENT[]) => {
                if (this._apiSrv.configList.shooseTab === 1 && data[0].DEPARTMENT_DUE !== this._apiSrv.dueDep && this._apiSrv.dueDep !== '0.') {
                    this._msgSrv.addNewMessage({
                        type: 'warning',
                        title: 'Предупреждение',
                        msg: 'Должностное лицо не принадлежит текущей картотеке',
                        dismissOnTimeout: 6000,
                    });
                    throw new Error();
                }
                return this._userParamSrv.ceckOccupationDueDep(dueDep, data[0]);
            })
            .then((dep: DEPARTMENT) => {
                this.isShell = false;
                this.departmentData = dep;
                this.data['dueDL'] = dep['DUE'];
                this.form.get('DUE_DEP_NAME').patchValue(dep['CLASSIF_NAME']);
                if (!!this.departmentData.UNREAD_FLAG) {
                    this.form.controls['USER_TEMPLATES'].patchValue('', { emitEvent: false });
                    this.form.controls['USER_COPY'].patchValue('', { emitEvent: false });
                }
            })
            .catch(() => {
                this.isShell = false;
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
    private _createUrlForSop() {
        const d = this.data;
        const isn_user_copy_from = (d['ISN_USER_COPY'] || d['USER_TEMPLATES']) || '0';
        let url = 'CreateUserCl?';
        url += `classifName='${d['classifName'] ? encodeURI(d['classifName']) : ''}'`;
        url += `&dueDL='${d['dueDL'] ? d['dueDL'] : ''}'`;
        url += `&role='${d['SELECT_ROLE'] && !this.techUser ? encodeURI(d['SELECT_ROLE']) : ''}'`;
        url += `&isn_user_copy_from=${isn_user_copy_from}`; // если не выбран пользователь для копирования передаем '0'
        url += `&userType=${d['USER_TYPE'] ? d['USER_TYPE'] : -1}`;
        //   url += `&delo_rights=0`;
        return url;
    }
    private _createUrlChangeLOgin(id: number): string {
        const d = this.data;
        let url = 'ChangeLogin?';
        url += `isn_user=${id}`;
        url += `&userType=${d['USER_TYPE'] ? d['USER_TYPE'] : -1}`;
        url += `&classifName='${d['classifName'] ? encodeURI(d['classifName']) : ''}'`;
        if (this.password) {
            url += `&pass='${this.password}'`;
        }
        return url;
    }

    private _subscribe() {
        const f = this.form;
        f.get('teсhUser').valueChanges
            .pipe(
                takeUntil(this.ngUnsubscribe)
            )
            .subscribe(data => {
                this.techUser = data;
                if (data) {
                    f.get('DUE_DEP_NAME').patchValue('');
                    f.get('DUE_DEP_NAME').disable();
                    f.get('SELECT_ROLE').patchValue('');
                    // f.get('SELECT_ROLE').disable();
                    delete this.data['dueDL'];
                    delete this.data['SELECT_ROLE'];
                    this.departmentData = null;
                } else {
                    f.get('DUE_DEP_NAME').enable();
                    // f.get('SELECT_ROLE').enable();
                }
            });



        f.valueChanges
            .pipe(
                takeUntil(this.ngUnsubscribe)
            )
            .subscribe(d => {
                // tslint:disable-next-line:forin
                for (const c in d) {
                    if (c !== 'teсhUser') {
                        this.data[c] = d[c];
                    }
                    this.btnDisabled = this.form.invalid;
                }
                this.loginMaxLength = this.form.get('USER_TYPE') && `${this.form.get('USER_TYPE').value}` === '0' ? 12 : 64;
            });
    }
}
