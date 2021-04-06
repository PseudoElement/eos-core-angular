import { USER_CL } from './../../eos-rest/interfaces/structures';
import { PipRX } from './../../eos-rest/services/pipRX.service';
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

@Component({
    selector: 'eos-dictionaries',
    templateUrl: 'dictionaries.component.html',
})
export class DictionariesComponent implements OnInit, OnDestroy {
    dictionariesList: IDictionaryDescriptor[] = [];
    r: number = 0;
    modalWindow: Window;
    curUserHasDocGroup: boolean;
    get path() {
        return this._router.url;
    }

    constructor(
        private _dictSrv: EosDictService,
        private _router: Router,
        private _appCtx: AppContext,
        private _eaps: EosAccessPermissionsService,
        private _storageSrv: EosStorageService,
        private _apiSrv: PipRX
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

    ngOnInit() {
        this.checkLimitedDocGroup();
    }

    /**
     * @func hasAnyTech - фукция запроса на наличие в системе неограниченных в видах документах системных технологов,
     * в случае остутствия таковых, по даем текущему ограниченному системному технологу доступ к видам документов
     * */
    hasAnyTech() {
        const query: any = {
            USER_CL:  PipRX.criteries({ 'USER_CL.HasNonUserTechForAll': 9 }),
            top: '2',
            skip: '0',
            orderby: `CLASSIF_NAME`
        };
       /*  this._apiSrv.read<USER_CL>(query).then((data) => setTimeout(() => {
            if (!data.length) {
                this.curUserHasDocGroup = true;
            }
        }, 2000)); */

        this._apiSrv.read<USER_CL>(query).then((data) => {
            if (!data.length) {
                this.curUserHasDocGroup = true;
            }
        });
    }

    /**
     * @func checkLimitedDocGroup - функция проверки текущего пользователя (системного технолога) на ограниченность в видах документах,
     * если у него есть права, то давать пускать в справочник виды документов.
     * */
    checkLimitedDocGroup() {
        const techList = this._appCtx.CurrentUser.USER_TECH_List;
        techList.forEach((el) => {
            if (el.FUNC_NUM === 9 && el.ALLOWED) {
                this.curUserHasDocGroup = true;
            }
        });
        if (!this.curUserHasDocGroup) {
            this.hasAnyTech();
        }
    }

    isAccessEnabled(dict: any) {
        // временно для Видов документов, если есть доступ к гр.док., то спр. доступен
        if (dict.id === TYPE_DOCUM_DICT.id) {
            if (!this.curUserHasDocGroup) {
                return  APS_DICT_GRANT.denied;
            } else {
                return  this._eaps.checkAccessTech(E_TECH_RIGHT.Docgroups) ? APS_DICT_GRANT.readwrite : APS_DICT_GRANT.denied;
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
}
