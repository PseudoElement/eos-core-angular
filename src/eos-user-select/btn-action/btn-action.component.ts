import { Component, Input, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { BtnAction, BtnActionFields } from '../shered/interfaces/btn-action.interfase';
import { TOOLTIP_DELAY_VALUE } from 'eos-common/services/eos-tooltip.service';
import { RtUserSelectService } from 'eos-user-select/shered/services/rt-user-select.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { UserSelectNode } from 'eos-user-select/list-user-select/user-node-select';
import {
    CreateUser, RedactUser, ViewDeletedUsers, ViewTechicalUsers,
    OpenAddressManagementWindow,
    OpenStreamScanSystem, OpenRightsSystemCaseDelo, SumProtocol,
    BlockUser,
    DeliteUser,
    Protocol,
    UsersInfo,
    DefaultSettings,
    SettingsManagement,
    UserLists,
    Unlock,
} from '../shered/consts/btn-action.consts';
import { AppContext } from 'eos-rest/services/appContext.service';
import { EosStorageService } from 'app/services/eos-storage.service';
@Component({
    selector: 'eos-btn-action',
    templateUrl: 'btn-action.component.html',
    styleUrls: ['btn-action.component.scss'],
})

export class BtnActionComponent implements OnInit, OnDestroy {
    @Input() buttons: BtnAction;
    @Output() showAction: EventEmitter<any> = new EventEmitter<any>();
    public dropdownMy;
    public listUsers: UserSelectNode[];
    public selectUser: UserSelectNode;
    _unSubscribe: Subject<any> = new Subject();
    tooltipDelay = TOOLTIP_DELAY_VALUE;
    buttonName: Array<string> = [
        'CreateUser',
        'RedactUser',
        'ViewDeletedUsers',
        'ViewTechicalUsers',
        'BlockUser',
        'Unlock',
        'OpenAddressManagementWindow',
        'OpenStreamScanSystem',
        'OpenRightsSystemCaseDelo',
        'Protocol',
        'OpenSumProtocol',
        'UsersInfo',
        'DefaultSettings',
        'DeliteUser',
        'UserLists',
        'SettingsManagement'];
    get techUser() {
        return this._appContext.CurrentUser.USER_TECH_List;
    }
    get limitCards() {
        return this._appContext.limitCardsUser;
    }
    get checkedUsers() {
        return this.listUsers.filter(user => user.isChecked || user.isSelected || user.selectedMark);
    }
    constructor(
        private _rtSrv: RtUserSelectService,
        private _appContext: AppContext,
        private _storage: EosStorageService,
    ) {
    }
    ngOnInit() {
        this._rtSrv.updateBtn.pipe(takeUntil(this._unSubscribe)).subscribe(({ listUsers, selectedUser }) => {
            this.listUsers = listUsers;
            this.selectUser = selectedUser;
            if (this.listUsers) {
                this.updateBtns();
            }
        });
    }
    ngOnDestroy() {
        this._unSubscribe.next();
        this._unSubscribe.complete();
        if (this.dropdownMy) {
            this.dropdownMy.autoClose = false;
        }
    }
    add(dropdown) {
        this.dropdownMy = dropdown;
    }
    doAction(event, dropdown, $event?) {
        if ($event) {
            $event.preventDefault();
        }
        if (dropdown) {
            dropdown.hide();
        }
        this.changeButtons(event);
        this.showAction.emit(event);
    }

    changeButtons(name) {
        // в this.buttons.buttons и  this.buttons.moreButtons  ссылки на одни и те же массивы
        this.buttons.buttons.map((button: BtnActionFields) => {
            if (button.name === name) {
                button.isActive = !button.isActive;
            }
            return button;
        });
        this.buttons.moreButtons.map((button: BtnActionFields) => {
            if (button.name === name) {
                button.isActive = !button.isActive;
            }
            return button;
        });
    }

    updateBtns() {
        this.buttonName.forEach(name => {
            this.upBtn(name);
        });
    }
    upBtn(btnName: string) {
        switch (btnName) {
            case 'CreateUser':
                this.checkCreateBtn();
                break;
            case 'RedactUser':
                this.checkRedactBrn();
                break;
            case 'DeliteUser':
                this.checkBtnDelete();
                break;
            case 'ViewDeletedUsers':
                this.checkBtnViewDeletedUsers();
                break;
            case 'ViewTechicalUsers':
                this.checkBtnViewTechicalUsers();
                break;
            case 'BlockUser':
                this.checkBtnBlockUser();
                break;
            case 'Unlock':
                this.checkBtnUnlockUser();
                break;
            case 'UserLists':
                this.checkBtnSharingLists();
                break;
            case 'OpenAddressManagementWindow':
                this.checkBtnOpenAdress();
                break;
            case 'OpenStreamScanSystem':
                this.checkBtnOpenStreamSystem();
                break;
            case 'OpenRightsSystemCaseDelo':
                this.checkBtnOpenSystemDelo();
                break;
            case 'Protocol':
                this.checkBtnProtocol();
                break;
            case 'OpenSumProtocol':
                this.checkBtnOpenSumProtocol();
                break;
            case 'UsersInfo':
                this.checkBtnUserInfo();
                break;
            case 'DefaultSettings':
                this.checkBtnDefaultSettings();
                break;
            case 'SettingsManagement':
                this.checkBtnSettingsManagement();
                break;
            case 'UserSession':
            default:
                console.log('not Action');
                break;
        }
    }
    checkCreateBtn() {
        if (this.limitCards.length) {
            CreateUser.disabled = true;
        } else {
            CreateUser.disabled = false;
        }
    }

    checkBtnViewDeletedUsers() {
        if (this._storage.getItem('quickSearch')) {
            ViewDeletedUsers.disabled = true;
        } else {
            ViewDeletedUsers.disabled = false;
        }
    }
    checkBtnViewTechicalUsers() {
        if (this._storage.getItem('quickSearch')) {
            ViewTechicalUsers.disabled = true;
        } else {
            ViewTechicalUsers.disabled = false;
        }
    }
    checkRedactBrn() {
        this.checkWithLimitedUser(RedactUser);
    }
    checkBtnDelete() {
        this.deleteForever(DeliteUser);
    }
    checkBtnBlockUser() {
        this.checkWithBlocketUSer(BlockUser);
    }
    checkBtnUnlockUser() {
        this.checkWithUnlockUSer(Unlock);
    }
    checkBtnOpenAdress() {
        this.checkWithLimitedUser(OpenAddressManagementWindow);
    }
    checkBtnOpenSystemDelo() {
        this.OpenRightsSystemCaseDelo(OpenRightsSystemCaseDelo);
    }
    checkBtnProtocol() {
        this.checkWittAllUsers(Protocol);
    }
    checkBtnUserInfo() {
        this.checkWittAllUsers(UsersInfo);
        this._rtSrv.usersInfo = UsersInfo;
    }
    checkBtnSettingsManagement() {
        this.checkSettingsManagement(SettingsManagement);
    }
    checkBtnSharingLists() {
        this.checkWithUsersList(UserLists);
    }
    checkBtnOpenStreamSystem() {
        if (!this.selectUser || this.selectUser.deleted || this.checkedUsers.length > 1) {
            OpenStreamScanSystem.disabled = true;
        } else {
            if (this.limitCards.length) {
                if (!this.selectUser.isEditable) {
                    OpenStreamScanSystem.disabled = true;
                } else {
                    if (this.selectUser.data.AV_SYSTEMS.charAt(3) !== '1') {
                        OpenStreamScanSystem.disabled = true;
                    } else {
                        OpenStreamScanSystem.disabled = false;
                    }
                }
            } else {
                if (this.selectUser.data.AV_SYSTEMS.charAt(3) !== '1') {
                    OpenStreamScanSystem.disabled = true;
                } else {
                    OpenStreamScanSystem.disabled = false;
                }
            }
        }
    }
    checkBtnOpenSumProtocol(): void {
        if (this.limitCards.length) {
            SumProtocol.disabled = true;
            SumProtocol.isActive = false;
        } else {
            SumProtocol.disabled = false;
        }
    }
    checkBtnDefaultSettings(): void {
        if (this.limitCards.length) {
            DefaultSettings.disabled = true;
            DefaultSettings.isActive = false;
        } else {
            DefaultSettings.disabled = false;
        }
    }
    checkWithLimitedUser(button: BtnActionFields): void {
        if (!this.selectUser || this.selectUser.deleted || this.checkedUsers.length > 1) {
            button.disabled = true;
            button.isActive = false;
        } else {
            if (this.limitCards.length) {
                button.disabled = !this.selectUser.isEditable;
                if (button.name === 'DeliteUser') { // запретить огран. тех. удалять пользователей
                    button.disabled = true;
                }
            } else {
                button.disabled = false;
            }
        }
    }
    checkWithBlocketUSer(button: BtnActionFields) {
        const usersEdit = this.checkedUsers.some(user => !user.isEditable || user.deleted);
        const isOnlyBlocked = this.checkedUsers.every((user) => user.blockedUser || user.blockedSystem);
        if (usersEdit || isOnlyBlocked) {
            button.disabled = true;
            button.isActive = false;
        } else {
            button.disabled = false;
        }
    }

    checkWithUnlockUSer(button: BtnActionFields) {
        const onlyNotBlocked = this.checkedUsers.every(user => !user.blockedSystem && !user.blockedUser);
        const usersEdit = this.checkedUsers.some(user => !user.isEditable || user.deleted);
        if (usersEdit || onlyNotBlocked) {
            button.disabled = true;
            button.isActive = false;
        } else {
            button.disabled = false;
        }
    }

    checkWithUsersList(button: BtnActionFields) {
        const usersEdit = this.checkedUsers.filter(user => user.isEditable && !user.deleted);
        // const isUnlimTech = this._appContext.CurrentUser.TECH_RIGHTS;
        if (usersEdit.length === 1) {
            this.checkWithLimitedUser(button);
        } else {
            button.disabled = true;
        }
    }

    checkWittAllUsers(button: BtnActionFields): void {
        // const usersEdit = this.listUsers.filter(user => (user.isChecked || user.isSelected) && user.isEditable);
        const usersEdit = this.listUsers.filter(user => (user.isChecked || user.isSelected));
        if (usersEdit.length) {
            button.disabled = false;
        } else {
            button.disabled = true;
            button.isActive = false;
        }
    }
    checkSettingsManagement(button: BtnActionFields): void {
        const checkedEditable = this.checkedUsers.some(user => user.isEditable);
        const checkedNotEditable = this.checkedUsers.some(user => !user.isEditable || user.deleted);
        if (checkedEditable) {
            if (checkedNotEditable) {
                button.disabled = true;
                button.isActive = false;
            } else {
                button.disabled = false;
            }
        } else {
            button.disabled = true;
            button.isActive = false;
        }
    }
    OpenRightsSystemCaseDelo(button: BtnActionFields): void {
        if (!this.selectUser || this.selectUser.deleted || this.checkedUsers.length > 1) {
            button.disabled = true;
            button.isActive = false;
        } else {
            button.disabled = false;
        }
    }
    deleteForever(button: BtnActionFields): void {
        if (!this.selectUser || this.selectUser.deleted) {
            button.disabled = true;
            button.isActive = false;
        } else {
            if (this.limitCards.length) {
                button.disabled = true;
            } else {
                button.disabled = false;
            }
        }
    }
}
