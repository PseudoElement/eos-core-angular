import {Injectable} from '@angular/core';
import { PipRX } from 'eos-rest';
import {USERCARD, DEPARTMENT} from '../../../eos-rest/interfaces/structures';
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
    getUserCard(userCard: USERCARD[], id_user?): Promise<any> {
        this.user_id = id_user;
            const queryFordep1 = this.createArrayQueryFor(userCard, true);
            if (queryFordep1 && queryFordep1.length) {
                return this.getDepartmentName(queryFordep1).then((date: DEPARTMENT[]) => {
                    const queryString = this.createStringQuery(date);
                    return this.getCabinetsName(queryString).then(data => {
                        const queryStringCards = this.createStringQueryCabinet(data);
                        return this.getUserCabinet(queryStringCards).then(res => {
                            const q: CardInit = {
                                DEPARTMENT_info: date,
                                CABINET_info: data,
                                USER_CABINET_info: res,
                                create: false
                            };
                            this.fillArrayCards(userCard, q);
                            this.fillArrayCardsName(date);
                        });
                    });
                }).catch(error => {
                    console.log(error);
                });
            }   else {
                return Promise.resolve();
            }
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

    fillArrayCards(inmfo: USERCARD[], supportInfo: CardInit): void {
        inmfo.forEach((card: USERCARD) => {
            this.cardsArray.push(new CardsClass(card, supportInfo));
        });
    }

    createStringQuery(inmfo, flagNewCard?): string {
        let stringQuery = '';
        if (!flagNewCard) {
                inmfo.forEach((card, index) => {
                if (index === inmfo.length - 1) {
                    stringQuery += `${card.DUE}`;
                }  else {
                    stringQuery += `${card.DUE}|`;
                }
            });
        }   else {
            inmfo.forEach((due, index) => {
                if (index === inmfo.length - 1) {
                    stringQuery += `${due}`;
                }  else {
                    stringQuery += `${due}|`;
                }
            });
        }
        return stringQuery;
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

    createStringQueryCabinet(inmfo): string {
        let stringQuery = '';
        inmfo.forEach((card, index) => {
            if (index === inmfo.length - 1) {
                stringQuery += `${card.ISN_CABINET}`;
            }  else {
                stringQuery += `${card.ISN_CABINET}|`;
            }
        });
        return stringQuery;
    }
    getDepartmentName(querystring: Array<any>): Promise<DEPARTMENT[]> {
        const queryDepartment = {
                DEPARTMENT: querystring
        };
        return this._pipRx.read(queryDepartment);
    }


    getCabinetsName(queryString: string): Promise<any> {
        const query = {
            CABINET: {
                criteries: {
                    DUE: queryString
                }
            },
        };
        if (queryString.length && queryString.length < 500) {
            return   this._pipRx.read(query);
        }   else if (queryString.length > 500) {
            this.arrResult = [];
            const newQuery = this.splitStrQuery(queryString);
            const arrPromise = [];
            newQuery.forEach(el => {
                arrPromise.push(
                    this._pipRx.read(
                                {
                                    CABINET: {
                                        criteries: {
                                            DUE: el.join('|')
                                        }
                                    },
                                }
                    ),
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

    splitStrQuery(queryString: string): Array<any> {
        const arrResult = [];
        const arr = queryString.split('|');
        const path = 100;
        let firstPath;
        while (arr.length >= 100) {
            firstPath = arr.splice(0, path);
            arrResult.push(firstPath);
        }
        if (arr.length && arr.length < 100) {
            arrResult.push(arr);
        }
        return arrResult;
    }
    getUserCabinet(queryString): Promise<any> {
        const query = {
            USER_CABINET: {
                criteries: {
                    ISN_CABINET: queryString
                }
            },
        };
        if (queryString.length && queryString.length < 500) {
            return   this._pipRx.read(query);
        }   else if (queryString.length > 500) {
            this.arrResult = [];
            const newQuery = this.splitStrQuery(queryString);
            const arrPromise = [];
            newQuery.forEach(el => {
                arrPromise.push(
                    this._pipRx.read(
                                {
                                    USER_CABINET: {
                                        criteries: {
                                            ISN_CABINET: el.join('|')
                                        }
                                    },
                                }
                    ),
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
