import { Component, OnInit, ViewChild } from '@angular/core';
import { PipRX } from 'eos-rest/services/pipRX.service';
import { ALL_ROWS } from 'eos-rest/core/consts';
import { ErrorHelperServices } from 'eos-user-params/shared/services/helper-error.services';
import { USER_PARMS } from 'eos-rest';

@Component({
  selector: 'eos-sum-protocol',
  templateUrl: './sum-protocol.component.html',
  styleUrls: ['./sum-protocol.component.scss']
})

export class EosReportSummaryProtocolComponent implements OnInit {
  findUsers: any;
  frontData: any;
  usersAudit: any;
  logUsers: boolean;
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

  constructor(private _pipeSrv: PipRX, private _errorSrv: ErrorHelperServices) { }

  ngOnInit() {
    this._pipeSrv.read<USER_PARMS>({
      USER_PARMS: PipRX.criteries({ 'PARM_NAME': 'USER_EDIT_AUDIT' })
    }).then((r: any) => {
      if (r[0].PARM_VALUE === 'NO') {
        this.logUsers = false;
      } else {
        this.logUsers = true;
      }
    })
      .catch((error) => {
        this._errorSrv.errorHandler(error);
      });
    this._pipeSrv.read({
      USER_AUDIT: ALL_ROWS
    })
      .then((data: any) => {
        this.usersAudit = data;
        return this.usersAudit;
      })
      .catch((error) => {
        this._errorSrv.errorHandler(error);
      })
      .then(() => {
        this.SelectUsers(this.usersAudit);
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
  MergeProtocol(): any {
    let parValCheck;
    if (this.logUsers === false) {
      parValCheck = 'NO';
    } else {
      parValCheck = 'YES';
    }
    return [{
      method: 'MERGE',
      requestUri: `SYS_PARMS(-99)/USER_PARMS_List('-99 USER_EDIT_AUDIT')`,
      data: {
        PARM_VALUE: parValCheck
      }
    }];
  }
  CheckProtocol() {
    this.logUsers = !this.logUsers;
    const query = this.MergeProtocol();
    this._pipeSrv.batch(query, '');
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
