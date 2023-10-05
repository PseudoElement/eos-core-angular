// import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { PipRX } from '../../../eos-rest/services/pipRX.service';
import { UserPaginationService } from '../services/users-pagination.service';
import { DEPARTMENT, DOCGROUP_CL, ORGANIZ_CL, USER_CL, /* USER_CL */ } from '../../../eos-rest';
import { ALL_ROWS } from '../../../eos-rest/core/consts';
import { Subject, Observable } from 'rxjs';
import { IConfig } from '../../../eos-user-select/shered/interfaces/user-select.interface';
import { UserSelectNode } from '../../../eos-user-select/list-user-select/user-node-select';
// import { HelpersSortFunctions } from '../../../eos-user-select/shered/helpers/sort.helper';
import { IUserSort } from '../../../eos-user-select/shered/interfaces/user-select.interface';
import { SortsList } from '../../../eos-user-select/shered/interfaces/user-select.interface';
import { EosStorageService } from '../../../app/services/eos-storage.service';
import { IPaginationConfig } from '../../../eos-common/interfaces';
import { AppContext } from '../../../eos-rest/services/appContext.service';
import { ERROR_LOGIN } from '../../../app/consts/confirms.const';
import { ConfirmWindowService } from '../../../eos-common/confirm-window/confirm-window.service';
import { RETURN_URL, URL_LOGIN } from '../../../app/consts/common.consts';

// import {EosStorageService} from '../../../../src/app/services/eos-storage.service';
@Injectable()
export class UserParamApiSrv {
    flagTehnicalUsers: boolean;
    flagDelitedPermanantly: boolean;
    flagOnlyThisDepart: boolean = true;
    flagDisableUser: boolean = false;
    sysParam: any;
    dueDep: any = '0.';
    srtConfig: IUserSort = {};
    configList: IConfig = {
        shooseTab: +sessionStorage.getItem('key') ? +sessionStorage.getItem('key') : 0,
        titleDue: '',
    };
    hashSorting = new Map()
        .set('fullDueName', 'SURNAME_PATRON')
        .set('login', 'CLASSIF_NAME')
        .set('department', 'NOTE')
        .set('surnamePatron', 'SURNAME_PATRON');
    confiList$: Subject<IConfig>;
    currentSort: any = SortsList[1];
    searchRequest = {};
    searchState: boolean = false;
    stateTehUsers: boolean = false;
    stateDeleteUsers: boolean = false;
    stateDisableUser: boolean = false;
    stateOnlyThisDepart: boolean = false;
    public sortDelUsers = false;
    // private helpersClass;
    get _confiList$(): Observable<IConfig> {
        return this.confiList$.asObservable();
    }
    constructor(
        private apiSrv: PipRX,
        // private _router: Router,
        private users_pagination: UserPaginationService,
        private _storageSrv: EosStorageService,
        private _appContext: AppContext,
        private _confirmSrv: ConfirmWindowService,
    ) {
        this.initConfigTitle();
        this.flagTehnicalUsers = false;
        this.flagDelitedPermanantly = false;
        this.confiList$ = new Subject();
        this._confiList$.subscribe((data: IConfig) => {
            this.configList = data;
            sessionStorage.setItem('titleDue', this.configList.titleDue);
            this.resetConfigPagination();
        });
        this.getSysParamForBlockedUser();

    }

    getData<T>(query?: any): Promise<T[]> {
        return this.apiSrv
            .read<T>(query)
            .then((data: T[]) => {
                return data;
            })
            .catch(err => {
                if (err.code === 401) {
                    this._confirmSrv
                    .confirm2(ERROR_LOGIN)
                    .then((confirmed) => {
                        if (confirmed) {
                            document.location.assign(URL_LOGIN + RETURN_URL + document.location.href);
                        }
                    });
                    /* this._router.navigate(
                        ['/login'],
                        {
                            queryParams: {
                                returnUrl: this._router.url
                            }
                        }
                    ); */
                }
                throw err;
            });
    }

