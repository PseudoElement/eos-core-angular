import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
// import { TooltipModule, ModalModule, AccordionModule, BsDropdownModule } from 'ngx-bootstrap';
import { AppRoutingModule } from 'app/app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

/*     ----Components----     */
import { EosReportComponent } from './eos-report.component';
import { EosReportUsersInfoComponent } from './users-info/users-info.component';
import { EosReportUsersStatsComponent } from './users-stats/users-stats.component';
import { EosReportSummaryProtocolComponent } from './sum-protocol/sum-protocol.component';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { EosReportSummaryFilterProtocolComponent } from './filter-protocol/filter-protocol.component';
import { BsDatepickerModule } from 'ngx-bootstrap';
/*     ----Services----     */

@NgModule({
    declarations: [
        EosReportComponent,
        EosReportUsersInfoComponent,
        EosReportUsersStatsComponent,
        EosReportSummaryProtocolComponent,
        EosReportSummaryFilterProtocolComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        TooltipModule.forRoot(),
        PopoverModule,
        BsDatepickerModule.forRoot()
    ],
})

export class EosReportModule { }
