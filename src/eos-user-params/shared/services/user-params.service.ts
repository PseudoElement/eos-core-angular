import { Injectable } from '@angular/core';
import { UserParamApiSrv } from './user-params-api.service';
import { USER_CL, DEPARTMENT, PipRX, IEnt } from 'eos-rest';
import { EosMessageService } from 'eos-common/services/eos-message.service';
import { IParamUserCl, IUserSetChanges, IGetUserCfg } from '../intrfaces/user-parm.intterfaces';
import { Subject, Observable } from 'rxjs';
import { IMessage } from 'eos-common/interfaces';
import { ALL_ROWS } from 'eos-rest/core/consts';
import { EosStorageService } from 'app/services/eos-storage.service';
import { Router } from '@angular/router';

@Injectable()
export class UserParamsService {
    userTechList: any[] = [];
    userRightDocgroupList: any[] = [];
    public SubEmail: Subject<any> = new Subject();
    public submitSave;
    private _saveFromAsk$: Subject<void> = new Subject<void>();
    private _updateUser$: Subject<void> = new Subject<void>();
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
    get userContextId (): number {
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
    get updateUser$ (): Observable<void> {
        return this._updateUser$.asObservable();
    }
    get hasChanges$ (): Observable<IUserSetChanges> {
        return this._hasChanges$.asObservable();
    }
    constructor (
        private _pipSrv: UserParamApiSrv,
        private _msgSrv: EosMessageService,
        private _pipRx: PipRX,
        private _storageSrv: EosStorageService,
        private _router: Router,
    ) {}
    getUserIsn(cfg?: IGetUserCfg): Promise<boolean> {
        const defaultExpand: string = 'USER_PARMS_List,USERCARD_List/USER_CABINET_List,USER_RIGHT_DOCGROUP_List,USERDEP_List,USERCARD_List/USER_CARD_DOCGROUP_List,NTFY_USER_EMAIL_List,USER_TECH_List';
        let isn: number;
        let expand: string;
        expand = cfg && cfg.expand ? cfg.expand : defaultExpand;
        if (cfg && cfg.isn_cl) {
            isn = cfg.isn_cl;
        } else {
            isn = this._storageSrv.getItem('userEditableId');
        }
        if (!isn) {
            this._router.navigate(['user_param']);
        }

        const queryUser = {
            [`USER_CL(${isn})`]: ALL_ROWS,
            expand: expand
        };
        const _user = this._pipSrv.getData<USER_CL>(queryUser);
        const _sys = cfg && cfg.shortSys ? this.fetchSysParams() : Promise.resolve([]);
        return Promise.all([_user, _sys])
        .then(([user, sys]) => {
            this._userContext = user[0];
            this.userTechList = [];
            this.userRightDocgroupList = [];
            this._userContext['DUE_DEP_NAME'] = '';
            this._isTechUser = !this._userContext['DUE_DEP'];
            this._userContext['isTechUser'] = !this._userContext['DUE_DEP'];
            this._userContext['ACCESS_SYSTEMS'] = this._userContext['AV_SYSTEMS'].split('');
            this.SubEmail.next(this._userContext);

            if (this._userContext.USER_TECH_List) {
                this._userContext.USER_TECH_List.forEach(item => this.userTechList.push(Object.assign({}, item)));
            }
            if (this._userContext.USER_RIGHT_DOCGROUP_List) {
                this._userContext.USER_RIGHT_DOCGROUP_List.forEach(item => this.userRightDocgroupList.push(Object.assign({}, item)));
            }
            if (this._userContext.USERCARD_List) {
                this._userContext['isAccessDelo'] = !!this._userContext.USERCARD_List.length;
            }

            if (this._userContext.USER_PARMS_List) {
                this._createHash();
            }
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
            // console.log(this._userContext.USERCARD_List);
            this._updateUser$.next();
            return true;
        })
        .catch(err => {
            console.log(err);
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
    checkGrifs(isn_user: number): Promise<boolean> {
        return  this._pipRx.read({
            USERSECUR: {
                criteries: {
                    ISN_LCLASSIF: String(isn_user)
                }
            }
            }).then(result => {
               if (result.length) {
                   return true;
               }    else {
                   return false;
               }
        });
    }
    getSertSBaseParams(isn_cl?: string) {
        if (!isn_cl) {
            isn_cl = this._storageSrv.getItem('userEditableId');
        }
        return  this._pipRx.read({
            USER_CERTIFICATE: {
                criteries: {
                    ISN_USER: isn_cl
                }
            }
            });
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
