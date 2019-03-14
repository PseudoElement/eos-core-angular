import {Injectable} from '@angular/core';
import { PipRX } from 'eos-rest';
import {USERCARD, DEPARTMENT} from '../../../eos-rest/interfaces/structures';
import {CardsClass} from '../../rights-delo/rights-cabinets/helpers/cards-class';
@Injectable()

export class RigthsCabinetsServices {
    public cardsArray: CardsClass[] = [];
    constructor(
        private _pipRx: PipRX
        ) {}
    getUserCard(userCard: USERCARD[]): Promise<any> {
            const queryFordep = this.createStringQuery(userCard);
            return this.getDepartmentName(queryFordep).then((date: DEPARTMENT[]) => {
                const queryString = this.createStringQuery(date);
                return this.getCabinetsName(queryString).then(data => {
                    const queryStringCards = this.createStringQueryCabinet(data);
                    return this.getUserCabinet(queryStringCards).then(res => {
                        const q = {
                            department: date,
                            cabinetsName: data,
                            userCabinet: res,
                            create: false
                        };
                        this.fillArrayCards(userCard, q);
                        this.fillArrayCardsName(date);
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

    fillArrayCards(inmfo: USERCARD[], supportInfo: any): void {
        inmfo.forEach((card: USERCARD) => {
            this.cardsArray.push(new CardsClass(card, supportInfo));
        });
    }

    createStringQuery(inmfo): string {
        let stringQuery = '';
        inmfo.forEach((card, index) => {
            if (index === inmfo.length - 1) {
                stringQuery += `${card.DUE}`;
            }  else {
                stringQuery += `${card.DUE}|`;
            }
        });
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
}
