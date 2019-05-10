import { Component, Output, EventEmitter, OnInit, OnDestroy} from '@angular/core';
import { InputParamControlService } from 'eos-user-params/shared/services/input-param-control.service';
import { CREATE_USER_INPUTS, OPEN_CLASSIF_DEPARTMENT, OPEN_CLASSIF_USER_CL } from 'eos-user-select/shered/consts/create-user.consts';
import { WaitClassifService } from 'app/services/waitClassif.service';
import { PipRX, DEPARTMENT, USER_CL } from 'eos-rest';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs/Subject';
import { ALL_ROWS } from 'eos-rest/core/consts';
import { Router } from '@angular/router';
import { EosMessageService } from 'eos-common/services/eos-message.service';
import { IMessage } from 'eos-common/interfaces';
import { RestError } from 'eos-rest/core/rest-error';
import { UserParamsService } from 'eos-user-params/shared/services/user-params.service';
import { UserParamApiSrv } from 'eos-user-params/shared/services/user-params-api.service';
// import { DUE_DEP_OCCUPATION } from 'app/consts/messages.consts';
@Component({
    selector: 'eos-param-create-user',
    templateUrl: 'createUser.component.html'
})
export class CreateUserComponent implements OnInit, OnDestroy {
    @Output() closedModal = new EventEmitter();
    isLoading: boolean = true;
    data = {};
    fields = CREATE_USER_INPUTS;
    inputs;
    form: FormGroup;
    titleHeader = 'Новый пользователь';
    btnDisabled: boolean = true;
    isShell: Boolean = false;
    initDue: string;
    initLogin: string;
    title: string;
    private ngUnsubscribe: Subject<any> = new Subject();
    constructor(
        public _apiSrv: UserParamApiSrv,
        private _userParamSrv: UserParamsService,
        private _msgSrv: EosMessageService,
        private _router: Router,
        private _inputCtrlSrv: InputParamControlService,
        private _waitClassifSrv: WaitClassifService,
        private _pipeSrv: PipRX,
    ) {
    }

    ngOnInit() {
        this.inputs = this._inputCtrlSrv.generateInputs(this.fields);
        this.inputs['SELECT_ROLE'].options = [];
        this.isLoading = true;
        this._pipeSrv.read({
            USER_PARMS: {
                criteries: {
                    ISN_USER_OWNER: '-99',
                    PARM_NAME: 'CATEGORIES_FOR_USER'
                }
            }
        })
            .then(data => {
                const d = data[0];
                d['PARM_VALUE'].split(';').forEach(i => {
                    this.inputs['SELECT_ROLE'].options.push({ title: i, value: i });
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
                this.isLoading = false;
                this._subscribe();
            });
    }
    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    submit() {

        const url = this._createUrlForSop();

        this._pipeSrv.read({
            [url]: ALL_ROWS,
        })
            .then(data => {
                this.closedModal.emit();
                this._router.navigate(['user-params-set'], {
                    queryParams: { isn_cl: data[0] }
                });
            })
            .catch(e => {
                const m: IMessage = {
                    type: 'warning',
                    title: 'Ошибка сервера',
                    msg: '',
                };
                if (e instanceof RestError && (e.code === 434 || e.code === 0)) {
                    this._router.navigate(['login'], {
                        queryParams: {
                            returnUrl: this._router.url
                        }
                    });
                }
                if (e instanceof RestError && e.code === 500) {
                    m.msg = 'Пользователь с таким логином уже существует';
                } else {
                    m.msg = e.message ? e.message : e;
                }
                this._msgSrv.addNewMessage(m);
            });
    }
    cancel() {
        this.closedModal.emit();
    }

    selectDepartment(status) {
        if (status) {
            this._showDepartment();
        }
    }
    selectUser() {
        OPEN_CLASSIF_USER_CL['criteriesName'] = this._apiSrv.configList.titleDue;
        this.isShell = true;
        this._waitClassifSrv.openClassif(OPEN_CLASSIF_USER_CL)
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

    private _showDepartment() {
        this.isShell = true;
        let dueDep = '';
        this._waitClassifSrv.openClassif(OPEN_CLASSIF_DEPARTMENT, true)
            .then((data: string) => {
                if (data === '') {
                    throw new Error();
                }
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
                return this._userParamSrv.getDepartmentFromUser([dueDep]);
            })
            .then((data: DEPARTMENT[]) => {
                return this._userParamSrv.ceckOccupationDueDep(dueDep, data[0]);
            })
            .then((dep: DEPARTMENT) => {
                this.isShell = false;
                this.data['dueDL'] = dep['DUE'];
                this.form.get('DUE_DEP_NAME').patchValue(dep['CLASSIF_NAME']);
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
        let url = 'CreateUserCl?';
        url += `classifName='${d['classifName'] ? encodeURI(d['classifName']) : ''}'`;
        url += `&dueDL='${d['dueDL'] ? d['dueDL'] : ''}'`;
        url += `&role='${d['SELECT_ROLE'] ? encodeURI(d['SELECT_ROLE']) : ''}'`;
        url += `&isn_user_copy_from=${d['ISN_USER_COPY'] ? d['ISN_USER_COPY'] : '0'}`; // если не выбран пользователь для копирования передаем '0'
        return url;
    }

    private _subscribe() {
        const f = this.form;
        f.get('teсhUser').valueChanges
            .takeUntil(this.ngUnsubscribe)
            .subscribe(data => {
                if (data) {
                    f.get('DUE_DEP_NAME').patchValue('');
                    f.get('DUE_DEP_NAME').disable();
                    delete this.data['dueDL'];
                } else {
                    f.get('DUE_DEP_NAME').enable();
                }
            });
        f.valueChanges
            .takeUntil(this.ngUnsubscribe)
            .subscribe(d => {
                for (const c in d) {
                    if (c !== 'teсhUser') {
                        this.data[c] = d[c];
                    }
                }
                this.btnDisabled = this.form.invalid;
            });
    }
}
