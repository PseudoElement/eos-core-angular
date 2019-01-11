import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { PipRX } from 'eos-rest/services/pipRX.service';
import {UserPaginationService} from '../services/users-pagination.service';
import { USER_CL, DEPARTMENT, DOCGROUP_CL } from 'eos-rest';
import { ALL_ROWS } from 'eos-rest/core/consts';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';
@Injectable()
export class UserParamApiSrv {
    flagAllUser: boolean;
    configList = {};
    confiList$: Subject<any>;
    private Allcustomer: USER_CL[] = [];
    get _confiList$(): Observable<{[key: string]: number|string}> {
        return this.confiList$.asObservable();
    }
    constructor(
        private apiSrv: PipRX,
        private _router: Router,
        private users_pagination: UserPaginationService,
    ) {
        this.flagAllUser = true;
        this.confiList$ = new Subject();
        this._confiList$.subscribe(data => {
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

    public updatePageList(pageList): Promise<any> {
        let stringQuery: string = '';
        pageList.forEach(user => {
            if (user.DUE_DEP) {
                stringQuery += user.DUE_DEP + '|';
            }
        });
        return  this.grtDepartment(stringQuery)
        .then(departments => {
                pageList.map(user => {
                    const findDue = departments.filter(dueDeep => {
                        return user.DUE_DEP === dueDeep.DUE;
                    });
                    if (findDue.length > 0) {
                        user['DEPARTMENT_SURNAME'] = findDue[0].SURNAME;
                        user['DEPARTMENT_DYTU'] = findDue[0].DUTY;
                    } else {
                        user['DEPARTMENT_SURNAME'] = '';
                        user['DEPARTMENT_DYTU'] = '';
                    }
                });
                return pageList;
            });

    }
    initConfigTitle(dueDep: string) {
        if (!this.configList['titleDue'] || !dueDep) {
            this.configList['titleDue'] = 'Все подразделения';
        }
    }
    // protected prepareForEdit(records: any[]): any[] {
    //     return records.map((record) => this.apiSrv.entityHelper.prepareForEdit(record));
    // }
}
