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
    DefaultSettings,
} from '../shered/consts/btn-action.consts';
import { AppContext } from 'eos-rest/services/appContext.service';
import { USER_TECH } from 'eos-rest';
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
    public flagTachRigth;
    _unSubscribe: Subject<any> = new Subject();
    tooltipDelay = TOOLTIP_DELAY_VALUE;
    buttonName: Array<string> = [
        'CreateUser',
        'RedactUser',
        'ViewDeletedUsers',
        'ViewTechicalUsers',
        'BlockUser',
        'OpenAddressManagementWindow',
        'OpenStreamScanSystem',
        'OpenRightsSystemCaseDelo',
        'Protocol',
        'DefaultSettings',
        'DeliteUser'];
    get techUser() {
        return this._appContext.CurrentUser.USER_TECH_List;
    }
    get limitCards() {
        return this._appContext.limitCardsUser;
    }
    constructor(
        private _rtSrv: RtUserSelectService,
        private _appContext: AppContext,
        private _storage: EosStorageService,
    ) {
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
    ngOnInit() {
        this.checkFlagTech();
        this._rtSrv.updateBtn.pipe(takeUntil(this._unSubscribe)).subscribe(({ listUsers, selectedUser }) => {
            this.listUsers = listUsers;
            this.selectUser = selectedUser;
            if (this.listUsers) {
                this.updateBtns();
            }
        });
    }
    ngOnDestroy() {
        if (this.dropdownMy) {
            this.dropdownMy.autoClose = false;
        }
    }
    add(dropdown) {
        this.dropdownMy = dropdown;
    }
    doAction(event, dropdown) {
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
            case 'DefaultSettings':
                this.checkBtnDefaultSettings();
                break;
            default:
                console.log('not Action');
                break;
        }
    }
    checkCreateBtn() {
        if (this.flagTachRigth) {
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
        this.checkWithLimitedUser(DeliteUser);
    }
    checkBtnBlockUser() {
        this.checkWithLimitedUser(BlockUser);
    }
    checkBtnOpenAdress() {
        this.checkWithLimitedUser(OpenAddressManagementWindow);
    }
    checkBtnOpenSystemDelo() {
        this.checkWithLimitedUser(OpenRightsSystemCaseDelo);
    }
    checkBtnProtocol() {
        if (!this.selectUser) {
            Protocol.disabled = true;
        } else {
            if (this.flagTachRigth) {
                if (this.checkUresForLimited()) {
                    Protocol.disabled = true;
                } else {
                    Protocol.disabled = false;
                }
            } else {
                Protocol.disabled = false;
            }
        }
    }
    checkBtnOpenStreamSystem() {
        if (!this.selectUser || this.selectUser.deleted) {
            OpenStreamScanSystem.disabled = true;
        } else {
            if (this.flagTachRigth) {
                if (this.checkUresForLimited()) {
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
        } else {
            SumProtocol.disabled = false;
        }
    }
    checkBtnDefaultSettings(): void {
        if (this.limitCards.length) {
            DefaultSettings.disabled = true;
        } else {
            DefaultSettings.disabled = false;
        }
    }
    checkWithLimitedUser(button: BtnActionFields): void {
        if (!this.selectUser || this.selectUser.deleted) {
            button.disabled = true;
        } else {
            if (this.flagTachRigth) {
                if (this.checkUresForLimited()) {
                    button.disabled = true;
                } else {
                    button.disabled = false;
                }
            } else {
                button.disabled = false;
            }
        }
    }
    checkUresForLimited(): boolean {
        return this.limitCards.indexOf(this.selectUser.data.TECH_DUE_DEP) === -1;
    }

}