    setData(query: any[]): Promise<any[]> {
        return this.apiSrv.batch(query, '').then((data: any) => {
            return data;
        });
    }
    getQueryforDB(dueDep?, cabinet?, techDueDep?: string) {
        let q: any = {};
        let skip, top;
        const ob1 = {};
        const conf: IPaginationConfig = this._storageSrv.getItem('users');
        if (conf) {
            if (conf.showMore) {
                if (conf.current !== 2 && conf.start !== 1) {
                    top = ((conf.current - conf.start) * conf.length) + conf.length;
                } else {
                    top = conf.length * conf.current;
                }
                skip = conf.length * conf.start - conf.length;
            } else {
                top = conf.length;
                skip = conf.length * conf.current - conf.length;
            }
        } else {
            top = 10;
            skip = 0;
        }
        let propOrderBy;
        if (this.currentSort === 'login') {
            propOrderBy = 'CLASSIF_NAME';
            propOrderBy += this.srtConfig[this.currentSort].upDoun ? ' desc' : ' asc';
        } else if (this.currentSort === 'department') {
            propOrderBy = 'NOTE';
            propOrderBy += this.srtConfig[this.currentSort].upDoun ? ' desc' : ' asc';
        } else if (this.currentSort === 'fullDueName') {
            propOrderBy = 'SURNAME_PATRON';
            propOrderBy += this.srtConfig[this.currentSort].upDoun ? ' desc' : ' asc';
        }
        if (this.stateTehUsers) {
            propOrderBy = 'CLASSIF_NAME asc';
            ob1['DUE_DEP'] = 'isnull';
        }
        if (this.configList.shooseTab === 0) {
            if (!dueDep || dueDep === '0.') {
                ob1['ISN_LCLASSIF'] = '1:null';
                if(techDueDep) { 
                    ob1['TECH_DUE_DEP'] = techDueDep
                    ob1['USER_CL.DEP.DEPARTMENT_DUE'] =  techDueDep
                }
                q = {
                    USER_CL: PipRX.criteries(ob1),
                    top: `${top}`,
                    skip: `${skip}`,
                    inlinecount: 'allpages'
                };
                if (!this.flagTehnicalUsers && !this.flagDelitedPermanantly) {
                    ob1['DUE_DEP'] = 'isnotnull';
                    ob1['USER_CL.Removed'] = 'false';
                }
                if (this.flagDelitedPermanantly && !this.flagTehnicalUsers) {
                    ob1['USER_CL.Removed'] = 'true';
                }
                if (!this.flagDelitedPermanantly && this.flagTehnicalUsers) {
                    ob1['DUE_DEP'] = 'isnull';
                    ob1['USER_CL.Removed'] = 'false';
                }
                if (!this.flagDelitedPermanantly && !this.flagDisableUser) { // вот тут должно быть обновление
                    ob1['DELETED'] = 0;
                }
                if (this.currentSort === 'surnamePatron') {
                    propOrderBy = 'SURNAME_PATRON';
                    propOrderBy += this.srtConfig[this.currentSort].upDoun ? ' desc' : ' asc';
                }
                q.orderby = `${propOrderBy}`;
                q['loadmode'] = 'Table';
            } else {
                let ob = {};
                ob['DUE_DEP'] = `${dueDep}%`;
                if (!this.flagDelitedPermanantly && !this.flagDisableUser) { // вот тут должно быть обновление
                    ob['DELETED'] = 0;
                }
                q = {
                    USER_CL: PipRX.criteries(ob),
                    top: `${top}`,
                    skip: `${skip}`,
                    inlinecount: 'allpages',
                    loadmode: 'Table'
                };

                // отображение ДЛ из подчененных подразделений
                if (!this.flagOnlyThisDepart && this.dueDep !== '0.' && this.configList.shooseTab === 0) {
                    ob = { 'USER_CL.DEP.ISN_HIGH_NODE': `${sessionStorage.getItem('isnNodeMy')}` };
                    q['USER_CL'] = PipRX.criteries(ob);
                }
                if (this.currentSort === 'fullDueName') {
                    propOrderBy = 'SURNAME_PATRON';
                    propOrderBy += this.srtConfig[this.currentSort].upDoun ? ' desc' : ' asc';
                    ob['orderby'] = propOrderBy;
                } else {
                    q.orderby = `${propOrderBy}`;
                }
            }
        }

        if (this.configList.shooseTab === 1) {
            if (this.currentSort === 'fullDueName') {
                propOrderBy = 'SURNAME_PATRON';
                propOrderBy += this.srtConfig[this.currentSort].upDoun ? ' desc' : ' asc';
            }
            const ob = {};
            if (cabinet) {
                ob['USER_CL.avail_cabs'] = `${cabinet}`; //    avail_cabs
            } else {
                ob['USERCARD.DUE'] = `${dueDep ? dueDep : '0.'}`;
            }
            q = {
                USER_CL: PipRX.criteries(ob),
                orderby: `${propOrderBy}`,
                top: `${top}`,
                skip: `${skip}`,
                inlinecount: 'allpages',
                loadmode: 'Table'
            };
            if (this.flagDelitedPermanantly && !this.flagTehnicalUsers) {
                q.USER_CL.criteries['USER_CL.Removed'] = 'true';
            }
            if (!this.flagTehnicalUsers && !this.flagDelitedPermanantly) {
                q.USER_CL.criteries['DUE_DEP'] = 'isnotnull';
                q.USER_CL.criteries['USER_CL.Removed'] = 'false';
            }
        }
        return q;
    }

