import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { PipRX } from 'eos-rest/services/pipRX.service';
import { UserPaginationService } from '../services/users-pagination.service';
import { DEPARTMENT, DOCGROUP_CL } from 'eos-rest';
import { ALL_ROWS } from 'eos-rest/core/consts';
import { Subject ,  Observable } from 'rxjs';
import { IConfig } from 'eos-user-select/shered/interfaces/user-select.interface';
import { UserSelectNode } from 'eos-user-select/list-user-select/user-node-select';
import { HelpersSortFunctions } from '../../../eos-user-select/shered/helpers/sort.helper';
import { IUserSort } from '../../../eos-user-select/shered/interfaces/user-select.interface';
import { SortsList } from '../../../eos-user-select/shered/interfaces/user-select.interface';
// import {EosStorageService} from '../../../../src/app/services/eos-storage.service';
@Injectable()
export class UserParamApiSrv {
    flagTehnicalUsers: boolean;
    flagDelitedPermanantly: boolean;
    sysParam: any;
    dueDep: any;
    srtConfig: IUserSort = {};
    configList: IConfig = {
        shooseTab: +sessionStorage.getItem('key') ? +sessionStorage.getItem('key') : 0,
        titleDue: '',
    };
    confiList$: Subject<IConfig>;
    currentSort: any = SortsList[3];
    private Allcustomer: UserSelectNode[] = [];
    private helpersClass;
    get _confiList$(): Observable<IConfig> {
        return this.confiList$.asObservable();
    }
    constructor(
        private apiSrv: PipRX,
        private _router: Router,
        private users_pagination: UserPaginationService,
        // private _storageSrv: EosStorageService,
    ) {
        this.helpersClass = new HelpersSortFunctions();
        this.initConfigTitle();
        this.flagTehnicalUsers = false;
        this.flagDelitedPermanantly = false;
        this.confiList$ = new Subject();
        this._confiList$.subscribe((data: IConfig) => {
            this.configList = data;
        });
        this.getSysParamForBlockedUser();
    }

    getData<T>(query?: any): Promise<T[]> {
        return this.apiSrv
            .read<T>(query)
            .then((data: T[]) => {
                return data;
                /*  return new Promise<T[]>(function() {
                      setTimeout(() => { console.log(data); }, 3000);
                  });*/
            })
            .catch(err => {
                if (err.code === 434) {
                    this._router.navigate(
                        ['/login'],
                        {
                            queryParams: {
                                returnUrl: this._router.url
                            }
                        }
                    );
                }
                throw err;
            });
    }

    setData(query: any[]): Promise<any[]> {
        return this.apiSrv.batch(query, '').then((data: any) => {
            return data;
        });
    }
    getQueryforDB(dueDep?) {
        let q;
        if (this.configList.shooseTab === 0) {
            if (!dueDep || dueDep === '0.') {
                q = ALL_ROWS;
            } else {
                q = PipRX.criteries({ DUE_DEP: `${dueDep}%` });
            }
        }
        if (this.configList.shooseTab === 1) {
            q = PipRX.criteries({ 'USERCARD.DUE': `${dueDep ? dueDep : '0.'}` });
        }
        return q;
    }

