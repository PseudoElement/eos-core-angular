import { Component, OnDestroy, OnInit, ViewChild, AfterContentChecked } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { UserParamApiSrv } from 'eos-user-params/shared/services/user-params-api.service';
import { UserPaginationService } from 'eos-user-params/shared/services/users-pagination.service';
import { UserSelectNode } from './user-node-select';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { CreateUserComponent } from './createUser/createUser.component';
import { RtUserSelectService } from '../shered/services/rt-user-select.service';
import { EosSandwichService } from 'eos-dictionaries/services/eos-sandwich.service';
import { HelpersSortFunctions } from '../shered/helpers/sort.helper';
import { Allbuttons } from '../shered/consts/btn-action.consts';
import { BtnAction, BtnActionFields } from '../shered/interfaces/btn-action.interfase';
import { TreeUserSelectService } from '../shered/services/tree-user-select.service';
import { RestError } from 'eos-rest/core/rest-error';
import { EosMessageService } from 'eos-common/services/eos-message.service';
import { ConfirmWindowService } from '../../eos-common/confirm-window/confirm-window.service';
import { CONFIRM_DELETE } from '../shered/consts/confirm-users.const';
import { PipRX, USER_TECH, USER_CL } from 'eos-rest';
import { ALL_ROWS } from 'eos-rest/core/consts';
import { EosStorageService } from '../../app/services/eos-storage.service';
import { EosBreadcrumbsService } from '../../app/services/eos-breadcrumbs.service';
import { AppContext } from '../../eos-rest/services/appContext.service';
import { ErrorHelperServices } from '../../eos-user-params/shared/services/helper-error.services';
interface TypeBread {
    action: number;
}
@Component({
    selector: 'eos-list-user-select',
    templateUrl: 'list-user-select.component.html'
})
export class ListUserSelectComponent implements OnDestroy, OnInit, AfterContentChecked {
    @ViewChild('listContent') listContent;
    currentState: boolean[];
    createUserModal: BsModalRef;
    listUsers: UserSelectNode[];
    selectedUser: UserSelectNode;
    isLoading: boolean;
    isMarkNode: Boolean;
    titleCurrentDue: string = '';
    helpersClass: any;
    buttons: BtnAction;
    flagChecked: boolean;
    flagScan: boolean = null;
    flagTachRigth: boolean = null;
    countMaxSize: number;
    shooseP: number;
    // количество выбранных пользователей
    countcheckedField: number;
    private ngUnsubscribe: Subject<any> = new Subject();
    constructor(
        public rtUserService: RtUserSelectService,
        public _apiSrv: UserParamApiSrv,
        private _modalSrv: BsModalService,
        private _pagSrv: UserPaginationService,
        private _route: ActivatedRoute,
        private _router: Router,
        private _sandwichSrv: EosSandwichService,
        private _treeSrv: TreeUserSelectService,
        private _confirmSrv: ConfirmWindowService,
        private _pipeSrv: PipRX,
        private _msgSrv: EosMessageService,
        private _storage: EosStorageService,
        private _breadSrv: EosBreadcrumbsService,
        private _appContext: AppContext,
        private _errorSrv: ErrorHelperServices,
    ) {

    }
    ngOnInit() {
        this.buttons = Allbuttons;
        this.rtUserService.flagDeleteScroll = true;
        this.rtUserService.flagDeleteSelectedUser = true;
        this.checkFlagTech();
        this.helpersClass = new HelpersSortFunctions();
        this._apiSrv.initSort();
        this._route.params
            .pipe(
                takeUntil(this.ngUnsubscribe)
            )
            .subscribe(param => {
                this.initView(param['nodeId']);
            });
        this._pagSrv.NodeList$
            .pipe(
                takeUntil(this.ngUnsubscribe)
            )
            .subscribe((data) => {
                this.flagScan = null;
                this.flagChecked = null;
                this.listUsers = data;
                if (this.listUsers && this.listUsers.length) {
                    this.selectedNode(this.listUsers[0]);
                } else {
                    this.selectedNode(null);
                }
                this._storage.removeItem('main_scroll');
                this.listContent.nativeElement.scrollTop = 0;
                // this.updateFlafListen();
            });

        this._treeSrv.changeListUsers$
            .pipe(
                takeUntil(this.ngUnsubscribe)
            )
            .subscribe(r => {
                this._storage.removeItem('selected_user_save');
                this.initView();
            });
        this._sandwichSrv.currentDictState$
            .pipe(
                takeUntil(this.ngUnsubscribe)
            )
            .subscribe((state: boolean[]) => {
                this.currentState = state;
            });

        this.rtUserService.subjectScan
            .pipe(
                takeUntil(this.ngUnsubscribe)
            )
            .subscribe(flagBtnScan => {
                this.flagScan = !flagBtnScan;
                this.buttons.buttons[5].disabled = this.flagScan;
                this.buttons.moreButtons[7].disabled = this.flagScan;
            });
        this._breadSrv._eventFromBc$
            .pipe(
                takeUntil(this.ngUnsubscribe)
            )
            .subscribe((type: TypeBread) => {
                if (type.action !== 1) {
                    this.changeCurentSelectedUser(type);
                } else {
                    this.RedactUser(this.selectedUser);
                }
            });
    }