    getQueryForSearch() {
        const dbQuery = Object.assign({}, this._storageSrv.getItem('quickSearch'));
        const config = this._storageSrv.getItem('users');
        if (config.showMore) {
            if (config.current !== 2 && config.start !== 1) {
                dbQuery.top = ((config.current - config.start) * config.length) + config.length;
            } else {
                dbQuery.top = config.length * config.current;
            }
            dbQuery.skip = config.length * config.start - config.length;
        } else {
            dbQuery.top = config.length;
            dbQuery.skip = config.length * config.current - config.length;
        }

        let propOrderBy = this.hashSorting.get(this.currentSort);
        propOrderBy += this.srtConfig[this.currentSort].upDoun ? ' desc' : ' asc';
        dbQuery.orderby = propOrderBy;
        dbQuery.inlinecount = 'allpages';
        return dbQuery;
    }
    getSkipTo() {

    }
    resetConfigPagination() {
        if (this.users_pagination.paginationConfig) {
            this.users_pagination.resetConfig();
            this.users_pagination.saveUsersConf();
        }
        // dueDep = dueDep ? dueDep : '0.';
        // if (this.dueDep !== dueDep) {

        // }
    }
    getUsers(dueDep?: string, cabinet?: string, techDueDep?: string): Promise<any> {
        this.dueDep = dueDep || '0.';
        let q;
        if (this._storageSrv.getItem('quickSearch')) {
            q = this.getQueryForSearch();
        } else {
            q = this.getQueryforDB(dueDep, cabinet, techDueDep);
        }

        q._moreJSON = { CanTech: null };
        return this.getData(q)
            .then(data => {
                if (data.hasOwnProperty('TotalRecords') && data.length) {
                    this.users_pagination.totalPages = data['TotalRecords'];
                } else {
                    this.users_pagination.totalPages = data.length;
                }
                // если на данной сранице пользователей не осталось
                // то переходить на первую страницу
                if (!this.users_pagination.totalPages) {
                    let hasUsers = false;
                    const conf = this._storageSrv.getItem('users');
                    if (conf) {
                        if (conf.showMore && conf.start > 1) {
                            conf.start = 1;
                            hasUsers = true;
                        } else if (conf.current > 1) {
                            conf.current = 1;
                            hasUsers = true;
                        }
                        if (hasUsers) {
                            this._storageSrv.setItem('users', conf, true);
                            return this.getUsers(dueDep);
                        }
                    }
                }
                const prepData = data.filter(user => user['ISN_LCLASSIF'] !== 0);
                return this.updatePageList(prepData, this.configList.shooseTab).then((res) => {
                    this.users_pagination.UsersList = this._getListUsers(res);
                    this.initConfigTitle(dueDep);
                    this.users_pagination._initPaginationConfig(true);
                    this.users_pagination.saveUsersConf();
                    return this.users_pagination.UsersList;
                });
            });
    }
    getSysParamForBlockedUser() {
        const QUERY = {
            USER_PARMS: {
                criteries: {
                    PARM_NAME: 'MAX_LOGIN_ATTEMPTS',
                    ISN_USER_OWNER: '-99'
                }
            }
        };
        this.getData(QUERY).then(value => {
            this.sysParam = value[0]['PARM_VALUE'];
        });
    }

    getDepartment(due?: Array<string>): Promise<DEPARTMENT[]> {
        const query = { DEPARTMENT: due };
        return this.getData<DEPARTMENT>(query);
    }
    getOrganization(due?: Array<string>): Promise<ORGANIZ_CL[]> {
        const query = { ORGANIZ_CL: due };
        return this.getData<ORGANIZ_CL>(query);
    }
    getDocGroup(due?: string[]): Promise<DOCGROUP_CL[]> {
        let q;
        if (!due) {
            q = ALL_ROWS;
        } else {
            q = due;
        }
        const query = { DOCGROUP_CL: q };
        return this.getData<DOCGROUP_CL>(query);
    }
    getEntity<T>(apiInstance: string, due?: string): Promise<T[]> {
        let q;
        if (!due) {
            q = ALL_ROWS;
        } else {
            q = PipRX.criteries({ DUE: due });
        }
        const query = { [apiInstance]: q };
        return this.getData<T>(query);
    }

