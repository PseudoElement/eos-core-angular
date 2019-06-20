import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
// import { TooltipModule, ModalModule, AccordionModule, BsDropdownModule } from 'ngx-bootstrap';
import { AppRoutingModule } from 'app/app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

/*     ----Components----     */
import { EosReportComponent } from './eos-report.component';
import { EosReportUsersInfoComponent } from './users-info/users-info.component';
import { EosReportUsersStatsComponent } from './users-stats/users-stats.component';
import { EosReportSummaryProtocolComponent } from './sum-protocol/sum-protocol.component';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { EosReportSummaryFilterProtocolComponent } from './filter-protocol/filter-protocol.component';
import { BsDatepickerModule } from 'ngx-bootstrap';
import { InputParamControlService } from 'eos-user-params/shared/services/input-param-control.service';
import { FormHelperService } from 'eos-user-params/shared/services/form-helper.services';
import { EosCommonModule } from 'eos-common/eos-common.module';
/*     ----Services----     */

@NgModule({
    declarations: [
        EosReportComponent,
        EosReportUsersInfoComponent,
        EosReportUsersStatsComponent,
        EosReportSummaryProtocolComponent,
        EosReportSummaryFilterProtocolComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        TooltipModule.forRoot(),
        PopoverModule,
        EosCommonModule,
        BsDropdownModule,
        BsDatepickerModule.forRoot()
    ],
    providers: [
        InputParamControlService,
        FormHelperService
    ]
})

export class EosReportModule { }
