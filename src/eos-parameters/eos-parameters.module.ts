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

/*  Service  */
import { EosParameters } from './core/eos-parameters-descriptor.service';

@NgModule({
    declarations: [ParametersSystemComponent, ParamWebComponent, ParamOtherComponent, ParamSearchComponent],
    imports: [BrowserModule, TooltipModule.forRoot(), AppRoutingModule, FormsModule, ReactiveFormsModule],
    providers: [EosParameters]
})
export class EosParametersModule {}
