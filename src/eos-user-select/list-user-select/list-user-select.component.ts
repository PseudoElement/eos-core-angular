import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { UserParamApiSrv } from 'eos-user-params/shared/services/user-params-api.service';
import { UserPaginationService } from 'eos-user-params/shared/services/users-pagination.service';
import { UserSelectNode } from './user-node-select';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { CreateUserComponent } from './createUser/createUser.component';
// import { SearchServices } from '../shered/services/search.service';
// import { USERSRCH } from '../../eos-user-select/shered/consts/search-const';
import { RtUserSelectService } from '../shered/services/rt-user-select.service';
import { EosSandwichService } from 'eos-dictionaries/services/eos-sandwich.service';
import { Allbuttons } from '../shered/consts/btn-action.consts';
import { BtnAction } from '../shered/interfaces/btn-action.interfase';
import { TreeUserSelectService } from '../shered/services/tree-user-select.service';
import { RestError } from 'eos-rest/core/rest-error';
import { EosMessageService } from 'eos-common/services/eos-message.service';
import { ConfirmWindowService } from '../../eos-common/confirm-window/confirm-window.service';
import { CONFIRM_DELETE } from '../shered/consts/confirm-users.const';
import { PipRX, /* USER_CL */ IRequest, USER_CL } from 'eos-rest';
import { ALL_ROWS } from 'eos-rest/core/consts';
import { EosStorageService } from '../../app/services/eos-storage.service';
import { EosBreadcrumbsService } from '../../app/services/eos-breadcrumbs.service';
import { ErrorHelperServices } from '../../eos-user-params/shared/services/helper-error.services';
import { WaitClassifService } from 'app/services/waitClassif.service';
import { IOpenClassifParams } from 'eos-common/interfaces';
import { UserParamsService } from 'eos-user-params/shared/services/user-params.service';
import { TOOLTIP_DELAY_VALUE } from 'eos-common/services/eos-tooltip.service';
import { SearchServices } from 'eos-user-select/shered/services/search.service';
import { AppContext } from 'eos-rest/services/appContext.service';
import { SettingManagementComponent } from './setting-management/setting-management.component';
interface TypeBread {
    action: number;
}
@Component({
    selector: 'eos-list-user-select',
    templateUrl: 'list-user-select.component.html'
})
export class ListUserSelectComponent implements OnDestroy, OnInit {
    @ViewChild('listContent') listContent;
    tooltipDelay = TOOLTIP_DELAY_VALUE;
    currentState: boolean[];
    createUserModal: BsModalRef;
    settingsManagementModal: BsModalRef;
    listUsers: UserSelectNode[];
    selectedUser: UserSelectNode;
    isLoading: boolean;
    isMarkNode: Boolean;
    titleCurrentDue: string = '';
    // helpersClass: any;
    buttons: BtnAction;
    flagChecked: boolean;
    flagScan: boolean = null;
    countMaxSize: number;
    shooseP: number;
    checkAll: string;
    onlyView: boolean;
    currentDue: string;
    // количество выбранных пользователей
    countcheckedField: number;
    shadow: boolean = false;
    deleteOwnUser: any;

