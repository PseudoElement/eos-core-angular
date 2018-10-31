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
import { UserParamDirectoriesComponent } from './user-params-set/user-param-directories/user-param-directories.component';
import { UserParamSearchComponent } from './user-params-set/user-param-search/user-param-search.component';
import { UserParamVisualizationComponent } from './user-params-set/user-param-visualization/user-param-visualization.component';
import { UserParamEAComponent } from './user-params-set/user-param-external-application/user-param-external-application.component';
import { UserParamOtherForwardingComponent } from './user-params-set/user-param-other/user-param-other.component';
import { UserParamsService } from './shared/services/user-params.service';
import { ParamEmailAddressComponent } from './email-address/email-address.component';
import { ParamsRightsDeloComponent } from './rights-delo/rights-delo.component';
import { ParamsBaseParamComponent } from './base-param/base-param.component';
import { InputParamControlService } from './shared/services/input-param-control.service';

@NgModule({
    declarations: [
        UserParamsComponent,
        UserParamSetComponent,
        UserParamHeaderComponent,
        UserParamRegistrationComponent,
        UserParamDirectoriesComponent,
        UserParamSearchComponent,
        UserParamVisualizationComponent,
        UserParamEAComponent,
        UserParamOtherForwardingComponent,
        ParamEmailAddressComponent,
        ParamsRightsDeloComponent,
        ParamsBaseParamComponent
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
    ]
})
export class EosUserParamsModule {}