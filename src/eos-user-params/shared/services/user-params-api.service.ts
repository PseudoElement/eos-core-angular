import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { PipRX } from 'eos-rest/services/pipRX.service';
import {UserPaginationService} from '../services/users-pagination.service';
import { DEPARTMENT, DOCGROUP_CL } from 'eos-rest';
import { ALL_ROWS } from 'eos-rest/core/consts';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';
import { IConfig } from 'eos-user-select/shered/interfaces/user-select.interface';
import { UserSelectNode } from 'eos-user-select/list-user-select/user-node-select';
@Injectable()
export class UserParamApiSrv {
    flagTehnicalUsers: boolean;
    flagDelitedPermanantly: boolean;
    sysParam: any;
    dueDep: any;
    configList: IConfig = {
        shooseTab: 0,
        titleDue: '',
    };
    confiList$: Subject<IConfig>;
    private Allcustomer: UserSelectNode[] = [];
    get _confiList$(): Observable<IConfig> {
        return this.confiList$.asObservable();
    }
    constructor(
        private apiSrv: PipRX,
        private _router: Router,
        private users_pagination: UserPaginationService,
    ) {
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

    getUsers(dueDep?: string): Promise<any> {
        this.dueDep = dueDep || '0.';
        let q;
        if (!dueDep) {
            q = ALL_ROWS;
        } else {
            q = PipRX.criteries({DUE_DEP: `${dueDep}%`});
        }
        const query = {USER_CL: q};
        return this.getData(query)
        .then(data => {
            const prepData = data.filter(user => user['ISN_LCLASSIF'] !== 0);
            return this.updatePageList(prepData, this.configList.shooseTab).then(res => {
                this.Allcustomer = this._getListUsers(res).slice();
                this.users_pagination.UsersList = this.Allcustomer.slice();
                this.devideUsers();
                this.initConfigTitle(dueDep);
                this.users_pagination._initPaginationConfig();
                   return this.users_pagination.UsersList.slice((this.users_pagination.paginationConfig.start - 1)
                    * this.users_pagination.paginationConfig.length,
                     this.users_pagination.paginationConfig.current
                    * this.users_pagination.paginationConfig.length);
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

    devideUsers() {
        this.users_pagination.UsersList = this.Allcustomer.slice();
        if (this.flagTehnicalUsers && !this.flagDelitedPermanantly) {
            this.users_pagination.UsersList = this.Allcustomer.filter((user: UserSelectNode) => {
                if ((user.data.DUE_DEP && !user.deleted) || (user.data.DUE_DEP === null && !user.deleted)) {
                    return user;
                }
            }).sort(function(a, b){
                if (a.data.DUE_DEP === null && b.data.DUE_DEP !== null) {
                    return -1;
                }  else if (a.data.DUE_DEP !== null && b.data.DUE_DEP === null) {
                    return 1;
                }   else {
                    return 0;
                }
            });
        }
        if (!this.flagTehnicalUsers && this.flagDelitedPermanantly) {
            this.users_pagination.UsersList = this.Allcustomer.filter(user => {
                if (user.data.DUE_DEP || user.deleted) {
                    return user;
                }
            });
        }

        if (this.flagTehnicalUsers && this.flagDelitedPermanantly) {
            this.users_pagination.UsersList = this.Allcustomer.slice();
            this.users_pagination.UsersList.sort(function(a, b){
                if (a.data.DUE_DEP === null && b.data.DUE_DEP !== null) {
                    return -1;
                }  else if (a.data.DUE_DEP !== null && b.data.DUE_DEP === null) {
                    return 1;
                }   else {
                    return 0;
                }
            });
        }

        if (!this.flagTehnicalUsers && !this.flagDelitedPermanantly) {
            this.users_pagination.UsersList = this.Allcustomer.slice();
            this.users_pagination.UsersList =  this.Allcustomer.filter(user => {
                if (user.data.DUE_DEP !== null && !user.deleted) {
                    return user;
                }
            });
        }
    }

    // getMainUsersList(): Array<USER_CL> {
    //     if (this.flagDepartment) {
    //         return this.official;
    //     } else {
    //         return this.customer.concat(this.official);
    //     }
    // }

    grtDepartment(due?: string): Promise<DEPARTMENT[]> {
        let q;
        if (!due) {
            q = ALL_ROWS;
        } else {
            q = PipRX.criteries({DUE: due});
        }
        const query = {DEPARTMENT: q};
        return this.getData<DEPARTMENT>(query);
    }
    grtDepartmentParent(due?: string): Promise<DEPARTMENT[]> {
        let q;
        if (!due) {
            q = ALL_ROWS;
        } else {
            q = PipRX.criteries({ISN_NODE: due});
        }
        const query = {DEPARTMENT: q};
        return this.getData<DEPARTMENT>(query);
    }
    getDocGroup(due?: string): Promise<DOCGROUP_CL[]> {
        let q;
        if (!due) {
            q = ALL_ROWS;
        } else {
            q = PipRX.criteries({DUE: due});
        }
        const query = {DOCGROUP_CL: q};
        return this.getData<DOCGROUP_CL>(query);
    }

    blokedUser(users: UserSelectNode[]): Promise<any> {
        const ARRAY_QUERY_SET_DELETE = [];
        let data = {};
        users.forEach((user: UserSelectNode) => {
            if (user.isChecked) {
                  if (user.blockedUser) {
                    data = {
                        DELETED : 0,
                    };
                } if (!user.blockedUser && !user.blockedSystem) {
                    data = {
                        DELETED : 1,
                    };
                } if (user.blockedSystem) {
                    data = {
                        DELETED: 0,
                        LOGIN_ATTEMPTS: 0
                    };
                }
            }
            ARRAY_QUERY_SET_DELETE.push({
                method: 'MERGE',
                requestUri: `USER_CL(${user.id})`,
                data: data
            });
            data = {};
        });
        if (ARRAY_QUERY_SET_DELETE.length > 0) {
         return  this.setData(ARRAY_QUERY_SET_DELETE).then(response => {
             return response;
            }).catch(error => {
                console.log('error');
            });
        }   else {
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
        let stringQuery: string = '';
        let valueForPadQuery = [];
        let padQuery;
        let parseStringUserDue = [];
        pageList.forEach(user => {
            if (user.DUE_DEP) {
                stringQuery += user.DUE_DEP + '|';
            }
        });
        stringQuery === '' ? stringQuery = '0000' : stringQuery = stringQuery;
        return  this.grtDepartment(stringQuery)
        .then(departments => {
            departments.forEach(el => {
                if (el.ISN_HIGH_NODE) {
                    setQueryResult.add(el.ISN_HIGH_NODE);
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
                }else {
                    user['DEPARTMENT_SURNAME'] = '';
                    user['DEPARTMENT_DYTU'] = '';
                    user['DEPARTMENT_DELETE'] = 0;
                }
            });
            valueForPadQuery = Array.from(setQueryResult);
            valueForPadQuery.length > 0 ? padQuery =  valueForPadQuery.join('|') : padQuery = '0000';
                return  this.grtDepartmentParent(padQuery)
                .then(deepInfo => {
                    pageList.map(user => {
                    const findDue = deepInfo.filter(dueDeep => {
                        if (user.DUE_DEP === null) {
                            return false;
                        }   else {
                            parseStringUserDue = user.DUE_DEP.split('.');
                            return parseStringUserDue.slice(0, parseStringUserDue.length - 2).join('.') + '.' === dueDeep.DUE;
                        }
                    });
                    if (findDue.length > 0) {
                        user['DEPARTMENT'] = tabs === 0 ? findDue[0].CLASSIF_NAME : findDue[0].CARD_NAME;
                    } else {
                        user['DEPARTMENT'] = '';
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

    private _getListUsers (data): UserSelectNode[] {
        const list: UserSelectNode[] = [];
        data.forEach(user => list.push(new UserSelectNode(user, this.sysParam)));
        return list;
    }

    // protected prepareForEdit(records: any[]): any[] {
    //     return records.map((record) => this.apiSrv.entityHelper.prepareForEdit(record));
    // }
}
