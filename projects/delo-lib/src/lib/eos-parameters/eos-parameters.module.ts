import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ModalModule } from 'ngx-bootstrap';

// import { HttpModule } from '@angular/http';



/*  Components  */
import { ParametersSystemComponent } from './parametersSystem/parametersSystem.component';
import { ParamWebComponent } from './parametersSystem/param-web/param-web.component';
import { ParamOtherComponent } from './parametersSystem/param-other/param-other.component';
import { ParamSearchComponent } from './parametersSystem/param-search/param-search.component';
import { ParamHeaderComponent } from './parametersSystem/shared/param-header/header.component';
import { ParamContextRcComponent } from './parametersSystem/param-context-rc/param-context-rc.component';
import { ParamAuthenticationComponent } from './parametersSystem/param-authentication/param-authentication.component';
import { AuthenticationCollectionComponent } from './parametersSystem/param-authentication/collection/collection.component';
import { ParamFielsComponent } from './parametersSystem/param-files/param-files.component';
import { ParamPrjRcComponent } from './parametersSystem/param-prj-rc/param-prj-rc.component';
import { ParamRcComponent } from './parametersSystem/param-rc/param-rc.component';
import { CertStoresComponent } from './parametersSystem/param-web/cert-stores/cert-stores.component';
import { AddCertStoresComponent } from './parametersSystem/param-web/cert-stores/add-cert-stores/add-cert-stores.component';
import { ParamOrganizNowComponent } from './parametersSystem/param-organiz-now/param-org-now.component';



/*  Service  */
import { ParamApiSrv } from './parametersSystem/shared/service/parameters-api.service';
import { EosCommonModule } from '../eos-common/eos-common.module';
import { CollectionService } from './parametersSystem/param-authentication/collection/collection.service';
import { ParamDictionariesComponent } from './parametersSystem/param-dictionaries/param-dictionaries.component';
import { ParamLoggingComponent } from './parametersSystem/param-logging/param-logging.component';
import {ParamConversionComponent} from './parametersSystem/param-conversion/param-conversion.component';
import { ParamUnloadingComponent } from './parametersSystem/param-unloading/param-unloading.component';
import { ParamLibComponent } from './parametersSystem/param-lib/param-lib.component';
import { AppDeloRoutingModule } from '../app/app-delo-routing.module';
import { ParamCryptographyComponent } from './parametersSystem/param-cryptography/param-cryptography.component';
import { EditCryptographyComponent } from './parametersSystem/param-cryptography/edit-cryptography/edit-cryptography.component';
import { ParamEmailComponent } from './parametersSystem/param-email/param-email.component';
import { ParamEmailCardComponent } from './parametersSystem/param-email/param-email-card/param-email-card.component';
import { ParamLibsComponent } from './parametersSystem/param-libs/param-libs.component';
import { EosParamLicensingComponent } from './parametersSystem/eos-param-licensing/eos-param-licensing.component';
import { ParamInlineScanningComponent } from './parametersSystem/inline-scanning/param-dictionaries.component';
import { SmsGatewayComponent } from './parametersSystem/sms-gateway/sms-gateway.component';
import { SmsGatewayCardComponent } from './parametersSystem/sms-gateway/sms-gateway-card/sms-gateway-card.component';
import { ParamExtendedProtocolComponent } from './parametersSystem/extended-protocol/extended-protocol.component';
import { ParamConversionCardComponent } from './parametersSystem/param-conversion/param-conversion-card/param-conversion-card.component';
import { ParamPreviewComponent } from './parametersSystem/param-preview/param-preview.component';
import { ParamTraceComponent } from './parametersSystem/param-trace/param-trace.component';

@NgModule({
    declarations: [
        ParametersSystemComponent,
        ParamWebComponent,
        ParamOtherComponent,
        ParamSearchComponent,
        ParamHeaderComponent,
        ParamContextRcComponent,
        ParamAuthenticationComponent,
        AuthenticationCollectionComponent,
        ParamFielsComponent,
        ParamDictionariesComponent,
        ParamPrjRcComponent,
        ParamRcComponent,
        CertStoresComponent,
        AddCertStoresComponent,
        ParamLoggingComponent,
        ParamOrganizNowComponent,
        ParamConversionComponent,
        ParamUnloadingComponent,
        ParamLibComponent,
        ParamCryptographyComponent,
        EditCryptographyComponent,
        ParamEmailComponent,
        ParamEmailCardComponent,
        ParamLibsComponent,
        EosParamLicensingComponent,
        ParamInlineScanningComponent,
        SmsGatewayComponent,
        SmsGatewayCardComponent,
        ParamExtendedProtocolComponent,
        ParamConversionCardComponent,
        ParamPreviewComponent,
        ParamTraceComponent
    ],
    entryComponents: [
        AuthenticationCollectionComponent,
        EditCryptographyComponent
    ],
    imports: [
        BrowserModule,
        TooltipModule.forRoot(),
        AppDeloRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        EosCommonModule,
        ModalModule,
    ],
    providers: [
        ParamApiSrv,
        CollectionService
    ],
    exports: [
        ParamHeaderComponent,
    ]
})
export class EosParametersModule {}
