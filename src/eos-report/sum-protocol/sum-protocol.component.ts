import { Component, OnInit } from '@angular/core';
import { PipRX } from 'eos-rest/services/pipRX.service';
import { ALL_ROWS } from 'eos-rest/core/consts';
import { ErrorHelperServices } from 'eos-user-params/shared/services/helper-error.services';
import { USER_PARMS } from 'eos-rest';
import { IPaginationConfig } from 'eos-dictionaries/node-list-pagination/node-list-pagination.interfaces';
import { EosDictService } from 'eos-dictionaries/services/eos-dict.service';
import { EosStorageService } from 'app/services/eos-storage.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { PAGES } from 'eos-dictionaries/node-list-pagination/node-list-pagination.consts';
import { LS_PAGE_LENGTH } from 'eos-user-select/shered/consts/pagination-user-select.consts';

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
  checkUser: boolean = false;
  flagChecked: boolean = false;
  isnRefFile: number;
  lastUser;
  posts: number;
  public config: IPaginationConfig;
  readonly pageLengths = PAGES;

  pageCount = 1;
  pages: number[] = [];
  options = [
    { value: '0', title: '' },
    { value: '1', title: 'Блокирование Пользователя' },
    { value: '2', title: 'Разблокирование Пользователя' },
    { value: '3', title: 'Создание пользователя' },
    { value: '4', title: 'Редактирование пользователя БД' },
    { value: '5', title: 'Редактирование прав ДЕЛА' },
    { value: '6', title: 'Редактирование прав поточного сканирования' },
    { value: '7', title: 'Удаление Пользователя' },
  ];
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
  private readonly _buttonsTotal = 5;
  private ngUnsubscribe: Subject<any> = new Subject();

  constructor(private _pipeSrv: PipRX, private _errorSrv: ErrorHelperServices, private _dictSrv: EosDictService,
    private _storageSrv: EosStorageService) {
    _dictSrv.paginationConfig$
      .pipe(
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe((config: IPaginationConfig) => {
        if (config) {
          this.config = config;
          this._update();
          console.log(config);
        }
      });
  }

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
      USER_AUDIT: ALL_ROWS,
      orderby: 'ISN_EVENT',

    })
      .then((data: any) => {
        this.usersAudit = data;
        this.posts = this.usersAudit.length;
        this.config.itemsQty = this.posts;
        this._update();

        return this.usersAudit;
      })
      .then(() => {
        this.SelectUsers(this.usersAudit);
        return this._pipeSrv.read({
          USER_CL: {
            criteries: {
              ISN_LCLASSIF: this.critUsers
            }
          },
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

      })
      .catch((error) => {
        this._errorSrv.errorHandler(error);
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
  markNode(marked: boolean, user) {
    user.checked = marked;
    if (marked === true) {
      this.lastUser = user;
    }
    this.checkNotAllUsers();
  }
  checkNotAllUsers() {
    const usersCheck = [];
    const usersNotCheck = [];
    for (const user of this.frontData) {
      if (user.checked === true) {
        usersCheck.push(user.checked);
      } else {
        usersNotCheck.push(user.checked);
      }
    }
    if (usersCheck.length > 0 && usersNotCheck.length > 0) {
      return this.flagChecked = false;
    }
    if (usersCheck.length === 0) {
      return this.flagChecked = null;
    }
    if (usersNotCheck.length === 0) {
      return this.flagChecked = true;
    }
  }
  get getflagChecked() {
    switch (this.flagChecked) {
      case true:
        return 'eos-icon-checkbox-square-v-blue';
      case false:
        return 'eos-icon-checkbox-square-minus-blue';
      default:
        return 'eos-icon-checkbox-square-blue';
    }
  }

  toggleAllMarks(event) {
    this.flagChecked = event.target.checked;
    if (this.flagChecked === false) {
      this.flagChecked = null;
    }
    if (event.target.checked) {
      this.frontData.forEach(node => {
        node.checked = event.target.checked;
      });
    } else {
      this.frontData.forEach(node => {
        node.checked = event.target.checked;
      });
    }
  }

  SingleUserCheck(user) {
    user.checked = true;
    if (user.checked) {
      this.frontData.forEach(node => {
        node.checked = false;
      });
      user.checked = true;
    }
    this.lastUser = user;

  }

  CheckUser(user) {
    if (user.checked === false) {
      user.checked = true;
    }
  }

  ShowData() {
    let eventUser;
    this.frontData = undefined;
    this.usersAudit.map((user) => {
      const date = this.ConvertDate(user.EVENT_DATE);
      eventUser = this.eventKind[user.EVENT_KIND - 1];
      if (this.frontData === undefined) {
        this.frontData = [{
          checked: !this.checkUser,
          date: date,
          eventUser: eventUser,
          isnWho: this.getUserName(user.ISN_WHO),
          isnUser: this.getUserName(user.ISN_USER),
          isnEvent: user.ISN_EVENT
        }];
        this.lastUser = {
          checked: !this.checkUser,
          date: date,
          eventUser: eventUser,
          isnWho: this.getUserName(user.ISN_WHO),
          isnUser: this.getUserName(user.ISN_USER),
          isnEvent: user.ISN_EVENT
        };
      } else {
        this.frontData.push({
          checked: this.checkUser,
          date: date,
          eventUser: eventUser,
          isnWho: this.getUserName(user.ISN_WHO),
          isnUser: this.getUserName(user.ISN_USER),
          isnEvent: user.ISN_EVENT
        });
      }
    });
    return this.frontData;
  }
  filterProtocol(evnt: any) {
    let arr = [];
    if (evnt['rec.DATEFROM'] !== '' && evnt['rec.DATETO'] !== '' && evnt['rec.USEREVENTS'] !== '' && evnt['rec.USERWHO'] !== '' && evnt['rec.USEREDIT'] !== '') {
      this.ShowData();
      arr = [];
    }
    for (const userSum of this.frontData) {
      let date, isnWho, isnUser, eventUser;
      let dateFrom, dateTo, formatDate;
      formatDate = new Date(userSum.date);
      dateTo = evnt['rec.DATETO'];
      dateFrom = evnt['rec.DATEFROM'];
      if (dateFrom === '' && dateTo === '' || dateFrom === null && dateTo === null) {
        date = formatDate;
      } else if (formatDate >= dateFrom && formatDate <= dateTo && (dateFrom !== '' && dateTo !== '' || dateFrom !== null && dateTo !== null)) {
        date = formatDate;
      } else if (dateFrom !== '' && dateTo === '' || dateFrom !== null && dateTo === null) {
        if (formatDate >= dateFrom) {
          date = formatDate;
        }
      } else if (dateFrom === '' && dateTo !== '' || dateFrom === null && dateTo !== null) {
        if (formatDate <= dateTo) {
          date = formatDate;
        }
      } else {
        date = undefined;
      }

      if (evnt['rec.USEREDIT'] === '' || evnt['rec.USEREDIT'] === null) {
        isnWho = userSum.isnWho;
      } else if ((evnt['rec.USEREDIT'] !== '' || evnt['rec.USEREDIT'] !== null) && evnt['rec.USEREDIT'] === userSum.isnWho) {
        isnWho = userSum.isnWho;
      } else if ((evnt['rec.USEREDIT'] !== '' || evnt['rec.USEREDIT'] !== null) && evnt['rec.USEREDIT'] !== userSum.isnWho) {
        isnWho = undefined;
      }
      if (evnt['rec.USERWHO'] === '' || evnt['rec.USERWHO'] === null) {
        isnUser = userSum.isnUser;
      } else if ((evnt['rec.USERWHO'] !== '' || evnt['rec.USERWHO'] !== null) && evnt['rec.USERWHO'] === userSum.isnUser) {
        isnUser = userSum.isnUser;
      } else if ((evnt['rec.USERWHO'] !== '' || evnt['rec.USERWHO'] !== null) && evnt['rec.USERWHO'] !== userSum.isnUser) {
        isnUser = undefined;
      }

      if (this.eventKind[evnt['rec.USEREVENTS'] - 1] === '' || this.eventKind[evnt['rec.USEREVENTS'] - 1] === undefined
        || evnt['rec.USEREVENTS'] === null || evnt['rec.USEREVENTS'] === 0) {
        eventUser = userSum.eventUser;
      } else if (userSum.eventUser === this.eventKind[evnt['rec.USEREVENTS'] - 1] && this.eventKind[evnt['rec.USEREVENTS'] - 1] !== undefined) {
        eventUser = userSum.eventUser;
      } else if (userSum.eventUser !== this.eventKind[evnt['rec.USEREVENTS'] - 1] && this.eventKind[evnt['rec.USEREVENTS'] - 1] !== undefined) {
        eventUser = undefined;
      }
      if (date !== undefined && eventUser !== undefined && isnUser !== undefined && isnWho !== undefined) {
        date = this.ConvertDate(date.toISOString());
        if (arr === undefined) {
          arr = [{ checked: this.checkUser, date: date, eventUser: eventUser, isnUser: isnUser, isnWho: isnWho, isnEvent: userSum.isnEvent }];
        } else {
          arr.push({ checked: this.checkUser, date: date, eventUser: eventUser, isnUser: isnUser, isnWho: isnWho, isnEvent: userSum.isnEvent });
        }
      }
    }
    this.frontData = arr;
  }
  DeleteEvent(isnEvent) {
    const query = this.createRequestForDelete(isnEvent);
    this._pipeSrv.batch(query, '');
  }
  createRequestForDelete(isnEvent) {
    return [{
      method: 'DELETE',
      requestUri: `USER_AUDIT(${isnEvent})`
    }];
  }
  DeleteEventUser() {
    for (const user of this.frontData) {
      if (user.checked === true) {
        this.DeleteEvent(user.isnEvent);
      }
    }
  }

  ShowDataUser() {
    return this.GetDataUser(this.lastUser.isnEvent);
  }
  GetDataUser(isnEvent) {
    console.log(isnEvent);
    // this.openFrame(12);
    // window.open(`/x1807/getfile.aspx/${isnEvent}/3x.html`, 'example', 'width=900,height=700');
    this._pipeSrv.read({
      REF_FILE: PipRX.criteries({ 'ISN_REF_DOC': String(isnEvent) })
    })
      .then((data: any) => {
        console.log(data);
        this.isnRefFile = data[0].ISN_REF_FILE;
        return this.isnRefFile;
      })
      .then((data) => {
        console.log(data);
        this.openFrame(data);
      })
      .catch((error) => {
        this._errorSrv.errorHandler(error);
      });
  }
  openFrame(isnFile) {
    window.open(`/x1807/getfile.aspx/${isnFile}/3x.html`, 'example', 'width=900,height=700');
  }
  ConvertDate(convDate) {
    const date = new Date(convDate);
    const curr_date = date.getDate();
    const curr_month = date.getMonth() + 1;
    const curr_year = date.getFullYear();
    const hms = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().substr(11, 8);
    const parseDate = `${curr_year}.${curr_month}.${curr_date} ${hms}`;
    return parseDate;
  }
  public setPageLength(length: number): void {
    this._storageSrv.setItem(LS_PAGE_LENGTH, length, true);
    this.config.length = length;
    this._dictSrv.changePagination(this.config);
  }

  public showMore() {
    this.config.current++;
    this._dictSrv.changePagination(this.config);
  }

  public showPage(page: number): void {
    if (page !== this.config.current) {
      this.config.current = page;
      this.config.start = page;
      this._dictSrv.changePagination(this.config);
    }
  }

  private _update() {
    let total = Math.ceil(this.config.itemsQty / this.config.length);
    if (total === 0) { total = 1; }
    const firstSet = this._buttonsTotal - this.config.current;
    const lastSet = total - this._buttonsTotal + 1;
    const middleSet = this._buttonsTotal - 3;

    this.pageCount = total;
    this.pages = [];
    for (let i = 1; i <= this.pageCount; i++) {
      if (
        i === 1 || i === this.pageCount || // first & last pages
        (1 < firstSet && i < this._buttonsTotal) || // first 4 pages
        (1 < this.config.current - lastSet && i - lastSet > 0) || // last 4 pages
        (middleSet > this.config.current - i && i - this.config.current < middleSet)  // middle pages
      ) {
        this.pages.push(i);
      }
    }
  }

}
