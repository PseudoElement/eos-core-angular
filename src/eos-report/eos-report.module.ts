import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
// import { TooltipModule, ModalModule, AccordionModule, BsDropdownModule } from 'ngx-bootstrap';
import { AppRoutingModule } from 'app/app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

/*     ----Components----     */
import { EosReportComponent } from './eos-report.component';
import { EosReportUsersInfoComponent } from './users-info/users-info.component';
import { EosReportUsersStatsComponent } from './users-stats/users-stats.component';
import { EosReporSubsystemComponent } from './subsystem/subsystem.component';
/*     ----Services----     */

@NgModule({
    declarations: [
        EosReportComponent,
        EosReportUsersInfoComponent,
        EosReportUsersStatsComponent,
        EosReporSubsystemComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        ReactiveFormsModule,
    ],
})

export class EosReportModule { }
