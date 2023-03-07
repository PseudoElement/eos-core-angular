import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EosBackgraundTasksComponent } from './components/eos-backgraund-tasks/eos-backgraund-tasks.component';
import { EosBackgraundSingleComponent } from './components/eos-backgraund-single/eos-backgraund-single.component';
import { EosBackgroundListComponent } from './components/eos-background-list/eos-background-list.component';

@NgModule({
  declarations: [EosBackgraundTasksComponent, EosBackgraundSingleComponent, EosBackgroundListComponent ],
  imports: [
    CommonModule
  ]
})
export class EosBackgraundTasksModule { }
