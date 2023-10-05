import { AfterContentChecked, Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Subject, BehaviorSubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { UserParamApiSrv } from '../../eos-user-params/shared/services/user-params-api.service';
import { UserPaginationService } from '../../eos-user-params/shared/services/users-pagination.service';
import { UserSelectNode } from './user-node-select';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { CreateUserComponent } from './createUser/createUser.component';
// import { SearchServices } from '../shered/services/search.service';
// import { USERSRCH } from '../../eos-user-select/shered/consts/search-const';
import { RtUserSelectService } from '../shered/services/rt-user-select.service';
import { EosSandwichService } from '../../eos-dictionaries/services/eos-sandwich.service';
import { Allbuttons } from '../shered/consts/btn-action.consts';
import { BtnAction } from '../shered/interfaces/btn-action.interfase';
import { TreeUserSelectService } from '../shered/services/tree-user-select.service';
import { EosMessageService } from '../../eos-common/services/eos-message.service';
import { ConfirmWindowService } from '../../eos-common/confirm-window/confirm-window.service';
import { CONFIRM_DELETE } from '../shered/consts/confirm-users.const';
import { PipRX, /* USER_CL */ IRequest, USER_CL } from '../../eos-rest';
import { ALL_ROWS } from '../../eos-rest/core/consts';
import { EosStorageService } from '../../app/services/eos-storage.service';
import { EosBreadcrumbsService } from '../../app/services/eos-breadcrumbs.service';
import { ErrorHelperServices } from '../../eos-user-params/shared/services/helper-error.services';
import { WaitClassifService } from '../../app/services/waitClassif.service';
import { IOpenClassifParams } from '../../eos-common/interfaces';
import { UserParamsService } from '../../eos-user-params/shared/services/user-params.service';
import { TOOLTIP_DELAY_VALUE } from '../../eos-common/services/eos-tooltip.service';
import { SearchServices } from '../../eos-user-select/shered/services/search.service';
import { AppContext } from '../../eos-rest/services/appContext.service';
import { SettingManagementComponent } from './setting-management/setting-management.component';
import { FormGroup } from '@angular/forms';
import { LIST_USER_CABINET, USERS_TYPE_TO_TECH_ADMIN_TABS, UsersTypeTabs } from '../../eos-user-select/shered/consts/list-user.const';
import { InputParamControlService } from '../../eos-user-params/shared/services/input-param-control.service';
import { IUsersTypeTabsVisibility } from '../../eos-user-select/shered/interfaces/user-select.interface';
interface TypeBread {
    action: number;
}
interface ISDISABLED {
    [name:string]: boolean;
}
@Component({
    selector: 'eos-list-user-select',
    templateUrl: 'list-user-select.component.html'
})
export class ListUserSelectComponent implements OnDestroy, OnInit, AfterContentChecked {
    @ViewChild('listContent', { static: false }) listContent;
    tooltipDelay = TOOLTIP_DELAY_VALUE;
    usersTypeTabs = USERS_TYPE_TO_TECH_ADMIN_TABS;
    activeUsersTypeTab$: BehaviorSubject<UsersTypeTabs> = new BehaviorSubject(UsersTypeTabs.AllUsers);
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
    openUserInfo: boolean = false;
    // количество выбранных пользователей
    countcheckedField: number;
    shadow: boolean = false;
    deleteOwnUser: any;
    CabinetOptions = [];
    isDisableObj: ISDISABLED = {}
    isVisibleUsersTypeTabs: IUsersTypeTabsVisibility = {
        [UsersTypeTabs.AllUsers]: true,
        [UsersTypeTabs.MyUsers]: true
    }
    public inputs: any;
    public form: FormGroup;
    get UsersTypeTabs(): typeof UsersTypeTabs{
        return UsersTypeTabs;
    }
    get isLimitedTechnologist(): boolean {
        return this._appContext.limitCardsUser.length > 0;
    }
    get availableDuesForTechnologist(): string[] {
        return this._appContext.limitCardsUser
    }
    get showCloseQuickSearch() {
        if (this._storage.getItem('quickSearch') !== undefined && this._storage.getItem('quickSearch').USER_CL.criteries['USER_CL.Removed'] === 'true') {
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
        private _appContext: AppContext,
        private _inputCtrlSrv: InputParamControlService,
    ) {

    }

    @HostListener('window:resize', ['$event.target'])
    checkIsDisabled() {
        this.listUsers.forEach(el => {
            const idDueName = el.id + 'DueName'
            const htmlElement = document.getElementById(idDueName);
            if(htmlElement){
                (htmlElement.offsetWidth < htmlElement.scrollWidth) ?
                this.isDisableObj[idDueName] = false :
                this.isDisableObj[idDueName] = true;
            } else {
                this.isDisableObj[idDueName] = true;
            }

            const idDep = el.id + 'Dep'
            const htmlElement2 = document.getElementById(idDep);
            if(htmlElement2){
                (htmlElement2.offsetWidth < htmlElement2.scrollWidth) ?
                this.isDisableObj[idDep] = false :
                this.isDisableObj[idDep] = true;
            } else {
                this.isDisableObj[idDep] = true;
            }
        })
    }

    ngAfterContentChecked() {
        if(this.listUsers) this.checkIsDisabled();
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
        this.inputs = this._inputCtrlSrv.generateInputs(LIST_USER_CABINET);
        this.form = this._inputCtrlSrv.toFormGroup(this.inputs, false);
        this._apiSrv.initSort();
        this._route.params
            .pipe(
                takeUntil(this.ngUnsubscribe)
            )
            .subscribe(param => {
                if (this._apiSrv.configList.shooseTab === 1) {
                    this.isLoading = true;
                    this.updateOptionSelect(param['nodeId'] || '0.')
                    .then(() => {
                        this.initView(param['nodeId']);
                    })
                    .catch(() => {
                        this.initView(param['nodeId']);
                    });
                } else {
                    this.initView(param['nodeId']);
                }
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
                if (this._apiSrv.configList.shooseTab === 1) {
                    this.updateOptionSelect('0.');
                }
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
        this.form.controls['USER_CABINET'].valueChanges
        .pipe(
            takeUntil(this.ngUnsubscribe)
        )
        .subscribe((value) => {
            const id = this._route.params['value'].nodeId;
            this._storage.setItem('cabinetFilter', value);
            this.initView(id, value);
        });
        this._initUsersTypeTabs()
        this.activeUsersTypeTab$
            .pipe(
                takeUntil(this.ngUnsubscribe)
            )
            .subscribe(() => this.initView())
    }
    updateOptionSelect(depart: string): Promise<boolean> {
        return this._pipeSrv.read<USER_CL>({
            CABINET: {
                criteries: { 'CABINET.DEPARTMENT.DEPARTMENT_DUE': `${depart}`},
            }
        })
        .then((cabinets) => {
            const filter = this._storage.getItem('cabinetFilter');
            let flag = false;
            const option = [{
                title: 'Все кабинеты',
                value: '.'
            }];
            cabinets.forEach((cab) => {
                if (filter && +cab['ISN_CABINET'] === +filter) {
                    flag = true;
                }
                option.push({
                    title: cab['CABINET_NAME'],
                    value: cab['ISN_CABINET']
                });
            });
            this.inputs['USER_CABINET'].options = option;
            this.form.controls['USER_CABINET'].setValue(flag ?  filter : '.', {emitEvent: false});
            this._storage.setItem('cabinetFilter', flag ? filter : '.');
            return true;
        });
    }
    cabinetFilterShow() {
        return !this.showCloseQuickSearch && this.shooseP === 1;
    }
    changeCurentSelectedUser(type: TypeBread) {
        const usersNotDeleted = this.listUsers.filter((user: UserSelectNode) => {
            return user.selectedMark === true || user.isSelected === true || user.isChecked === true;
        });
        if (usersNotDeleted.length > 0) {
            const index = usersNotDeleted.indexOf(this.selectedUser);
            if (type.action === 17) {
                this.setNewCurrUserByBreadMinus(index, usersNotDeleted);
            }
            if (type.action === 18) {
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

    initView(param?, cabinet?): Promise<any> {
        if (!cabinet && this.form.controls['USER_CABINET'].value !== '.') {
            cabinet = this.form.controls['USER_CABINET'].value;
        }
        if (cabinet === '.') {
            cabinet = '';
        }
        this.selectedUser = undefined;
        this.checkSortSessionStore();
        this.countcheckedField = 0;
        this.shooseP = this._apiSrv.configList.shooseTab;
        if (!param || param === '0.') {
            if (this._apiSrv.flagDelitedPermanantly && this._apiSrv.configList.shooseTab === 1) {
                this.titleCurrentDue = '';
            } else {
                this.titleCurrentDue = this._apiSrv.configList.shooseTab === 0 ? 'Все подразделения' : this._appContext.nameCentralСabinet;
            }
        } else {
            this.titleCurrentDue = this._apiSrv.configList.titleDue;
        }
        if ((this._apiSrv.flagDelitedPermanantly === true || this._apiSrv.flagTehnicalUsers === true) && this._apiSrv.configList.shooseTab === 0) {
            this.titleCurrentDue = 'Все подразделения';
        }
        if (this._apiSrv.flagDelitedPermanantly === true) {
            this.titleCurrentDue = this._apiSrv.configList.shooseTab === 1 ? '' : 'Удаленные пользователи';
        }
        // this.flagScan = null; убираю из-за сканирования
        this.flagChecked = null;
        this.isLoading = true;
        /* Добавляем techDueDeps - если выбран таб Мои Пользователи и нужно фильтровать только доступных для редактирования пользователей*/
        let techDueDeps = this.activeUsersTypeTab$.value === UsersTypeTabs.MyUsers ? this._getAvailableTecDueDeps() : undefined;
        return this._apiSrv.getUsers(param || '0.', cabinet, techDueDeps)
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
            this._apiSrv.srtConfig['surnamePatron'].checked = false;
            // this._apiSrv.srtConfig['login'].checked = false; @166034
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
            keyboard: false,
            animated: true,
            show: false,
        });
        this.createUserModal.content.titleNow = this.titleCurrentDue;
        this.createUserModal.content.closedModal.subscribe(() => {
            setTimeout(() => {
                this.createUserModal.hide();
                const id = this._route.params['value'].nodeId;
                this.initView(id ? id : '0.');
            });
        });
    }

    showBtnNested() {
        return this._apiSrv.dueDep === '0.' ? false :
                this.shooseP === 0 ? true : false;
    }

    toggleNested() {
        this.onlyView = !this.onlyView;
        this._apiSrv.flagOnlyThisDepart = this.onlyView;
        this._storage.setItem('onlyView', this.onlyView);
        const id = this._route.params['value'].nodeId;
        this._pagSrv.resetConfig();
        this.initView(id ? id : '0.');
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
            return 'icon eos-adm-icon small eos-adm-icon-arrow-blue-bottom';
        }
        return 'icon eos-adm-icon small eos-adm-icon-arrow-blue-top';
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
        this._storage.setItem('SortPageList', { 'sort': 'fullDueName', 'upDoun': false });
        this._apiSrv.srtConfig[this._apiSrv.currentSort].checked = false;
        if (this._apiSrv.stateDeleteUsers === true) {
            this.buttons.moreButtons[3].isActive = false;
            this._apiSrv.stateTehUsers = false;
            this._apiSrv.flagTehnicalUsers = false;
            this.buttons.moreButtons[4].isActive = false;
            this._apiSrv.flagDisableUser = false;
        }
        this.upsavePagConfig();
        this._pagSrv.resetConfig();
        if (this._apiSrv.configList.shooseTab === 0 && id !== '0.') {
            if (this._apiSrv.flagDelitedPermanantly === true) {
                localStorage.setItem('lastNodeDue', JSON.stringify('0.'));
            }
            this._router.navigate(['user_param/0.']);
        } else {
            this.initView(id ? id : '0.');
        }
        /* Если мы показываем удалённых то меняем заголовок в пользователях */
        if (this._apiSrv.flagDelitedPermanantly) {
            this.titleCurrentDue = 'Удаленные пользователи';
        }
    }

    ViewTechicalUsers() {
        const id = this._route.params['value'].nodeId;
        this._apiSrv.flagTehnicalUsers = !this._apiSrv.flagTehnicalUsers;
        this._apiSrv.stateTehUsers = this._apiSrv.flagTehnicalUsers;
        if (this._apiSrv.flagTehnicalUsers === true && this._apiSrv.configList.shooseTab === 0) {
            localStorage.setItem('lastNodeDue', JSON.stringify('0.'));
        }
        // this._storage.setItem('SortPageList', { 'sort': 'login', 'upDoun': false }); // @166034 - старая сортировка
        this._storage.setItem('SortPageList', { 'sort': 'fullDueName', 'upDoun': false });
        this._apiSrv.srtConfig[this._apiSrv.currentSort].checked = false;
        if (this._apiSrv.stateTehUsers === true) {
            this.buttons.moreButtons[2].isActive = false;
            this._apiSrv.stateDeleteUsers = false;
            this._apiSrv.flagDelitedPermanantly = false;
        }

        this.upsavePagConfig();
        this._pagSrv.resetConfig();
        if (this._apiSrv.configList.shooseTab === 0 && id !== '0.') {
            this._router.navigate(['user_param/0.']);
        } else {
            this.initView(id ? id : '0.');
        }
        /* Если мы показываем технических пользователей то меняем заголовок в пользователях */
        if (this._apiSrv.flagTehnicalUsers) {
            this.titleCurrentDue = 'Технические пользователи';
        }
    }
    ViewDisableUser() {
        const id = this._route.params['value'].nodeId;
        this._apiSrv.flagDisableUser = !this._apiSrv.flagDisableUser;
        /* if (this._apiSrv.flagDisableUser === true && this._apiSrv.configList.shooseTab === 0) {
            localStorage.setItem('lastNodeDue', JSON.stringify('0.'));
        } */
        // this._storage.setItem('SortPageList', { 'sort': 'login', 'upDoun': false }); @166034 - старая сортировка
        this._storage.setItem('SortPageList', { 'sort': 'fullDueName', 'upDoun': false });
        this._apiSrv.srtConfig[this._apiSrv.currentSort].checked = false;
        if (this._apiSrv.flagDisableUser) {
            this.buttons.moreButtons[2].isActive = false;
            this._apiSrv.stateDeleteUsers = false;
            this._apiSrv.flagDelitedPermanantly = false;
        }
        this.upsavePagConfig();
        this._pagSrv.resetConfig();
        /* if (this._apiSrv.configList.shooseTab === 0 && id !== '0.') {
            this._router.navigate(['user_param/0.']);
        } else {
            this.initView(id ? id : '0.');
        } */
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
        this._router.navigate(['user-params-set/', 'inline-scanning'],
            {
                queryParams: { isn_cl: this.selectedUser.id }
            }
        );
        /* }, 0); */
    }

    UserLists() {
        // const selectedUsers = this.listUsers.filter((user) => user.isChecked);
        if (this._userParamSrv.checkedUsers.length === 1) {
            const selectedUser = this._userParamSrv.checkedUsers[0];
            const param: IOpenClassifParams = {
                classif: 'SharingLists',
                clUser: true,
                isn_user: selectedUser.id
            };
            this.shadow = true;
            this._waitCl.openClassif(param).then(data => {
                this.shadow = false;
            }).catch(error => {
                this.shadow = false;
            });
        }
    }

    OpenSumProtocol() {
        /* setTimeout(() => { */
        this._router.navigate(['user_param/sum-protocol']);
        /* }, 0); */
    }

    UsersStats() {
        /*  setTimeout(() => { */
    //    this._router.navigate(['user_param/users-stats']);
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
        this.settingsManagementModal.content.checkedUsers = this.getCheckedUsers();
        this.settingsManagementModal.content.closedModal.subscribe(() => {
            setTimeout(() => {
                this.settingsManagementModal.hide();
                const id = this._route.params['value'].nodeId;
                this.initView(id ? id : '0.');
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
                AV_SYSTEMS: '_1________________________________________%'
            };
        } else {
            query = {
                ISN_LCLASSIF: '0',
            };
        }
        return query;
    }

    BlockUser() {
        const idMain = this._appContext.CurrentUser.ISN_LCLASSIF;
        const selectedUser: UserSelectNode[] = this._userParamSrv.checkedUsers.filter(_user => !_user.blockedSystem && !_user.blockedUser);
        if (!selectedUser.length) {
            this._msgSrv.addNewMessage({
                title: 'Сообщение',
                type: 'info',
                msg: 'Выберите не заблокированных пользователей'
            });
            return;
        }
        this._userParamSrv.getSysTechUser(null, selectedUser).then((allSysTech: boolean) => {
            if (allSysTech) {
                this._msgSrv.addNewMessage({
                    type: 'warning',
                    title: 'Предупреждение:',
                    msg: `Ни один из незаблокированных пользователей не имеет права «Системный технолог» с доступом к модулю «Пользователи» без ограничений.`
                });
            } else {
                this._pipeSrv.read<USER_CL>({
                    USER_CL: {
                        criteries: this.getQuery(),
                    }
                }).then((data: USER_CL[]) => {
                    this.isLoading = true;
                    const blockedUsers = selectedUser.filter(user => user.data.IS_SECUR_ADM === 1);
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

                    this._apiSrv.blokedUser(selectedUser, idMain, lastAdmin).then(user => {
                        if (selectedUser.findIndex(_u => _u.id === idMain) !== -1) {
                            this._msgSrv.addNewMessage({
                                type: 'warning',
                                title: 'Предупреждение:',
                                msg: `Нельзя заблокировать самого себя.`
                            });
                        }
                        selectedUser.forEach(users => {
                            if (users.id !== +idMain && users.isEditable) {
                                users.blockedUser = true;
                                this._userParamSrv.ProtocolService(users.data.ISN_LCLASSIF, 1);
                            }
                        });
                        const checkUser = this.getCheckedUsers(); // после блокировки убираем все галочки
                        checkUser.forEach((users) => {
                            users.isChecked = false;
                            users.isSelected = false;
                            users.selectedMark = false;
                        });
                        this.rtUserService.changeSelectedUser(null); // убираем из правого стакана
                        this.selectedUser = undefined; // убираем выбраного
                        this.rtUserService._updateBtn.next(this.optionsBtn); // обновляем кнопки
                        this.rtUserService.subjectFlagBtnHeader.next(false); // обновляем кнопки
                        this.updateFlafListen(); // обновить флаги
                        this.initView(this.currentDue)
                        .then(() => {
                            this.isLoading = false;
                        })
                        .catch(() => {
                            this.isLoading = false;
                        });
                    }).catch(error => {
                        error.message = error.message ? error.message : error.message = 'Не удалось заблокировать пользователя,  обратитесь к системному администратору';
                        this.isLoading = false;
                        this._errorSrv.errorHandler(error);
                    });
                });
            }
        });
        //     }
        // });
    }

    Unlock() {
        const selectedUserSystemBlock: UserSelectNode[] = [];
        const selectedUserBlocked: UserSelectNode[] = [];
        this._userParamSrv.checkedUsers.forEach((_user: UserSelectNode) => {
            if (!_user.isEditable) {
                return;
            }
            if (_user.blockedSystem) {
                selectedUserSystemBlock.push(_user);
            }
            if (_user.blockedUser) {
                selectedUserBlocked.push(_user);
            }
        });
        this._userParamSrv.checkLicenseCount(selectedUserBlocked, this.rtUserService.ArraySystemHelper).then(result => {
            const users = selectedUserSystemBlock.concat(result ? selectedUserBlocked : []);
            this.isLoading = true;
            this._apiSrv.unlockUsers(users).then(() => {
                users.forEach(_user => {
                    _user.blockedSystem = false;
                    _user.blockedUser = false;
                    this._userParamSrv.ProtocolService(_user.data.ISN_LCLASSIF, 2);
                    _user.isChecked = false;
                    _user.isSelected = false;
                    _user.selectedMark = false;
                });
                if (!result) {
                    selectedUserBlocked.forEach((_user) => {
                        this.selectedNodeSetFlags(_user);
                    });
                    this.selectedUser = selectedUserBlocked[0];
                    if (selectedUserBlocked.length) {
                        this.rtUserService.changeSelectedUser(selectedUserBlocked[0]);
                    }
                    this.rtUserService._updateBtn.next(this.optionsBtn);
                    this.rtUserService.subjectFlagBtnHeader.next(true);
                } else {
                    const checkUser = this.getCheckedUsers(); // после блокировки убираем все галочки
                    checkUser.forEach((user) => {
                        user.isChecked = false;
                        user.isSelected = false;
                        user.selectedMark = false;
                    });
                    this.rtUserService.changeSelectedUser(null);
                    this.selectedUser = undefined;
                    this.rtUserService._updateBtn.next(this.optionsBtn);
                    this.rtUserService.subjectFlagBtnHeader.next(true);
                    this.updateFlafListen();
                }
                this.isLoading = false;
            }).catch(error => {
                error.message = error.message ? error.message : error.message = 'Не удалось заблокировать пользователя,  обратитесь к системному администратору';
                this.isLoading = false;
                this._errorSrv.errorHandler(error);
            });
        });

    }
    getLoginDeleted(): { names: string; delIsns: string } {
        let names = '';
        let delIsns = 'isnotnull|';
        this.listUsers.forEach((list: UserSelectNode) => {
            if (list.isChecked || list.isSelected || list.selectedMark) {
                if (list.id === this._appContext.CurrentUser.ISN_LCLASSIF) {
                    this.deleteOwnUser = list.name;
                } else {
                    names += `${list.name}, `;
                    delIsns += `^${list.id}|`;
                }
            }
        });
        return { names: names.substr(0, names.length - 2), delIsns };
    }
    DeliteUser() {
        const { names, delIsns } = this.getLoginDeleted();
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
                                ISN_LCLASSIF: delIsns,
                                AV_SYSTEMS: '_1%',
                                ORACLE_ID: 'isnotnull',
                                'USER_TECH.FUNC_NUM': '^1'
                            },
                        },
                        skip: 0,
                        top: 2,
                        orderby: 'ISN_LCLASSIF',
                        loadmode: 'Table'
                    }).then((data: any) => {
                        // > 1 включая владельца схемы (ins_lclassif = 0 )
                        if (data.length > 1) {
                            this.deleteConfirm(names);
                        } else {
                            this._msgSrv.addNewMessage({
                                title: 'Предупреждение',
                                msg: `Ни один из незаблокированных пользователей не имеет права "Системный технолог" с доступом к модулю "Пользователи" без ограничений.`,
                                type: 'warning'
                            });
                            return;
                        }
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
                this.rtUserService.clearHash();
                return Promise.all([...arrayProtocol]).then(() => {
                    this.isLoading = false;
                });
            }).catch(error => {
                this.isLoading = false;
                this._errorSrv.errorHandler(error);
            });
        }
    }

    OpenUsersInfo(closeModal?) {
        if (closeModal) {
            this.openUserInfo = false;
        } else {
            this.openUserInfo = true;
        }
    }

    UserSession() {
        this._router.navigate(['user_param/user-session']);
    }

    get getflagChecked() {
        switch (this.flagChecked) {
            case true:
                this.checkAll = 'Снять пометки';
                return 'eos-adm-icon-checkbox-square-v-blue';
            case false:
                this.checkAll = 'Отметить все на странице';
                return 'eos-adm-icon-checkbox-square-minus-blue';
            default:
                this.checkAll = 'Отметить все на странице';
                return 'eos-adm-icon-checkbox-square-blue';
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
        // this.sortPageList('login', 'sortSearch'); @166034
        this.sortPageList('fullDueName', 'sortSearch');
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
    private _initUsersTypeTabs(): void {
        if(this._appContext.cbBase && this.isLimitedTechnologist){
            this.setActiveUsersTypeTab(UsersTypeTabs.MyUsers)
            this.isVisibleUsersTypeTabs = {
                [UsersTypeTabs.AllUsers]: false,
                [UsersTypeTabs.MyUsers]: true
            };
        }else if(!this._appContext.cbBase && this.isLimitedTechnologist){
            this.setActiveUsersTypeTab(UsersTypeTabs.MyUsers)
            this.isVisibleUsersTypeTabs = {
                [UsersTypeTabs.AllUsers]: true,
                [UsersTypeTabs.MyUsers]: true
            }
        }else{
            this.setActiveUsersTypeTab(UsersTypeTabs.AllUsers)
            this.isVisibleUsersTypeTabs = null;
        }
    }
    /**
     * 
     * @param activeTab Выбранный таб Мои пользователи / Все
     * @param onClick Защита от дурака - Используется в html-темплейте, чтобы не спамили запросами нажимая на кнопку, если второй Таб скрыт
     */
    setActiveUsersTypeTab(activeTab: UsersTypeTabs,){
        this.activeUsersTypeTab$.next(activeTab);
    }
    private _getAvailableTecDueDeps(): string {
        const dues = this._appContext.limitCardsUser;
        const duesToString = dues.join('|');
        return duesToString;
    }
    private _createUrlForSop(isn_user) {
        const url = `EraseUser?isn_user=${isn_user}`;
        return url;
    }
}
