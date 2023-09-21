import { Component, OnInit, OnDestroy } from '@angular/core';
import { PipRX } from '../../../eos-rest/services/pipRX.service';
import { ErrorHelperServices } from '../../../eos-user-params/shared/services/helper-error.services';
import { IPaginationConfig } from '../../../eos-common/interfaces/interfaces';
import { UserPaginationService } from '../../../eos-user-params/shared/services/users-pagination.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { UserParamsService } from '../../../eos-user-params/shared/services/user-params.service';
import { EosStorageService } from '../../../app/services/eos-storage.service';
import { Router } from '@angular/router';
import { ISelectedUserProtocol } from '../../../eos-user-params/shared/intrfaces/user-params.interfaces';
import { EosUtils } from '../../../eos-common/core/utils';
enum EIsnRef {
    now = 0,
    next = 1
}
@Component({
    selector: 'eos-protocol',
    templateUrl: './protocol.component.html',
    styleUrls: ['./protocol.component.scss'],
})
export class EosReportProtocolComponent implements OnInit, OnDestroy {
    findUsers: any;
    frontData: ISelectedUserProtocol[];
    usersAudit: any;
    hideTree: boolean = false;
    isnNow: number;
    isnNext: number;
    lastUser: ISelectedUserProtocol;
    initPage: boolean = false;
    checkUser: boolean = false;
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
    closeTooltip: boolean = true;
    currentState: boolean[] = [false, false];
    status: string;
    SortUp: string;
    checkOverflow: boolean;
    curentUser: number;
    username: string;
    selfLink: any;
    link: any;
    arrSort = [
        { date: false },
        { event: false },
        { who: false },
        { isn: false }
    ];
    isLoading: boolean = false;
    isOpenUserInfo: boolean = false;
    isComparisonWithPrev: boolean = false
    innerHTMLSelectedProtocol: string
    innerHTMLPrevProtocol: string
    public config: IPaginationConfig;
    private ngUnsubscribe: Subject<any> = new Subject();
    constructor(
        private _pipeSrv: PipRX,
        private _errorSrv: ErrorHelperServices,
        private _userpar: UserParamsService,
        public _user_pagination: UserPaginationService,
        private _storage: EosStorageService,
        private _router: Router,
    ) {
        _user_pagination.paginationConfig$
            .pipe(
                takeUntil(this.ngUnsubscribe)
            )
            .subscribe(async (config: IPaginationConfig) => {
                if (config) {
                    this.config = config;
                    if (this._user_pagination.totalPages !== undefined) {
                        if (this.config.current > this.config.start) {
                            await this.PaginateData(this.config.length * (this.config.current - this.config.start + 1), this.orderByStr,
                                (this.config.length * this.config.start - this.config.length).toString());
                        } else if (this.config.current && this.initPage === true) {
                            await this.PaginateData(this.config.length, this.orderByStr, this.config.length * this.config.current - this.config.length);
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
        this.isLoading = true;
        this._userpar.getUserIsn({
            expand: 'NTFY_USER_EMAIL_List'
        }).then(() => {
            this.curentUser = this._userpar.curentUser.ISN_LCLASSIF;
            this.username = (this._userpar.curentUser.CLASSIF_NAME && this._userpar.curentUser.CLASSIF_NAME.trim()) || this._userpar.curentUser.SURNAME_PATRON;
            this._user_pagination.typeConfig = 'protocol';
            const confUsers = this._storage.getItem('protocol');
            this._user_pagination.paginationConfig = confUsers;
            this._user_pagination._initPaginationConfig();
            this._user_pagination.paginationConfig.current = 1;
            this._user_pagination.paginationConfig.start = 1;
            this.PaginateData(this.config.length, this.orderByStr);
            this._user_pagination.totalPages = undefined;
            this.selfLink = this._router.url.split('?')[0];
            this.link = this._userpar.userContextId;
        })
            .catch((error) => {
                this.isLoading = false;
                this._errorSrv.errorHandler(error);
            });
    }

    async PaginateData(length, orderStr, skip?) {
        this.isLoading = true;
        await EosUtils.wait(500)
        this._pipeSrv.read({
            USER_AUDIT: PipRX.criteries({ ISN_USER: `${this.curentUser}` }),
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
                    }
                    this.ParseInitData(this.usersAudit);
                } else {
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
        const getUsersPromise = this.critUsers && this.critUsers.length ? this._pipeSrv.read({
            USER_CL: this.critUsers,
            loadmode: 'Table'
        }) : Promise.resolve([]);
        getUsersPromise.then((users: any) => {
            for (const user of users) {
                if (this.findUsers === undefined) {
                    this.findUsers = [{ isn: user.ISN_LCLASSIF, name: user.SURNAME_PATRON }];
                } else {
                    this.findUsers.push({ isn: user.ISN_LCLASSIF, name: user.SURNAME_PATRON });
                }
            }
            this.ShowData();
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
            }
            if (critSearch === 'WHO') {
                // this.orderByStr = `${critSearch}.SURNAME_PATRON ${this.SortUp}`;
                // this._pipeSrv.read({
                //   USER_AUDIT: PipRX.criteries({ orderby: this.orderByStr }),
                // }).then((data) => {
                // });
            } else if (critSearch === 'EVENT_DATE') {
                this.orderByStr = `${critSearch} ${this.SortUp}`;
                this.PaginateData(this.config.length, this.orderByStr, (this.config.length * this.config.current - this.config.length).toString());
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

    async SingleUserCheck(user) {
        this.isnNow = undefined;
        user.checked = true;
        if (user.checked) {
            this.frontData.forEach(node => {
                node.checked = false;
            });
            user.checked = true;
        }
        this.lastUser = user;
        const getIsn = [this.lastUser.isnEvent];
        if (this.orderByStr.indexOf('desc') > -1) {
            this.frontData.forEach((data) => {
                if (this.lastUser.count + 1 === data.count) {
                    getIsn.push(data.isnEvent);
                }
            })
            if (getIsn.length === 1 && this.lastUser.count + 1 < this.lastUser.itemsQty) {
                const ans = await this._pipeSrv.read({
                    USER_AUDIT: PipRX.criteries({ ISN_USER: `${this.curentUser}` }),
                    orderby: 'EVENT_DATE desc',
                    top: 1,
                    skip: this.lastUser.count + 1,
                    inlinecount: 'allpages'
                });
                getIsn.push(ans[0]['ISN_EVENT']);
            }
            this.GetRefIsn(getIsn);
        } else { // сначала старые
            this.frontData.forEach((data) => {
                if (this.lastUser.count - 1 === data.count) {
                    getIsn.unshift(data.isnEvent);
                }
            });
            if (getIsn.length === 1 && this.lastUser.count > 0) {
                const ans = await this._pipeSrv.read({
                    USER_AUDIT: PipRX.criteries({ ISN_USER: `${this.curentUser}` }),
                    orderby: 'EVENT_DATE asc',
                    top: 1,
                    skip: this.lastUser.count - 1,
                    inlinecount: 'allpages'
                });
                getIsn.unshift(ans[0]['ISN_EVENT']);
            }
            this.GetRefIsn(getIsn);
        }
    }

    ShowData() {
        let eventUser;
        this.frontData = [];
        this.isnNow = undefined;
        this.usersAudit.map((user, index) => {
            const date = this.ConvertDate(user.EVENT_DATE);
            eventUser = this.eventKind[user.EVENT_KIND - 1];
            // if (this.frontData === undefined) {
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
            // } else {
            this.frontData.push({
                checked: this.checkUser,
                date: date,
                eventUser: eventUser,
                isnWho: this.getUserName(user.ISN_WHO),
                isnUser: this.getUserName(user.ISN_USER),
                isnEvent: user.ISN_EVENT,
                count: this.config.length * (this.config.current - 1) + index,
                itemsQty: this.config.itemsQty,
                id: user.ISN_USER
            });
        });
    }

    GetRefIsn(getIsn: number[]) {
        this._pipeSrv.read({
            REF_FILE: PipRX.criteries({ 'ISN_REF_DOC': getIsn.join('|') }),
            orderby: 'UPD_DATE desc',
        })
            .then((data: any) => {
                if (data.length !== 0) {
                    this.isnNow = data[EIsnRef.now].ISN_REF_FILE;
                    this.isnNext = data[EIsnRef.next]?.ISN_REF_FILE;
                }
            })
            .catch((error) => {
                this._errorSrv.errorHandler(error);
            });
    }

    openUserInfoModal(): void {
        this.closeTooltip = true;
        this.setIsOpenUserInfo(true)
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
    getUnitFile() {
        const query = [];
        if (this.isnNow !== undefined) {
            query.push(this._pipeSrv.getHttp_client().get(`../CoreHost/FOP/GetFile/${this.isnNow}/3x.html`, { responseType: 'text' }).toPromise());
        }
        if (this.isnNext) {
            query.push(this._pipeSrv.getHttp_client().get(`../CoreHost/FOP/GetFile/${this.isnNext}/3x.html`, { responseType: 'text' }).toPromise());
        }
        return Promise.all(query).then(([html1, html2]) => {
            if (html1 && html2) {
                this.innerHTMLSelectedProtocol = html1;
                this.innerHTMLPrevProtocol = html2;
                this.isComparisonWithPrev = true;
                this.openUserInfoModal();
            }
        })
            .catch((error) => {
                this._errorSrv.errorHandler(error);
            });
    }
    close() {
        this._router.navigate(['user_param', JSON.parse(localStorage.getItem('lastNodeDue'))]);
    }
    setIsOpenUserInfo(isOpen: boolean): void {
        if (!isOpen) setTimeout(() => this.isComparisonWithPrev = false, 700);
        this.isOpenUserInfo = isOpen
    }
}

