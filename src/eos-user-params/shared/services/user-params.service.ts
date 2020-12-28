import { Injectable } from '@angular/core';
import { UserParamApiSrv } from './user-params-api.service';
import { USER_CL, DEPARTMENT, PipRX, IEnt, ORGANIZ_CL } from 'eos-rest';
import { EosMessageService } from 'eos-common/services/eos-message.service';
import { IParamUserCl, IUserSetChanges, IGetUserCfg, IRoleCB } from '../intrfaces/user-parm.intterfaces';
import { Subject, Observable } from 'rxjs';
import { IMessage } from 'eos-common/interfaces';
import { ALL_ROWS } from 'eos-rest/core/consts';
import { EosStorageService } from 'app/services/eos-storage.service';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { AppContext } from 'eos-rest/services/appContext.service';
import { ErrorHelperServices } from './helper-error.services';
import { KIND_ROLES_CB } from '../consts/user-param.consts';

@Injectable()
export class UserParamsService {
    userTechList: any[] = [];
    userRightDocgroupList: any[] = [];
    userEditOrgType: any[] = [];
    checkedUsers: any[] = [];
    cardModal: BsModalRef;
    public SubEmail: Subject<any> = new Subject();
    public SubmitCards: Subject<any> = new Subject();
    public submitSave;
    public asistMansStr: string;
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
    get userContextId(): number {
        if (this._userContext) {
            return this._userContext['ISN_LCLASSIF'];
        }
        return null;
    }
    get curentUser(): IParamUserCl {
        return this._userContext;
    }
    get hashUserContext() {
        if (this._userContext) {
            return this._userContext['USER_PARMS_HASH'];
        }
        return null;
    }
    get isUserContexst() {
        return !!this._userContext;
    }
    get updateUser$(): Observable<void> {
        return this._updateUser$.asObservable();
    }
    get hasChanges$(): Observable<IUserSetChanges> {
        return this._hasChanges$.asObservable();
    }
    constructor(
        private _pipSrv: UserParamApiSrv,
        private _msgSrv: EosMessageService,
        private _pipRx: PipRX,
        private _storageSrv: EosStorageService,
        private _router: Router,
        private _modalSrv: BsModalService,
        private _appContext: AppContext,
        private _errorSrv: ErrorHelperServices,

    ) { }
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
            return Promise.reject(false);
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
                this.userEditOrgType = [];
                this._userContext['DUE_DEP_NAME'] = '';
                this._isTechUser = !this._userContext['DUE_DEP'];
                this._userContext['isTechUser'] = !this._userContext['DUE_DEP'];
                this._userContext.ACCESS_SYSTEMS = this._userContext['AV_SYSTEMS'].split('');
                this.SubEmail.next(this._userContext);

