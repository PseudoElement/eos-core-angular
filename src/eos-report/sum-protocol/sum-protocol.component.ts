import { Component, OnInit, OnDestroy } from '@angular/core';
import { PipRX } from 'eos-rest/services/pipRX.service';
import { ALL_ROWS } from 'eos-rest/core/consts';
import { ErrorHelperServices } from 'eos-user-params/shared/services/helper-error.services';
import { USER_PARMS, USER_AUDIT } from 'eos-rest';
import { IPaginationConfig } from 'eos-dictionaries/node-list-pagination/node-list-pagination.interfaces';
import { EosMessageService } from 'eos-common/services/eos-message.service';
import { UserPaginationService } from 'eos-user-params/shared/services/users-pagination.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'eos-sum-protocol',
  templateUrl: './sum-protocol.component.html',
  styleUrls: ['./sum-protocol.component.scss']
})

export class EosReportSummaryProtocolComponent implements OnInit, OnDestroy {
  findUsers: any;
  frontData: any;
  usersAudit: any;
  logUsers: boolean;
  checkUser: boolean = false;
  flagChecked: boolean = false;
  hideTree: boolean = false;
  isnRefFile: number;
  lastUser;
  initPage: boolean = false;
  posts: number;
  clearResult: boolean = false;
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
  critUsers = [];
  initConfig: boolean = false;
  currentState: boolean[] = [true, true];
  public config: IPaginationConfig;
  private ngUnsubscribe: Subject<any> = new Subject();

