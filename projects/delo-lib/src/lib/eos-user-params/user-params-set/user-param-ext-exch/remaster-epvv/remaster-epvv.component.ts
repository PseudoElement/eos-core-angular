import { Component } from '@angular/core';

import { InputControlService } from '../../../../eos-common/services/input-control.service';
import { EosDataConvertService } from '../../../../eos-dictionaries/services/eos-data-convert.service';
import { FormHelperService } from '../../../shared/services/form-helper.services';
import { RemasterService } from '../../shared-user-param/services/remaster-service';
import { SearchService } from '../.././shared-user-param/services/search-service';

import { ConfigChannelCB } from '../../shared-user-param/interface/email-tree.interface';

import { REGISTRATION_EPVV } from '../../../user-params-set/shared-user-param/consts/remaster-email/remaster-email-epvv.const';
import { RemasterAbstractComponent } from '../remaster-abstract/remaster-abstract.component';

@Component({
    selector: 'eos-remaster-epvv',
    templateUrl: '../remaster-abstract/remaster-abstract.component.html',
    providers: [FormHelperService],
})

export class RemasterEpvvComponent extends RemasterAbstractComponent {
    public SEND_EMAIL: string;
    public SEND_RADIO: string;
    constructor(
        formHelp: FormHelperService,
        dataSrv: EosDataConvertService,
        inputCtrlSrv: InputControlService,
        _RemasterService: RemasterService,
        _searchService: SearchService,
    ) {
        const configChannel: ConfigChannelCB = {
            nameEN: 'EPVV',
            nameRU: 'ЕПВВ',
            fieldsConst: REGISTRATION_EPVV,
        }
        super(formHelp, dataSrv, inputCtrlSrv, _RemasterService, _searchService, configChannel);
        this.SEND_EMAIL = `${this.RCSEND}_HIDE_OPERATION_SEND_EMAIL`
        this.SEND_RADIO = `${this.RCSEND}_FOR_MULTIPOINT_DOCUMENTS_SEND_RADIO`
    }
}
