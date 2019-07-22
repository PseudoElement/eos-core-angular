import { Component, OnInit, OnDestroy, ElementRef, ViewChild, ChangeDetectorRef, AfterContentChecked } from '@angular/core';
import { PipRX } from 'eos-rest/services/pipRX.service';
import { ErrorHelperServices } from 'eos-user-params/shared/services/helper-error.services';
import { IPaginationConfig } from 'eos-dictionaries/node-list-pagination/node-list-pagination.interfaces';
import { UserPaginationService } from 'eos-user-params/shared/services/users-pagination.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { UserParamsService } from 'eos-user-params/shared/services/user-params.service';

@Component({
  selector: 'eos-protocol',
  templateUrl: './protocol.component.html',
  styleUrls: ['./protocol.component.scss']
})
export class EosReportProtocolComponent implements OnInit, OnDestroy, AfterContentChecked {
  @ViewChild('someVar') el: ElementRef;
  findUsers: any;
  frontData: any;
  usersAudit: any;
  hideTree: boolean = false;
  isnRefFile: number;
  lastUser;
  initPage: boolean = false;
  checkUser: boolean = false;
  orderByStr: string = 'EVENT_DATE asc';
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
  currentState: boolean[] = [true, true];
  status: string;
  SortUp: string;
  checkOverflow: boolean;
  curentUser: number;
  username: string;
  arrSort = [
    { date: true },
    { event: false },
    { who: false },
    { isn: false }
  ];
  public config: IPaginationConfig;
  private ngUnsubscribe: Subject<any> = new Subject();

  constructor(private _pipeSrv: PipRX, private _errorSrv: ErrorHelperServices, private cdr: ChangeDetectorRef, private _userpar: UserParamsService,
    private _user_pagination: UserPaginationService) {
    _user_pagination.paginationConfig$
      .pipe(
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe((config: IPaginationConfig) => {
        if (config) {
          this.config = config;
          if (this._user_pagination.totalPages !== undefined) {
            if (this.config.current > this.config.start) {
              this.PaginateData(this.config.length * 2, this.orderByStr);
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
  }

  ngOnInit() {
    this._userpar.getUserIsn().then(() => {
      this.curentUser = this._userpar.curentUser.ISN_LCLASSIF;
      this.username = this._userpar.curentUser.SURNAME_PATRON;
      this._user_pagination._initPaginationConfig(true);
      this.PaginateData(this.config.length, this.orderByStr, 0);
      this._user_pagination.totalPages = undefined;
    })
    .catch((error: boolean) => {
    })
      .catch((error) => {
        this._errorSrv.errorHandler(error);
      });
  }

  PaginateData(length, orderStr, skip?) {
    this._pipeSrv.read({
      USER_AUDIT: {
        criteries: {
          'ISN_USER': `${this.curentUser}`,
          orderby: orderStr,
        },
        top: length,
        skip: skip,
        inlinecount: 'allpages'
      }
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
    }
    if (critSearch === 'WHO') {
      // this.orderByStr = `${critSearch}.SURNAME_PATRON ${this.SortUp}`;
      // this._pipeSrv.read({
      //   USER_AUDIT: PipRX.criteries({ orderby: this.orderByStr }),
      // }).then((data) => {
      // });
    } else if (critSearch === 'EVENT_DATE') {
      this.orderByStr = `${critSearch} ${this.SortUp}`;
      this.PaginateData(this.config.length, this.orderByStr, this.config.length * this.config.current - this.config.length);
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

  ShowDataUser() {
    // if (this.lastUser !== undefined) {
    //   return this.GetDataUser(this.lastUser.isnEvent);
    // }
  }
  CompareWithEvent() {
    // if (this.lastUser !== undefined) {
    //   return this.GetDataUser(this.lastUser.isnEvent);
    // }
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
    const curr_date = ('0' + date.getDate()).slice(-2);
    const curr_month = ('0' + (date.getMonth() + 1) ).slice(-2);
    const curr_year = date.getFullYear();
    const hms = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().substr(11, 8);
    const parseDate = `${curr_year}.${curr_month}.${curr_date} ${hms}`;
    return parseDate;
  }

  ngAfterContentChecked() {
    this.checkOverflow = true;
    this.cdr.detectChanges();
  }
  get getOverflow() {
    if (this.checkOverflow === true) {
      if (this.el.nativeElement.scrollHeight > this.el.nativeElement.clientHeight || this.el.nativeElement.scrollWidth > this.el.nativeElement.clientWidth) {
        return true;
      } else {
        return false;
      }
    }
  }

}

