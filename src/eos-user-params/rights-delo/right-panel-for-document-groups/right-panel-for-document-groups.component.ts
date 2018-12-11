import { Component, OnInit } from '@angular/core';
// import { UserParamApiSrv } from 'eos-user-params/shared/services/user-params-api.service';
// import { EosDataConvertService } from 'eos-dictionaries/services/eos-data-convert.service';
import { RightsDeloCardIndexRightsComponent } from '../rights-delo-card-index-rights/rights-delo-card-index-rights.component';

@Component({
    selector: 'eos-right-panel-for-document-groups',
    templateUrl: 'right-panel-for-document-groups.component.html'
})

export class RightPanelForDocumentGroupsComponent extends RightsDeloCardIndexRightsComponent implements OnInit {
    isLoading = false;
  /*  constructor(
        injector: Injector,
    ) {
        super(injector);
        this.dataSrv = injector.get(EosDataConvertService);
    }*/
    ngOnInit () {}
}