    get showCloseQuickSearch() {
        if (this._storage.getItem('quickSearch') !== undefined && this._storage.getItem('quickSearch').USER_CL.criteries.ORACLE_ID === 'isnull') {
            this._apiSrv.sortDelUsers = true;
        } else {
            this._apiSrv.sortDelUsers = false;
        }
        return this._storage.getItem('quickSearch');
    }
    get cardName() {
        // return this.shooseP === 0 ? 'Подразделение' : 'Картотека';
        return 'Подразделение';
    }
    get optionsBtn() {
        return {
            selectedUser: this.selectedUser,
            listUsers: this.listUsers,
        };
    }
    get curentTabSearch() {
        if (this._storage.getItem('searchUsers')) {
            return this._storage.getItem('searchUsers').currTab;
        }
        return 0;
    }
    get DisableSearch() {
        if (this._storage.getItem('quickSearch')) {
            if (this._apiSrv.sortDelUsers === true) {
                return false;
            } else {
                return true;
            }
        } else {
            if (this._apiSrv.flagTehnicalUsers) {
                return true;
            }
            return false;
        }
    }
    get disableLoginSearch() {
        if (this._storage.getItem('quickSearch')) {
            if (this._apiSrv.sortDelUsers) {
                return true;
            }
            return false;
        } else if (this._apiSrv.flagDelitedPermanantly) {
            return true;
        } else {
            return false;
        }
    }
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
        private _errorSrv: ErrorHelperServices,
        private _waitCl: WaitClassifService,
        private _userParamSrv: UserParamsService,
        private _srhSrv: SearchServices,
        private _appContext: AppContext
    ) {

    }
    ngOnInit() {
        this.rtUserService.clearHash();
        if (this._storage.getItem('onlyView') !== undefined) {
            this.onlyView = this._storage.getItem('onlyView');
        } else {
            this.onlyView = true;
        }
        this._pagSrv.getSumIteq = true;
        this._pagSrv.typeConfig = 'users';
        const confUsers = this._storage.getItem('users');
        this._pagSrv.paginationConfig = confUsers;
        this.buttons = Allbuttons;
        //  this.helpersClass = new HelpersSortFunctions();
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
                const id = this._route.params['value'].nodeId;
                this.initView(id ? id : '0.');
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

    changeCurentSelectedUser(type: TypeBread) {
        const usersNotDeleted = this.listUsers.filter((user: UserSelectNode) => {
            return user.selectedMark === true || user.isSelected === true || user.isChecked === true;
        });
        if (usersNotDeleted.length > 0) {
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
            this.selectedUser = usersNotDeleted[usersNotDeleted.length - 1];
            this.rtUserService.changeSelectedUser(usersNotDeleted[usersNotDeleted.length - 1]);
        } else {
            index--;
            this.selectedUser = usersNotDeleted[index];
            this.rtUserService.changeSelectedUser(this.selectedUser);
        }
    }
    setNewCurrUserByBreadPlus(index, usersNotDeleted) {
        if (index === usersNotDeleted.length - 1) {
            this.selectedUser = usersNotDeleted[0];
            this.rtUserService.changeSelectedUser(this.selectedUser);
        } else {
            index++;
            this.selectedUser = usersNotDeleted[index];
            this.rtUserService.changeSelectedUser(this.selectedUser);
        }
    }

    initView(param?) {
        this.selectedUser = undefined;
        this.checkSortSessionStore();
        this.countcheckedField = 0;
        this.shooseP = this._apiSrv.configList.shooseTab;
        if (!param || param === '0.') {
            if (this._apiSrv.flagDelitedPermanantly && this._apiSrv.configList.shooseTab === 1) {
                this.titleCurrentDue = '';
            } else {
                this._apiSrv.configList.shooseTab === 0 ? this.titleCurrentDue = 'Все подразделения' : this.titleCurrentDue = 'Центральная картотека';
            }
        } else {
            this.titleCurrentDue = this._apiSrv.configList.titleDue;
        }
        if ((this._apiSrv.flagDelitedPermanantly === true || this._apiSrv.flagTehnicalUsers === true) && this._apiSrv.configList.shooseTab === 0) {
            this.titleCurrentDue = 'Все подразделения';
        }
        if (this._apiSrv.flagDelitedPermanantly === true && this._apiSrv.configList.shooseTab === 1) {
            this.titleCurrentDue = '';
        }
        // this.flagScan = null; убираю из-за сканирования
        this.flagChecked = null;
        this.isLoading = true;
        this._apiSrv.getUsers(param || '0.')
            .then((data: UserSelectNode[]) => {
                this.listUsers = this._pagSrv.UsersList;
                this.flagScan = null;
                this.isLoading = false;
                this.countMaxSize = this._pagSrv.countMaxSize;
                this.rtUserService._updateBtn.next(this.optionsBtn);
                this.rtUserService.changeSelectedUser(null);
            }).catch(error => {
                this._errorSrv.errorHandler(error);
            });
        let due;
        const url = this._router.url.split('/');
        if (url[url.length - 1] === 'user_param') {
            due = '0.';
        } else {
            due = url[url.length - 1];
        }
        this.currentDue = due;
    }
    checkSortSessionStore() {
        const sort = this._storage.getItem('SortPageList');
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
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
        this._storage.setItem('users', this._pagSrv.paginationConfig, true);
        this._pagSrv.SelectConfig();
    }

    selectedNode(user: UserSelectNode) {
        let flagUserSelected: boolean = true;
        if (!user) {
            this.updateFlafListen();
            this.rtUserService.changeSelectedUser(null);
            flagUserSelected = false;
        } else {
            this.resetFlags();
            this.selectedNodeSetFlags(user);
            this.updateFlafListen();
            this.rtUserService.changeSelectedUser(user);
        }
        this._userParamSrv.checkedUsers = [user];
        this.rtUserService._updateBtn.next(this.optionsBtn);
        this.rtUserService.subjectFlagBtnHeader.next(flagUserSelected);
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
        /*  setTimeout(() => { */
        if (this.selectedUser && !this.selectedUser.deleted && this.selectedUser.isEditable) {
            this._storage.setItem('selected_user_save', this.selectedUser);
            this._router.navigate(['user-params-set'], {
                queryParams: { isn_cl: this.selectedUser.id }
            });
        }
        /*  }, 0); */
    }

    checkboxClick(e: Event) {
        e.stopPropagation();
    }

    CreateUser() {
        this.createUserModal = this._modalSrv.show(CreateUserComponent, {
            class: 'param-create-user',
            ignoreBackdropClick: true,
            animated: false,
            show: false,
        });
        this.createUserModal.content.titleNow = this.titleCurrentDue;
        this.createUserModal.content.closedModal.subscribe(() => {
            setTimeout(() => {
                this.createUserModal.hide();
            });
        });
    }
    setChengeOnlyView() {
        if (this.shooseP === 0) {
            this.onlyView = !this.onlyView;
            this._apiSrv.flagOnlyThisDepart = this.onlyView;
            this._storage.setItem('onlyView', this.onlyView);
            const id = this._route.params['value'].nodeId;
            this._pagSrv.resetConfig();
            this.initView(id ? id : '0.');
        }
    }

    sortPageList(nameSort: string, sortSearch?: string): void {
        this._apiSrv.currentSort = nameSort;
        for (const key in this._apiSrv.srtConfig) {
            if (this._apiSrv.srtConfig.hasOwnProperty(key)) {
                this._apiSrv.srtConfig[key].checked = false;
            }
        }
        if (sortSearch && sortSearch === 'sortSearch') {
            this._apiSrv.srtConfig[nameSort].upDoun = false;
        } else {
            this._apiSrv.srtConfig[nameSort].upDoun = !this._apiSrv.srtConfig[nameSort].upDoun;
        }
        this._storage.setItem('SortPageList', { 'sort': nameSort, 'upDoun': this._apiSrv.srtConfig[nameSort].upDoun });
        this._apiSrv.stateTehUsers = false;
        this._apiSrv.stateDeleteUsers = false;
        const id = this._route.params['value'].nodeId;
        this.initView(id ? id : '0.');
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

    ViewDeletedUsers() {
        const id = this._route.params['value'].nodeId;
        this._apiSrv.flagDelitedPermanantly = !this._apiSrv.flagDelitedPermanantly;
        this._apiSrv.stateDeleteUsers = this._apiSrv.flagDelitedPermanantly;
        this.flagScan = true;
        if (this._apiSrv.flagDelitedPermanantly === true) {
            this._storage.setItem('SortPageList', { 'sort': 'fullDueName', 'upDoun': false });
        } else {
            this._storage.setItem('SortPageList', { 'sort': 'login', 'upDoun': false });
        }
        this._apiSrv.srtConfig[this._apiSrv.currentSort].checked = false;
        if (this._apiSrv.stateDeleteUsers === true) {
            this.buttons.moreButtons[3].isActive = false;
            this._apiSrv.stateTehUsers = false;
            this._apiSrv.flagTehnicalUsers = false;
        }
        this.upsavePagConfig();
        this._pagSrv.resetConfig();
        if (this._apiSrv.configList.shooseTab === 0) {
            if (this._apiSrv.flagDelitedPermanantly === true) {
                localStorage.setItem('lastNodeDue', JSON.stringify('0.'));
            }
            this._router.navigate(['user_param/0.']);
        }
        this.initView(id ? id : '0.');
    }

    ViewTechicalUsers() {
        this._apiSrv.flagTehnicalUsers = !this._apiSrv.flagTehnicalUsers;
        this._apiSrv.stateTehUsers = this._apiSrv.flagTehnicalUsers;
        if (this._apiSrv.flagTehnicalUsers === true && this._apiSrv.configList.shooseTab === 0) {
            localStorage.setItem('lastNodeDue', JSON.stringify('0.'));
        }
        this._storage.setItem('SortPageList', { 'sort': 'login', 'upDoun': false });
        this._apiSrv.srtConfig[this._apiSrv.currentSort].checked = false;
        if (this._apiSrv.stateTehUsers === true) {
            this.buttons.moreButtons[2].isActive = false;
            this._apiSrv.stateDeleteUsers = false;
            this._apiSrv.flagDelitedPermanantly = false;
        }
        const id = this._route.params['value'].nodeId;
        this.upsavePagConfig();
        this._pagSrv.resetConfig();
        if (this._apiSrv.configList.shooseTab === 0) {
            this._router.navigate(['user_param/0.']);
        }
        this.initView(id ? id : '0.');
    }
    upsavePagConfig() {
        const conf = this._storage.getItem('users');
        if (conf) {
            conf.start = 1;
            conf.curent = 1;
            this._storage.setItem('users', conf);
        }
    }
    OpenAddressManagementWindow() {
        /*  setTimeout(() => { */
        if (this.selectedUser) {
            this._router.navigate(['user-params-set/', 'email-address'], {
                queryParams: { isn_cl: this.selectedUser.id }
            });
        }
        /* }, 0); */
    }

    OpenRightsSystemCaseDelo() {
        /* setTimeout(() => { */
        if (this.selectedUser) {
            this._router.navigate(['user-params-set/', 'card-files'], {
                queryParams: { isn_cl: this.selectedUser.id }
            });
        }
        /* }, 0); */
    }

    OpenStreamScanSystem() {
        /* setTimeout(() => { */
        this._router.navigate(['user-params-set/', 'inline-scaning'],
            {
                queryParams: { isn_cl: this.selectedUser.id }
            }
        );
        /* }, 0); */
    }

    CommonTechLists() {
        const param: IOpenClassifParams = {
            classif: 'COMMON_LIST',
        };
        this.shadow = true;
        this._waitCl.openClassif(param).then(data => {
            this.shadow = false;
        }).catch(error => {
            this.shadow = false;
        });
    }

    GeneralLists() {
        const param: IOpenClassifParams = {
            classif: 'StdText',
            clUser: true,
            isn_user: -99,
        };
        this.shadow = true;
        this._waitCl.openClassif(param).then(data => {
            this.shadow = false;
        }).catch(error => {
            this.shadow = false;
        });
    }

    OpenSumProtocol() {
        /* setTimeout(() => { */
        this._router.navigate(['user_param/sum-protocol']);
        /* }, 0); */
    }

    UsersStats() {
        /*  setTimeout(() => { */
        this._router.navigate(['user_param/users-stats']);
        /* }, 0); */
    }

    Protocol() {
        /* setTimeout(() => { */
        this._router.navigate(['user-params-set/', 'protocol'],
            {
                queryParams: { isn_cl: this.selectedUser.id }
            }
        );
        /* }, 0); */
    }

    DefaultSettings() {
        setTimeout(() => {
            this._router.navigate(['user_param/default-settings']);
        }, 0);
    }

    SettingsManagement() {
        this.settingsManagementModal = this._modalSrv.show(SettingManagementComponent, {
            class: 'param-settings-management',
            ignoreBackdropClick: true,
            animated: false,
            show: false,
        });
        this.settingsManagementModal.content.checkedUsers = this.getCheckedUsers().map(user => user.data.ISN_LCLASSIF);
        this.settingsManagementModal.content.closedModal.subscribe(() => {
            setTimeout(() => {
                this.settingsManagementModal.hide();
            });
        });
    }

    setCheckedAllFlag() {
        if (this.listUsers.length === 0) {
            this.flagChecked = null;
        } else {
            if (!this.flagChecked) {
                this.flagChecked = true;
            } else {
                this.flagChecked = null;
            }
        }
        this.listUsers.forEach(user => {
            user.selectedMark = false;
            if (this.flagChecked) {
                user.isChecked = true;
            } else {
                user.isChecked = false;
            }
        });
        this.updateFlafListen();
        if (this.countcheckedField === 0) {
            this._userParamSrv.checkedUsers = [];
            this.rtUserService.changeSelectedUser(null);
            if (this.selectedUser) {
                this.selectedUser.isSelected = false;
                this.selectedUser = undefined;
            }
        } else {
            const checkUser = this.getCheckedUsers();
            this._userParamSrv.checkedUsers = this.getCheckedUsers();
            if (this.selectedUser) {
                this.selectedUser.isSelected = false;
            }
            this.selectedUser = checkUser[0];
            this.selectedUser.isSelected = true;
            this.rtUserService.changeSelectedUser(this.selectedUser);
        }
        this.rtUserService._updateBtn.next(this.optionsBtn);
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
        this.updateFlafListen();
        if (event.target.checked) {
            this.rtUserService.changeSelectedUser(user);
            this.selectedUser = user;
        } else {
            const chekUsers = this.getCheckedUsers();
            if (chekUsers.length) {
                this.selectedUser = chekUsers[0];
                this.rtUserService.changeSelectedUser(chekUsers[0]);
            } else {
                this.selectedUser = undefined;
                this.rtUserService.changeSelectedUser(null);
            }
        }
        this._userParamSrv.checkedUsers = this.getCheckedUsers();
        this.rtUserService._updateBtn.next(this.optionsBtn);
    }
    getCheckedUsers() {
        return this.listUsers.filter((user: UserSelectNode) => {
            return user.isChecked || user.isSelected || user.selectedMark;
        });
    }

    updateFlafListen() {
        this.countCheckedField();
        const leng = this.listUsers.length;
        if (this.listUsers.length === 0) {
            this.flagChecked = null;
        } else {
            if (this.countcheckedField === leng) {
                this.flagChecked = true;
            }
            if (this.countcheckedField === 1) {
                this.rtUserService.btnDisabled = true;
            } else {
                this.rtUserService.btnDisabled = false;
            }
            if (this.countcheckedField > 0 && this.countcheckedField < leng) {
                this.flagChecked = false;
            }
            if (this.countcheckedField === 0) {
                this.flagChecked = null;
            } else {
                this.rtUserService.subjectFlagBtnHeader.next(true);
            }
        }
    }

    countCheckedField() {
        this.countcheckedField = this.listUsers.filter((user: UserSelectNode) => {
            return user.isChecked || user.selectedMark;
        }).length;
    }
    getQuery(): any {
        let query = {};
        if (this._appContext.cbBase) {
            query = {
                ORACLE_ID: 'isnotnull',
                IS_SECUR_ADM: '1',
                DELETED: '0',
            };
        } else {
            query = {
                ISN_LCLASSIF: '0',
            };
        }
        return query;
    }
    getUsersBlocked(lastAdmin: boolean): UserSelectNode[] {
        if (this._appContext.cbBase && lastAdmin) {
            return this.listUsers.filter((user: UserSelectNode) => {
                return user.data.IS_SECUR_ADM !== 1 || (user.blockedUser || user.blockedSystem && user.data.IS_SECUR_ADM === 1);
            }
            );
        }
        return this.listUsers;
    }
    BlockUser() {
        const idMain = this._appContext.CurrentUser.ISN_LCLASSIF;
        this._pipeSrv.read<USER_CL>({
            USER_CL: {
                criteries: this.getQuery(),
            }
        }).then((data: USER_CL[]) => {
            this.isLoading = true;
            const blockedUsers = this.listUsers.filter(user => !user.blockedUser && !user.blockedSystem && (user.selectedMark || user.isChecked) && user.data.IS_SECUR_ADM === 1);
            let lastAdmin = false;
            if (this._appContext.cbBase) {
                if (data['TotalRecords'] === blockedUsers.length) {
                    this._msgSrv.addNewMessage({
                        type: 'warning',
                        title: 'Предупреждение:',
                        msg: `В системе не будет ни одного незаблокированного пользователя с правом «Администратор»`
                    });
                    lastAdmin = true;
                }
            }

            this._apiSrv.blokedUser(this.getUsersBlocked(lastAdmin), idMain).then(user => {
                this.getUsersBlocked(lastAdmin).forEach(users => {
                    if (users.id === +idMain && (users.isChecked || users.selectedMark)) {
                        this._msgSrv.addNewMessage({
                            type: 'warning',
                            title: 'Предупреждение:',
                            msg: `Нельзя заблокировать самого себя.`
                        });
                    }
                    if ((users.isChecked || users.selectedMark) && users.id !== +idMain && users.isEditable) {
                        if (users.blockedUser) {
                            users.blockedUser = false;
                            this._userParamSrv.ProtocolService(users.data.ISN_LCLASSIF, 2);
                        } else {
                            if (!users.blockedUser && !users.blockedSystem) {
                                users.blockedUser = true;
                                this._userParamSrv.ProtocolService(users.data.ISN_LCLASSIF, 1);
                            }
                            if (users.blockedSystem) {
                                this._userParamSrv.ProtocolService(users.data.ISN_LCLASSIF, 2);
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
                error.message = error.message ? error.message : error.message = 'Не удалось заблокировать пользователя,  обратитесь к системному администратору';
                this.isLoading = false;
                this.cathError(error.message);
            });
        });
    }
    getLoginDeleted(): string {
        let names = '';
        this.listUsers.forEach((list: UserSelectNode) => {
            if (list.isChecked || list.isSelected || list.selectedMark) {
                if (list.id === this._appContext.CurrentUser.ISN_LCLASSIF) {
                    this.deleteOwnUser = list.name;
                } else {
                    names += `${list.name}, `;
                }
            }
        });
        return names.substr(0, names.length - 2);
    }
    DeliteUser() {
        const names = this.getLoginDeleted();
        if (this.checkedOwnDelete(names)) {
            this._msgSrv.addNewMessage({
                title: 'Предупреждение',
                msg: `Нельзя удалить самого себя`,
                type: 'warning'
            });
            this.deleteOwnUser = null;
            return;
        }
        this._confirmSrv.confirm(CONFIRM_DELETE).then(confirmation => {
            this.deleteOwnUser = null;
            if (confirmation) {
                if (this._appContext.cbBase) {
                    this._pipeSrv.read({
                        USER_CL: {
                            criteries: {
                                DELO_RIGHTS: '1%',
                                DELETED: '0',
                                ISN_LCLASSIF: '1:null'
                            },
                        },
                        expand: 'USER_TECH_List'
                    }).then((data: any) => {
                        const usersUnlimit = data.filter(user => this._userParamSrv.CheckLimitTech(user.USER_TECH_List) !== true && user.TECH_RIGHTS[0] === '1');
                        let count = 0;
                        for (const user of usersUnlimit) {
                            if (names.indexOf(user.SURNAME_PATRON) !== -1) {
                                count++;
                            }
                        }
                        if (usersUnlimit.length === count) {
                            this._msgSrv.addNewMessage({
                                title: 'Предупреждение',
                                msg: `Ни один из незаблокированных пользователей не имеет права "Системный технолог" с доступом к модулю "Пользователи" без ограничений.`,
                                type: 'warning'
                            });
                            return;
                        }
                        this.deleteConfirm(names);
                    });
                } else {
                    this.deleteConfirm(names);
                }
            }
        });
    }

    checkedOwnDelete(names: string): boolean {
        if (names) {
            CONFIRM_DELETE.body = 'Удаленных пользователей невозможно будет восстановить. Вы действительно хотите удалить пользователей: ' + '\n\r' + names + ' ?';
        }
        if (this.deleteOwnUser) {
            if (names !== '') {
                CONFIRM_DELETE.body = CONFIRM_DELETE.body + '\n\r' + `Пользователь ${this.deleteOwnUser} не будет удален. Нельзя удалить самого себя.`;
            } else {
                return true;
            }
        }
        return false;
    }

    deleteConfirm(names: string): Promise<any> {
        this.isLoading = true;
        let arrayRequests = [];
        const deletedUsers = [];
        const arrayProtocol = [];
        this.listUsers.forEach((user: UserSelectNode) => {
            if (((user.isChecked && !user.deleted) || (user.selectedMark)) && user.id !== this._appContext.CurrentUser.ISN_LCLASSIF) {
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
                this._msgSrv.addNewMessage({
                    title: 'Сообщение',
                    msg: `Пользователи: ${names} \n\r удалены`,
                    type: 'success'
                });
                this.initView(this.currentDue);
                arrayRequests = [];
                deletedUsers.forEach(el => {
                    arrayProtocol.push(this._userParamSrv.ProtocolService(el, 8));
                });
                return Promise.all([...arrayProtocol]).then(() => {
                    this.isLoading = false;
                });
            }).catch(error => {
                this.isLoading = false;
                error.message = error.message ? error.message : 'Не удалось удалить пользователя, обратитесь к системному администратору';
                this.cathError(error);
            });
        }
    }

    get getflagChecked() {
        switch (this.flagChecked) {
            case true:
                this.checkAll = 'Снять пометки';
                return 'eos-icon-checkbox-square-v-blue';
            case false:
                this.checkAll = 'Отметить все на странице';
                return 'eos-icon-checkbox-square-minus-blue';
            default:
                this.checkAll = 'Отметить все на странице';
                return 'eos-icon-checkbox-square-blue';
        }
    }
    searchUsers($event: IRequest): void {
        this._apiSrv.searchState = true;
        this._storage.setItem('quickSearch', $event);
        const sort = this.curentTabSearch === 1 ? 'fullDueName' : 'login';
        this.sortPageList(sort, 'sortSearch');
    }
    getClassTooltip(lust: boolean): string {
        if (lust === true) {
            return `tooltip-info tooltip-pos-l`;
        } else {
            return `tooltip-info`;
        }
    }
    quickSearchKey(evn) {
        this._apiSrv.searchState = true;
        this._storage.setItem('quickSearch', evn);
        this.sortPageList('login', 'sortSearch');
    }
    resetSearch() {
        let urlUpdate;
        const url = this._router.url.split('/');
        if (url[url.length - 1] === 'user_param') {
            urlUpdate = '0.';
        } else {
            urlUpdate = url[url.length - 1];
        }
        if (this._storage.getItem('quickSearch')) {
            this._srhSrv.closeSearch.next(true);
        }
        this._pagSrv.resetConfig();
        this.initView(urlUpdate);
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
    private _createUrlForSop(isn_user) {
        const url = `EraseUser?isn_user=${isn_user}`;
        return url;
    }
}
