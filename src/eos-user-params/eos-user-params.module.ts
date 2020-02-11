import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TooltipModule, ModalModule, AccordionModule, PopoverModule, BsDropdownModule, BsDatepickerModule } from 'ngx-bootstrap';
import { AppRoutingModule } from 'app/app-routing.module';
import { EosCommonModule } from 'eos-common/eos-common.module';

import { UserParamsComponent } from './eos-user-params.component';
import { UserParamApiSrv } from './shared/services/user-params-api.service';
import { UserParamHeaderComponent } from './shared/user-param-header/user-header.component';
import { UserParamRegistrationRemasterComponent } from './user-params-set/user-param-registration-remaster/user-param-registration-remaster.component';
import { UserParamCabinetsComponent } from './user-params-set/user-param-cabinets/user-param-cabinets.component';
import { UserParamRCComponent } from './user-params-set/user-param-rc/user-param-rc.component';
import { UserParamDirectoriesComponent } from './user-params-set/user-param-directories/user-param-directories.component';
import { UserParamSearchComponent } from './user-params-set/user-param-search/user-param-search.component';
import { UserParamVisualizationComponent } from './user-params-set/user-param-visualization/user-param-visualization.component';
import { UserParamEAComponent } from './user-params-set/user-param-external-application/user-param-external-application.component';
import { UserParamOtherForwardingComponent } from './user-params-set/user-param-other/user-param-other.component';
import { UserParamsService } from './shared/services/user-params.service';
import { ParamEmailAddressComponent } from './email-address/email-address.component';
import { RightsCardFilesComponent } from './rights-delo/rights-cabinets/rights-card-files.component';
import { RightsDeloAbsoluteRightsComponent } from './rights-delo/rights-delo-absolute-rights/rights-delo-absolute-rights.component';
import { RightsDeloCardsComponent } from './rights-delo/rights-delo-cards/rights-delo-cards.component';
import { ParamsBaseParamComponent } from './base-param/base-param.component';
import { InputParamControlService } from './shared/services/input-param-control.service';
import { EmailAddressService } from './shared/services/email-address.service';
import { EmailFormComponent } from './email-address/email-form/email-form.component';
import { RightLimitedAccessComponent } from './rights-delo/right-limited-access/right-limited-access.component';
import { LinksLimitedComponent } from './rights-delo/right-limited-access/links/links-limited.component';
import { LimitedAccesseService } from './shared/services/limited-access.service';
import { RightDepertmentComponent } from './rights-delo/rights-delo-absolute-rights/right-department/right-department.component';
import { GrifsComponent } from './rights-delo/right-limited-access/grifs/grifs-component';
import { GrifsFilesComponent } from './rights-delo/right-limited-access/grifs-files/grifs-files-component';
import { RightAbsoluteDocGroupComponent } from './rights-delo/rights-delo-absolute-rights/right-doc-group/right-doc-group.component';
import { ListDocsTreeComponent } from './shared/list-docs-tree/list-docs-tree.component';
import { AbsoluteRightsClassifComponent } from './rights-delo/rights-delo-absolute-rights/absolute-rights-classif/absolute-rights-classif.component';
import { UserPaginationService } from './shared/services/users-pagination.service';
import { UserHeaderComponent } from '../eos-user-params/user-header/user-header.component';
import { InlineScaningComponent } from '../eos-user-params/inline-scaning/inline-scaning.component';
import { UserParamElSignatureComponent } from '../eos-user-params/user-params-set/user-param-el-signature/user-param-el-signature.component';
import { SignaturePopupComponent } from '../eos-user-params/user-params-set/user-param-el-signature/signature-popup/signature-popup.component';
import { SignatureAddComponent } from '../eos-user-params/user-params-set/user-param-el-signature/signature-popup/signature-add/signature-add.component';
import { UserParamsProfSertComponent } from '../eos-user-params/user-params-set/user-param-prof-sert/user-params-prof-sert.component';
import { RemasterService } from '../eos-user-params/user-params-set/shared-user-param/services/remaster-service';
import { RemasterDopOperationComponent } from '../eos-user-params/user-params-set/user-param-registration-remaster/remaster-dop/remaster-dop-operation.component';
import { RemasterAddressesComponent } from '../eos-user-params/user-params-set/user-param-registration-remaster/remaster-addresses/remaster-addresses.conponent';
import { RemasterScanComponent } from '../eos-user-params/user-params-set/user-param-registration-remaster/remaster-scan/remaster-scan.conponent';
import { RemasterAutoSearchComponent } from '../eos-user-params/user-params-set/user-param-registration-remaster/remaster-auto-search/remaster-auto-search.conponent';
import { RemasterRcComponent } from '../eos-user-params/user-params-set/user-param-registration-remaster/remaster-rc/remaster-rc.component';
import { RtCabinetsFoldersComponent } from './rights-delo/rights-cabinets/rt-cabinets-folders/rt-cabinets-folders.component';
import { RigthsCabinetsServices } from '../eos-user-params/shared/services/rigths-cabinets.services';
import { ListCardRightComponent } from './rights-delo/rights-delo-cards/list-card/list-card.component';
import { CardRightSrv } from './rights-delo/rights-delo-cards/card-right.service';
import { ErrorHelperServices } from '../eos-user-params/shared/services/helper-error.services';
import {UserParamTransferComponent} from './user-params-set/user-param-other/user-param-transfer/user-param-transfer.component';
import {UserParamAddressesComponent} from './user-params-set/user-param-other/user-param-addresses/user-param-addresses.component';
import {UserParamReestrComponent} from './user-params-set/user-param-other/user-param-reestr/user-param-reestr.component';
import {UserParamReestrCBComponent} from './user-params-set/user-param-other/user-param-reestr-cb/user-param-reestr-cb.component';
import {UserParamShablonyComponent} from './user-params-set/user-param-shablony/user-param-shablony.component';
import {BaseSertsComponent} from './base-param/base-serts/base-serts.component';
import { OrganizEditTypeComponent } from './rights-delo/rights-delo-absolute-rights/organiz-edit-type/organiz-edit-type.component';
import { EosReportSummaryProtocolComponent } from './report/sum-protocol/sum-protocol.component';
import { EosReportUsersStatsComponent } from './report/users-stats/users-stats.component';
import { EosReportSummaryFilterProtocolComponent } from './report/filter-protocol/filter-protocol.component';
import { EosReportProtocolComponent } from './report/protocol/protocol.component';
import { FormHelperService } from './shared/services/form-helper.services';
import { DefaultSettingsComponent } from './default-options/default-settings.component';
import { RightDepertOrganizComponent } from './rights-delo/rights-delo-absolute-rights/right-organiz/right-organiz.component';
import { RightOrganizDepertComponent } from './rights-delo/rights-delo-absolute-rights/right-dep-org/right-dep-org.component';
import { ParamsBaseParamCBComponent } from './base-param/base-param-cb/base-param-cb.component';
import { CbUserRoleComponent } from './base-param/base-param-cb/cb-user-role/cb-user-role.component';
import { DragulaModule } from 'ng2-dragula';
import { AddGrifComponent } from './user-params-set/user-param-other/user-param-reestr-cb/addGrif/addGrif.component';
import { AutenteficationComponent } from './auntefication/auntefication.component';
import { UserParamExtendExchComponent } from './user-params-set/user-param-ext-exch/user-param-ext-exch.component';
import { RemasterSebComponent } from './user-params-set/user-param-ext-exch/remaster-seb/remaster-seb.component';
import { RemasterEmailComponent } from './user-params-set/user-param-ext-exch/remaster-email/remaster-email.component';
import { UserParamJournalTrDocComponent } from './user-params-set/user-param-other/user-param-journal-transf-doc/user-param-journal-tr-doc.component';

