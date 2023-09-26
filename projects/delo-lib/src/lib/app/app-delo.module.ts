import { SystemParamsGuard } from './guards/system-params.guard';
import { UsersPermissionGuard } from './guards/users-permission.guard';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler, LOCALE_ID, Injector } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { SortableModule } from 'ngx-bootstrap/sortable';

import { EosErrorHandler } from './core/error-handler';

import { APP_CONFIG_LOCAL } from './app.config.local';


import { EosCommonModule } from '../eos-common/eos-common.module';
import { EosDictionariesModule } from '../eos-dictionaries/eos-dictionaries.module';
import { EosRestModule } from '../eos-rest/eos-rest.module';

import { EosParametersModule } from '../eos-parameters/eos-parameters.module';
import { EosUserParamsModule } from '../eos-user-params/eos-user-params.module';
import { EosUserSelectModule } from '../eos-user-select/eos-user-select.module';

import { AppDeloComponent } from './app-delo.component';
import { BreadcrumbsComponent } from './breadcrumb/breadcrumb.component';
import { DesktopComponent } from './desktop/desktop.component';
import { DesktopListComponent } from './desktop-list/desktop-list.component';
import { DesktopSwitcherComponent } from './desktop-switcher/desktop-switcher.component';
import { EosHeaderComponent } from './header/eos-header.component';
import { LoginComponent } from './login/login.component';
import { LoginFormComponent } from './login-form/login-form.component';
import { NoticeComponent } from './notice/notice.component';
import { PushpinComponent } from './pushpin/pushpin.component';
import { SearchComponent } from './search/search.component';

import { TestPageComponent } from './test-page/test-page.component';

import { TitleComponent } from './title/title.component';
import { UserComponent } from './user/user.component';
import { NavParamComponent } from './nav-param/nav-param.component';

import { EosBreadcrumbsService } from './services/eos-breadcrumbs.service';
import { EosDeskService } from './services/eos-desk.service';
import { EosNoticeService } from './services/eos-notice.service';
import { EosStorageService } from './services/eos-storage.service';
import { EosUserProfileService } from './services/eos-user-profile.service';
import { CarmaHttpService } from './services/carmaHttp.service';
import { NavParamService } from './services/nav-param.service';
import { WaitClassifService } from './services/waitClassif.service';
import {CertificateService} from './services/certificate.service';
import { ExportImportClService } from './services/export-import-cl.service';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { GraphQLModule } from './graphql.module';

/* guards */
import { AuthorizedGuard, UnauthorizedGuard } from './guards/eos-auth.guard';
import { CanDeactivateGuard } from './guards/can-deactivate.guard';
import { PermissionsGuard } from './guards/permissions.guard';
import { StaticHelper } from './app.static';
import { CarmaHttp2Service } from './services/camaHttp2.service';
import { CanDeactivateDictGuard } from './guards/can-deactivate-dict.guard';
import { AppDeloRoutingModule } from './app-delo-routing.module';
import { BackgroundTaskGuard } from './guards/background-tasks.guard';
import { EosBackgraundTasksModule } from '../eos-backgraund-tasks/eos-backgraund-tasks.module';
import { EosInstrumentsModule } from '../eos-instruments/eos-instruments.module';
import { AbsoluteRigthServiceLib } from '../eos-rest/addons/absoluteRigth.service';
import { ExetentionsRigthsServiceLib } from '../eos-rest/addons/extentionsRigts.service';
import { ExetentionsUserParamsLib } from '../eos-rest/addons/ExtentionsUserParamsLib.service';
import { EosCommonOverriveService } from './services/eos-common-overrive.service';
import { logoOverrideServices } from './services/logo-overrride.service';
import { UserSessionGuard } from './guards/user-session.guard';
import { ScrollingModule } from '@angular/cdk/scrolling';
/* end guards */

@NgModule({
    declarations: [
        AppDeloComponent,
        BreadcrumbsComponent,
        DesktopComponent,
        DesktopListComponent,
        DesktopSwitcherComponent,
        EosHeaderComponent,
        LoginComponent,
        LoginFormComponent,
        NoticeComponent,
        PushpinComponent,
        SearchComponent,
        TestPageComponent,
        TitleComponent,
        UserComponent,
        NavParamComponent,
    ],
    imports: [
        AppDeloRoutingModule,
        BrowserModule,
        FormsModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        HttpClientModule,
        BsDropdownModule.forRoot(),
        SortableModule.forRoot(),
        TooltipModule.forRoot(),
        EosRestModule.forRoot(APP_CONFIG_LOCAL),
        BsDatepickerModule.forRoot(),
        EosCommonModule,
        EosDictionariesModule,
        EosParametersModule,
        EosUserParamsModule,
        EosUserSelectModule,
        EosBackgraundTasksModule,
        EosInstrumentsModule,
        GraphQLModule,
        ScrollingModule
    ],
    entryComponents: [
        LoginFormComponent,
    ],
    exports: [
        AppDeloComponent,
        AppDeloRoutingModule,
    ],
    providers: [
        { provide: LOCALE_ID, useValue: 'ru' },
        { provide: ErrorHandler, useClass: EosErrorHandler },
        AuthorizedGuard,
        UserSessionGuard,
        UnauthorizedGuard,
        CanDeactivateGuard,
        CanDeactivateDictGuard,
        UsersPermissionGuard,
        SystemParamsGuard,
        PermissionsGuard,
        EosBreadcrumbsService,
        EosDeskService,
        EosErrorHandler,
        EosNoticeService,
        EosStorageService,
        EosUserProfileService,
        CarmaHttpService,
        CarmaHttp2Service,
        NavParamService,
        WaitClassifService,
        CertificateService,
        ExportImportClService,
        BackgroundTaskGuard,
        AbsoluteRigthServiceLib,
        ExetentionsRigthsServiceLib,
        ExetentionsUserParamsLib,
        EosCommonOverriveService,
        logoOverrideServices
    ],
})

export class AppDeloModule {
    constructor(private injector: Injector) {
        StaticHelper.setInjectorInstance(this.injector);
    }
}