  constructor(private _pipeSrv: PipRX, private _errorSrv: ErrorHelperServices,
    private _msgSrv: EosMessageService, private _user_pagination: UserPaginationService) {
    _user_pagination.paginationConfig$
      .pipe(
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe((config: IPaginationConfig) => {
        if (config) {
          this.config = config;
          if (this._user_pagination.totalPages !== undefined) {
            if (this.config.current > this.config.start) {
              this.PaginateData(this.config.length * 2);
            } else if (this.config.current && this.initPage === true) {
              this.PaginateData(this.config.length, this.config.length * this.config.current - this.config.length);
            }
          }
        }
      });
  }
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ngOnInit() {
    this._pipeSrv.read<USER_PARMS>({
      USER_PARMS: PipRX.criteries({ 'PARM_NAME': 'USER_EDIT_AUDIT' })
    }).then((r: any) => {
      this._user_pagination._initPaginationConfig(true);
      this.PaginateData(this.config.length, 0);
      this._user_pagination.totalPages = undefined;
      if (r[0].PARM_VALUE === 'NO') {
        this.logUsers = false;
      } else {
        this.logUsers = true;
      }
    });
  }


  PaginateData(length, skip?) {
    this._pipeSrv.read({
      USER_AUDIT: ALL_ROWS,
      orderby: 'ISN_EVENT',
      top: length,
      skip: skip,
      inlinecount: 'allpages'
    })
      .then((data: any) => {
        this.usersAudit = data;
        if (data !== undefined) {
          if (this._user_pagination.totalPages === undefined) {
            const parsePosts = data.TotalRecords;
            if (parsePosts !== undefined) {
              this._user_pagination.totalPages = this.GetCountPosts(parsePosts);
            } else {
              this._user_pagination.totalPages = this.usersAudit.length;
            }
            this._user_pagination.getSumIteq = true;
            this._user_pagination.changePagination(this.config);
            this.initPage = true;
          }
          this.ParseInitData(this.usersAudit);
        } else {
          this.flagChecked = null;
        }

      })
      .catch((error) => {
        this._errorSrv.errorHandler(error);
      });
  }

  ParseInitData(data) {
    this.SelectUsers(data);
    this._pipeSrv.read({
      USER_CL: this.critUsers
    })
      .then((users: any) => {
        for (const user of users) {
          if (this.findUsers === undefined) {
            this.findUsers = [{ isn: user.ISN_LCLASSIF, name: user.SURNAME_PATRON }];
          } else {
            this.findUsers.push({ isn: user.ISN_LCLASSIF, name: user.SURNAME_PATRON });
          }
        }
        this.ShowData();
      });
  }

  GetCountPosts(posts: string): number {
    if (posts !== undefined) {
      posts = posts.split('').reverse().join('');
      posts = posts.split(',')[0];
      posts = posts.split('').reverse().join('');
      this.posts = parseInt(posts, 10);
      let data;
      data = parseInt(posts, 10);
      return data;
    }
  }
  SortPageList(crit: number) {
    let critSearch;
    switch (crit) {
      case 1:
        critSearch = 'EVENT_DATE';
        break;
      case 2:
        critSearch = 'eventUser';
        break;
      case 3:
        critSearch = 'WHO';
        break;
      case 4:
        critSearch = 'USER';
        break;
    }
    if (critSearch === 'WHO' || critSearch === 'USER') {
      this._pipeSrv.read<USER_AUDIT>({
        USER_AUDIT:
          PipRX.criteries({
            orderby: `${critSearch}.CLASSIF_NAME`
          })
      }).then((data) => {
      });
    } else if (critSearch === 'EVENT_DATE') {
      this._pipeSrv.read<USER_AUDIT>({
        USER_AUDIT: ALL_ROWS,
        orderby: critSearch,
        foredit: false,
      }).then((data) => {
      });
    }
  }
  sort(pageList, flag, key): any {
    return pageList.sort(function (a, b) {
      return (flag ? -1 : 1) * String(a[key]).localeCompare(String(b[key]));
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
    this.critUsers.length = 0;
    const b = new Set();
    data.map((x) => {
      isnUser = x.ISN_USER;
      isnWho = x.ISN_WHO;
      b.add(isnUser);
      b.add(isnWho);
    });
    const setUsers = b.values();
    for (let i = 0; i < b.size; i++) {
      this.critUsers.push(setUsers.next().value);
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
    if (this.frontData !== undefined) {
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
  }
  ConvertToFilterDate(date): string {
    const oldDate = new Date(date);
    let dd = oldDate.getDate();
    let mm = oldDate.getMonth() + 1;
    const yyyy = oldDate.getFullYear();
    if (dd < 10) {
      dd = 0 + dd;
    }
    if (mm < 10) {
      mm = 0 + mm;
    }
    const newDate = dd + '/' + mm + '/' + yyyy;
    return newDate;
  }

  filterProtocol(evnt: any) {
    let isnWho, isnUser, eventUser, dateTo, dateFrom, dateSearch;
    if (evnt['rec.USEREDITISN'] === '' || evnt['rec.USEREDITISN'] === null) {
      isnUser = undefined;
    } else {
      isnUser = evnt['rec.USEREDITISN'];
    }

    if (evnt['rec.USERWHOISN'] === '' || evnt['rec.USERWHOISN'] === null) {
      isnWho = undefined;
    } else {
      isnWho = evnt['rec.USERWHOISN'];
    }

    if (evnt['rec.USEREVENTS'] === '' || evnt['rec.USEREVENTS'] === null) {
      eventUser = undefined;
    } else {
      eventUser = evnt['rec.USEREVENTS'];
    }

    if (evnt['rec.USEREVENTS'] === '' || evnt['rec.USEREVENTS'] === null) {
      eventUser = undefined;
    } else {
      eventUser = evnt['rec.USEREVENTS'];
    }

    if (evnt['rec.DATEFROM'] === '' || evnt['rec.DATEFROM'] === null) {
      dateFrom = undefined;
    } else {
      dateFrom = evnt['rec.DATEFROM'];
      dateFrom = this.ConvertToFilterDate(dateFrom);
    }
    if (evnt['rec.DATETO'] === '' || evnt['rec.DATETO'] === null) {
      dateTo = undefined;
    } else {
      dateTo = evnt['rec.DATETO'];
      dateTo = this.ConvertToFilterDate(dateTo);
    }
    if (dateTo !== undefined && dateFrom !== undefined) {
      dateSearch = `${dateFrom}:${dateTo}`;
    } else if (dateTo === undefined && dateFrom !== undefined) {
      const dateNow = new Date();
      const dateStr = this.ConvertToFilterDate(dateNow);
      dateSearch = `${dateFrom}:${dateStr}`;
    } else if (dateTo !== undefined && dateFrom === undefined) {
      const dateOld = new Date(0);
      const dateStr = this.ConvertToFilterDate(dateOld);
      dateSearch = `${dateStr}:${dateTo}`;
    } else {
      dateSearch = undefined;
    }
    this._pipeSrv.read({
      USER_AUDIT: {
        criteries: {
          EVENT_KIND: eventUser,
          EVENT_DATE: dateSearch,
          ISN_USER: isnUser,
          ISN_WHO: isnWho
        }
      },
      orderby: 'ISN_EVENT',
    })
      .then((data: any) => {
        this.usersAudit = data;
        if (this.usersAudit.length === 0) {
          this._msgSrv.addNewMessage({
            title: 'Ничего не найдено',
            msg: 'попробуйте изменить поисковую фразу',
            type: 'warning'
          });
          this.frontData = [];
        } else {
          this.ParseDate(this.usersAudit);
        }
        this.clearResult = true;
      })
      .catch((error) => {
        this._errorSrv.errorHandler(error);
      });
  }

  ParseDate(data) {
    this.SelectUsers(data);
    for (const user of data) {
      if (this.findUsers === undefined) {
        this.findUsers = [{ isn: user.ISN_LCLASSIF, name: user.SURNAME_PATRON }];
      } else {
        this.findUsers.push({ isn: user.ISN_LCLASSIF, name: user.SURNAME_PATRON });
      }
    }
    this.ShowData();
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
    if (this.frontData !== undefined) {
      for (const user of this.frontData) {
        if (user.checked === true) {
          this.DeleteEvent(user.isnEvent);
        }
      }
    }
  }

  ShowDataUser() {
    if (this.lastUser !== undefined) {
      return this.GetDataUser(this.lastUser.isnEvent);
    }
  }

  GetDataUser(isnEvent) {
    this._pipeSrv.read({
      REF_FILE: PipRX.criteries({ 'ISN_REF_DOC': String(isnEvent) })
    })
      .then((data: any) => {
        this.isnRefFile = data[0].ISN_REF_FILE;
        return this.isnRefFile;
      })
      .then((data) => {
        this.openFrame(data);
      })
      .catch((error) => {
        this._errorSrv.errorHandler(error);
      });
    // this.openFrame(12);
    // window.open(`/x1807/getfile.aspx/${isnEvent}/3x.html`, 'example', 'width=900,height=700');
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

  resetSearch() {
    this.PaginateData(this.config.length, 1);
    this.clearResult = false;
  }

}