@NgModule({
    declarations: [
        UserParamsComponent,
        UserParamHeaderComponent,
        UserParamRegistrationRemasterComponent,
        UserParamExtendExchComponent,
        UserParamCabinetsComponent,
        UserParamRCComponent,
        UserParamDirectoriesComponent,
        UserParamSearchComponent,
        UserParamVisualizationComponent,
        UserParamEAComponent,
        UserParamOtherForwardingComponent,
        ParamEmailAddressComponent,
        RightsCardFilesComponent,
        RightsDeloAbsoluteRightsComponent,
        RightsDeloCardsComponent,
        ParamsBaseParamComponent,
        EmailFormComponent,
        RightLimitedAccessComponent,
        ParamsBaseParamCBComponent,
        RightDepertmentComponent,
        GrifsComponent,
        GrifsFilesComponent,
        RightAbsoluteDocGroupComponent,
        ListDocsTreeComponent,
        LinksLimitedComponent,
        AbsoluteRightsClassifComponent,
        UserHeaderComponent,
        InlineScaningComponent,
        UserParamElSignatureComponent,
        SignaturePopupComponent,
        SignatureAddComponent,
        UserParamsProfSertComponent,
        RemasterEmailComponent,
        RemasterDopOperationComponent,
        RemasterAddressesComponent,
        RemasterScanComponent,
        RemasterAutoSearchComponent,
        RemasterSebComponent,
        RemasterRcComponent,
        RtCabinetsFoldersComponent,
        ListCardRightComponent,
        UserParamTransferComponent,
        UserParamAddressesComponent,
        UserParamJournalTrDocComponent,
        UserParamReestrCBComponent,
        UserParamReestrComponent,
        UserParamShablonyComponent,
        BaseSertsComponent,
        OrganizEditTypeComponent,
        EosReportSummaryProtocolComponent,
        EosReportUsersStatsComponent,
        EosReportSummaryFilterProtocolComponent,
        EosReportProtocolComponent,
        DefaultSettingsComponent,
        RightDepertOrganizComponent,
        AddGrifComponent,
        RightOrganizDepertComponent,
        CbUserRoleComponent,
        AutenteficationComponent,
    ],
    entryComponents: [
        AddGrifComponent
    ],
    imports: [
        BrowserModule,
        TooltipModule.forRoot(),
        AppRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        EosCommonModule,
        ModalModule,
        AccordionModule,
        PopoverModule,
        BsDropdownModule,
        BsDatepickerModule.forRoot(),
        DragulaModule
    ],
    providers: [
        UserParamApiSrv,
        UserParamsService,
        InputParamControlService,
        EmailAddressService,
        LimitedAccesseService,
        UserPaginationService,
        RemasterService,
        RigthsCabinetsServices,
        CardRightSrv,
        ErrorHelperServices,
        FormHelperService
    ]
})
export class EosUserParamsModule { }
