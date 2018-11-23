import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { SortableModule } from 'ngx-bootstrap/sortable';
import { DatepickerModule } from 'ngx-bootstrap/datepicker';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { AccordionModule } from 'ngx-bootstrap/accordion';

import { DragulaModule } from 'ng2-dragula';

// import { APP_CONFIG } from 'app/app.config.local';
// console.log('dict config', APP_CONFIG);

import { AppRoutingModule } from 'app/app-routing.module';
import { EosCommonModule } from 'eos-common/eos-common.module';
// import { EosRestModule } from 'eos-rest/eos-rest.module';

/* components */
import { CabinetNodeInfoComponent } from './node-info/cabinet-node-info.component';
import { CardComponent } from './card/card.component';
import { ColumnSettingsComponent } from './column-settings/column-settings.component';
import { CardEditComponent } from './card-views/card-edit.component';
import { CreateNodeComponent } from './create-node/create-node.component';
import { DepartmentsCardEditDepartmentComponent } from './card-views/departments-card-edit-department.component';
import { DepartmentsCardEditPersonComponent } from './card-views/departments-card-edit-person.component';
import { DepartmentNodeInfoComponent } from './node-info/department-node-info.component';
import { DictionaryComponent } from './dictionary/dictionary.component';
import { DictionariesComponent } from './dictionaries/dictionaries.component';
import { DictionarySearchComponent } from './dictionary-search/dictionary-search.component';
import { DocgroupCardComponent } from './card-views/docgroup-card.component';
import { VisatypeCardComponent } from './card-views/visatype-card.component';
import { ReestrtypeCardComponent } from './card-views/reestrtype-card.component';
import { DocgroupTemplateConfigComponent } from './docgroup-template-config/docgroup-template-config.component';
import { LongTitleHintComponent } from './long-title-hint/long-title-hint.component';
import { NodeActionsComponent } from './node-actions/node-actions.component';
import { NodeInfoSwitcherComponent } from './node-info/node-info-switcher.component';
import { NodeFieldComponent } from './node-field/node-field.component';
import { NodeListComponent } from './node-list/node-list.component';
import { NodeListItemComponent } from './node-list-item/node-list-item.component';
import { NodeListPaginationComponent } from './node-list-pagination/node-list-pagination.component';
import { NodeInfoComponent } from './node-info/node-info.component';
import { OrganizationsCardEditGroupComponent } from './card-views/organizations-card-edit-group.component';
import { OrganizationsCardEditNodeComponent } from './card-views/organizations-card-edit-node.component';
import { CabinetCardEditComponent } from './card-views/cabinet-card-edit.component';
import { SandwichComponent } from './sandwich/sandwich.component';
import { SecurityCardEditComponent } from './card-views/security-card-edit.component';
import { BroadcastChannelCardEditComponent } from './card-views/broadcast-channel-card-edit.component';
import { SevRulesCardEditComponent } from './card-views/sev-rules-card-edit.component';
import { SecurityNodeInfoComponent } from './node-info/security-node-info.component';
import { SimpleCardEditComponent } from './card-views/simple-card-edit.component';
import { TreeComponent } from './tree/tree.component';
import { DictionariesQuickSearchComponent } from './dictionary-quick-search/dictionary-quick-search.component';
import { CreateNodeBroadcastChannelComponent } from './create-node-broadcast-channel/create-node-broadcast-channel.component';

/* services */
import { DictionaryDescriptorService } from './core/dictionary-descriptor.service';
import { EosDataConvertService } from './services/eos-data-convert.service';
import { EosDepartmentsService } from './services/eos-department-service';
import { EosDictService } from './services/eos-dict.service';
import { EosSandwichService } from './services/eos-sandwich.service';
import { EosBroadcastChannelService } from './services/eos-broadcast-channel.service';
import { EosSevRulesService } from './services/eos-sev-rules.service';
import {CitizenCardComponent} from './card-views/citizen-card.component';
import {NomenklCardComponent} from './card-views/nomenkl-card.component';

@NgModule({
    declarations: [
        CardComponent,
        CardEditComponent,
        ColumnSettingsComponent,
        DepartmentsCardEditDepartmentComponent,
        DepartmentsCardEditPersonComponent,
        DictionaryComponent,
        DictionariesComponent,
        DictionariesQuickSearchComponent,
        DictionarySearchComponent,
        DocgroupCardComponent,
        CitizenCardComponent,
        NomenklCardComponent,
        VisatypeCardComponent,
        ReestrtypeCardComponent,
        DocgroupTemplateConfigComponent,
        NodeActionsComponent,
        NodeInfoComponent,
        NodeFieldComponent,
        NodeListComponent,
        NodeListItemComponent,
        NodeListPaginationComponent,
        CabinetCardEditComponent,
        SandwichComponent,
        SimpleCardEditComponent,
        TreeComponent,
        NodeInfoSwitcherComponent,
        DepartmentNodeInfoComponent,
        CabinetNodeInfoComponent,
        LongTitleHintComponent,
        SecurityCardEditComponent,
        SecurityNodeInfoComponent,
        CreateNodeComponent,
        CreateNodeBroadcastChannelComponent,
        BroadcastChannelCardEditComponent,
        SevRulesCardEditComponent,
        OrganizationsCardEditGroupComponent,
        OrganizationsCardEditNodeComponent
    ],
    entryComponents: [
        ColumnSettingsComponent,
        CreateNodeComponent,
        CreateNodeBroadcastChannelComponent,
        DocgroupTemplateConfigComponent,
    ],
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        AppRoutingModule,
        SortableModule.forRoot(),
        //        EosRestModule.forRoot(APP_CONFIG),
        EosCommonModule,
        AccordionModule.forRoot(),
        DatepickerModule.forRoot(),
        TooltipModule.forRoot(),
        ModalModule.forRoot(),
        PopoverModule.forRoot(),
        BsDropdownModule.forRoot(),
        TypeaheadModule.forRoot(),
        DragulaModule,
    ],
    exports: [
        DictionaryComponent,
        DictionariesComponent,
        SandwichComponent,
        ColumnSettingsComponent,
    ],
    providers: [
        DictionaryDescriptorService,
        EosDataConvertService,
        EosDepartmentsService,
        EosBroadcastChannelService,
        EosSevRulesService,
        EosDictService,
        EosSandwichService,
    ],
})
export class EosDictionariesModule { }
