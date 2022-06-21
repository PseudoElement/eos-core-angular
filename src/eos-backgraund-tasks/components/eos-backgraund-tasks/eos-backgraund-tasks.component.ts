import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'eos-eos-backgraund-tasks',
  templateUrl: './eos-backgraund-tasks.component.html',
  styleUrls: ['./eos-backgraund-tasks.component.scss']
})
export class EosBackgraundTasksComponent implements OnInit {

  public backgr_lists: Array<any> = [
    {
      title: 'Фоновые задачи',
      icon: 'eos-icon-citizen-blue',
      id: 'fon_1'
    },
    {
      title: 'Фоновые задачи',
      icon: 'eos-icon-citizen-blue',
      id: 'fon_2'
    },
    {
      title: 'Фоновые задачи',
      icon: 'eos-icon-citizen-blue',
      id: 'fon_3'
    },
    {
      title: 'Фоновые задачи',
      icon: 'eos-icon-citizen-blue',
      id: 'fon_4'
    },

  ];
  constructor() { }

  ngOnInit() {
  }

}
