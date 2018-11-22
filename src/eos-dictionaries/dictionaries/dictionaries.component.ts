import {Component} from '@angular/core';
import { EosDictService } from '../services/eos-dict.service';
import { IDictionaryDescriptor } from 'eos-dictionaries/interfaces';
import {Router} from '@angular/router';

@Component({
    selector: 'eos-dictionaries',
    templateUrl: 'dictionaries.component.html',
})
export class DictionariesComponent {
    dictionariesList: IDictionaryDescriptor[] = [];

    constructor(
        private _dictSrv: EosDictService,
        private _router: Router
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
}
