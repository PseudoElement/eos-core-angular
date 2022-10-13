import { Component, OnDestroy, OnInit } from '@angular/core';
import { IFonLists } from 'eos-backgraund-tasks/interface';
import { FonTasksService } from 'eos-backgraund-tasks/services/fon-tasks.service';

@Component({
  selector: 'eos-eos-backgraund-tasks',
  templateUrl: './eos-backgraund-tasks.component.html',
  styleUrls: ['./eos-backgraund-tasks.component.scss']
})



export class EosBackgraundTasksComponent implements OnInit, OnDestroy {
  lists: IFonLists[] = [];
  constructor(private _fonTasksSrv: FonTasksService) {
  }

  ngOnInit() {
    try {
      this.lists = this._fonTasksSrv.loadTaskLists();
    } catch (error) {
      console.log('Ошибка получения всех плагинов', error);
    }
  }


  ngOnDestroy(): void {
    this.lists = [];
  }

}
