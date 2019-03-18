import { Injectable } from '@angular/core';
import { UserParamApiSrv } from './user-params-api.service';
import { USER_CL, DEPARTMENT, PipRX, IEnt } from 'eos-rest';
import { EosMessageService } from 'eos-common/services/eos-message.service';
import { IParamUserCl, IUserSetChanges } from '../intrfaces/user-parm.intterfaces';
import { Subject } from 'rxjs/Subject';
import { IMessage } from 'eos-common/interfaces';
import { ALL_ROWS } from 'eos-rest/core/consts';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class UserParamsService {
    userTechList: any[] = [];
    userRightDocgroupList: any[] = [];
    public SubEmail: Subject<any> = new Subject();
    private _saveFromAsk$: Subject<void> = new Subject<void>();
    private _hasChanges$: Subject<IUserSetChanges> = new Subject<IUserSetChanges>();
    private _isTechUser: boolean;
    private _userContext: IParamUserCl;
    private _userContextDeparnment: DEPARTMENT;
    private _sysParams;

    get sysParams() {
        if (this._sysParams) {
            return this._sysParams;
        }
        return null;
    }

    get isTechUser() {
        return this._isTechUser;
    }
    get userContextId () {
        if (this._userContext) {
            return this._userContext['ISN_LCLASSIF'];
        }
        return null;
    }
    get curentUser (): IParamUserCl {
        return this._userContext;
    }
    get hashUserContext () {
        if (this._userContext) {
            return this._userContext['USER_PARMS_HASH'];
        }
        return null;
    }
    get isUserContexst () {
        return !!this._userContext;
    }
    get saveData$ (): Observable<void> {
        return this._saveFromAsk$.asObservable();
    }
    get hasChanges$ (): Observable<IUserSetChanges> {
        return this._hasChanges$.asObservable();
    }
    constructor (
        private _pipSrv: UserParamApiSrv,
        private _msgSrv: EosMessageService,
        private _pipRx: PipRX,
    ) {}
    getUserIsn(isn_cl: string = this.userContextId.toString()): Promise<boolean> {
        const queryUser = {
            [`USER_CL(${+isn_cl})`]: ALL_ROWS,
            expand: 'USER_PARMS_List,USERCARD_List/USER_CABINET_List,USER_RIGHT_DOCGROUP_List,USERDEP_List,USERCARD_List/USER_CARD_DOCGROUP_List,NTFY_USER_EMAIL_List,USER_TECH_List'
        };
        const _user = this._pipSrv.getData<USER_CL>(queryUser);
        const _sys = this.fetchSysParams();
        return Promise.all([_user, _sys])
        .then(([user, sys]) => {
            this._sysParams = sys;
            this._userContext = user[0];
            this.userTechList = [];
            this.userRightDocgroupList = [];
            this._userContext.USER_TECH_List.forEach(item => this.userTechList.push(Object.assign({}, item)));
            this._userContext.USER_RIGHT_DOCGROUP_List.forEach(item => this.userRightDocgroupList.push(Object.assign({}, item)));
            /*
                КОСТЫЛЬ!
                Обрезаем 40-й элемент так как запись в базу пока ограничена длинной 39
                TODO Разобраться и убрать это удаление
            */
            if (this._userContext['TECH_RIGHTS'] && this._userContext['TECH_RIGHTS'].length > 39) {
                this._userContext['TECH_RIGHTS'] = this._userContext['TECH_RIGHTS'].slice(0, -1);
            }
            this._userContext['DUE_DEP_NAME'] = '';
            this._isTechUser = !this._userContext['DUE_DEP'];
            this._userContext['isTechUser'] = !this._userContext['DUE_DEP'];
            this._userContext['isAccessDelo'] = !!this._userContext.USERCARD_List.length;
            this._userContext['ACCESS_SYSTEMS'] = this._userContext['AV_SYSTEMS'].split('');
            this.SubEmail.next(this._userContext);
            this._createHash();
            if (!this._isTechUser) {
                return this.getDepartmentFromUser([this._userContext['DUE_DEP']]);
            }
            return Promise.resolve([]);
        })
        .then((data: any[]) => {
            if (data.length) {
                this._userContextDeparnment = data[0];
                this._userContext['DUE_DEP_NAME'] = this._userContextDeparnment['CLASSIF_NAME'];
            }
            this._userContext = this._pipRx.entityHelper.prepareForEdit(this._userContext);
            console.log(this._userContext.USERCARD_List);
            return true;
        })
        .catch(err => {
            this._errorHandler(err);
            return false;
        });
    }
    fetchSysParams() {
        const querySys = {
            USER_PARMS: {
                criteries: {
                    PARM_NAME: 'CHANGE_PASS||CATEGORIES_FOR_USER'
                }
            }
        };

        return this._pipSrv.getData(querySys)
        .then(data => {
            const h = {};
            data.forEach(e => {
                h[e['PARM_NAME']] = e['PARM_VALUE'];
            });
            this._sysParams = h;
            return h;
        });
    }

    getDepartmentFromUser (dueDep: string[]): Promise<DEPARTMENT[]> {
        return this._pipSrv.getData<DEPARTMENT>({DEPARTMENT: dueDep});
    }
    ceckOccupationDueDep(dueDep: string, dep: DEPARTMENT, isn?: boolean) {/* проверяем прикреплино ли должностное лицо к пользователю */
        const mess: IMessage = {
            title: 'Предупреждение:',
            msg: '',
            type: 'warning'
        };
        return this._pipSrv.getData<USER_CL>({USER_CL: PipRX.criteries({DUE_DEP: dueDep})})
        .then((u: USER_CL[]) => {
            if (!u.length) {
                return dep;
            }
            mess.msg = `Пользователь "${u[0].SURNAME_PATRON}" уже ассоциирован с выбранным ДЛ "${dep.CLASSIF_NAME}".`;
            if (isn && u[0]['ISN_LCLASSIF'] === this.userContextId) {
                mess.msg = `Пользователь ${this.curentUser.SURNAME_PATRON} уже ассоциирован с выбранным ДЛ`;
            }
            this._msgSrv.addNewMessage(mess);
            throw new Error();
        });
    }
    createEntyti<T extends IEnt>(ent: any, typeName: string): T {
        ent.__metadata = { __type: typeName };
        return ent;
    }
    saveChenges() {
        this._saveFromAsk$.next();
    }
    setChangeState(state: IUserSetChanges) {
        this._hasChanges$.next(state);
    }
    private _errorHandler (err) {
        if (err.code === 434) {
            return;
        }
        const errMessage = err.message ? err.message : err;
        this._msgSrv.addNewMessage({
            type: 'danger',
            title: '',
            msg: errMessage
        });
    }
    private _createHash() {
        this._userContext['USER_PARMS_HASH'] = {};
        this._userContext['USER_PARMS_List'].forEach(item => {
            this._userContext['USER_PARMS_HASH'][item['PARM_NAME']] = item.PARM_VALUE;
        });
    }
}
