import {Injectable} from '@angular/core';
import { PipRX } from 'eos-rest';
import {USERCARD, DEPARTMENT, CABINET, USER_CABINET} from '../../../eos-rest/interfaces/structures';
import {CardsClass} from '../../rights-delo/rights-cabinets/helpers/cards-class';
import {CardInit} from 'eos-user-params/shared/intrfaces/cabinets.interfaces';
import { Subject } from 'rxjs/Subject';
@Injectable()

export class RigthsCabinetsServices {
    public cardsArray: CardsClass[] = [];
    public cardsOrigin: CardsClass[] = [];
    public user_id;
    public changeCabinets = new Subject();
    public submitRequest = new Subject();
    arrResult = [];
    constructor(
        private _pipRx: PipRX
        ) {}
    getUserCard(userCard: USERCARD[], id_user, flag?): Promise<any> {
        this.user_id = id_user;
        const queryString = [];
        const queryArray = this.createArrayQueryFor(userCard, true);
     return   this.getDepartmentName(queryArray).then((department: DEPARTMENT[]) => {
            const arrayUpDepart = [];
            userCard.forEach((depart: USERCARD, index) => {
                const pip = this._pipRx.read(this.criterCabinet(depart)).then((cabinets: CABINET[]) => {
                queryString.push(...this.gitStringQueryUserCabinets(cabinets));
                return  depart['_d'] = cabinets;
                });
                arrayUpDepart.push(pip);
            });
         return   Promise.all([...arrayUpDepart]).then(departmentUp => {
                return  this.getUserCabinet(queryString).then((user_cab: USER_CABINET[]) => {
                    this.fillArrayCards(userCard, { USER_CABINET_info:  user_cab , create: flag ? true : false});
                    this.fillArrayCardsName(department);
                });
            });
        });
    }

    gitStringQueryUserCabinets(cabinets: CABINET[]): Array<string> {
        const arrayCaString = [];
        if (cabinets.length) {
            cabinets.forEach((cab: CABINET) => {
                arrayCaString.push(cab.ISN_CABINET);
            });
        }
        return arrayCaString;
    }
    criterCabinet(depart) {
      return  {
            CABINET: {
                criteries: {'CABINET.DEPARTMENT.DEPARTMENT_DUE': `${depart.DUE}`} // 0.1R5U.
            }
        };
    }
    fillArrayCardsName(department: DEPARTMENT[]): void {
        department.forEach((depart: DEPARTMENT) => {
            this.cardsArray.map((card: CardsClass) => {
              if (depart.DUE === card.cardDue) {
                  card.cardName = depart.CARD_NAME;
              }
              return card;
            });
        });
    }

    fillArrayCards(deep: USERCARD[], supportInfo: CardInit): void {
        deep.forEach((card: USERCARD) => {
            this.cardsArray.push(new CardsClass(card, supportInfo));
        });
    }

    createArrayQueryFor(info, flag?): Array<any> {
        const arr = [];
        if (flag) {
            info.forEach((card) => {
                arr.push(card.DUE);
            });
        }  else {
            info.forEach((card) => {
                arr.push(card);
            });
        }

        return  arr;
    }

    getDepartmentName(querystring: Array<any>): Promise<DEPARTMENT[]> {
        const queryDepartment = {
                DEPARTMENT: querystring
        };
        return this._pipRx.read(queryDepartment);
    }

    splitStrQuery(queryString: Array<any>): Array<any> {
        const arrResult = [];
        const path = 100;
        let firstPath;
        while (queryString.length >= 100) {
            firstPath = queryString.splice(0, path);
            arrResult.push(firstPath);
        }
        if (queryString.length && queryString.length < 100) {
            arrResult.push(queryString);
        }
        return arrResult;
    }
    getUserCabinet(queryArray: Array<any>): Promise<any> {
        if (queryArray.length && queryArray.length < 100) {
            return   this._pipRx.read(this.getCriteriesUserCab(queryArray));
        }   else if (queryArray.length > 100) {
            this.arrResult = [];
            const newQuery = this.splitStrQuery(queryArray);
            const arrPromise = [];
            newQuery.forEach(el => {
                arrPromise.push(
                    this._pipRx.read(this.getCriteriesUserCab(el)),
                );
            });
            return Promise.all([...arrPromise]).then(result => {
                const res = [];
                if (result.length) {
                    result.forEach(el => {
                        res.push(...el);
                    });
                }
                return res;
            });
        }   else {
            return Promise.resolve([]);
        }
    }

    getCriteriesUserCab(param: Array<any>) {
       return {
            USER_CABINET: {
                criteries: {
                    ISN_CABINET: param.join('|')
                }
            },
        };
    }
    createUSERCARDArray(typeArrayUserCard): USERCARD[] {
        return  typeArrayUserCard.map(el => {
            return {
                ISN_LCLASSIF: this.user_id,
                DUE: el,
                HOME_CARD: 0,
                FUNCLIST: '010000000000010010000',
                USER_CARD_DOCGROUP_List: null,
                USER_CABINET_List: null
            }as USERCARD ;
        });
    }
}