                if (this._userContext.USER_TECH_List) {
                    this._userContext.USER_TECH_List.forEach(item => this.userTechList.push(Object.assign({}, item)));
                }
                if (this._userContext.USER_RIGHT_DOCGROUP_List) {
                    this._userContext.USER_RIGHT_DOCGROUP_List.forEach(item => this.userRightDocgroupList.push(Object.assign({}, item)));
                }
                // if (this._userContext.USER_EDIT_ORG_TYPE_List) {
                //     this._userContext.USER_EDIT_ORG_TYPE_List.forEach(item => this.userEditOrgType.push(Object.assign({}, item)));
                // }
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
                    this._userContext['DUE_DEP_SURNAME'] = this._userContextDeparnment['SURNAME'];
                    this._userContext['DEPARTMENT_DUE'] = this._userContextDeparnment['DEPARTMENT_DUE'];
                }
                this._userContext = this._pipRx.entityHelper.prepareForEdit(this._userContext);
                this._updateUser$.next();
                return true;
            })
            .catch(err => {
                this._errorSrv.errorHandler(err);
                this._router.navigate(['user_param']);
                return false;
            });
    }
    fetchSysParams() {
        const querySys = {
            USER_PARMS: {
                criteries: {
                    ISN_USER_OWNER: '-99',
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

    getDepartmentFromUser(dueDep: string[]): Promise<DEPARTMENT[]> {
        return this._pipSrv.getData<DEPARTMENT>({ DEPARTMENT: dueDep });
    }
    getOrganizFromUser(due: string[]): Promise<ORGANIZ_CL[]> {
        return this._pipSrv.getData<ORGANIZ_CL>({ ORGANIZ_CL: due });
    }
    ProtocolService(isn: number, kind: number): Promise<any> {
        const protocol = () => {
            const url = `../UserInfo/UserOperations.asmx/WriteUserAudit?uisn=${isn}&event_kind=${kind}`;
            const protocolParam = this._userContext.USER_PARMS_List.find((parm) => parm.PARM_NAME === 'USER_EDIT_AUDIT');
            if (protocolParam && protocolParam.PARM_VALUE === 'YES') {
                return this._pipRx.read({
                    [url]: ALL_ROWS
                    // http://localhost/x1807/UserInfo/UserOperations.asmx/WriteUserAudit?uisn=73337&event_kind=1
                })
                    .catch((e) => {
                        if (e.code !== 200) {
                            this._msgSrv.addNewMessage({
                                type: 'warning',
                                title: 'Предупреждение',
                                msg: 'Ошибка протоколирования пользователя',
                                dismissOnTimeout: 6000,
                            });
                        }
                    });
            }
        };
        if (this._userContext && this._userContext.USER_PARMS_List) {
            return protocol();
        }
        return this.getUserIsn({
            expand: 'USER_PARMS_List',
            isn_cl: isn,
        })
        .then(() => protocol())
        .catch((e) => {
            const errMessage = e.message ? e.message : e;
            this._msgSrv.addNewMessage({
                type: 'danger',
                title: 'Ошибка протоколирования пользователя',
                msg: errMessage,
            });
        });
    }

    addRightsForCBRole(isn: number): Promise<any> {
        const changes = [];
        PipRX.invokeSop(changes, 'AdjustCbrUserRights', { isn_user: isn }, 'MERGE', false);
        return this._pipRx.batch(changes, '')
        .then()
        .catch((e) => {
            if (e.code !== 200) {
                this._msgSrv.addNewMessage({
                    type: 'warning',
                    title: 'Предупреждение',
                    msg: 'Ошибка добавления прав для ЦБ роли',
                    dismissOnTimeout: 6000,
                });
            }
        });
    }

    ceckOccupationDueDep(dueDep: string, dep: DEPARTMENT, isn?: boolean) {/* проверяем прикреплино ли должностное лицо к пользователю */
        const mess: IMessage = {
            title: 'Предупреждение:',
            msg: '',
            type: 'warning'
        };
        return this._pipSrv.getData<USER_CL>({ USER_CL: PipRX.criteries({ DUE_DEP: `${dep.DUE}` }) })
        .then((u: USER_CL[]) => {
            if (this._appContext.limitCardsUser.length > 0) {
                if (this._appContext.limitCardsUser.indexOf(dep.DEPARTMENT_DUE) !== -1) { // проверку написать на существующего пользователя
                    if (!u.length) {
                        return dep;
                    } else {
                        mess.msg = `Пользователь "${u[0].SURNAME_PATRON}" уже ассоциирован с выбранным ДЛ "${dep.CLASSIF_NAME}".`;
                    }
                } else {
                    mess.msg = `Выбранное ДЛ ${dep.CLASSIF_NAME} не принадлежит разрешенным Вам подразделениям.`;
                }
            } else {
                if (!u.length) {
                    return dep;
                }
                mess.msg = `Пользователь "${u[0].SURNAME_PATRON}" уже ассоциирован с выбранным ДЛ "${dep.CLASSIF_NAME}".`;
                if (isn && u[0]['ISN_LCLASSIF'] === this.userContextId) {
                    mess.msg = `Пользователь ${this.curentUser.SURNAME_PATRON} уже ассоциирован с выбранным ДЛ`;
                }
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
        return this._pipRx.read({
            USERSECUR: {
                criteries: {
                    ISN_LCLASSIF: String(isn_user)
                }
            }
        }).then(result => {
            if (result.length) {
                return true;
            } else {
                return false;
            }
        });
    }
    getSertSBaseParams(isn_cl?: string) {
        if (!isn_cl) {
            isn_cl = this._storageSrv.getItem('userEditableId');
        }
        return this._pipRx.read({
            USER_CERTIFICATE: {
                criteries: {
                    ISN_USER: isn_cl
                }
            }
        });
    }
    BatchData(type: string, requestUri: string, data?: Object): Promise<any[]> {
        let query;
        if (data !== undefined) {
            query = [{
                method: type,
                requestUri: requestUri,
                data: data
            }];
        } else {
            query = [{
                method: type,
                requestUri: requestUri,
            }];
        }
        return this._pipRx.batch(query, '');
    }
    confirmCallCard(card): Promise<any> {
        this.cardModal = this._modalSrv.show(card);
        return new Promise((res, _rej) => {
            this.SubmitCards.subscribe((confirm) => {
                if (confirm !== undefined) {
                    res(confirm);
                    this.cardModal.hide();
                }
            });
            this._modalSrv.onHide.subscribe(reason => {
                if (reason === 'backdrop-click' || reason === 'esc') {
                    res(null);
                }
            });
        });
    }

    CheckLimitTech(techList): boolean {
        let limitUser = false;
        techList.forEach((item) => {
            if (item.FUNC_NUM === 1) {
                limitUser = true;
            }
        });
        return limitUser;
    }

    getPhotoUser(due: string): Promise<any> {
        const query = {
            DEPARTMENT: {
                criteries: {
                    DUE: `${due}`
                }
            }
        };
        return this._pipRx.read(query);
    }

    getCabinetOwnUser(isnCabinet): Promise<any> {
        return this._pipRx.read<DEPARTMENT>({ DEPARTMENT: {
            criteries: {
                ISN_CABINET: isnCabinet,
            }
        }});
    }

    getUserCbRoles(due: string): Promise<any> {
        this.asistMansStr = '';
        const reqs = [
            this._pipRx.read({CBR_USER_ROLE: {
                criteries: {DUE_PERSON: due}
            }}),
            this._pipRx.read({CBR_USER_ROLE: {
                    criteries: {ISN_USER: this.curentUser.ISN_LCLASSIF},
                },
                orderby: 'WEIGHT',
            })
        ];
        return Promise.all(reqs).then((data: any[]) => {
            const asistMansData = data[0].filter(el => el.ISN_USER !== this.curentUser.ISN_LCLASSIF && (el.KIND_ROLE === 4 || el.KIND_ROLE === 5)).map(el => el.ISN_USER);
            if (asistMansData.length > 0) {
                return this.getUserCl(asistMansData).then((users: USER_CL[]) => {
                    const sortUsers =  users.sort((a, b) => a.SURNAME_PATRON > b.SURNAME_PATRON ? 1 : -1);
                    sortUsers.forEach(user => {
                        if (this.asistMansStr.indexOf(user.SURNAME_PATRON) === -1) {
                            this.asistMansStr += `${user.SURNAME_PATRON}(${user.NOTE})\n`;
                        }
                    });
                    if (data[1].length) {
                        return this.ParseRoles(data[1]);
                    }
                    return Promise.resolve([]);
                });
            } else {
                if (data[1].length) {
                    return this.ParseRoles(data[1]);
                }
                return Promise.resolve([]);
            }
        });
    }

    ParseRoles(roles: any[]): Promise<any> {
        const arrRoles = roles.filter(role => role.DUE_PERSON !== null).map(due => due.DUE_PERSON);
        if (arrRoles.length) {
            return this._pipRx.read<DEPARTMENT>({ DEPARTMENT: arrRoles}).then((dueName: any) => {
                const dueNames = new Map<string, string>();
                dueName.forEach((dep) => dueNames.set(dep.DUE, dep.CLASSIF_NAME));
                return Promise.resolve(this.parseData(roles, dueNames));
            });
        } else {
            return Promise.resolve(this.parseData(roles));
        }
    }

    parseData(data: any[], dueNames?: Map<string, string>): any[]  {
        const currentCbFields = [];
        data.forEach(el => {
            if (el.KIND_ROLE === 4 || el.KIND_ROLE === 5) {
                currentCbFields.push({role: KIND_ROLES_CB[el.KIND_ROLE - 1], dueName: dueNames.get(el.DUE_PERSON),
                due: el.DUE_PERSON, isnRole: el.ISN_USER_ROLE});
            } else if (this.asistMansStr && (el.KIND_ROLE === 1 || el.KIND_ROLE === 2 || el.KIND_ROLE === 3)) {
                currentCbFields.push({role: KIND_ROLES_CB[el.KIND_ROLE - 1], asistMan: this.asistMansStr, isnRole: el.ISN_USER_ROLE});
            } else {
                currentCbFields.push({role: KIND_ROLES_CB[el.KIND_ROLE - 1], isnRole: el.ISN_USER_ROLE});
            }
        });
        return currentCbFields;
    }

    clearRolesCb(startRolesCb: IRoleCB[]): any[] {
        const queryRoles = [];
        startRolesCb.forEach(role => {
            queryRoles.push({
                method: 'DELETE',
                requestUri: `CBR_USER_ROLE(${role.isnRole})`,
            });
        });
        return queryRoles;
    }

    getQueryFromRoles(currentCbFields: IRoleCB[], startRolesCb: IRoleCB[], due: string): any[] {
        const queryRoles = [];
        currentCbFields.forEach((field, indx) => {
            if (!field.isnRole) {
                const newElem = {
                    method: 'POST',
                    requestUri: `CBR_USER_ROLE(-99)`,
                    data: {
                        WEIGHT: indx + 1,
                        DUE_PERSON: field.hasOwnProperty('due') ? field.due : due,
                        KIND_ROLE: KIND_ROLES_CB.indexOf(field.role) + 1,
                        ISN_USER: this.curentUser.ISN_LCLASSIF,
                    }
                };
                if (queryRoles.filter(elem => JSON.stringify(newElem) === JSON.stringify(elem)).length === 0) {
                    queryRoles.push(newElem);
                }
           }
        });
        startRolesCb.forEach((old, index) => {
            const kindRole = KIND_ROLES_CB.indexOf(old.role);
            const weigthNow = currentCbFields[index] && currentCbFields[index].isnRole === old.isnRole ? false : true;
            if (kindRole === 3 || kindRole === 4 || weigthNow) {
                const repeatRole = currentCbFields.filter(cur => cur.isnRole === old.isnRole)[0];
                if (repeatRole) {
                    queryRoles.push({
                        method: 'MERGE',
                        requestUri: `CBR_USER_ROLE(${repeatRole.isnRole})`,
                        data: {
                            WEIGHT: currentCbFields.indexOf(repeatRole) + 1,
                            DUE_PERSON: repeatRole.due,
                            KIND_ROLE: kindRole + 1,
                            ISN_USER: this.curentUser.ISN_LCLASSIF,
                        }
                    });
                } else {
                    const checkArr = queryRoles.map(q => q.requestUri);
                    if (old.isnRole && checkArr && checkArr.indexOf(`CBR_USER_ROLE(${old.isnRole})`) === -1) {
                        queryRoles.push({
                            method: 'DELETE',
                            requestUri: `CBR_USER_ROLE(${old.isnRole})`,
                        });
                    }
                }
            } else {
                if (currentCbFields.filter(cur => cur.isnRole === old.isnRole).length === 0) {
                    const checkArr = queryRoles.map(q => q.requestUri);
                    if (old.isnRole && checkArr.indexOf(`CBR_USER_ROLE(${old.isnRole})`) === -1) {
                        queryRoles.push({
                            method: 'DELETE',
                            requestUri: `CBR_USER_ROLE(${old.isnRole})`,
                        });
                    }
                }
            }
        });
        return queryRoles;
    }

    getUserCl(isn: number|number[]) {
        let queryUser;
        if (typeof isn === 'number') {
            queryUser = {
                USER_CL: {
                    criteries: {
                        ISN_LCLASSIF: isn
                    }
                }
            };
        } else {
            queryUser = {
                USER_CL: isn,
            };
        }
        return this._pipRx.read<USER_CL>(queryUser);
    }

    getUserDepartment(isn_cl: number): Promise<any> {
        const queryCabinet = {
            DEPARTMENT: {
                criteries: {
                    ISN_NODE: String(isn_cl)
                }
            }
        };
        return this._pipRx.read(queryCabinet);
    }

    dropLogin(id, userT, clasName?): Promise<any> {
        if (userT && +userT === 1 && clasName) {
            return this._pipRx.batch([{
                method: 'MERGE',
                requestUri: `USER_CL(${id})`,
                data: {

                    CLASSIF_NAME: clasName,
                }
            }], '');
        } else {
            const url = `DropLogin?isn_user=${id}`;
            return this._pipRx.read({ [url]: ALL_ROWS });
        }
    }

    getSysTechUser(forCurrentUser: boolean = false): Promise<any> {
        return this._pipRx.read({
            USER_CL: {
                criteries: {
                    DELO_RIGHTS: '1%',
                    DELETED: '0',
                    ISN_LCLASSIF: '1:null'
                },
            },
            loadmode: 'Table',
            expand: 'USER_TECH_List'
        }).then((data: USER_CL[]) => {
            const countNotLim = [];
            let checkedUsers = [];
            if (forCurrentUser) {
                checkedUsers = data.filter(user => this.curentUser.ISN_LCLASSIF === user.ISN_LCLASSIF && !this.CheckLimitTech(user.USER_TECH_List));
            } else {
                const checkedUsersIsn = this.checkedUsers.map((user) => user.data.ISN_LCLASSIF);
                checkedUsers = data.filter(user => checkedUsersIsn.indexOf(user.ISN_LCLASSIF) !== -1 && !this.CheckLimitTech(user.USER_TECH_List));
            }
            for (const user of data) {
                if (!this.CheckLimitTech(user.USER_TECH_List) && user.TECH_RIGHTS.charAt(0) === '1') {
                    countNotLim.push(user);
                }
            }
            return countNotLim.length > checkedUsers.length ||
                (countNotLim.length === checkedUsers.length &&
                countNotLim.length && checkedUsers.length &&
                !countNotLim.some((user) => user.ISN_LCLASSIF === checkedUsers[0].ISN_LCLASSIF));
        });
    }

    closeWindowForCurrentSettings(isCurrentSettings: boolean) {
        if (isCurrentSettings) {
            window.close();
        }
    }

    private _createHash() {
        this._userContext['USER_PARMS_HASH'] = {};
        this._userContext['USER_PARMS_List'].forEach(item => {
            this._userContext['USER_PARMS_HASH'][item['PARM_NAME']] = item.PARM_VALUE;
        });
    }

}
