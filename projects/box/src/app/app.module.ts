import {  NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppDeloModule, EosCommonModule } from '@eos/delo-adm';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    EosCommonModule,
    AppDeloModule,

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
