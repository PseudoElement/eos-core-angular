import {Injectable} from '@angular/core';
import { PipRX } from 'eos-rest';
import {USERCARD, DEPARTMENT} from '../../../eos-rest/interfaces/structures';
import {CardsClass} from '../../rights-delo/rights-cabinets/helpers/cards-class';
import {CardInit} from 'eos-user-params/shared/intrfaces/cabinets.interfaces';
@Injectable()

export class RigthsCabinetsServices {
    public cardsArray: CardsClass[] = [];
    public cardsOrigin: CardsClass[];
    public user_id;
    constructor(
        private _pipRx: PipRX
        ) {}
    getUserCard(userCard: USERCARD[], id_user?): Promise<any> {
        this.user_id = id_user;
            const queryFordep = this.createStringQuery(userCard);
            return this.getDepartmentName(queryFordep).then((date: DEPARTMENT[]) => {
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
                        this.cardsOrigin = this.cardsArray.slice();
                    });
                });
        }).catch(error => {
            console.log(error);
        });
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
    getDepartmentName(querystring: string): Promise<DEPARTMENT[]> {
        const queryDepartment = {
                DEPARTMENT: {
                    criteries: {
                        DUE: querystring
                },
            }
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
       return this._pipRx.read(query);
    }
    getUserCabinet(queryString): Promise<any> {
        const query = {
            USER_CABINET: {
                criteries: {
                    ISN_CABINET: queryString
                }
            },
        };
       return this._pipRx.read(query);
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
