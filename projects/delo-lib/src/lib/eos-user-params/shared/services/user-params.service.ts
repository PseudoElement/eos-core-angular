import { HTML_TEMPLATE_TITLE, HTML_TEMPLATE_DATA, HTML_TEMPLATE_DATE, HTML_TEMPLATE_SHORT_REPORT } from './../consts/user-param.consts';
import { Injectable } from '@angular/core';
import { UserParamApiSrv } from './user-params-api.service';
import { USER_CL, DEPARTMENT, PipRX, IEnt, ORGANIZ_CL } from '../../../eos-rest';
import { EosMessageService } from '../../../eos-common/services/eos-message.service';
import { IParamUserCl, IUserSetChanges, IGetUserCfg, IRoleCB } from '../intrfaces/user-parm.intterfaces';
import { Subject, Observable } from 'rxjs';
import { IMessage } from '../../../eos-common/interfaces';
import { ALL_ROWS } from '../../../eos-rest/core/consts';
import { EosStorageService } from '../../../app/services/eos-storage.service';
import { Router, RouterStateSnapshot } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { AppContext } from '../../../eos-rest/services/appContext.service';
import { ErrorHelperServices } from './helper-error.services';
import { KIND_ROLES_CB } from '../consts/user-param.consts';
import { ConfirmWindowService } from '../../../eos-common/confirm-window/confirm-window.service';
import { CONFIRM_UNAVAILABLE_SYSTEMS_AFTER_BLOCK } from '../../../eos-dictionaries/consts/confirm.consts';
import { saveAs } from 'file-saver';
import { HttpHeaders } from '@angular/common/http';
import { EosUserProfileService } from '../../../app/services/eos-user-profile.service';
import { UserSelectNode } from '../../../eos-user-select/list-user-select/user-node-select';
import { AbsoluteRigthServiceLib } from '../../../eos-rest/addons/absoluteRigth.service';
import { ETypeDeloRight } from '../../rights-delo/rights-delo-absolute-rights/absolute-rights.consts';
import { E_TECH_RIGHTS } from '../../rights-delo/rights-delo-absolute-rights/absolute-rights-classif/tech-user-classif.interface';


@Injectable()
export class UserParamsService {
    userTechList: any[] = [];
    userRightDocgroupList: any[] = [];
    userEditOrgType: any[] = [];
    checkedUsers: any[] = [];
    cardModal: BsModalRef;
    // используется только в настройках пользователей при сохранении настроек
    public mainUser;
    public SubEmail: Subject<any> = new Subject();
    public SubmitCards: Subject<any> = new Subject();
    public submitSave;
    public asistMansStr: string;
    private _saveFromAsk$: Subject<void> = new Subject<void>();
    private _updateUser$: Subject<void> = new Subject<void>();
    private _hasChanges$: Subject<IUserSetChanges> = new Subject<IUserSetChanges>();
    private _canDeactivateSubmit$: Subject<RouterStateSnapshot> = new Subject<RouterStateSnapshot>();
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
    get canDeactivateSubmit$(): Observable<RouterStateSnapshot> {
        return this._canDeactivateSubmit$.asObservable();
    }
    get updateUser$(): Observable<void> {
        return this._updateUser$.asObservable();
    }
    get hasChanges$(): Observable<IUserSetChanges> {
        return this._hasChanges$.asObservable();
    }
    get CanEdit() {
        return !!this.curentUser._more_json['CanTech'];
    }
    get getAppContextIsCB() {
        return this._appContext.cbBase;
    }
    constructor(
        private _pipSrv: UserParamApiSrv,
        private _msgSrv: EosMessageService,
        private _pipRx: PipRX,
        private _storageSrv: EosStorageService,
        private _router: Router,
        private _modalSrv: BsModalService,
        private _appContext: AppContext,
        private _confirmSrv: ConfirmWindowService,
        private _errorSrv: ErrorHelperServices,
        private _userProfiler: EosUserProfileService,
        private _absRigthSer: AbsoluteRigthServiceLib

    ) { }
    getUserIsn(cfg?: IGetUserCfg): Promise<boolean> {
        const defaultExpand: string = `USER_PARMS_List,
                                       USERCARD_List/USER_CABINET_List,
                                       USER_RIGHT_DOCGROUP_List,
                                       USERDEP_List,
                                       USERCARD_List/USER_CARD_DOCGROUP_List,
                                       NTFY_USER_EMAIL_List,
                                       USER_TECH_List,
                                       USER_SRCH_GROUP_List`;
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
            _moreJSON: { CanTech: null },
            expand: expand
        };

