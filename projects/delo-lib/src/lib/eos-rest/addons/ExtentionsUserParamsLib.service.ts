import { Injectable } from '@angular/core';
import { PipRX } from '../../eos-rest/services/pipRX.service';
import { DEPARTMENT } from '../../eos-rest/interfaces/structures';
@Injectable()
export class ExetentionsUserParamsLib {
    NOTE: string;
    constructor(
        private pipRX: PipRX,
    ) {}
    public async loadDepartments(value: string): Promise<string> {
        this.NOTE = '';
        let due = value.split('.').map(el => el += '.');
        due.pop();
        due.pop();
        const resultDue = [];
        let curentDue:string = '';
        due.forEach(el => {
            curentDue += el
            resultDue.push(curentDue)
        })
        const result: DEPARTMENT[] = await this.pipRX.read({ DEPARTMENT: {criteries: {DUE: resultDue.join('|')}}});
        result.forEach( el => {
            if (el.CARD_NAME === "Центральная картотека") {
                this.NOTE += el.CARD_NAME;
            } else {
                this.NOTE += ' - ' + el.CLASSIF_NAME;
            }
        })
        return this.NOTE;
    }
}