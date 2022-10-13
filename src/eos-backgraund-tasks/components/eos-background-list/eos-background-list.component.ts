import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ETypeFon, IFonLists } from 'eos-backgraund-tasks/interface';
import {DISABLED_LIST_ITEM} from 'app/consts/messages.consts';
import { AppContext } from 'eos-rest/services/appContext.service';

@Component({
  selector: 'eos-eos-background-list',
  templateUrl: './eos-background-list.component.html',
  styleUrls: ['./eos-background-list.component.scss']
})
export class EosBackgroundListComponent implements OnInit {

  @Input() list: IFonLists;
  disabled: boolean = false;
  constructor(
    private router: Router,
    private _appContext: AppContext,
    ) { }

  ngOnInit() {
    if (this.list.checkAccess) {
      this.list.checkAccess().then(access => {
        // Добавляю проверку права Управление фоновыми задачами для всех фоновых задач кроме Буфер электронных сообщений
        if (this.list.title === 'Буфер электронных сообщений') {
          this.disabled = access;
        } else {
          this.disabled = access && this._appContext.CurrentUser['TECH_RIGHTS'][47] === '1';
        }
      });
    } else {
      this.disabled = true;
    }
  }

  public setCurentTask(list: IFonLists) {
    if (list.type !== ETypeFon.popUp) {
      this.router.navigate(['/background-tasks', list.id]);
    } else {
      list.loadPlugin('eos-admin-fon-tasks');
    }
  }

  getHint(): string {
    return this.disabled ? DISABLED_LIST_ITEM : '';
  }

}