        const _user = this._pipSrv.getData<USER_CL>(queryUser);
        const _sys = this.fetchSysParams();

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
                if (this._userContext['USER_EDIT_ORG_TYPE_List']) {
                    this.userEditOrgType = this._absRigthSer.getUserEditOrgType(this._userContext['USER_EDIT_ORG_TYPE_List']);
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
                    this._userContext['DUE_DEP_SURNAME'] = this._userContextDeparnment['SURNAME'];
                    this._userContext['DEPARTMENT_DUE'] = this._userContextDeparnment['DEPARTMENT_DUE'];
                    this._userContext['DEPARTMENT_DELETE'] = !!this._userContextDeparnment['DELETED'];
                }
                this._userContext = this._pipRx.entityHelper.prepareForEdit(this._userContext);
                this._updateUser$.next();
                return true;
            })
            .catch(err => {
                this._errorSrv.errorHandler(err);
                // если нас не открыли с настроек пользователя, то редиректим
                if (!this._userProfiler.openWithCurrentUserSettings) {
                    this._router.navigate(['user_param']);
                }
                return false;
            });
    }

    fetchSysParams() {
        const querySys = {
            USER_PARMS: {
                criteries: {
                    ISN_USER_OWNER: '-99',
                    PARM_NAME: 'CHANGE_PASS||CATEGORIES_FOR_USER||USER_EDIT_AUDIT'
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
            const url = `../FOP/WriteUserAudit/${kind}/${isn}`;
            // const protocolParam = this._userContext.USER_PARMS_List.find((parm) => parm.PARM_NAME === 'USER_EDIT_AUDIT');
            if (this._sysParams['USER_EDIT_AUDIT'] === 'YES') {
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
                    if(isn && u[0]['ISN_LCLASSIF'] === this.userContextId) return;
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
    setCanDeactivateSubmit(router: RouterStateSnapshot) {
        this._canDeactivateSubmit$.next(router);
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
        return this._pipRx.read<DEPARTMENT>({
            DEPARTMENT: {
                criteries: {
                    ISN_CABINET: isnCabinet,
                }
            }
        });
    }

    getUserCbRoles(due: string): Promise<any> {
        this.asistMansStr = '';
        const reqs = [
            this._pipRx.read({
                CBR_USER_ROLE: {
                    criteries: { DUE_PERSON: due }
                }
            }),
            this._pipRx.read({
                CBR_USER_ROLE: {
                    criteries: { ISN_USER: this.curentUser.ISN_LCLASSIF },
                },
                orderby: 'WEIGHT',
            })
        ];
        return Promise.all(reqs).then((data: any[]) => {
            const asistMansData = data[0].filter(el => el.ISN_USER !== this.curentUser.ISN_LCLASSIF && (el.KIND_ROLE === 4 || el.KIND_ROLE === 5)).map(el => el.ISN_USER);
            if (asistMansData.length > 0) {
                return this.getUserCl(asistMansData).then((users: USER_CL[]) => {
                    const sortUsers = users.sort((a, b) => a.SURNAME_PATRON > b.SURNAME_PATRON ? 1 : -1);
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
            return this._pipRx.read<DEPARTMENT>({ DEPARTMENT: arrRoles }).then((dueName: any) => {
                const dueNames = new Map<string, string>();
                dueName.forEach((dep) => dueNames.set(dep.DUE, dep.CLASSIF_NAME));
                return Promise.resolve(this.parseData(roles, dueNames));
            });
        } else {
            return Promise.resolve(this.parseData(roles));
        }
    }

    parseData(data: any[], dueNames?: Map<string, string>): any[] {
        const currentCbFields = [];
        data.forEach(el => {
            if (el.KIND_ROLE === 4 || el.KIND_ROLE === 5) {
                currentCbFields.push({
                    role: KIND_ROLES_CB[el.KIND_ROLE - 1], dueName: dueNames.get(el.DUE_PERSON),
                    due: el.DUE_PERSON, isnRole: el.ISN_USER_ROLE
                });
            } else if (this.asistMansStr && (el.KIND_ROLE === 1 || el.KIND_ROLE === 2 || el.KIND_ROLE === 3)) {
                currentCbFields.push({ role: KIND_ROLES_CB[el.KIND_ROLE - 1], asistMan: this.asistMansStr, isnRole: el.ISN_USER_ROLE });
            } else {
                currentCbFields.push({ role: KIND_ROLES_CB[el.KIND_ROLE - 1], isnRole: el.ISN_USER_ROLE });
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

    getUserCl(isn: number | number[]) {
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
    сhangeLogin(id, userT, clasName?): Promise<any> {
        let url = 'ChangeLogin?';
        url += `isn_user=${id}`;
        url += `&userType=${userT}`;
        url += `&classifName='${clasName}'`;
        url += `&pass='1'`;
        const request = {
            method: 'POST',
            requestUri: url,
        };
        return this._pipRx.batch([request], '');
    }
    dropLogin(id, userT, clasName?): Promise<any> {
        if (userT && +userT === 1 && clasName) {
            return this._pipRx.batch([{
                method: 'MERGE',
                requestUri: `USER_CL(${id})`,
                data: {

                    CLASSIF_NAME: ('' + clasName).toUpperCase(),
                }
            }], '');
        } else {
            const url = `DropLogin?isn_user=${id}`;
            return this._pipRx.read({ [url]: ALL_ROWS });
        }
    }
    getQueryTech() {
        return this._pipRx.read<USER_CL>({
            USER_CL: {
                criteries: {
                    DELO_RIGHTS: '1%',
                    TECH_RIGHTS: '1%',
                    DELETED: '0',
                    /** ^0 это владелец БД его не учитываем */
                    ISN_LCLASSIF: `^0|${this.curentUser.ISN_LCLASSIF}`,
                    AV_SYSTEMS: '_1%',
                    ORACLE_ID: 'isnotnull',
                    'USER_TECH.FUNC_NUM': '^1'
                },
            },
            skip: 0,
            top: 2,
            orderby: 'ISN_LCLASSIF',
            loadmode: 'Table'
        });
    }
    getSysTechUser(curUser: { oldRights: string[], newRights: string[], editUser: IParamUserCl } = null, checkedUser = this.checkedUsers): Promise<any> {
        /** проверка галочки системный технолог */
        let limitTechUser = false;
        let checkedUsersIsn = '';
        /** проверка ограничений на пользователи */
        let checkLimitTech = true;
        let checkUser = true;
        if (curUser && curUser.editUser) {
            checkUser = curUser.editUser.TECH_RIGHTS && curUser.editUser.TECH_RIGHTS[E_TECH_RIGHTS.Users - 1] === '1';
        } else {
            checkedUser.forEach((user) => {
                if (user.TECH_RIGHTS && user.TECH_RIGHTS[E_TECH_RIGHTS.Users - 1] !== '1' && checkUser) {
                    checkUser = false;
                }
            });
        }
        /** проверка галочки пользователи */
        if (!curUser) {
            checkedUsersIsn = checkedUser.map((user) => `^${user.data.ISN_LCLASSIF}|`).join('');
        } else {
            limitTechUser = curUser.oldRights[+ETypeDeloRight.SystemTechnologist] === '1' && curUser.newRights[+ETypeDeloRight.SystemTechnologist] === '0';
            checkedUsersIsn = `^${this.curentUser.ISN_LCLASSIF}`;
        }
        if (curUser) {
            this.userTechList.forEach((tech) => {
                if (tech['FUNC_NUM'] === E_TECH_RIGHTS.Users) {
                    checkLimitTech = false;
                }
            });
        }
        if (!limitTechUser && curUser && checkLimitTech && checkUser) {
            return Promise.resolve(false);
        }
        return this._pipRx.read<USER_CL>({
            USER_CL: {
                criteries: {
                    DELO_RIGHTS: '1%',
                    TECH_RIGHTS: '1%',
                    DELETED: '0',
                    /** ^0 это владелец БД его не учитываем */
                    ISN_LCLASSIF: `^0|${checkedUsersIsn}`,
                    AV_SYSTEMS: '_1%',
                    ORACLE_ID: 'isnotnull',
                    'USER_TECH.FUNC_NUM': '^1'
                },
            },
            skip: 0,
            top: 2,
            orderby: 'ISN_LCLASSIF',
            loadmode: 'Table'
        }).then((data: USER_CL[]) => {
            return !(data.length !== 0);
        });
    }

    closeWindowForCurrentSettings(isCurrentSettings: boolean) {
        if (isCurrentSettings) {
            window.close();
        }
    }

    /**
     * @method checkAvailableDep проверяет доступность конкретного подразделения
     * пользователю соответственно USER_TECH_List
     * @param depDue - DUE Подразделения
     * @param techList - Список доступности подразделений
     */
    checkAvailableDep(depDue: string, techList: any[]): boolean {
        let availble = false;
        let currentDep = '';
        if (techList && techList.length) {
            techList.forEach((tech) => {
                if (depDue.indexOf(tech.DUE) !== -1 && currentDep.length < tech.DUE.length) {
                    availble = Boolean(tech.ALLOWED);
                    currentDep = tech.DUE;
                }
            });
        }
        return availble;
    }

    /**
     * @method getParmValueByParmName возвращает значение <PARM_VALUE> параметра
     * <PARM_NAME> из массива параметров,
     * при отсутствии возвращает : null
     */
    public getParmValueByParmName(paramsArr: any[], parmName: string) {
        if (paramsArr && paramsArr.length && parmName) {
            const value = paramsArr.find((parm) => parm.PARM_NAME === parmName);
            if (value) {
                return value.PARM_VALUE;
            }
        }
        return null;
    }

    /**
     * @method createShortReportHtml создает html файл
     * кратких сведений о выбранных пользователях
     */
    createShortReportHtml(data) {
        let htmlUserData = '';
        let aboutInfo = 'о выбранных пользователях';
        if (data && data.length) {
            data.forEach((user, index) => {
                htmlUserData += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${user.department || ''}</td>
                    <td>${user.name || ''}</td>
                    <td>${user.login || ''}</td>
                </tr>
                `;
            });
        }
        if (data && data.length === 1) {
            aboutInfo = data[0].login;
        }
        const time = new Date().toLocaleString();
        const htmlTitle = `Краткие сведения ${aboutInfo}`;
        const html: string = HTML_TEMPLATE_SHORT_REPORT
            .replace(HTML_TEMPLATE_TITLE, htmlTitle)
            .replace(HTML_TEMPLATE_TITLE, htmlTitle)
            .replace(HTML_TEMPLATE_DATA, htmlUserData)
            .replace(HTML_TEMPLATE_DATE, time);

        const blobHtml = new Blob([html], { type: 'text/html;charset=utf-8' });
        saveAs(blobHtml, `${htmlTitle}.html`);
    }

    /**
     * @method createFullReportHtml создает html файл
     * сведений о выбранных пользователях
     */
    public createFullReportHtml(url: string, title: string): Promise<any> {
        const options = {
            withCredentials: true,
            headers: new HttpHeaders({
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
                'Content-Type': 'text/plain; charset=utf-8'
            }),
            responseType: 'text' as 'text',
        };

        return this._pipRx.getHttp_client().get(url, options)
            .toPromise()
            .then((html) => {
                const blobHtml = new Blob([html], { type: 'text/html;charset=utf-8' });
                saveAs(blobHtml, `${title}.html`);
            });
    }

    /**
     * @method getLicenseInfo получает список лицензий
     */
    getLicenseInfo(): Promise<any[]> {
        return this._pipRx.read<any>({
            LicenseInfo: ALL_ROWS
        })
            .then((ans) => {
                let licenseInfo = [];
                if (typeof (ans) === 'string') {
                    licenseInfo = JSON.parse(ans);
                } else {
                    licenseInfo = (ans && ans.length && [...ans]) || [];
                }

                return licenseInfo;
            });
    }

    /**
     * @method checkLicenseCount проверяет хватит ли лицензий
     * выбранным пользователям
     */
    checkLicenseCount(users: UserSelectNode[] = [], systems = {}): Promise<boolean> {
        if (!users.length) {
            return Promise.resolve(true);
        }
        const selectedUsers: UserSelectNode[] = users;
        const licenseMap: Map<number, any> = new Map();
        let hasCrowded = false;

        return this.getLicenseInfo().then((licenseInfo) => {
            if (licenseInfo && licenseInfo.length) {
                licenseInfo.forEach((lic) => {
                    if (lic.Users) {
                        licenseMap.set(lic.Id, {
                            max: lic.Users,
                            cur: lic.ActualUsers,
                        });
                    }
                });
                selectedUsers.forEach((user: UserSelectNode) => {
                    if (user.data && user.data.AV_SYSTEMS && user.data.AV_SYSTEMS.length) {
                        user.data.AV_SYSTEMS.split('').forEach((system, index) => {
                            const id = index + 1;
                            const lic = licenseMap.get(id);

                            if (lic && Number(system)) {
                                let { cur } = lic;
                                cur += user.blockedUser ? 1 : 0;
                                licenseMap.set(id, {
                                    ...lic,
                                    cur
                                });
                            }
                        });
                    }
                });
                CONFIRM_UNAVAILABLE_SYSTEMS_AFTER_BLOCK.bodyList = ['Заблокированных технологом пользователей невозможно разблокировать.'];
                Object.keys(systems).forEach((key) => {
                    const system = systems[key];
                    const lic = licenseMap.get(system.id);
                    if (key !== 'delowebKL' && lic && (lic.max - lic.cur) < 0) { // Пользователей с КЛ можно зарегистрировать сколько угодно
                        hasCrowded = true;
                        CONFIRM_UNAVAILABLE_SYSTEMS_AFTER_BLOCK.bodyList.push(
                            `Количество пользователей подсистемы '${system.label}' не может превышать ${lic.max}`
                        );
                    }
                });

                if (hasCrowded) {
                    return this._confirmSrv.confirm2(CONFIRM_UNAVAILABLE_SYSTEMS_AFTER_BLOCK).then(() => {
                        return false;
                    });
                }
            }
            return true;
        });
    }

    private _createHash() {
        this._userContext['USER_PARMS_HASH'] = {};
        this._userContext['USER_PARMS_List'].forEach(item => {
            this._userContext['USER_PARMS_HASH'][item['PARM_NAME']] = item.PARM_VALUE;
        });
    }

}
