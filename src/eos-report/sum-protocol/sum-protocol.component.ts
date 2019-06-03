import { Component, OnInit, ViewChild } from '@angular/core';
import { PipRX } from 'eos-rest/services/pipRX.service';
import { ALL_ROWS } from 'eos-rest/core/consts';

@Component({
  selector: 'eos-sum-protocol',
  templateUrl: './sum-protocol.component.html',
  styleUrls: ['./sum-protocol.component.scss']
})
export class EosReportSummaryProtocolComponent implements OnInit {
  dataDate = 'dataDate';
  dataEvent = 'dataEvent';
  dataEdit = 'dataEdit';
  usersAudit;
  dataUsers = 'dataUsers';
  event_kind = {
    1: 'Блокирование Пользователя',
    2: 'Разблокирование Пользователя',
    3: 'Создание пользователя',
    4: 'Редактирование пользователя БД',
    5: 'Редактирование прав ДЕЛА',
    6: 'Редактирование прав поточного сканирования',
    7: 'Удаление Пользователя'
  };

  @ViewChild('full') fSearchPop;

  constructor(private _pipeSrv: PipRX) { }

  ngOnInit() {
    this._pipeSrv.read({
      USER_AUDIT: ALL_ROWS
    })
      .then(data => {
        this.usersAudit = data;
      });
  }
  isActiveButton() {
  }

}
