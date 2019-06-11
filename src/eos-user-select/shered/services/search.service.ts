import { Injectable } from '@angular/core';
import { PipRX, DEPARTMENT } from 'eos-rest';


@Injectable()
export class SearchServices {
    constructor(
        private _pipApisrv: PipRX
    ) {

    }
    getSearchCard(title): Promise<DEPARTMENT[]> {
        return this._pipApisrv.read({
            DEPARTMENT: {
                criteries: {
                    CARD_NAME: `${title}%`
                }
            }
        });
    }
    getSearchDepartment(title): Promise<DEPARTMENT[]> {
        return this._pipApisrv.read({
            DEPARTMENT: {
                criteries: { CLASSIF_NAME: `${title}%` }
            }
        });
    }
    getSearchLogin(due) {
        return this._pipApisrv.read({
            USER_CL: {
                criteries: { DUE_DEP: `${due}` }
            }
        }).then(data => {
            console.log(data);
        });
    }

    searchPrepareCardAndFullDue(config: Object) {
        const cardQuery = this.getSearchCard(config['CARD']);
        const fullDueQuery = this.getSearchDepartment(config['fullDueName']);

        Promise.all([cardQuery, fullDueQuery]).then((data: Array<DEPARTMENT[]>) => {
            if (data[0].length === 0 || data[1].length === 0) {
                console.log('Поиск не дал результатов');
                return;
            } else {
                const er = data[1].filter((value: DEPARTMENT) => {
                    return data[0].some((val: DEPARTMENT) => {
                        return val.ISN_NODE === value.ISN_HIGH_NODE;
                    });
                });
                console.log(er);
            }
        });


    }



}
