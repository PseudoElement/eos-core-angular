import { Component, OnDestroy, OnInit } from '@angular/core';
import { EosDictService } from '../services/eos-dict.service';
import { IDictionaryDescriptor, E_DICT_TYPE } from 'eos-dictionaries/interfaces';
import { Router } from '@angular/router';
import { EosAccessPermissionsService, APS_DICT_GRANT } from 'eos-dictionaries/services/eos-access-permissions.service';
import { EosStorageService } from 'app/services/eos-storage.service';
import { RECENT_URL } from 'app/consts/common.consts';
import { TYPE_DOCUM_DICT } from '../consts/dictionaries/type-docum.const';
import { E_TECH_RIGHT } from '../../eos-rest/interfaces/rightName';
import { AppContext } from '../../eos-rest/services/appContext.service';
import { DISABLED_LIST_ITEM } from 'app/consts/messages.consts';

@Component({
    selector: 'eos-dictionaries',
    templateUrl: 'dictionaries.component.html',
})
export class DictionariesComponent implements OnInit, OnDestroy {
    instrumentsList: IDictionaryDescriptor[] = [];
    dictionariesList: IDictionaryDescriptor[] = [];
    r: number = 0;
    modalWindow: Window;
    curUserHasDocGroup: boolean;
    get path() {
        return this._router.url;
    }
    get isDisabled(): boolean {
        if (+this._appCtx.CurrentUser.DELO_RIGHTS[0]) {
            return false;
        } else {
            return true;
        }
    }
    constructor(
        private _dictSrv: EosDictService,
        private _router: Router,
        private _appCtx: AppContext,
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
        if (dictList) {
            dictList.then((list) => {
                this.dictionariesList = list;
            });
        }
    }

    ngOnInit() {
        this.checkLimitedDocGroup();
    }

    /**
     * @method checkLimitedDocGroup - функция проверки текущего пользователя (системного технолога) на ограниченность в видах документах,
     * если у него есть права, то давать пускать в справочник виды документов.
     * */
    checkLimitedDocGroup() {
        const techList = this._appCtx.CurrentUser.USER_TECH_List;
        const isLimTech = techList.some((el) => el.FUNC_NUM === 9 && !el.ALLOWED);
        if (!isLimTech) {
            this.curUserHasDocGroup = true;
        }
        if (!this.curUserHasDocGroup && !this._appCtx.hasUnlimTech) {
            this.curUserHasDocGroup = true;
        }
    }

    isAccessEnabled(dict: any) {
        // временно для Видов документов, если есть доступ к гр.док., то спр. доступен
        if (dict.id === TYPE_DOCUM_DICT.id) {
            if (!this.curUserHasDocGroup) {
                return APS_DICT_GRANT.denied;
            } else {
                return this._eaps.checkAccessTech(E_TECH_RIGHT.Docgroups) ? APS_DICT_GRANT.readwrite : APS_DICT_GRANT.denied;
            }
        }
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

    getHint(isDisabled: boolean): string {
        return isDisabled ? DISABLED_LIST_ITEM : '';
    }
}