    ngAfterContentChecked () {
        if (this._storage.getItem('main_scroll')) {
            this.listContent.nativeElement.scrollTop = this._storage.getItem('main_scroll');
        }
    }
    checkFlagTech() {
        const arrThech = this._appContext.CurrentUser.USER_TECH_List;
        const flag = arrThech.some((el: USER_TECH) => {
            return String(el.FUNC_NUM) === '1';
        });
        if (flag) {
            this.flagTachRigth = true;
        } else {
            this.flagTachRigth = false;
        }
    }

    changeCurentSelectedUser(type: TypeBread) {
        const usersNotDeleted = this.listUsers.filter((user: UserSelectNode) => {
            return !user.deleted;
        });
        if (usersNotDeleted.length) {
            const index = usersNotDeleted.indexOf(this.selectedUser);
            if (type.action === 13) {
                this.setNewCurrUserByBreadMinus(index, usersNotDeleted);
            }
            if (type.action === 14) {
                this.setNewCurrUserByBreadPlus(index, usersNotDeleted);
            }
        }
    }

    setNewCurrUserByBreadMinus(index, usersNotDeleted) {
        if (index === 0) {
            this.selectedNode(usersNotDeleted[usersNotDeleted.length - 1]);
        } else {
            index--;
            this.selectedNode(usersNotDeleted[index]);
        }
    }
    setNewCurrUserByBreadPlus(index, usersNotDeleted) {
        if (index === usersNotDeleted.length - 1) {
            this.selectedNode(usersNotDeleted[0]);
        } else {
            index++;
            this.selectedNode(usersNotDeleted[index]);
        }
    }

    initView(param?) {
        this.checkSortSessionStore();
        this.countcheckedField = 0;
        this.shooseP = this._apiSrv.configList.shooseTab;
        if (!param || param === '0.') {
            this._apiSrv.configList.shooseTab === 0 ? this.titleCurrentDue = 'Все подразделения' : this.titleCurrentDue = 'Центральная картотека';
        } else {
            this.titleCurrentDue = this._apiSrv.configList.titleDue;
        }
        this.flagScan = null;
        this.flagChecked = null;
        this.isLoading = true;
        this._apiSrv.getUsers(param || '0.')
            .then((data: UserSelectNode[]) => {
                //  this._pagSrv.UsersList =  this.helpersClass.sort(data, this.srtConfig[this.currentSort].upDoun, this.currentSort);
                this.listUsers = this._pagSrv.UsersList.slice((this._pagSrv.paginationConfig.start - 1)
                    * this._pagSrv.paginationConfig.length,
                    this._pagSrv.paginationConfig.current
                    * this._pagSrv.paginationConfig.length);
                if (this.listUsers && this.listUsers.length) {
                    this.selectedNode(this.findSelectedSaveUsers()[0] ? this.findSelectedSaveUsers()[0] : this.listUsers[0]);
                //    this._storage.removeItem('selected_user_save');
                } else {
                    this.selectedNode(null);
                }
                //  this.updateFlafListen();
                this.isLoading = false;
                this.countMaxSize = this._pagSrv.countMaxSize;

            }).catch(error => {
                this._errorSrv.errorHandler(error);
            });
    }
    checkSortSessionStore() {
        const sort = JSON.parse(sessionStorage.getItem('currentSort'));
        if (sort) {
            this._apiSrv.srtConfig['login'].checked = false;
            this._apiSrv.currentSort = sort['sort'];
            this._apiSrv.srtConfig[this._apiSrv.currentSort].checked = true;
            this._apiSrv.srtConfig[this._apiSrv.currentSort].upDoun = sort['upDoun'];
        }
    }
    findSelectedSaveUsers(): UserSelectNode[] | boolean {
        const save_selectedUser: UserSelectNode = this._storage.getItem('selected_user_save');
        if (save_selectedUser) {
            return this.listUsers.filter((user: UserSelectNode) => {
                return save_selectedUser.id === user.id;
            });
        } else {
            return false;
        }
    }

