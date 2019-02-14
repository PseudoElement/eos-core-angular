import { RUBRICATOR_DICT } from './../consts/dictionaries/rubricator.consts';
import { Injectable } from '@angular/core';
import { AppContext } from 'eos-rest/services/appContext.service';
import { NADZORDICTIONARIES } from 'eos-dictionaries/consts/dictionaries/nadzor.consts';
import { E_TECH_RIGHT } from 'eos-rest/interfaces/rightName';

@Injectable()
export class EosAccessPermissionsService {
    constructor (
        private appCtx: AppContext,
    ) {}


    isAccessGrantedForDictionary (dictId: string): boolean {
        // TODO: other checks for dictionaryes must be here
        const r: string = this.appCtx.CurrentUser.TECH_RIGHTS;

        switch (dictId) {
            case RUBRICATOR_DICT.id: {
                return (r[E_TECH_RIGHT.Rubrics - 1] === '1');
            }
        }

        const dNadzor =  NADZORDICTIONARIES.find (n => n.id === dictId);
        if (dNadzor) {
            if (r[E_TECH_RIGHT.NadzorCL - 1] === '1') {
                return true;
            }
            return false;
        }
        return true;
    }
    isAccessGrantedForUsers(): boolean {
        const r: string = this.appCtx.CurrentUser.TECH_RIGHTS;
        return (r[E_TECH_RIGHT.Users - 1] === '1');
    }

}
