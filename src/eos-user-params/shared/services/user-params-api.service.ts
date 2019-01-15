import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { PipRX } from 'eos-rest/services/pipRX.service';
import {UserPaginationService} from '../services/users-pagination.service';
import { USER_CL, DEPARTMENT, DOCGROUP_CL } from 'eos-rest';
import { ALL_ROWS } from 'eos-rest/core/consts';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';
import { IConfig } from 'eos-user-select/shered/interfaces/user-select.interface';
@Injectable()
export class UserParamApiSrv {
    flagAllUser: boolean;
    configList: IConfig = {
        shooseTab: 0,
        titleDue: '',
    };
    confiList$: Subject<IConfig>;
    private Allcustomer: USER_CL[] = [];
    get _confiList$(): Observable<IConfig> {
        return this.confiList$.asObservable();
    }
    constructor(
        private apiSrv: PipRX,
        private _router: Router,
        private users_pagination: UserPaginationService,
    ) {
        this.initConfigTitle();
        this.flagAllUser = true;
        this.confiList$ = new Subject();
        this._confiList$.subscribe((data: IConfig) => {
           this.configList = data;
        });
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

    getUsers(dueDep?: string): Promise<USER_CL[]> {
        let q;
        if (!dueDep) {
            q = ALL_ROWS;
        } else {
            q = PipRX.criteries({DUE_DEP: `${dueDep}%`});
        }
        const query = {USER_CL: q};

        return this.getData<USER_CL>(query)
        .then(data => {
        this.Allcustomer =  data.filter(user => user.ISN_LCLASSIF !== 0 && user.CLASSIF_NAME !== ' ');
        this.users_pagination.UsersList = this.Allcustomer.slice();
        this.devideUsers();
        this.initConfigTitle(dueDep);
        this.users_pagination._initPaginationConfig();
           return this.users_pagination.UsersList.slice((this.users_pagination.paginationConfig.start - 1)
            * this.users_pagination.paginationConfig.length,
             this.users_pagination.paginationConfig.current
            * this.users_pagination.paginationConfig.length);
        });
    }

    devideUsers() {
        if (this.flagAllUser) {
            this.users_pagination.UsersList = this.Allcustomer.filter(user => {
                if (user.DUE_DEP) {
                    return user;
                }
            });
        } else {
            this.users_pagination.UsersList = this.Allcustomer.slice();
            this.users_pagination.UsersList.sort(function(a, b){
                if (a.DUE_DEP === null && b.DUE_DEP !== null) {
                    return -1;
                }  else if (a.DUE_DEP !== null && b.DUE_DEP === null) {
                    return 1;
                }   else {
                    return 0;
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
                }else {
                    user['DEPARTMENT_SURNAME'] = 'Технический';
                    user['DEPARTMENT_DYTU'] = 'пользовалтель';
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
    // protected prepareForEdit(records: any[]): any[] {
    //     return records.map((record) => this.apiSrv.entityHelper.prepareForEdit(record));
    // }
}
