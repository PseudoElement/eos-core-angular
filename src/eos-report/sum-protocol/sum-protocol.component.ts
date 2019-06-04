import { Component, OnInit, ViewChild } from '@angular/core';
import { PipRX } from 'eos-rest/services/pipRX.service';
import { ALL_ROWS } from 'eos-rest/core/consts';

@Component({
  selector: 'eos-sum-protocol',
  templateUrl: './sum-protocol.component.html',
  styleUrls: ['./sum-protocol.component.scss']
})
export class EosReportSummaryProtocolComponent implements OnInit {
  usersAudit: any;
  eventKind = [
    'Блокирование Пользователя',
    'Разблокирование Пользователя',
    'Создание пользователя',
    'Редактирование пользователя БД',
    'Редактирование прав ДЕЛА',
    'Редактирование прав поточного сканирования',
    'Удаление Пользователя'
  ];
  critUsers: [];

  @ViewChild('full') fSearchPop;

  constructor(private _pipeSrv: PipRX) { }

  ngOnInit() {
    this._pipeSrv.read({
      USER_AUDIT: ALL_ROWS
    })
      .then(data => {
        this.usersAudit = data;
        this.SelectUsers(data);
      });
    this._pipeSrv.read({
      USER_CL: {
        criteries: {

        }
      }
    })
      .then(data => {
      });
  }
  isActiveButton() {

  }

  SelectUsers(data) {
    // for (const item of data) {
      // this.critUsers.push(item.ISN_USER)
      // if(item.ISN_USER && item.ISN_WHO)
      // if(item.ISN_USER && item.ISN_WHO)
    // }
  }

}
