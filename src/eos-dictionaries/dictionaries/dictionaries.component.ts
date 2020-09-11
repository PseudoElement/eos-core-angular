import { Component, OnDestroy } from '@angular/core';
import { EosDictService } from '../services/eos-dict.service';
import { IDictionaryDescriptor, E_DICT_TYPE } from 'eos-dictionaries/interfaces';
import { Router } from '@angular/router';
import { EosAccessPermissionsService, APS_DICT_GRANT } from 'eos-dictionaries/services/eos-access-permissions.service';
import { EosStorageService } from 'app/services/eos-storage.service';
import { RECENT_URL } from 'app/consts/common.consts';

@Component({
    selector: 'eos-dictionaries',
    templateUrl: 'dictionaries.component.html',
})
export class DictionariesComponent implements OnDestroy {
    dictionariesList: IDictionaryDescriptor[] = [];
    r: number = 0;
    modalWindow: Window;

    get path() {
        return this._router.url;
    }

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
        } else if (this._router.url === '/spravochniki/SEV') {
            dictList = this._dictSrv.getSevDictionariesList();
        }

        this._storageSrv.setItem(RECENT_URL, this._router.url);

        dictList.then((list) => {
            this.dictionariesList = list;
        });
    }

    isAccessEnabled(dict: any) {
        return this._eaps.isAccessGrantedForDictionary(dict.id, null) !== APS_DICT_GRANT.denied;
    }
    isAccessLicense(id) {
        return this._eaps.isAssessSev(id);
    }

    routeForDict(dictId: string) {
        const d = this._dictSrv.getDescr(dictId);
        if (d && d.dictType === E_DICT_TYPE.form) {
            return ['/form', dictId];
        } else {
            return ['/spravochniki', dictId];
        }
    }
    openModalSynchro(): void {
        if (this.modalWindow && !this.modalWindow.closed) {
            this.modalWindow.focus();
        } else {
            this.modalWindow = window.open(`../Pages/Sev/Synchronization.aspx`, '_blank', 'width=900,height=700');
            this.modalWindow.blur();
        }
    }
    ngOnDestroy() {
        if (this.modalWindow) {
            this.modalWindow.close();
            this.modalWindow = null;
        }
    }
}
