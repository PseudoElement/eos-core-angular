import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EosDeskService } from '../../app/services/eos-desk.service';
import { EosStorageService } from '../../app/services/eos-storage.service';
import { ConfirmWindowService } from '../../eos-common/confirm-window/confirm-window.service';
import { EosMessageService } from '../../eos-common/services/eos-message.service';
import { CardComponent } from '../../eos-dictionaries/card/card.component';
import { EosDictionaryNode } from '../../eos-dictionaries/core/eos-dictionary-node';
import { EosAccessPermissionsService } from '../../eos-dictionaries/services/eos-access-permissions.service';
import { EosDepartmentsService } from '../../eos-dictionaries/services/eos-department-service';
import { EosDictService } from '../../eos-dictionaries/services/eos-dict.service';
import { PipRX } from '../../eos-rest';
import { ErrorHelperServices } from '../../eos-user-params/shared/services/helper-error.services';


@Component({
    selector: 'eos-card-from',
    templateUrl: 'card-from.component.html',
    styleUrls: ['card-from.component.scss']
})

export class CardFromComponent extends CardComponent {

    constructor(
        protected _storageSrv: EosStorageService,
        protected _confirmSrv: ConfirmWindowService,
        protected _dictSrv: EosDictService,
        protected _deskSrv: EosDeskService,
        protected _msgSrv: EosMessageService,
        protected _route: ActivatedRoute,
        protected _router: Router,
        protected departmentsSrv: EosDepartmentsService,
        protected _eaps: EosAccessPermissionsService,
        protected _errSrv: ErrorHelperServices,
        protected _apiSrv: PipRX ) {
        super(_storageSrv, _confirmSrv, _dictSrv, _deskSrv, _msgSrv, _route, _router, departmentsSrv, _eaps, _errSrv, _apiSrv);
    }


    cancel(): void {
        window.close();
    }

    close(): void {
        window.close();
    }
    save(): void {
        console.log('save_card-from')
        if (this.isSaveDisabled()) {
            this._windowInvalidSave();
            return;
        }
        const _data = this.cardEditRef.getNewData();
        if (_data.rec.CHANGED_FILE) {
            this.isChanged = true;
        }
        this._confirmSave(_data, false)
            .then((res: boolean) => {
                if (res) {
                    this.disableSave = true;
                    this._save(_data)
                        .then((node: EosDictionaryNode) => {
                            this.isChanged = false;
                            this.cardEditRef.isChanged = false;
                            setTimeout(() => {
                                window.close();
                            }, 1000);
                        })
                        .catch((err) => {
                            if (err.code && err.code === 401) {
                                this.cardEditRef.isChanged = false;
                                this.isChanged = false;
                                this._errSrv.errorHandler(err);
                            } else {
                                this._windowInvalidSave([err.message]);
                                this.disableSave = false;
                                this.cardEditRef.resetData();
                            }
                        });
                } else {
                    this.cardEditRef.resetData();
                }
            }).catch(e => {
                this.isChanged = false;
                this.cardEditRef.isChanged = false;
                this._errSrv.errorHandler(e);
            });
    }
}
