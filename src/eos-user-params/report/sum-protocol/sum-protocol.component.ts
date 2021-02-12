import { Component, OnInit, OnDestroy } from '@angular/core';
import { PipRX } from 'eos-rest/services/pipRX.service';
import { ErrorHelperServices } from 'eos-user-params/shared/services/helper-error.services';
import { IPaginationConfig } from 'eos-dictionaries/node-list-pagination/node-list-pagination.interfaces';
import { EosMessageService } from 'eos-common/services/eos-message.service';
import { UserPaginationService } from 'eos-user-params/shared/services/users-pagination.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ALL_ROWS } from 'eos-rest/core/consts';
import { EosStorageService } from 'app/services/eos-storage.service';

@Component({
  selector: 'eos-sum-protocol',
  templateUrl: './sum-protocol.component.html',
  styleUrls: ['./sum-protocol.component.scss']
})

export class EosReportSummaryProtocolComponent implements OnInit, OnDestroy {
  findUsers: any;
  frontData: any;
  usersAudit: any;
  checkUser: boolean = false;
  flagChecked: boolean;
  hideTree: boolean = false;
  checkAll: string;
  lastUser;
  isnRefFile: number;
  initPage: boolean = false;
  clearResult: boolean = false;
  resetPage: boolean = false;
  orderByStr: string = 'EVENT_DATE desc';
  eventKind = [
    'Блокирование пользователя',
    'Разблокирование пользователя',
    'Создание пользователя',
    'Редактирование пользователя БД',
    'Редактирование прав ДЕЛА',
    'Редактирование прав Поточного сканирования',
    '',
    'Удаление пользователя'
  ];
  critUsers = [];
  currentState: boolean[] = [true, true];
  status: string;
  SortUp: string;
  dateCrit: string;
  eventUser: string;
  isnUser: string;
  isnWho: string;
  closeTooltip: boolean = true;
  queryForDelete: any = [];
  arrSort = [
    { date: false },
    { event: false },
    { who: false },
    { isn: false }
  ];
  isLoading: boolean = false;
  public config: IPaginationConfig;
  public markedNodes = [];
  private ngUnsubscribe: Subject<any> = new Subject();

