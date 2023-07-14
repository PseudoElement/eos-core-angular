import {  NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppDeloModule, EosCommonModule } from '@eos/delo-adm';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GraphQLModule } from './graphql.module';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    EosCommonModule,
    AppDeloModule,
    GraphQLModule,
    HttpClientModule,

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
