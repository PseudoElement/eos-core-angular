import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthorizedGuard } from '../app/guards/eos-auth.guard';
import { EosBackgraundSingleComponent } from './components/eos-backgraund-single/eos-backgraund-single.component';
import { EosBackgraundTasksComponent } from './components/eos-backgraund-tasks/eos-backgraund-tasks.component';

const routes: Routes = [
  {
    path: '',
    component: EosBackgraundTasksComponent,
    pathMatch: 'full',
    canActivate: [AuthorizedGuard],
  },
  {
    path: ':taskId',
    component: EosBackgraundSingleComponent,
    data: {
      showBreadcrumb: false,
      showInBreadcrumb: false,
      showSandwichInBreadcrumb: false,
      showPushpin: false
  },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EosBackgraundTasksRoutingModule { }
