import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
// import { HttpModule } from '@angular/http';

import { AppRoutingModule } from 'app/app-routing.module';

/*  Components  */
import { ParametersSystemComponent } from './parametersSystem/parametersSystem.component';
import { ParamWebComponent } from './param-web/param-web.component';
import { ParamOtherComponent } from './param-other/param-other.component';
import { ParamSearchComponent } from './param-search/param-search.component';
import { ParamHeaderComponent } from './param-header/header.component';


/*  Service  */
import { EosParametersApiServ } from './core/eos-parameters-descriptor.service';
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
