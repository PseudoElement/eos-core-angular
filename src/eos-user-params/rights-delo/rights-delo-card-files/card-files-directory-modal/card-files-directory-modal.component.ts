import { Component, OnInit, Injector, EventEmitter, Output } from '@angular/core';
import { CARD_FILES_DIRECTORY_MODAL_USER } from '../../shared-rights-delo/consts/card-files-directory-modal.consts';
import { UserParamApiSrv } from 'eos-user-params/shared/services/user-params-api.service';
import { UserParamsService } from '../../../shared/services/user-params.service';
import { EosDataConvertService } from 'eos-dictionaries/services/eos-data-convert.service';
import { FormGroup } from '@angular/forms';
import { BaseRightsDeloSrv } from '../../shared-rights-delo/services/base-rights-delo.service';
import { RightsDeloCardFilesComponent } from '../rights-delo-card-files.component';

@Component({
    selector: 'eos-card-files-directory-modal',
    templateUrl: 'card-files-directory-modal.component.html'
})

export class CardFilesDirectoryModalComponent extends BaseRightsDeloSrv implements OnInit {
    @Output() closeCollection = new EventEmitter();
    @Output() formChanged = new EventEmitter();
    @Output() formInvalid = new EventEmitter();
    updateRDCF: RightsDeloCardFilesComponent;
    isLoading = false;
    fieldKeysforCardFiles2 = [];
    _userParamsSetSrv: UserParamsService;
    dataSrv: EosDataConvertService;
    form: FormGroup;
    inputs: any;
    prepInputs: any;
    private quaryDepartment = {
        DEPARTMENT: {
            criteries: {
                CARD_FLAG: '1'
            }
        }
    };
    constructor(
        private servApi: UserParamApiSrv,
        injector: Injector,
    ) {
        super(injector, CARD_FILES_DIRECTORY_MODAL_USER);
        this.dataSrv = injector.get(EosDataConvertService);
    }
    ngOnInit () {
     this.isLoading = true;
     this.servApi.getData(this.quaryDepartment)
        .then(data => {
            for (let i = 0; i < data.length; i++) {
                this.fieldKeysforCardFiles2.push([data[i]['DUE'], data[i]['CARD_NAME'], false, false]);
                CARD_FILES_DIRECTORY_MODAL_USER.fields.push({
                   key: data[i]['DUE'],
                   type: 'boolean',
                   title: data[i]['CARD_NAME'],
                   readonly: false
                });
           }
            this.init();
            this.isLoading = false;
        });
        }
        cancel() {
            this._closed();
        }
        submitDirectoryModal() {
            this.submit();
            this._closed();
        }
        _closed() {
            this.closeCollection.emit();
        }
}
