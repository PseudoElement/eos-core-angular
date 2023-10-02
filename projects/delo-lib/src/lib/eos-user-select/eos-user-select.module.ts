import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { TooltipModule, ModalModule, AccordionModule, BsDropdownModule, PopoverModule, AlertModule } from 'ngx-bootstrap';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EosCommonModule } from '../eos-common/eos-common.module';
import { EosParametersModule } from '../eos-parameters/eos-parameters.module';
import { UserPaginationService } from '../eos-user-params/shared/services/users-pagination.service';

/*     ----Components----     */
import { UserSelectComponent } from './eos-user-select.component';
import { TreeUserSelectComponent } from './tree-user-select/tree-user-select.component';
import { ListUserSelectComponent } from './list-user-select/list-user-select.component';
import { CreateUserComponent } from './list-user-select/createUser/createUser.component';
import {RightUserSelectComponent} from './right-user-select/right-user-select.component';
import {UserSystemComponent} from './user-system/user-system.component';
import {BtnActionComponent} from './btn-action/btn-action.component';
import { UserSearchComponent } from './user-search/user-search.component';
/*     ----Services----     */
import { TreeUserSelectService } from './shered/services/tree-user-select.service';
import { RtUserSelectService } from './shered/services/rt-user-select.service';
import {SearchServices} from '../eos-user-select/shered/services/search.service';
import { EosReportUsersInfoComponent } from '../eos-user-params/report/users-info/users-info.component';
import { SettingManagementComponent } from './list-user-select/setting-management/setting-management.component';
import { AppDeloRoutingModule } from '../app/app-delo-routing.module';
import { FilterUsersPipe } from './shered/pipes/filter-users.pipe';
@NgModule({
    declarations: [
        UserSelectComponent,
        TreeUserSelectComponent,
        ListUserSelectComponent,
        CreateUserComponent,
        RightUserSelectComponent,
        UserSystemComponent,
        BtnActionComponent,
        UserSearchComponent,
        EosReportUsersInfoComponent,
        SettingManagementComponent,
        FilterUsersPipe
    ],
    entryComponents: [
        CreateUserComponent,
        SettingManagementComponent
    ],
    imports: [
        BrowserModule,
        TooltipModule.forRoot(),
        BsDropdownModule.forRoot(),
        PopoverModule.forRoot(),
        AlertModule.forRoot(),
        AppDeloRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        EosCommonModule,
        ModalModule,
        AccordionModule,
        EosParametersModule,
    ],
    exports: [EosReportUsersInfoComponent],
    providers: [
        TreeUserSelectService,
        RtUserSelectService,
        SearchServices,
        UserPaginationService
    ]
})
export class EosUserSelectModule {}
