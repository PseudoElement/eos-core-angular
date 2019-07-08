import {Component} from '@angular/core';
import { EosDictService } from '../services/eos-dict.service';
import { IDictionaryDescriptor, E_DICT_TYPE } from 'eos-dictionaries/interfaces';
import {Router} from '@angular/router';
import { EosAccessPermissionsService, APS_DICT_GRANT } from 'eos-dictionaries/services/eos-access-permissions.service';
import { EosStorageService } from 'app/services/eos-storage.service';
import { RECENT_URL } from 'app/consts/common.consts';

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
        private _storageSrv: EosStorageService,
    ) {
        this._dictSrv.closeDictionary();

        let dictList;
        if (this._router.url === '/spravochniki') {
            dictList = this._dictSrv.getDictionariesList();
        } else if (this._router.url === '/spravochniki/nadzor') {
            dictList = this._dictSrv.getNadzorDictionariesList();
        }

        this._storageSrv.setItem(RECENT_URL, this._router.url);

        dictList.then((list) => {
                this.dictionariesList = list;
        });
    }

    isAccessEnabled(dict: any) {
        return this._eaps.isAccessGrantedForDictionary(dict.id, null) !== APS_DICT_GRANT.denied;
    }
    routeForDict (dictId: string) {

        const d = this._dictSrv.getDescr(dictId);
        if (d && d.dictType === E_DICT_TYPE.form) {
            return ['/form', dictId];
        } else {
            return ['/spravochniki', dictId];
        }
    }

}
