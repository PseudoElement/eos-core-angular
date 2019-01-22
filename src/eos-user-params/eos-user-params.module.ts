import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TooltipModule, ModalModule, AccordionModule } from 'ngx-bootstrap';
import { AppRoutingModule } from 'app/app-routing.module';
import { EosCommonModule } from 'eos-common/eos-common.module';

import { UserParamsComponent } from './eos-user-params.component';
import { UserParamApiSrv } from './shared/services/user-params-api.service';
import { UserParamsDescriptorSrv } from './shared/services/user-params-descriptor.service';
import { UserParamSetComponent } from './user-params-set/user-params-set.component';
import { UserParamHeaderComponent } from './shared/user-param-header/user-header.component';
import { UserParamRegistrationComponent } from './user-params-set/user-param-registration/user-param-registration.component';
import { UserParamCabinetsComponent } from './user-params-set/user-param-cabinets/user-param-cabinets.component';
import { UserParamRCComponent } from './user-params-set/user-param-rc/user-param-rc.component';
import { UserParamDirectoriesComponent } from './user-params-set/user-param-directories/user-param-directories.component';
import { UserParamSearchComponent } from './user-params-set/user-param-search/user-param-search.component';
import { UserParamVisualizationComponent } from './user-params-set/user-param-visualization/user-param-visualization.component';
import { UserParamEAComponent } from './user-params-set/user-param-external-application/user-param-external-application.component';
import { UserParamOtherForwardingComponent } from './user-params-set/user-param-other/user-param-other.component';
import { UserParamsService } from './shared/services/user-params.service';
import { ParamEmailAddressComponent } from './email-address/email-address.component';
import { ParamsRightsDeloComponent } from './rights-delo/rights-delo.component';
import { RightsDeloHeaderComponent } from './rights-delo/shared-rights-delo/rights-delo-header/rights-delo-header.component';
import { RightsDeloCardFilesComponent } from './rights-delo/rights-delo-card-files/rights-delo-card-files.component';
import { RightsDeloAbsoluteRightsComponent } from './rights-delo/rights-delo-absolute-rights/rights-delo-absolute-rights.component';
import { AbsoluteRightsDirectoryComponent } from './rights-delo/rights-delo-absolute-rights/absolute-rights-directory-modal/absolute-rights-directory-modal.component';
import { CardFilesDirectoryModalComponent } from './rights-delo/rights-delo-card-files/card-files-directory-modal/card-files-directory-modal.component';
import { RightsDeloCardIndexRightsComponent } from './rights-delo/rights-delo-card-index-rights/rights-delo-card-index-rights.component';
import { RightPanelForDocumentGroupsComponent } from './rights-delo/right-panel-for-document-groups/right-panel-for-document-groups.component';
import { ParamsBaseParamComponent } from './base-param/base-param.component';
import { InputParamControlService } from './shared/services/input-param-control.service';
import {EmailAddressService} from './shared/services/email-address.service';
import {EmailFormComponent} from './email-address/email-form/email-form.component';
import {RightLimitedAccessComponent} from './rights-delo/right-limited-access/right-limited-access.component';
import {LinksLimitedComponent} from './rights-delo/right-limited-access/links/links-limited.component';
import {LimitedAccesseService} from './shared/services/limited-access.service';
import { RightDepertmentComponent } from './rights-delo/rights-delo-absolute-rights/right-department/right-department.component';
import {GrifsComponent} from './rights-delo/right-limited-access/grifs/grifs-component';
import { RightAbsoluteDocGroupComponent } from './rights-delo/rights-delo-absolute-rights/right-doc-group/right-doc-group.component';
import { ListDocsTreeComponent } from './shared/list-docs-tree/list-docs-tree.component';
import {UserPaginationService} from './shared/services/users-pagination.service';

@NgModule({
    declarations: [
        UserParamsComponent,
        UserParamSetComponent,
        UserParamHeaderComponent,
        UserParamRegistrationComponent,
        UserParamCabinetsComponent,
        UserParamRCComponent,
        UserParamDirectoriesComponent,
        UserParamSearchComponent,
        UserParamVisualizationComponent,
        UserParamEAComponent,
        UserParamOtherForwardingComponent,
        ParamEmailAddressComponent,
        ParamsRightsDeloComponent,
        RightsDeloHeaderComponent,
        RightsDeloCardFilesComponent,
        RightsDeloAbsoluteRightsComponent,
        AbsoluteRightsDirectoryComponent,
        CardFilesDirectoryModalComponent,
        RightsDeloCardIndexRightsComponent,
        ParamsBaseParamComponent,
        EmailFormComponent,
        RightPanelForDocumentGroupsComponent,
        RightLimitedAccessComponent,
        ParamsBaseParamComponent,
        RightDepertmentComponent,
        GrifsComponent,
        RightAbsoluteDocGroupComponent,
        ListDocsTreeComponent,
        LinksLimitedComponent,
    ],
    entryComponents: [
        AbsoluteRightsDirectoryComponent,
        CardFilesDirectoryModalComponent
    ],
    imports: [
        BrowserModule,
        TooltipModule.forRoot(),
        AppRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        EosCommonModule,
        ModalModule,
        AccordionModule
    ],
    providers: [
        UserParamApiSrv,
        UserParamsDescriptorSrv,
        UserParamsService,
        InputParamControlService,
        EmailAddressService,
        LimitedAccesseService,
        UserPaginationService
    ]
})
export class EosUserParamsModule {}
