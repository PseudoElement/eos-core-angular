import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
// import { HttpModule } from '@angular/http';

import { AppRoutingModule } from 'app/app-routing.module';

import { ParametersSystemComponent } from './parametersSystem/parametersSystem.component';
import { ParamWebComponent } from './param-web/param-web.component';
import { ParamOtherComponent } from './param-other/param-other.component';
import { ParamSearchComponent } from './param-search/param-search.component';


@NgModule({
    declarations: [ParametersSystemComponent, ParamWebComponent, ParamOtherComponent, ParamSearchComponent],
    imports: [BrowserModule, TooltipModule.forRoot(), AppRoutingModule]
})
export class EosParametersModule {}
