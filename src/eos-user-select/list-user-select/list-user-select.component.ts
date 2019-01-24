import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { UserParamApiSrv } from 'eos-user-params/shared/services/user-params-api.service';
import { UserPaginationService } from 'eos-user-params/shared/services/users-pagination.service';
import { UserSelectNode } from './user-node-select';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { CreateUserComponent } from './createUser/createUser.component';
import {RtUserSelectService} from '../shered/services/rt-user-select.service';
import { EosSandwichService } from 'eos-dictionaries/services/eos-sandwich.service';
import {IUserSort, SortsList} from '../shered/interfaces/user-select.interface';
import {HelpersSortFunctions} from '../shered/helpers/sort.helper';
import {Allbuttons} from '../shered/consts/btn-action.consts';
import {BtnAction, BtnActionFields} from '../shered/interfaces/btn-action.interfase';
import {TreeUserSelectService} from '../shered/services/tree-user-select.service';
// import { PipRX} from 'eos-rest';
// import { ALL_ROWS } from 'eos-rest/core/consts';
@Component({
    selector: 'eos-list-user-select',
    templateUrl: 'list-user-select.component.html'
})
export class ListUserSelectComponent implements OnDestroy, OnInit {
    currentState: boolean[];
    createUserModal: BsModalRef;
    listUsers: UserSelectNode[];
    selectedUser: UserSelectNode;
    isLoading: boolean;
    isMarkNode: Boolean;
    titleCurrentDue: string = '';
    srtConfig: IUserSort = {};
    currentSort: string = SortsList[0];
    helpersClass: any;
    buttons: BtnAction;
    flagChecked: boolean;
    countMaxSize: number;

    // количество выбранных пользователей
    countcheckedField: number;
    private ngUnsubscribe: Subject<any> = new Subject();
    constructor (
        private _modalSrv: BsModalService,
        private _apiSrv: UserParamApiSrv,
        private _pagSrv: UserPaginationService,
        private _route: ActivatedRoute,
        private _router: Router,
        private rtUserService: RtUserSelectService,
        private _sandwichSrv: EosSandwichService,
        private _treeSrv: TreeUserSelectService,
      //  private _pipeSrv: PipRX,
    ) {
        this.helpersClass = new HelpersSortFunctions();
        this.initSort();
        this._route.params
            .takeUntil(this.ngUnsubscribe)
            .subscribe(param => {
              this.initView(param['nodeId']);
            });
        this._pagSrv.NodeList$.takeUntil(this.ngUnsubscribe).subscribe((data) => {
           this.flagChecked = false;
           this.listUsers  = data;
           if (this.listUsers && this.listUsers.length) {
            this.selectedNode(this.listUsers[0]);
            } else {
                this.selectedUser = undefined;
            }
            this.disabledBtnAction();
            this.changeFlagCheked();
        });

        this._treeSrv.changeListUsers$.takeUntil(this.ngUnsubscribe).subscribe(r => {
            this.initView();
        });
        this._sandwichSrv.currentDictState$
        .takeUntil(this.ngUnsubscribe)
        .subscribe((state: boolean[]) => {
                this.currentState = state;
            });
    }

