import { Injectable } from '@angular/core';
import { PipRX, DEPARTMENT, USER_CL } from 'eos-rest';
import { USERSRCH } from '../consts/search-const';

@Injectable()
export class SearchServices {
    constructor(
        private _pipApisrv: PipRX
    ) {

    }
    getSearchDepartment(criteries): Promise<DEPARTMENT[]> {
        return this._pipApisrv.read({
            DEPARTMENT: {
                criteries
            }
        });
    }

    searchPrepareCardAndFullDue(config: USERSRCH, flagTab: boolean): Promise<any> {
        let cardQuery, fullDueQuery;
        fullDueQuery = { SURNAME: `%${config.fullDueName}%` };
        if (flagTab) {
            cardQuery = { CARD_NAME: `%${config.CARD}%` };
        } else {
            cardQuery = { CLASSIF_NAME: `%${config.DEPARTMENT}%` };
        }
        const queryCard = this.getSearchDepartment(cardQuery);
        const queryFullDuename = this.getSearchDepartment(fullDueQuery);

        return Promise.all([queryCard, queryFullDuename]).then((data: Array<DEPARTMENT[]>) => {
            if (data[0].length === 0 || data[1].length === 0) {
                console.log('Поиск не дал результатов');
                return Promise.resolve([] as any);
            } else {
                const findDepartments: DEPARTMENT[] = data[1].filter((value: DEPARTMENT) => {
                    return data[0].some((val: DEPARTMENT) => {
                        return val.ISN_NODE === value.ISN_HIGH_NODE;
                    });
                });
                if (findDepartments.length) {
                    const due = this.getDue(findDepartments, 'DUE');
                    return Promise.all([...this.createArrayRequestsUsers(due, this.getUsersToGo.bind(this), config)]).then(users => {
                        return [].concat(...users);
                    });
                    //    return this.getUsersToGo(config, due);
                } else {
                    console.log('Поиск не дал результатов');
                    return Promise.resolve([] as any);
                }

            }
        });
        // return Promise.resolve(false);
    }

    searchCardOneParam(config: USERSRCH): Promise<any> {
        const dueQuery = { SURNAME: `${config.fullDueName}%` };
        return this.getSearchDepartment(dueQuery).then((data: DEPARTMENT[]) => {
            if (!data.length) {
                console.log('Поиск не дал результатов');
                return Promise.resolve([]);
            } else {
                const due = this.getDue(data, 'DUE');
                return Promise.all([...this.createArrayRequestsUsers(due, this.getUsersToGo.bind(this), config)]).then(users => {
                    return [].concat(...users);
                });
                //  return this.getUsersToGo(config, due);
            }
        });
        //  return Promise.resolve(false);
    }
    searchCardOneCardParam(config: USERSRCH, flagTab: boolean): Promise<any> {
        let dueQuery;
        if (flagTab) {
            dueQuery = { CARD_NAME: `%${config.CARD}%` };
        } else {
            dueQuery = { CLASSIF_NAME: `%${config.DEPARTMENT}%` };
        }
        return this.getSearchDepartment(dueQuery).then((deepCard: DEPARTMENT[]) => {
            if (deepCard.length) {
                const ISN_HIGH_NODE = this.getDue(deepCard, 'ISN_NODE');
                return Promise.all([...this.createArrayRequestDeeparnments(ISN_HIGH_NODE, 'ISN_HIGH_NODE', this.getSearchDepartment.bind(this))]).then(departmentsfind => {
                    const depName = [].concat(...departmentsfind);
                    if (depName.length) {
                        const due = this.getDue(depName, 'DUE');
                        return Promise.all([...this.createArrayRequestsUsers(due, this.getUsersToGo.bind(this), config)]).then(data => {
                            return [].concat(...data);
                        });
                        //  return this.getUsersToGo(config, due);
                    } else {
                        console.log('Поиск не дал результатов');
                        return Promise.resolve([] as any);
                    }
                });
            } else {
                return Promise.resolve([] as any);
            }
        });
    }
    getDue(data: DEPARTMENT[], filterParam) {
        let stringDue = '';
        const arrayStringQuery = [];
        data.forEach((value: DEPARTMENT, index) => {
            if (stringDue.length > 1000) {
                arrayStringQuery.push(stringDue);
                stringDue = '';
                stringDue += value[filterParam] + '|';
            } else {
                stringDue += value[filterParam] + '|';
            }
        });
        arrayStringQuery.push(stringDue);
        return arrayStringQuery;
    }

    createArrayRequestsUsers(arrayStringQuery: Array<string>, fn: Function, config) {
        const arrayResp = [];
        arrayStringQuery.forEach((val, index) => {
            arrayResp.push(fn(config, val));
        });
        return arrayResp;
    }
    createArrayRequestDeeparnments(arrayStringQuery, criteries, fn: Function) {
        const arrayResp = [];
        arrayStringQuery.forEach((val, index) => {
            const criter = {};
            criter[criteries] = val;
            arrayResp.push(fn(criter));
        });
        return arrayResp;
    }

    getUsersToGo(config: USERSRCH, due?: string): Promise<USER_CL[]> {
        const query = {
            USER_CL: {
                criteries: {}
            }
        };
        if (config.SURNAME) {
            query.USER_CL.criteries['SURNAME_PATRON'] = `%${config.SURNAME}%`;
        }   else {
            if (due) {
                query.USER_CL.criteries['DUE_DEP'] = due;
            }
            if (config.LOGIN) {
                query.USER_CL.criteries['CLASSIF_NAME'] = `%${config.LOGIN}%`;
            }
        }
        return this._pipApisrv.read(query).then((users: USER_CL[]) => {
            if (users.length) {
                return users;
            } else {
                return [];
            }
        });
    }
}
