import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { TooltipModule, ModalModule, AccordionModule, BsDropdownModule } from 'ngx-bootstrap';
import { AppRoutingModule } from 'app/app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EosCommonModule } from 'eos-common/eos-common.module';
import { UserSelectPaginationComponent } from './pagination-user-select/pagination-user-select.component';
import { EosParametersModule } from 'eos-parameters/eos-parameters.module';

/*     ----Components----     */
import { UserSelectComponent } from './eos-user-select.component';
import { TreeUserSelectComponent } from './tree-user-select/tree-user-select.component';
import { ListUserSelectComponent } from './list-user-select/list-user-select.component';
import { CreateUserComponent } from './list-user-select/createUser/createUser.component';
import {RightUserSelectComponent} from './right-user-select/right-user-select.component';
import {DepartUserSelectComponent} from './depart-user-select/depart-user-select.component';
import {CabinetUserComponent} from './cabinet-user/cabinet-user.component';
import {UserSystemComponent} from './user-system/user-system.component';
/*     ----Services----     */
import { TreeUserSelectService } from './shered/services/tree-user-select.service';
import { RtUserSelectService } from './shered/services/rt-user-select.service';
@NgModule({
    declarations: [
        UserSelectComponent,
        TreeUserSelectComponent,
        UserSelectPaginationComponent,
        ListUserSelectComponent,
        CreateUserComponent,
        RightUserSelectComponent,
        DepartUserSelectComponent,
        UserSystemComponent,
        CabinetUserComponent
    ],
    entryComponents: [
        CreateUserComponent
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
        AccordionModule,
        EosParametersModule,
    ],
    providers: [
        TreeUserSelectService,
        RtUserSelectService
    ],
})
export class EosUserSelectModule {}
