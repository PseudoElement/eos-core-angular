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

  date;
  eventUser;
  isnUser;
  isnWho;

  critUsers: string = '';
  @ViewChild('full') fSearchPop;

  constructor(private _pipeSrv: PipRX) { }

  ngOnInit() {
    this._pipeSrv.read({
      USER_AUDIT: ALL_ROWS
    })
      .then((data: any) => {
        this.usersAudit = data;
        this.SelectUsers(this.usersAudit);
      })
      .then(() => {
        return this._pipeSrv.read({
          USER_CL: {
            criteries: {
              ISN_LCLASSIF: this.critUsers
            }
          }
        });
      }).then((data: any) => {
      });
  }
  isActiveButton() {
  }

  SelectUsers(data) {
    let isnUser,
      isnWho;
    const b = new Set();
    data.map((x) => {
      isnUser = x.ISN_USER;
      isnWho = x.ISN_WHO;
      b.add(isnUser);
      b.add(isnWho);
    });
    const setUsers = b.values();
    for (let i = 0; i < b.size; i++) {
      this.critUsers = this.critUsers + setUsers.next().value + '|';
    }
  }
}