    getUsers(dueDep?: string): Promise<any> {
        this.dueDep = dueDep || '0.';
        const q = this.getQueryforDB(dueDep);
        const query = { USER_CL: q };
        return this.getData(query)
            .then(data => {
                const prepData = data.filter(user => user['ISN_LCLASSIF'] !== 0);
                return this.updatePageList(prepData, this.configList.shooseTab).then(res => {
                    this.Allcustomer = this._getListUsers(res).slice();
                    this.devideUsers();
                    this.initConfigTitle(dueDep);
                    this.users_pagination._initPaginationConfig(true);
                    return this.users_pagination.UsersList;
                });
            });
        // перенес в list-user-select.component что бы включить сортировку в выборку
        // .slice((this.users_pagination.paginationConfig.start - 1)
        //         * this.users_pagination.paginationConfig.length,
        //          this.users_pagination.paginationConfig.current
        //         * this.users_pagination.paginationConfig.length);
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

    devideUsers() {
        const prepareUser = this.prepareListUsers();
        if (this.flagTehnicalUsers && !this.flagDelitedPermanantly) {
            this.updateListUsersTech(prepareUser.techUser, prepareUser.happyUser);
        }

        if (!this.flagTehnicalUsers && this.flagDelitedPermanantly) {
            this.updateListUserDeleted(prepareUser.deletedUser, prepareUser.happyUser);
        }

        if (this.flagTehnicalUsers && this.flagDelitedPermanantly) {
            this.updateListUserAnyFlags(prepareUser.techUser, prepareUser.deletedUser, prepareUser.happyUser);
        }

        if (!this.flagTehnicalUsers && !this.flagDelitedPermanantly) {
            this.updateListUserEmptyFlags(prepareUser.happyUser);
        }
    }

    prepareListUsers(): {techUser: UserSelectNode[], deletedUser: UserSelectNode[], happyUser: UserSelectNode[]} {
        this.users_pagination.UsersList = this.Allcustomer.slice();
        const techUser = this.damnTesterTechUser();
        const deletedUser = this.damnTesterDeletedUser();
        const happyUser = this.damnTesterHappyUsers();
        return {
            techUser,
            deletedUser,
            happyUser
        };
    }
    findUsers(config) {
        const prepareList = this.prepareListUsers();
        if (config.TEH && !config.DEL_USER) {
            this.users_pagination.UsersList = this.helpersClass.findUsers([].concat(prepareList.techUser, prepareList.happyUser), config);
        }
        if (!config.TEH && config.DEL_USER) {
            this.users_pagination.UsersList = this.helpersClass.findUsers([].concat(prepareList.deletedUser, prepareList.happyUser), config);
        }
        if (config.TEH && config.DEL_USER) {
            this.users_pagination.UsersList = this.helpersClass.findUsers([].concat(prepareList.techUser, prepareList.happyUser, prepareList.deletedUser), config);
        }
        if (!config.TEH && !config.DEL_USER) {
            this.users_pagination.UsersList = this.helpersClass.findUsers(prepareList.happyUser, config);
        }
    }

    updateListUsersTech(userT: UserSelectNode[], userH: UserSelectNode[]) {
        const sortedT = this.helpersClass.sort(userT, this.srtConfig[this.currentSort].upDoun, this.currentSort);
        const sortedH = this.helpersClass.sort(userH, this.srtConfig[this.currentSort].upDoun, this.currentSort);
        this.users_pagination.UsersList = [].concat(sortedT, sortedH);
    }
    updateListUserDeleted(userD: UserSelectNode[], userH: UserSelectNode[]) {
        const sortedD = this.helpersClass.sort(userD, this.srtConfig[this.currentSort].upDoun, this.currentSort);
        const sortedH = this.helpersClass.sort(userH, this.srtConfig[this.currentSort].upDoun, this.currentSort);
        this.users_pagination.UsersList = [].concat(sortedD, sortedH);
    }
    updateListUserAnyFlags(userT, userD, userH) {
        const sortedT = this.helpersClass.sort(userT, this.srtConfig[this.currentSort].upDoun, this.currentSort);
        const sortedD = this.helpersClass.sort(userD, this.srtConfig[this.currentSort].upDoun, this.currentSort);
        const sortedH = this.helpersClass.sort(userH, this.srtConfig[this.currentSort].upDoun, this.currentSort);
        this.users_pagination.UsersList = [].concat(sortedD, sortedT, sortedH);
    }
    updateListUserEmptyFlags(userH) {
        const sortedH = this.helpersClass.sort(userH, this.srtConfig[this.currentSort].upDoun, this.currentSort);
        this.users_pagination.UsersList = sortedH;
    }

    damnTesterTechUser(): UserSelectNode[] {
        return this.users_pagination.UsersList.filter((userInfo: UserSelectNode) => {
            return userInfo.data.DUE_DEP === null && !userInfo.deleted;
        });
    }
    damnTesterDeletedUser(): UserSelectNode[] {
        return this.users_pagination.UsersList.filter((userInfo: UserSelectNode) => {
            return userInfo.deleted;
        });
    }
    damnTesterHappyUsers(): UserSelectNode[] {
        return this.users_pagination.UsersList.filter((userInfo: UserSelectNode) => {
            return userInfo.data.DUE_DEP !== null && !userInfo.deleted;
        });
    }

    getDepartment(due?: Array<string>): Promise<DEPARTMENT[]> {
        const query = { DEPARTMENT: due };
        return this.getData<DEPARTMENT>(query);
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

    blokedUser(users: UserSelectNode[]): Promise<any> {
        const ARRAY_QUERY_SET_DELETE = [];
        let data = {};
        users.forEach((user: UserSelectNode) => {
            if (user.isChecked || user.selectedMark) {
                if (user.blockedUser) {
                    data = {
                        DELETED: 0,
                    };
                } if (!user.blockedUser && !user.blockedSystem) {
                    data = {
                        DELETED: 1,
                    };
                } if (user.blockedSystem) {
                    data = {
                        DELETED: 0,
                        LOGIN_ATTEMPTS: 0
                    };
                }
                ARRAY_QUERY_SET_DELETE.push({
                    method: 'MERGE',
                    requestUri: `USER_CL(${user.id})`,
                    data: data
                });
                data = {};
            }
        });
        if (ARRAY_QUERY_SET_DELETE.length > 0) {
            return this.setData(ARRAY_QUERY_SET_DELETE).then(response => {
                return response;
            }).catch(error => {
                console.log(error);
            });
        } else {
            return Promise.resolve(false);
        }
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
        let valueForPadQuery = [];
        let padQuery;
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
                    const findDepartInfo = departments.filter(dapartInfo => {
                        return user.DUE_DEP === dapartInfo.DUE;
                    });
                    if (findDepartInfo.length > 0) {
                        user['DEPARTMENT_SURNAME'] = findDepartInfo[0].SURNAME;
                        user['DEPARTMENT_DYTU'] = findDepartInfo[0].DUTY;
                        user['DEPARTMENT_DELETE'] = findDepartInfo[0].DELETED;
                    } else {
                        user['DEPARTMENT_SURNAME'] = '';
                        user['DEPARTMENT_DYTU'] = '';
                        user['DEPARTMENT_DELETE'] = 0;
                    }
                });
                valueForPadQuery = Array.from(setQueryResult);
                valueForPadQuery.length > 0 ? padQuery = valueForPadQuery : padQuery = ['0000'];
                return this.getDepartment(padQuery)
                    .then(deepInfo => {
                        pageList.map(user => {
                            const findDue = deepInfo.filter(dueDeep => {
                                if (user.DUE_DEP === null) {
                                    return false;
                                } else {
                                    parseStringUserDue = user.DUE_DEP.split('.');
                                    return parseStringUserDue.slice(0, parseStringUserDue.length - 2).join('.') + '.' === dueDeep.DUE;
                                }
                            });
                            if (findDue.length > 0) {
                                user['DEPARTMENT'] = tabs === 0 ? (findDue[0].DUE === '0.' ? 'Все подраздения' : findDue[0].CLASSIF_NAME) : findDue[0].CARD_NAME;
                            } else {
                                user['DEPARTMENT'] = '...';
                            }
                        });
                        return pageList;
                    });
            });
    }
    initConfigTitle(dueDep?: string) {
        if (!this.configList.titleDue || !dueDep) {
            this.configList.titleDue = 'Все подразделения';
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
            checked: true,
        };
        this.srtConfig.fullDueName = {
            upDoun: false,
            checked: false,
        };
        this.srtConfig.tip = {
            upDoun: false,
            checked: false,
        };
    }

    private _getListUsers(data): UserSelectNode[] {
        const list: UserSelectNode[] = [];
        data.forEach(user => list.push(new UserSelectNode(user, this.sysParam)));
        return list;
    }

    // protected prepareForEdit(records: any[]): any[] {
    //     return records.map((record) => this.apiSrv.entityHelper.prepareForEdit(record));
    // }
}
