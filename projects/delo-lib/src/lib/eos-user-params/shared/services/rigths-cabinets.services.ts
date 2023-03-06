import { Injectable } from '@angular/core';
import { PipRX } from '../../../eos-rest';
import { USERCARD, DEPARTMENT, CABINET, /* USER_CABINET */ } from '../../../eos-rest/interfaces/structures';
import { CardsClass } from '../../rights-delo/rights-cabinets/helpers/cards-class';
// import {CardInit} from 'eos-user-params/shared/intrfaces/cabinets.interfaces';
import { Subject } from 'rxjs';
import { AppContext } from '../../../eos-rest/services/appContext.service';
@Injectable()

export class RigthsCabinetsServices {
    public cardsArray: CardsClass[] = [];
    public user_id;
    public changeCabinets = new Subject();
    public submitRequest = new Subject();
    constructor(
        private _pipRx: PipRX,
        private _apCtx: AppContext,
    ) { }
    getUserCard(userCard: USERCARD[], id_user, isNew?: boolean): Promise<any> {
        this.user_id = id_user;
        const queryArray = this.createArrayQueryFor(userCard);
        return this.getDepartmentName(queryArray).then((department: DEPARTMENT[]) => {
            this.fillArrayCards(userCard, isNew);
            this.fillArrayCardsName(department);
        });
    }
    getCabinets(due, isn): Promise<any> {
        return this._pipRx.read(this.criterCabinet(due)).then((cabinets: CABINET[]) => {
            const queryString = [];
            queryString.push(...this.gitStringQueryUserCabinets(cabinets));
            if (queryString.length) {
                return this.getUserCabinet(queryString, isn).then(folders => {
                    return { cabinets, folders } as any;
                });
            } else {
                return Promise.resolve();
            }
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
        return {
            CABINET: {
                criteries: { 'CABINET.DEPARTMENT.DEPARTMENT_DUE': `${depart}` },
            }
        };
    }
    fillArrayCardsName(department: DEPARTMENT[]): void {
        department.forEach((depart: DEPARTMENT) => {
            this.cardsArray.map((card: CardsClass) => {
                if (depart.DUE === card.data.DUE) {
                    card.cardName = depart.CARD_NAME;
                    card.deleted = false;
                    card.logDelet = !!depart.DELETED;
                }
                return card;
            });
        });
    }

    fillArrayCards(cards: USERCARD[], isNew?: boolean): void {
        if (cards) {
            cards.forEach((card: USERCARD) => {
                this.cardsArray.push(new CardsClass(this._apCtx, card, isNew));
            });
        }
    }

    createArrayQueryFor(cards: USERCARD[]): string[] {
        const arr = [];
        if (cards) {
            cards.forEach((card: USERCARD) => {
                arr.push(card.DUE);
            });
        }
        return arr;
    }

    getDepartmentName(arrayDues: string[]): Promise<DEPARTMENT[]> {
        const getDepartments = {
            DEPARTMENT: arrayDues
        };
        return this._pipRx.read(getDepartments);
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
    getUserCabinet(queryArray: Array<any>, isn): Promise<any> {
        if (queryArray.length && queryArray.length <= 100) {
            return this._pipRx.read(this.getCriteriesUserCab(queryArray, isn));
        } else if (queryArray.length > 100) {
            const newQuery = this.splitStrQuery(queryArray);
            const arrPromise = [];
            newQuery.forEach(el => {
                arrPromise.push(
                    this._pipRx.read(this.getCriteriesUserCab(el, isn)),
                );
            });
            return Promise.all([...arrPromise]).then(result => {
                const res = [];
                    result.forEach(el => {
                        res.push(...el);
                    });
                return res;
            });
        } else {
            return Promise.resolve([]);
        }
    }

    getCriteriesUserCab(param: Array<any>, isn) {
        return {
            USER_CABINET: {
                criteries: {
                    ISN_CABINET: param.join('|'),
                    //   ISN_LCLASSIF: String(72509)
                }
            },
        };
    }
    createUSERCARDArray(typeArrayUserCard): USERCARD[] {
        return typeArrayUserCard.map(el => {
            return {
                ISN_LCLASSIF: this.user_id,
                DUE: el,
                HOME_CARD: 0,
                FUNCLIST: '010000000000010010000',
                USER_CARD_DOCGROUP_List: null,
                USER_CABINET_List: null
            } as USERCARD;
        });
    }
}
