import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EosInstrumentsListsComponent } from './components/eos-instruments-lists/eos-instruments-lists.component';
import { EosInstrumentsSingleComponent } from './components/eos-instruments-single/eos-instruments-single.component';
import { EosInstrumentsListComponent } from './components/eos-instruments-list/eos-instruments-list.component';

@NgModule({
  declarations: [EosInstrumentsListsComponent, EosInstrumentsSingleComponent, EosInstrumentsListComponent ],
  imports: [
    CommonModule
  ]
})
export class EosInstrumentsModule { }
