import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
// import { TooltipModule, ModalModule, AccordionModule, BsDropdownModule } from 'ngx-bootstrap';
import { AppRoutingModule } from 'app/app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

/*     ----Components----     */
import { EosReportComponent } from './eos-report.component';
/*     ----Services----     */

@NgModule({
    declarations: [
        EosReportComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        ReactiveFormsModule,
    ],
})

export class EosReportModule { }