    initView(param?) {
        this.countcheckedField = 0;
        this.titleCurrentDue = this._apiSrv.configList.titleDue;
        this.flagChecked = false;
        this.isLoading = true;
        this._apiSrv.getUsers(param || '0.')
        .then((data: UserSelectNode[]) => {
                this.listUsers = data;
                if (this.listUsers && this.listUsers.length) {
                    this.selectedNode(this.listUsers[0]);
                }   else {
                    this.selectedUser = undefined;
                }
                this.disabledBtnAction();
                this.changeFlagCheked();
                this.isLoading = false;
                this.countMaxSize = this._pagSrv.countMaxSize;
        });
    }
    ngOnInit() {
        this.buttons = Allbuttons;
    }
    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
        // this.buttons.buttons.map((button: BtnActionFields) => {
        //     button.isActive = false;
        //     return button;
        // });
    }

    selectedNode(user: UserSelectNode) {
        if (!user.deleted) {
            if (this.selectedUser) {
                this.selectedUser.isSelected = false;
            }
            this.selectedUser = user;
            this.selectedUser.isSelected = true;
            this.rtUserService.changeSelectedUser(user);
            this.disabledBtnAction();
        }
    }

    RedactUser() {
        if (this.selectedUser && !this.selectedUser.deleted) {
            this._router.navigate(['user-params-set'], {
                queryParams: {isn_cl: this.selectedUser.id}
            });
        }
    }

    checkboxClick(e: Event) {
        e.stopPropagation();
    }

    markNode(e, user) {
        if (!e) {
            this._checkMarkNode();
        }
        console.log('markNode($event, user)');
    }

    CreateUser() {
        this.createUserModal = this._modalSrv.show(CreateUserComponent, {
            class: 'param-create-user',
            ignoreBackdropClick: true
        });
        this.createUserModal.content.closedModal.subscribe(() => {
            this.createUserModal.hide();
        });
    }
    // showDeep() {
    //     this._apiSrv.flagTehnicalUsers = !this._apiSrv.flagTehnicalUsers;
    //   //  this._apiSrv.devideUsers();
    //     this._pagSrv._initPaginationConfig(true);
    //     this._pagSrv.changePagination(this._pagSrv.paginationConfig);
    // }

    sortPageList(nameSort: string) {
     this.currentSort = nameSort;
     this.srtConfig[this.currentSort].upDoun = !this.srtConfig[this.currentSort].upDoun;
        if (!this.srtConfig[this.currentSort].checked) {
            for (const key in  this.srtConfig) {
                if (this.srtConfig.hasOwnProperty(key)) {
                    if (key === this.currentSort) {
                        this.srtConfig[key].checked = true;
                    }  else {
                        this.srtConfig[key].checked = false;
                    }
                }
            }
        }
        this.goSortList();
    }
    goSortList(pageList?) {
        this._pagSrv.UsersList =  this.helpersClass.sort(this._pagSrv.UsersList, this.srtConfig[this.currentSort].upDoun, this.currentSort);
        this._pagSrv._initPaginationConfig(true);
        this._pagSrv.changePagination(this._pagSrv.paginationConfig);
    }
    getClassOrder(flag) {
       // console.log(flag);
        if (flag) {
            return 'icon eos-icon small eos-icon-arrow-blue-top';
        }
            return 'icon eos-icon small eos-icon-arrow-blue-bottom';
    }

    initSort() {
        this.srtConfig.department = {
            upDoun: true,
            checked: true,
        };
        this.srtConfig.login = {
            upDoun: false,
            checked: false,
        };
        this.srtConfig.dueName =  {
            upDoun: false,
            checked: false,
        };
        this.srtConfig.tip = {
            upDoun: false,
            checked: false,
        };
    }
    showAction(nameMethods: any) {
        this.callPassedFunction(nameMethods);
    }
    callPassedFunction(nameFunc: string): void {
       try {
           this[nameFunc]();
       } catch  (error) {
            console.log('переданный параметр ' + nameFunc + ' не является названием метода');
       }
    }

    ActionMode() {
        this._apiSrv.flagDelitedPermanantly = !this._apiSrv.flagDelitedPermanantly;
        this._apiSrv.devideUsers();
        this._pagSrv._initPaginationConfig(true);
        this._pagSrv.changePagination(this._pagSrv.paginationConfig);
        this.countMaxSize = this._pagSrv.countMaxSize;
    }

    ActionTehnicalUser() {
        this._apiSrv.flagTehnicalUsers = !this._apiSrv.flagTehnicalUsers;
        this._apiSrv.devideUsers();
        this._pagSrv._initPaginationConfig(true);
        this._pagSrv.changePagination(this._pagSrv.paginationConfig);
        this.countMaxSize = this._pagSrv.countMaxSize;
    }

    OpenAddressManagementWindow() {
        if (this.selectedUser) {
            this._router.navigate(['user-params-set/', 'email-address'], {
                queryParams: {isn_cl: this.selectedUser.id}
            });
        }
    }

    OpenRightsSystemCaseDelo() {
        if (this.selectedUser) {
            this._router.navigate(['user-params-set/', 'rights-delo', 'card-files'], {
                  queryParams: {isn_cl: this.selectedUser.id}
            });
        }
    }
    setCheckedAllFlag() {
        this.flagChecked = !this.flagChecked;
        this.listUsers.forEach(user => {
            if (this.flagChecked) {
                user.isChecked = true;
            }   else {
                user.isChecked = false;
            }
        });
        if (this.flagChecked) {
            this.countcheckedField = this.listUsers.length;
        }   else {
            this.countcheckedField = 0;
        }
      // this.disabledBtnDeleted();
    }

    changeFlagCheked() {
        this.countcheckedField = 0;
        this.listUsers.forEach(user => {
            if (user.isChecked) {
                this.countcheckedField += 1;
            }
        });
        if (this.countcheckedField === this.listUsers.length) {
            this.flagChecked = true;
        }

        if (this.countcheckedField === 0) {
                this.flagChecked = false;
        }
      // this.disabledBtnDeleted();
    }
    setFlagChecked(event, user: UserSelectNode) {
        user.isChecked = !user.isChecked;
        if (user.isChecked) {
            this.countcheckedField += 1;
        }   else {
            this.countcheckedField -= 1;
        }
     // this.disabledBtnDeleted();
    }
    LocSelectedUser() {
        this.isLoading = true;
        this._apiSrv.blokedUser(this.listUsers).then(user => {
            this.listUsers = this.listUsers.map(users => {
                if (users.isChecked) {
                    if (users.blockedUser) {
                        users.blockedUser = false;
                    }   else {
                        if (!users.blockedUser && !users.blockedSystem) {
                            users.blockedUser = true;
                        }
                        if (users.blockedSystem) {
                            users.blockedUser = false;
                            users.blockedSystem = false;
                    }
                    }
                }
                users.isChecked = false;
                return users;
            });
            this.isLoading = false;
        });
    }

    // DeliteLogicalUser() {
    //    const arrayRequests = [];
    //     this.listUsers.forEach((user: UserSelectNode) => {
    //         if (user.isChecked) {

    //             console.log(url);
    //         //     arrayRequests.push(
    //         //         this._pipeSrv.read({
    //         //             [url]: ALL_ROWS,
    //         //         }).then(res => {
    //         //             console.log(res);
    //         //         })
    //         //     );
    //         //     url = '';
    //         // }
    //         }
    //     });
    //     const url = this._createUrlForSop(73748);
    //     this._pipeSrv.read({
    //         [url]: ALL_ROWS,
    //     }).then(result => {
    //         console.log(result);
    //     }).catch(error => {
    //         console.log(error);
    //     });
    //    if (arrayRequests.length > 0) {
    //         Promise.all([...arrayRequests]).then(result => {
    //             console.log(result);
    //         });
    //     }
    // }

   private disabledBtnAction() {
        if (this.selectedUser) {
            this.buttons.buttons.map((button: BtnActionFields, index) => {
                if (this.selectedUser.deleted) {
                    button.disabled = true;
                }else {
                    button.disabled = false;
                }
                return button;
            });
            this.buttons.buttons[0].disabled = false;
            this.buttons.moreButtons[3].disabled = false;
            this.buttons.moreButtons[2].disabled = false;
        }   else {
            this.buttons.buttons.map((button: BtnActionFields, index) => {
                if (index > 0) {
                    button.disabled = true;
                }
                return button;
            });
          this.buttons.moreButtons[3].disabled = true;
          this.buttons.moreButtons[2].disabled = true;
        }
    }

    // private disabledBtnDeleted() {
    //     if (this.countcheckedField === 0) {
    //         this.buttons.buttons[2].disabled = true;
    //         this.buttons.moreButtons[2].disabled = true;
    //     } else {
    //         this.buttons.buttons[2].disabled = false;
    //         this.buttons.moreButtons[2].disabled = false;
    //     }
    // }
    // private btnDisabledDelite() {
    //     this.buttons.bo
    // }

    // private _createUrlForSop(isn_user) {
    //     const url = `EraseUser?isn_user=${isn_user}`;
    //     return url;
    // }

    private _checkMarkNode() {
        let check = false;
        this.listUsers.forEach(node => {
            if (node.marked || node.selectedMark) {
                check = true;
            }
        });
        this.isMarkNode = check;
    }
}
