import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
// import { HttpModule } from '@angular/http';

import { AppRoutingModule } from 'app/app-routing.module';

/*  Components  */
import { ParametersSystemComponent } from './parametersSystem/parametersSystem.component';
import { ParamWebComponent } from './parametersSystem/param-web/param-web.component';
import { ParamOtherComponent } from './parametersSystem/param-other/param-other.component';
import { ParamSearchComponent } from './parametersSystem/param-search/param-search.component';
import { ParamHeaderComponent } from './parametersSystem/shared/param-header/header.component';


/*  Service  */
import { EosParametersApiServ } from './parametersSystem/shared/service/eos-parameters-descriptor.service';
import { EosCommonModule } from 'eos-common/eos-common.module';


@NgModule({
    declarations: [
        ParametersSystemComponent,
        ParamWebComponent,
        ParamOtherComponent,
        ParamSearchComponent,
        ParamHeaderComponent,
    ],
    imports: [BrowserModule, TooltipModule.forRoot(), AppRoutingModule, FormsModule, ReactiveFormsModule,
        EosCommonModule],
    providers: [EosParametersApiServ]
})
export class EosParametersModule {}
