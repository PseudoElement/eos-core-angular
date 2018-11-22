import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { TooltipModule, ModalModule, AccordionModule, BsDropdownModule } from 'ngx-bootstrap';
import { AppRoutingModule } from 'app/app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EosCommonModule } from 'eos-common/eos-common.module';
import { UserSelectPaginationComponent } from './pagination-user-select/pagination-user-select.component';

/*     ----Components----     */
import { UserSelectComponent } from './eos-user-select.component';
import { TreeUserSelectComponent } from './tree-user-select/tree-user-select.component';
import { ListUserSelectComponent } from './list-user-select/list-user-select.component';
/*     ----Services----     */
import { TreeUserSelectService } from './shered/services/tree-user-select.service';

@NgModule({
    declarations: [
        UserSelectComponent,
        TreeUserSelectComponent,
        UserSelectPaginationComponent,
        ListUserSelectComponent,
    ],
    imports: [
        BrowserModule,
        TooltipModule.forRoot(),
        BsDropdownModule.forRoot(),
        AppRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        EosCommonModule,
        ModalModule,
        AccordionModule
    ],
    providers: [
        TreeUserSelectService,
    ],
})
export class EosUserSelectModule {}
