import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EosInstrumentsListsComponent } from './components/eos-instruments-lists/eos-instruments-lists.component';
import { EosInstrumentsSingleComponent } from './components/eos-instruments-single/eos-instruments-single.component';
import { EosInstrumentsListComponent } from './components/eos-instruments-list/eos-instruments-list.component';
import { ToolsControlCache } from './components/control-cache/control-cache.component';
import { RouterModule } from '@angular/router';
import { TooltipModule } from 'ngx-bootstrap';

@NgModule({
  declarations: [
    EosInstrumentsListsComponent,
    EosInstrumentsSingleComponent,
    EosInstrumentsListComponent,
    ToolsControlCache ],
  imports: [
    CommonModule,
    RouterModule,
    TooltipModule.forRoot(),
  ]
})
export class EosInstrumentsModule { }
