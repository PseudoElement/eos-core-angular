import { Component, OnInit, ViewChild } from '@angular/core';
import { PipRX } from 'eos-rest/services/pipRX.service';
import { ALL_ROWS } from 'eos-rest/core/consts';

@Component({
  selector: 'eos-sum-protocol',
  templateUrl: './sum-protocol.component.html',
  styleUrls: ['./sum-protocol.component.scss']
})


export class EosReportSummaryProtocolComponent implements OnInit {
  findUsers: any;
  frontData: any;
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
      })
      .then((data: any) => {
        for (const user of data) {
          if (this.findUsers === undefined) {
            this.findUsers = [{ isn: user.ISN_LCLASSIF, name: user.SURNAME_PATRON }];
          } else {
            this.findUsers.push({ isn: user.ISN_LCLASSIF, name: user.SURNAME_PATRON });
          }
        }
      })
      .then(() => {
        this.ShowData();
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

  getUserName(isn) {
    for (const user of this.findUsers) {
      if (user.isn === isn) {
        return user.name;
      }
    }
  }
  ShowData() {
    let date, eventUser;
    this.usersAudit.map((user) => {
      date = new Date(user.EVENT_DATE);
      const curr_date = date.getDate();
      const curr_month = date.getMonth() + 1;
      const curr_year = date.getFullYear();
      const hms = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().substr(11, 8);
      const parseDate = `${curr_year}.${curr_month}.${curr_date} ${hms}`;
      eventUser = this.eventKind[user.EVENT_KIND - 1];
      if (this.frontData === undefined) {
        this.frontData = [{
          date: parseDate,
          eventUser: eventUser,
          isnWho: this.getUserName(user.ISN_WHO),
          isnUser: this.getUserName(user.ISN_USER)
        }];
      } else {
        this.frontData.push({
          date: parseDate,
          eventUser: eventUser,
          isnWho: this.getUserName(user.ISN_WHO),
          isnUser: this.getUserName(user.ISN_USER)
        });
      }
    });
  }
}