  constructor(private _pipeSrv: PipRX, private _errorSrv: ErrorHelperServices, private _storageSrv: EosStorageService,
    private _msgSrv: EosMessageService, public _user_pagination: UserPaginationService) {
    _user_pagination.paginationConfig$
      .pipe(
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe((config: IPaginationConfig) => {
        if (config) {
          this.config = config;
          if (this._user_pagination.totalPages !== undefined && this.resetPage === false) {
            if (this.config.current > this.config.start && this.clearResult !== true) {
              this.PaginateData(this.config.length * (this.config.current - this.config.start + 1), this.orderByStr,
              (this.config.length * this.config.start - this.config.length).toString());
            } else if (this.config.current && this.initPage === true && this.clearResult === true) {
              this.GetSortData();
            } else if (this.config.current && this.initPage === true) {
              this.PaginateData(this.config.length, this.orderByStr, this.config.length * this.config.current - this.config.length);
            }
          }
        }
      });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this._user_pagination.SelectConfig();
  }

  ngOnInit() {
      this._user_pagination.typeConfig = 'sum-protocol';
      const confSumPr = this._storageSrv.getItem('sum-protocol');
      this._user_pagination.paginationConfig = confSumPr;
      this._user_pagination._initPaginationConfig();
      this._user_pagination.paginationConfig.current = 1;
      this._user_pagination.paginationConfig.start = 1;
      this.PaginateData(this.config.length, this.orderByStr);
      this._user_pagination.totalPages = undefined;
  }

  GetSortData() {
    this.isLoading = true;
    this._pipeSrv.read({
      USER_AUDIT:
        PipRX.criteries({
          EVENT_KIND: this.eventUser,
          EVENT_DATE: this.dateCrit,
          ISN_USER: this.isnUser,
          ISN_WHO: this.isnWho,
        }),
      orderby: this.orderByStr,
      top: this.config.current > this.config.start ? this.config.length * (this.config.current - this.config.start + 1) : this.config.length,
      skip: this.config.length * this.config.start - this.config.length,
      inlinecount: 'allpages'
    }).then((data: any) => {
      this.usersAudit = data;
      const parsePosts = data.TotalRecords;
      if (parsePosts !== undefined) {
        this._user_pagination.totalPages = parsePosts;
      } else {
        this._user_pagination.totalPages = this.usersAudit.length;
      }
      if (this.usersAudit.length === 0) {
        this._msgSrv.addNewMessage({
          title: 'Ничего не найдено',
          msg: 'попробуйте изменить поисковую фразу',
          type: 'warning'
        });
        this.frontData = [];
        this.isLoading = false;
      } else {
        this.ParseDate(this.usersAudit);
      }
    })
      .catch((error) => {
        this._errorSrv.errorHandler(error);
        this.isLoading = false;
      });
  }

  PaginateData(length, orderStr, skip?) {
    this.isLoading = true;
    this._pipeSrv.read({
      USER_AUDIT: ALL_ROWS,
      orderby: orderStr,
      top: length,
      skip: skip || this.config.length * this.config.current - this.config.length,
      inlinecount: 'allpages'
    })
      .then((data: any) => {
        this.usersAudit = data;
        if (data !== undefined) {
          if (this._user_pagination.totalPages === undefined) {
            const parsePosts = data.TotalRecords;
            if (parsePosts !== undefined) {
              this._user_pagination.totalPages = parsePosts;
            } else {
              this._user_pagination.totalPages = this.usersAudit.length;
            }
            this._user_pagination.getSumIteq = true;
            this._user_pagination.changePagination(this.config);
            this.initPage = true;
            this.resetPage = false;
          }
          this.ParseInitData(this.usersAudit);
        } else {
          this.flagChecked = null;
          this.isLoading = false;
        }
      })
      .catch((error) => {
        this._errorSrv.errorHandler(error);
        this.isLoading = false;
      });
  }

  ParseInitData(data) {
    this.SelectUsers(data);
    this._pipeSrv.read({
      USER_CL: this.critUsers,
      loadmode: 'Table'
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
        this.checkNotAllUsers();
        this.isLoading = false;
      });
  }

//   GetCountPosts(posts: string): number {
//     if (posts !== undefined) {
//       posts = posts.split('').reverse().join('');
//       posts = posts.split(',')[0];
//       posts = posts.split('').reverse().join('');
//       let data;
//       data = parseInt(posts, 10);
//       return data;
//     }
//   }
  SortPageList(crit: number) {
    if (this._user_pagination.totalPages > 1) {
      let critSearch;
      switch (crit) {
        case 1:
          critSearch = 'EVENT_DATE';
          this.arrSort[0].date = !this.arrSort[0].date;
          this.SortUp = this.arrSort[0].date ? 'asc' : 'desc';
          this.status = critSearch;
          break;
        // case 2:
        //   critSearch = 'eventUser';
        //   this.arrSort[1].event = !this.arrSort[1].event;
        //   this.SortUp = this.arrSort[1].event ? 'asc' : 'desc';
        //   this.status = critSearch;
        //   break;
        // case 3:
        //   critSearch = 'WHO';
        //   this.arrSort[2].who = !this.arrSort[2].who;
        //   this.SortUp = this.arrSort[2].who ? 'asc' : 'desc';
        //   this.status = critSearch;
        //   break;
        // case 4:
        //   critSearch = 'USER';
        //   this.arrSort[3].isn = !this.arrSort[3].isn;
        //   this.SortUp = this.arrSort[3].isn ? 'asc' : 'desc';
        //   this.status = critSearch;
        //   break;
      }
      if (critSearch === 'WHO' || critSearch === 'USER') {
        // this.orderByStr = `${critSearch}.SURNAME_PATRON ${this.SortUp}`;
        // this._pipeSrv.read({
        //   USER_AUDIT: PipRX.criteries({ orderby: this.orderByStr }),
        // }).then((data) => {
        // });
      } else if (critSearch === 'EVENT_DATE') {
        this.orderByStr = `${critSearch} ${this.SortUp}`;
        if (this.clearResult === true) {
          this.GetSortData();
        } else {
          this.PaginateData(this.config.length, this.orderByStr, (this.config.length * this.config.current - this.config.length).toString());
        }
      }
    }
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
    this.isnRefFile = undefined;
    user.checked = !user.checked;
    if (marked === true) {
      this.checkNotAllUsers(user);
    } else {
      this.checkNotAllUsers();
    }
  }

  checkNotAllUsers(user?) {
    const usersCheck = this._getMarkedNodes();
    if (user) {
      this.lastUser = user;
    } else {
      this.lastUser = usersCheck[0];
    }
    if (usersCheck.length > 0) {
      this.GetRefIsn(this.lastUser.isnEvent);
      this.flagChecked = false;
    }
    if (usersCheck.length > 0) {
      this.flagChecked = false;
    }
    if (usersCheck.length === 0) {
      this.flagChecked = null;
    }
    if (usersCheck.length === this.config.length) {
     this.flagChecked = true;
    }
  }

  get getflagChecked() {
    if (this._user_pagination.totalPages === 0) {
      this.flagChecked = null;
    }
    switch (this.flagChecked) {
      case true:
        this.checkAll = 'Снять пометки';
        return 'eos-icon-checkbox-square-v-blue';
      case false:
        this.checkAll = 'Отметить все на странице';
        return 'eos-icon-checkbox-square-minus-blue';
      default:
        this.isnRefFile = undefined;
        this.lastUser = undefined;
        this.checkAll = 'Отметить все на странице';
        return 'eos-icon-checkbox-square-blue';
    }
  }

  toggleAllMarks(event) {
    this.isnRefFile = undefined;
    this.lastUser = null;
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
    this._getMarkedNodes();
  }

  SingleUserCheck(user) {
    this.isnRefFile = undefined;
    user.checked = true;
    if (user.checked) {
      this.frontData.forEach(node => {
        node.checked = false;
      });
      user.checked = true;
    }
    this.checkNotAllUsers(user);
  }

  DisabledRemoveAudits() {
    let deleteAudit;
    if (this.frontData !== undefined) {
      this.frontData.forEach(node => {
        if (node.checked === true) {
          deleteAudit = true;
        }
      });
    }
    return deleteAudit === true ? false : true;
  }

  GetRefIsn(isnEvent) {
    this._pipeSrv.read({
      REF_FILE: PipRX.criteries({ 'ISN_REF_DOC': String(isnEvent) })
    })
      .then((data: any) => {
        if (data.length !== 0) {
          this.isnRefFile = data[0].ISN_REF_FILE;
        }
      })
      .catch((error) => {
        this._errorSrv.errorHandler(error);
      });
  }

  ShowData() {
    let eventUser;
    this.frontData = [];
    this.isnRefFile = undefined;
    this.usersAudit.map((user) => {
      const date = this.ConvertDate(user.EVENT_DATE);
      eventUser = this.eventKind[user.EVENT_KIND - 1];
      // if (this.frontData === undefined && this.usersAudit.length !== 0) {
      //   this.frontData = [{
      //     checked: !this.checkUser,
      //     date: date,
      //     eventUser: eventUser,
      //     isnWho: this.getUserName(user.ISN_WHO),
      //     isnUser: this.getUserName(user.ISN_USER),
      //     isnEvent: user.ISN_EVENT
      //   }];
      //   this.lastUser = {
      //     checked: !this.checkUser,
      //     date: date,
      //     eventUser: eventUser,
      //     isnWho: this.getUserName(user.ISN_WHO),
      //     isnUser: this.getUserName(user.ISN_USER),
      //     isnEvent: user.ISN_EVENT
      //   };
      //   if (this.lastUser !== undefined) {
      //     this.GetRefIsn(this.lastUser.isnEvent);
      //   }
      //   this.flagChecked = false;
      // } else {
        this.frontData.push({
          checked: this.checkUser,
          date: date,
          eventUser: eventUser,
          isnWho: this.getUserName(user.ISN_WHO),
          isnUser: this.getUserName(user.ISN_USER),
          isnEvent: user.ISN_EVENT
        });
   //   }
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
      isnUser = evnt['rec.USEREDITISN'].replace(/,/g , '|');
    }

    if (evnt['rec.USERWHOISN'] === '' || evnt['rec.USERWHOISN'] === null) {
      isnWho = undefined;
    } else {
      isnWho = evnt['rec.USERWHOISN'].replace(/,/g , '|');
    }


    if (evnt['rec.USEREVENTS'] === '' || evnt['rec.USEREVENTS'] === null || evnt['rec.USEREVENTS'] === '0') {
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
    this.isLoading = true;
    this.dateCrit = dateSearch;
    this.eventUser = eventUser;
    this.isnUser = isnUser;
    this.isnWho = isnWho;
    this._pipeSrv.read({
      USER_AUDIT:
        PipRX.criteries({
          EVENT_KIND: eventUser,
          EVENT_DATE: dateSearch,
          ISN_USER: isnUser,
          ISN_WHO: isnWho,
        }),
      orderby: this.orderByStr,
      top: this.config.length,
      skip: 0,
      inlinecount: 'allpages'
    })
      .then((data: any) => {
        this.usersAudit = data || [];
        this.initPage = false;
        if (this.usersAudit.length === 0) {
          this._msgSrv.addNewMessage({
            title: 'Ничего не найдено',
            msg: 'попробуйте изменить поисковую фразу',
            type: 'warning'
          });
          this.frontData = [];
          this._user_pagination.totalPages = 0;
          this.isLoading = false;
        } else {
          const parsePosts = data.TotalRecords;
          if (parsePosts !== undefined) {
            this._user_pagination.totalPages = parsePosts;
          } else {
            this._user_pagination.totalPages = this.usersAudit.length;
          }
          this.ParseDate(this.usersAudit);
        }
        this.config.current = 1;
        this.config.start = 1;
        this._user_pagination.changePagination(this.config);
        this.clearResult = true;
        this.initPage = true;
      })
      .catch((error) => {
        this.isLoading = false;
        this._errorSrv.errorHandler(error);
      });
  }

  ParseDate(data) {
    this.SelectUsers(data);
    this._pipeSrv.read({
      USER_CL: this.critUsers,
      loadmode: 'Table'
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
        this.checkNotAllUsers();
        this.isLoading = false;
      });
  }

  DeleteEvents(): Promise<any> {
    return this._pipeSrv.batch(this.queryForDelete, '');
  }

  createRequestForDelete(isnEvent) {
    const query = {
      method: 'DELETE',
      requestUri: `USER_AUDIT(${isnEvent})`
    };
    this.queryForDelete.push(query);
  }

  DeleteEventUser() {
    this.queryForDelete = [];
    let usersCheck;
    this.isLoading = true;
    if (this.frontData !== undefined) {
      usersCheck = this.frontData.filter(user => user.checked === true);
      for (const user of usersCheck) {
        if (usersCheck[usersCheck.length - 1] === user) {
          this.createRequestForDelete(user.isnEvent);
          this.DeleteEvents()
            .then(() => {
              this._user_pagination.totalPages = this._user_pagination.totalPages === 0 ? 0 : this._user_pagination.totalPages - 1;
              if (this._user_pagination.totalPages % this.config.length === 0) {
                if (this.config.current !== 1) {
                  this.config.current = this.config.current - 1;
                  this.config.start = this.config.start - 1;
                }
              }
              if (this.frontData.length === 0) {
                this.config.current = 1;
                this.config.start = 1;
              }
              if (this.clearResult === true && this.usersAudit.length === 0) {
                this.frontData = [];
              }
              this._user_pagination.changePagination(this.config);
              this.isLoading = false;
            }).catch(e => {
              this.isLoading = false;
              this._errorSrv.errorHandler(e);
            });
        } else {
          this.createRequestForDelete(user.isnEvent);
          this._user_pagination.totalPages = this._user_pagination.totalPages === 0 ? 0 : this._user_pagination.totalPages - 1;
        }
      }
    }
  }

  GetRefFile() {
    this.closeTooltip = true;
    setTimeout(() => {
        window.open(`../getfile.aspx/${this.isnRefFile}/3x.html`, '_blank', 'width=900, height=700, scrollbars=1');
    }, 0);
  }

  ConvertDate(convDate) {
    const date = new Date(convDate);
    const curr_date = ('0' + date.getDate()).slice(-2);
    const curr_month = ('0' + (date.getMonth() + 1)).slice(-2);
    const curr_year = date.getFullYear();
    const hms = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().substr(11, 8);
    const parseDate = `${curr_date}.${curr_month}.${curr_year} ${hms}`;
    return parseDate;
  }

  resetSearch() {
    this.resetPage = true;
    this._user_pagination.totalPages = undefined;
    this._user_pagination.paginationConfig.start = 1;
    this._user_pagination.paginationConfig.current = 1;
    this.PaginateData(this.config.length, this.orderByStr, '0');
    this.clearResult = false;
  }
  private _getMarkedNodes() {
    if (this.frontData.length) {
      this.markedNodes = this.frontData.filter(item => item.checked === true);
    } else {
      this.markedNodes = [];
    }
    return this.markedNodes;
  }
}