    blokedUser(users: UserSelectNode[], mainUser, lastAdmin): Promise<any> {
        const ARRAY_QUERY_SET_DELETE = [];
        let data = {};
        users.forEach((user: UserSelectNode) => {
            const cdAdm = lastAdmin ? user.data.IS_SECUR_ADM !== 1 : true;
            if (user.id !== +mainUser && user.isEditable && cdAdm) {
                data = {
                    DELETED: 1,
                };
                ARRAY_QUERY_SET_DELETE.push({
                    method: 'MERGE',
                    requestUri: `USER_CL(${user.id})`,
                    data: data
                });
                data = {};
            }
        });
        if (ARRAY_QUERY_SET_DELETE.length > 0) {
            return this.setData(ARRAY_QUERY_SET_DELETE);
        } else {
            return Promise.resolve(false);
        }
    }
    unlockUsers(users: UserSelectNode[]): Promise<any> {
        const query = users.map(_user => {
            if (_user.blockedSystem) {
                return {
                    method: 'MERGE',
                    requestUri: `USER_CL(${_user.id})`,
                    data: {
                        DELETED: 0,
                        LOGIN_ATTEMPTS: 0
                    }
                };
            } else {
                return {
                    method: 'MERGE',
                    requestUri: `USER_CL(${_user.id})`,
                    data: {
                        DELETED: 0,
                    }
                };
            }
        });
        return this.setData(query);
    }
    public updatePageList(pageList, curTab): Promise<any> {
        switch (curTab) {
            case 0:
                return this.updateDepartMent(pageList, 0);
            case 1:
                return this.updateDepartMent(pageList, 1);
            case 2:
                // заглушка для организций
                return this.updateDepartMent(pageList, 1);
        }

    }

    updateDepartMent(pageList, tabs) {
        const setQueryResult = new Set();
        let stringQuery: Array<string> = [];
        let parseStringUserDue = [];
        pageList.forEach(user => {
            if (user.DUE_DEP) {
                stringQuery.push(user.DUE_DEP);
            }
        });
        stringQuery.length === 0 ? stringQuery = ['0000'] : stringQuery = stringQuery;
        return this.getDepartment(stringQuery)
            .then(departments => {
                departments.forEach(el => {
                    if (el.ISN_HIGH_NODE >= 0) {
                        parseStringUserDue = el.DUE.split('.');
                        setQueryResult.add(parseStringUserDue.slice(0, parseStringUserDue.length - 2).join('.') + '.');
                    }
                });
                pageList.map(user => {
                    user['DEPARTMENT'] = user['NOTE'];
                    const findDepartInfo = departments.filter(dapartInfo => {
                        return user.DUE_DEP === dapartInfo.DUE;
                    });
                    if (findDepartInfo.length > 0) {
                        user['DEPARTMENT_SURNAME'] = findDepartInfo[0].SURNAME;
                        user['DEPARTMENT_DYTU'] = findDepartInfo[0].DUTY;
                        user['DEPARTMENT_DELETE'] = findDepartInfo[0].DELETED;
                        user['DEEP_DATA'] = findDepartInfo[0];
                    } else {
                        user['DEPARTMENT_SURNAME'] = '';
                        user['DEPARTMENT_DYTU'] = '';
                        user['DEPARTMENT_DELETE'] = 0;
                    }
                });
                return pageList;
            });
    }
    initConfigTitle(dueDep?: string) {
        if (!this.configList.titleDue || !dueDep) {
            this.configList.titleDue = sessionStorage.getItem('titleDue');
        }
        if (!this.configList.shooseTab) {
            this.configList.shooseTab = 0;
        }
    }

    initSort() {
        this.srtConfig.department = {
            upDoun: false,
            checked: false,
        };
        this.srtConfig.login = {
            upDoun: false,
            checked: false,
        };
        this.srtConfig.fullDueName = {
            upDoun: false,
            checked: false,
        };
        this.srtConfig.tip = {
            upDoun: false,
            checked: false,
        };
        this.srtConfig.surnamePatron = {
            upDoun: false,
            checked: true,
        };
    }

    public _getListUsers(data: USER_CL[]): UserSelectNode[] {
        const list: UserSelectNode[] = [];
        data.forEach(user => list.push(new UserSelectNode(user, this.sysParam, this._appContext.limitCardsUser)));
        return list;
    }
}
