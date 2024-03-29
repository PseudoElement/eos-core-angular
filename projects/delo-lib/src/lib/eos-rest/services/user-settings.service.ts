


import { Injectable } from '@angular/core';
import { PipRX } from './pipRX.service';
import { E_DICTIONARY_ID } from '../../eos-dictionaries/consts/dictionaries/enum/dictionaryId.enum';

@Injectable()
export class UserSettingsService {

    constructor(private _piperX: PipRX ) {
    }

    readUserSetting(tableId: string, date: Date = new Date()): Promise<any> {
        // 2022-11-16 16:25:54.100
        const DT: string = date.toISOString();
        const cfg = this._piperX.getConfig();
        const URL = `${cfg.apiBaseUrl}CoreHost/usersettings/api?category=${tableId}&timestamp=${DT}`;
        return fetch(URL).then((response) => {
            return response.json();
        });
      }

    readDepartments(): Promise<any> {
      return  this.readUserSetting(E_DICTIONARY_ID.DEPARTMENTS);
    }

}
