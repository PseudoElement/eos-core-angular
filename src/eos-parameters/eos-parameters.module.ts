import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
// import { HttpModule } from '@angular/http';
import { ParametersSystemComponent } from './parametersSystem/parametersSystem.component';

@NgModule({
    declarations: [ParametersSystemComponent],
    imports: [BrowserModule, TooltipModule.forRoot()]
})
export class EosParametersModule {}
