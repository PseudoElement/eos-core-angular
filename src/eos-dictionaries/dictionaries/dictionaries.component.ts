import {Component} from '@angular/core';
import { EosDictService } from '../services/eos-dict.service';
import { IDictionaryDescriptor } from 'eos-dictionaries/interfaces';
import {Router} from '@angular/router';
import { EosAccessPermissionsService, APS_DICT_GRANT } from 'eos-dictionaries/services/eos-access-permissions.service';

@Component({
    selector: 'eos-dictionaries',
    templateUrl: 'dictionaries.component.html',
})
export class DictionariesComponent {
    dictionariesList: IDictionaryDescriptor[] = [];
    r: number = 0;

    constructor(
        private _dictSrv: EosDictService,
        private _router: Router,
        private _eaps: EosAccessPermissionsService,
    ) {
        this._dictSrv.closeDictionary();

        let dictList;
        if (this._router.url === '/spravochniki') {
            dictList = this._dictSrv.getDictionariesList();
        } else if (this._router.url === '/spravochniki/nadzor') {
            dictList = this._dictSrv.getNadzorDictionariesList();
        }

        dictList.then((list) => {
                this.dictionariesList = list;
        });
    }

    isAccessEnabled(dict: any) {
        return this._eaps.isAccessGrantedForDictionary(dict.id, null) !== APS_DICT_GRANT.denied;
    }
}