    ngOnDestroy() {
        if (this.rtUserService.flagDeleteScroll && this.rtUserService.flagDeleteSelectedUser) {
            this._storage.removeItem('main_scroll');
        }
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    selectedNode(user: UserSelectNode, flag?) {
        let flagUserSelected: boolean = true;
        if (!user) {
            this.rtUserService.changeSelectedUser(null);
            flagUserSelected = false;
        } else {
            if (!user.deleted) {
                this.resetFlags();
                this.selectedNodeSetFlags(user);
                if (flag) {
                     flag = false;
                }
                this.rtUserService.changeSelectedUser(user);
            } else {
                const searchSelected = this.listUsers.filter(userList => {
                    return userList.deleted === false;
                });
                if (searchSelected.length > 0) {
                    this.selectedNodeSetFlags(searchSelected[0]);
                    this.rtUserService.changeSelectedUser(searchSelected[0]);
                    if (flag) {
                        flag = false;
                   }
                } else {
                    flagUserSelected = false;
                    if (this.selectedUser && this.selectedUser.hasOwnProperty('isSelected')) {
                        this.selectedUser.isSelected = false;
                    }
                    this.rtUserService.changeSelectedUser(null);
                    if (flag) {
                        flag = true;
                   }
                }
            }
        }
        this.rtUserService.subjectFlagBtnHeader.next(flagUserSelected);
        this.updateFlafListen();
        this.disabledBtnAction(flagUserSelected);
    }
    resetFlags() {
        this.listUsers.forEach(user => {
            user.isChecked = false;
            user.selectedMark = false;
        });
    }
    selectedNodeSetFlags(user) {
        if (this.selectedUser) {
            this.selectedUser.isSelected = false;
            this.selectedUser.selectedMark = false;
        }
        this.selectedUser = user;
        this.selectedUser.isSelected = true;
        if (!this.selectedUser.isChecked) {
            this.selectedUser.selectedMark = true;
        }
    }

    RedactUser(user?) {
        if (user) {
            if (user.deleted) {
                return false;
            }
        }
        if (this.selectedUser && !this.selectedUser.deleted) {
            this._storage.setItem('selected_user_save', this.selectedUser);
            this.rtUserService.flagDeleteScroll = false;
            this._router.navigate(['user-params-set'], {
                queryParams: { isn_cl: this.selectedUser.id }
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
            ignoreBackdropClick: true,
        });
        this.createUserModal.content.closedModal.subscribe(() => {
            this.createUserModal.hide();
        });
    }

    sortPageList(nameSort: string) {
        this._apiSrv.currentSort = nameSort;
        this._apiSrv.srtConfig[this._apiSrv.currentSort].upDoun = !this._apiSrv.srtConfig[this._apiSrv.currentSort].upDoun;
        sessionStorage.setItem('currentSort', JSON.stringify({ 'sort': nameSort, 'upDoun': this._apiSrv.srtConfig[this._apiSrv.currentSort].upDoun }));
        if (!this._apiSrv.srtConfig[this._apiSrv.currentSort].checked) {
            for (const key in this._apiSrv.srtConfig) {
                if (this._apiSrv.srtConfig.hasOwnProperty(key)) {
                    if (key === this._apiSrv.currentSort) {
                        this._apiSrv.srtConfig[key].checked = true;
                    } else {
                        this._apiSrv.srtConfig[key].checked = false;
                    }
                }
            }
        }
        this.goSortList();
    }
    goSortList(pageList?) {
        this._pagSrv.UsersList = this.helpersClass.sort(this._pagSrv.UsersList, this._apiSrv.srtConfig[this._apiSrv.currentSort].upDoun, this._apiSrv.currentSort);
        this._pagSrv._initPaginationConfig(true);
        this._pagSrv.changePagination(this._pagSrv.paginationConfig);
    }
    getClassOrder(flag) {
        if (flag) {
            return 'icon eos-icon small eos-icon-arrow-blue-bottom';
        }
        return 'icon eos-icon small eos-icon-arrow-blue-top';
    }

    showAction(nameMethods: any) {
        this.callPassedFunction(nameMethods);
    }
    callPassedFunction(nameFunc: string): void {
        try {
            this[nameFunc]();
        } catch (error) {
            console.log('переданный параметр ' + nameFunc + ' не является названием метода');
        }
    }

    ActionMode() {
        this._apiSrv.flagDelitedPermanantly = !this._apiSrv.flagDelitedPermanantly;
        this.preSortForAction();
    }

    ActionTehnicalUser() {
        this._apiSrv.flagTehnicalUsers = !this._apiSrv.flagTehnicalUsers;
        this.preSortForAction();
    }
    preSortForAction() {
        this._apiSrv.devideUsers();
        this._pagSrv._initPaginationConfig(true);
        this._pagSrv.changePagination(this._pagSrv.paginationConfig);
        this.countMaxSize = this._pagSrv.countMaxSize;
    }

    OpenAddressManagementWindow() {
        if (this.selectedUser) {
            this._router.navigate(['user-params-set/', 'email-address'], {
                queryParams: { isn_cl: this.selectedUser.id }
            });
        }
    }

    OpenRightsSystemCaseDelo() {
        if (this.selectedUser) {
            this._router.navigate(['user-params-set/', 'card-files'], {
                queryParams: { isn_cl: this.selectedUser.id }
            });
        }
    }

    OpenStreamScanSystem() {
        this._router.navigate(['user-params-set/', 'inline-scaning'],
            {
                queryParams: { isn_cl: this.selectedUser.id }
            }
        );
    }
    setCheckedAllFlag() {
        const leng = this.filterForFlagChecked().length;
        if (leng === 0) {
            this.flagChecked = null;
        } else {
            if (this.flagChecked === null || this.flagChecked === false) {
                this.flagChecked = true;
            } else {
                this.flagChecked = null;
            }
        }
        this.listUsers.forEach(user => {
            user.selectedMark = false;
            if (this.flagChecked && !user.deleted) {
                user.isChecked = true;
            } else {
                user.isChecked = false;
            }
        });
        this.updateFlafListen();
        if (this.countcheckedField === 0) {
            this.rtUserService.changeSelectedUser(null);
            if (this.selectedUser) {
                this.selectedUser.isSelected = false;
            }
        } else {
            const checkUser = this.getCheckedUsers();
            if (this.selectedUser) {
                this.selectedUser.isSelected = false;
            }
            this.selectedUser = checkUser[0];
            this.selectedUser.isSelected = true;
            this.rtUserService.changeSelectedUser(this.selectedUser);
            this.rtUserService.flagDeleteSelectedUser = true;
        }
        this.disabledBtnDeleted();
    }

    setFlagChecked(event, user: UserSelectNode) {
        if (user.selectedMark) {
            user.selectedMark = false;
        } else {
            user.isChecked = !user.isChecked;
        }
        if (this.selectedUser) {
            this.selectedUser.isSelected = false;
        }
        if (event.target.checked) {
            this.rtUserService.changeSelectedUser(user);
            this.selectedUser = user;
            this.rtUserService.flagDeleteSelectedUser = false;
        } else {
            const chekUsers = this.getCheckedUsers();
            if (chekUsers.length) {
                this.selectedUser = chekUsers[0];
                this.rtUserService.changeSelectedUser(chekUsers[0]);
                this.rtUserService.flagDeleteSelectedUser = false;
            } else {
                this.selectedUser = undefined;
                this.rtUserService.changeSelectedUser(null);
                this.rtUserService.flagDeleteSelectedUser = true;
            }
        }
        this.updateFlafListen();
        this.disabledBtnDeleted();
    }
    getCheckedUsers() {
        return this.listUsers.filter((user: UserSelectNode) => {
            return user.isChecked || user.isSelected || user.selectedMark;
        });
    }

    updateFlafListen() {
        this.countCheckedField();
        const leng = this.filterForFlagChecked().length;
        if (leng === 0) {
            this.flagChecked = null;
        } else {
            if (this.countcheckedField === leng) {
                this.flagChecked = true;
            }
            if (this.countcheckedField === 0) {
                this.flagChecked = null;
            }

            if (this.countcheckedField > 0 && this.countcheckedField < leng) {
                this.flagChecked = false;
            }
        }

    }
    filterForFlagChecked() {
        return this.listUsers.filter((user: UserSelectNode) => {
            return !user.deleted;
        });
    }

    countCheckedField() {
        this.countcheckedField = this.listUsers.filter((user: UserSelectNode) => {
            return user.isChecked || user.selectedMark;
        }).length;
    }
    LocSelectedUser() {
        this.isLoading = true;
        this._apiSrv.blokedUser(this.listUsers).then(user => {
            this.listUsers = this.listUsers.map(users => {
                if (users.isChecked || users.selectedMark) {
                    if (users.blockedUser) {
                        users.blockedUser = false;
                    } else {
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
            if (this.listUsers && this.listUsers.length) {
                this.selectedNode(this.listUsers[0]);
            } else {
                this.selectedUser = undefined;
                this.updateFlafListen();
            }
            this.isLoading = false;
        }).catch(error => {
            error.message = 'Не удалось заблокировать пользователя,  обратитесь к системному администратору';
            this.cathError(error);
        });
    }

    DeliteLogicalUser() {
        this._confirmSrv.confirm(CONFIRM_DELETE).then(confirmation => {
            if (confirmation) {
                let arrayRequests = [];
                const deletedUsers = [];
                this.listUsers.forEach((user: UserSelectNode) => {
                    if ((user.isChecked && !user.deleted) || (user.selectedMark)) {
                        let url = this._createUrlForSop(user.id);
                        deletedUsers.push(user.id);
                        arrayRequests.push(
                            this._pipeSrv.read({
                                [url]: ALL_ROWS,
                            })
                        );
                        url = '';
                    }
                });

                if (arrayRequests.length > 0) {
                    return Promise.all([...arrayRequests]).then(result => {
                        this.initView();
                        arrayRequests = [];
                    });
                }
            }
        }).catch(error => {
            error.message = 'Не удалось удалить пользователя, обратитесь к системному администратору';
            this.cathError(error);
        });

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
    searchUsers($event: USER_CL[]) {
        if (!$event.length) {
            this._apiSrv.Allcustomer = [];
            this.setListSearch();
            this._msgSrv.addNewMessage({
                title: 'Ничего не найдено',
                msg: 'попробуйте изменить поисковую фразу',
                type: 'warning'
            });
        } else {
            this._apiSrv.updatePageList($event, this.shooseP).then((res) => {
                this._apiSrv.Allcustomer = this._apiSrv._getListUsers(res).slice();
                this.setListSearch();
            });
        }
    }
    setListSearch() {
        this._pagSrv.UsersList = this._apiSrv.Allcustomer;
        this._pagSrv._initPaginationConfig(true);
        this._pagSrv.changePagination(this._pagSrv.paginationConfig);
        this.countMaxSize = this._pagSrv.countMaxSize;
    }
    savePositionSelectUser($event) {
        this._storage.setItem('main_scroll', $event.target.scrollTop);
    }

    private cathError(e) {
        if (e instanceof RestError && (e.code === 434 || e.code === 0)) {
            return undefined;
        } else {
            const errMessage = e.message ? e.message : e;
            this._msgSrv.addNewMessage({
                type: 'danger',
                title: 'Ошибка обработки. Ответ сервера:',
                msg: errMessage
            });
            return null;
        }
    }
    private disabledBtnAction(flagUserSelected) {
        this.buttons.buttons.map((button: BtnActionFields, index) => {
            if (index > 0) {
                !flagUserSelected ? button.disabled = true : button.disabled = false;
            }
            return button;
        });
        if (this.flagScan !== null) {
            this.buttons.buttons[5].disabled = this.flagScan;
            this.buttons.moreButtons[7].disabled = this.flagScan;
        }
        if (this.flagTachRigth !== null) {
            this.buttons.buttons[0].disabled = this.flagTachRigth;
            this.buttons.moreButtons[0].disabled = this.flagTachRigth;
        }
    }

    private disabledBtnDeleted() {
        if (this.countcheckedField === 0) {
            this.buttons.buttons[1].disabled = true;
            this.buttons.buttons[2].disabled = true;
            this.buttons.buttons[3].disabled = true;
            this.buttons.buttons[4].disabled = true;
            this.buttons.buttons[6].disabled = true;
        } else {
            this.buttons.buttons[1].disabled = false;
            this.buttons.buttons[2].disabled = false;
            this.buttons.buttons[3].disabled = false;
            this.buttons.buttons[4].disabled = false;
            this.buttons.buttons[6].disabled = false;
        }
    }

    private _createUrlForSop(isn_user) {
        const url = `EraseUser?isn_user=${isn_user}`;
        return url;
    }

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
