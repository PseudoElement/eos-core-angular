/* todo: remove after debug */
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
/* end:todo */

import { NgModule, Optional, ModuleWithProviders, SkipSelf } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { DeliveryComponent } from './clman/delivery.component';
import { RubricComponent } from './clman/rubric.component';
import { DeliveryDetailComponent } from './clman/delivery-detail.component';
import { DepartmentComponent } from './clman/department.component';
import { UserRestComponent } from './clman/user.component';

// import { IAppCfg } from 'eos-common/interfaces';
import { ApiCfg } from './core/api-cfg';

/* services */
import { PipRX } from './services/pipRX.service';
import { AuthService } from './services/auth.service';
// import { ContextService } from './services/appContext.service';
import { AppContext } from 'eos-rest/services/appContext.service';
import { ViewManager } from 'eos-rest/services/viewManager';
import { EosTemplateComponent } from './clman/eos-template/eos-template.component';
// import { commonMergeMeta } from 'eos-rest/common/initMetaData';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpClientModule,
    ],
    declarations: [
        DeliveryComponent,
        RubricComponent,
        DeliveryDetailComponent,
        DepartmentComponent,
        UserRestComponent,
        EosTemplateComponent,
    ],
    exports: [
        DeliveryComponent,
        RubricComponent,
        DepartmentComponent,
        UserRestComponent,
    ],
    providers: [
        PipRX,
        AuthService,
        AppContext,
        ViewManager,
        // ContextService,
    ]
})
export class EosRestModule {
    constructor( @Optional() @SkipSelf() parentModule: EosRestModule) {
        if (parentModule) {
            throw new Error(
                'EosRestModule is already loaded. Import it in the AppModule only');
        }
    }

    static forRoot(config: any): ModuleWithProviders {
        return {
            ngModule: EosRestModule,
            providers: [
                {
                    provide: ApiCfg,
                    useValue: config
                }
            ]
        };
    }
}
