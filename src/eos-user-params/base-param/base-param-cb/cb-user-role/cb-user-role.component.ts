import { Component, Output, OnInit, OnDestroy, EventEmitter, Input } from '@angular/core';
import { DragulaService } from 'ng2-dragula';
import { Subscription } from 'rxjs';
import { ConfirmWindowService } from 'eos-common/confirm-window/confirm-window.service';
import { CONFIRM_DELETE_ROLE } from 'eos-dictionaries/consts/confirm.consts';
import { OPEN_CLASSIF_DEPARTMENT } from 'eos-user-select/shered/consts/create-user.consts';
import { WaitClassifService } from 'app/services/waitClassif.service';
import { IRoleCB } from 'eos-user-params/shared/intrfaces/user-parm.intterfaces';
import { KIND_ROLES_CB } from 'eos-user-params/shared/consts/user-param.consts';
import { PipRX, DEPARTMENT } from 'eos-rest';
import { EosMessageService } from 'eos-common/services/eos-message.service';
import { UserParamsService } from 'eos-user-params/shared/services/user-params.service';
@Component({
    selector: 'eos-cb-user-role',
    templateUrl: 'cb-user-role.component.html',
    styleUrls: ['cb-user-role.component.scss'],
})
export class CbUserRoleComponent implements OnInit, OnDestroy {
    @Output() closeModal: EventEmitter<any> = new EventEmitter();
    @Output() saveCbRoles: EventEmitter<any> = new EventEmitter();
    @Input() currentFields: IRoleCB[];
    startRolesCb: IRoleCB[];
    basicFields: IRoleCB[] = [];
    fixedFields: IRoleCB[] = [];
    selectedBasicRole: IRoleCB;
    selectedCurrRole: IRoleCB;
    selectedFixedItem: IRoleCB;
    curPreDelete: IRoleCB;
    rightsDueRole: boolean = false;
    btnChangeDue: boolean;
    public deletRole: boolean = true;
    public isShell = false;
    public nameRoles: Map<number, string> = new Map();
    private _subscriptionDrop: Subscription;
    private _subscriptionDrag: Subscription;

    constructor(
        private _dragulaService: DragulaService,
        private _confirmSrv: ConfirmWindowService,
        private _waitClassifSrv: WaitClassifService,
        private _pipRx: PipRX, private _msgSrv: EosMessageService,
        private _userParamSrv: UserParamsService
    ) {}

    ngOnInit() {
        this._fixInitRoles();
        this._subscription();
        this.startRolesCb = JSON.parse(JSON.stringify(this.currentFields));
    }

    ngOnDestroy() {
        if (!!this._dragulaService.find('bag-one')) {
            this._dragulaService.destroy('bag-one');
        }
        if (!!this._dragulaService.find('fixed-bag')) {
            this._dragulaService.destroy('fixed-bag');
        }
        this._subscriptionDrop.unsubscribe();
        this._subscriptionDrag.unsubscribe();
    }

    select(item: IRoleCB, type: number) {
        switch (type) {
            case 1:
                this.selectedBasicRole = item;
                this.selectedCurrRole = null;
                this.selectedFixedItem = null;
                this.btnChangeDue = false;
                break;
            case 2:
                this.selectedBasicRole = null;
                this.selectedCurrRole = item;
                this.selectedFixedItem = null;
                if (this.selectedCurrRole && this.selectedCurrRole.hasOwnProperty('due')) {
                    this.btnChangeDue = true;
                } else {
                    this.btnChangeDue = false;
                }
                break;
            case 3:
                this.selectedBasicRole = null;
                this.selectedCurrRole = null;
                this.selectedFixedItem = item;
                this.btnChangeDue = false;
                break;
        }
    }

    parseToCurRole(BasicRole: IRoleCB): IRoleCB {
        const repeatRole = this.startRolesCb.filter(field => field.role === BasicRole.role)[0];
        if (this._userParamSrv.asistMansStr && BasicRole.role !== this.nameRoles.get(5)) {
            BasicRole.asistMan = this._userParamSrv.asistMansStr;
        }
        BasicRole.isnRole = repeatRole ? repeatRole.isnRole : null;
        return BasicRole;
    }

    addToCurrent() {
        if (this.selectedBasicRole) {
            if (this.selectedBasicRole.role !== this.nameRoles.get(4) && this.selectedBasicRole.role !== this.nameRoles.get(3)) {
                this.currentFields.push(this.parseToCurRole(this.selectedBasicRole));
            }
            this._fixedRoles(this.selectedBasicRole.role, 'add');
            this.selectedBasicRole = null;
        }
    }

    removeFromCurrent(item?: string) {
        if (this.selectedCurrRole || item) {
            this.deletRole = false;
            return this._confirmSrv.confirm(CONFIRM_DELETE_ROLE).then(res => {
                if (res) {
                    if (this.selectedCurrRole) {
                        if (this.selectedCurrRole.role !== this.nameRoles.get(4) && this.selectedCurrRole.role !== this.nameRoles.get(3)) {
                            this.basicFields.push(this.selectedCurrRole);
                        }
                        this.currentFields.splice(this.currentFields.indexOf(this.selectedCurrRole), 1);
                        this._fixedRoles(this.selectedCurrRole.role, 'del');
                        this.btnChangeDue = false;
                        this.selectedCurrRole = null;
                    } else {
                        if (item === this.nameRoles.get(4) || item === this.nameRoles.get(3)) {
                            this.basicFields.splice(this.basicFields.indexOf(this.curPreDelete), 1);
                        }
                        this._fixedRoles(item, 'del');
                    }
                } else {
                    if (item) {
                        this.currentFields.push(this.curPreDelete);
                        this.basicFields.splice(this.basicFields.indexOf(this.curPreDelete), 1);
                    }
                }
                this.deletRole = true;
            });
        }
    }

    save() {
        this.saveCbRoles.emit(this.currentFields);
        this.closeModal.emit();
    }

    close() {
        this.currentFields = this.startRolesCb;
        this.saveCbRoles.emit(this.currentFields);
        this.closeModal.emit();
    }

    changeDueRole() {
        this._showDepRole(this.selectedCurrRole.role, null, true);
    }

    private _addRole(role: string) {
        if (role !== this.nameRoles.get(4) && role !== this.nameRoles.get(3) && role !== this.nameRoles.get(5)) {
            const assistManRole = this.currentFields.filter(field => field.role === role);
            this.parseToCurRole(assistManRole[0]);
        }
        if (role === this.nameRoles.get(4) || role === this.nameRoles.get(3)) {
            this.basicFields.push({role: role});
        }
        this._fixedRoles(role, 'add');
    }

    private _fixInitRoles() {
        KIND_ROLES_CB.forEach((role, ind) => {
            this.basicFields.push({role: role});
            this.nameRoles.set(ind, role);
        });
        const arrRoles = this.currentFields.map(field => field.role);
        KIND_ROLES_CB.forEach(role => {
            if (arrRoles.indexOf(role) !== -1) {
                this._fixedRoles(role, 'add', true);
            }
        });
    }

    private _fixedRoles(role: string, typeMove: string , init?: boolean): void {
        if (typeMove === 'add') {
            if (role !== this.nameRoles.get(4) && role !== this.nameRoles.get(3)) {
                this.basicFields = this.basicFields.filter(field => field.role !== role);
            }
            switch (role) {
                case this.nameRoles.get(0):
                case this.nameRoles.get(1):
                    this.fixedFields = this.basicFields;
                    this.basicFields = [];
                    break;
                case this.nameRoles.get(2):
                    if (!this.fixedFields.length) {
                        this.fixedFields = this.basicFields.filter(field => field.role !== this.nameRoles.get(4) && field.role !== this.nameRoles.get(3));
                        this.basicFields = [
                            {role: this.nameRoles.get(4)},
                            {role: this.nameRoles.get(3)}
                        ];
                    } else {
                        this.basicFields = this.basicFields.filter(field => field.role !== this.nameRoles.get(5));
                        this.fixedFields.push({role: this.nameRoles.get(5)});
                    }
                    break;
                case this.nameRoles.get(5):
                    if (!this.fixedFields.length) {
                        this.fixedFields = this.basicFields.filter(field => field.role !== this.nameRoles.get(4) && field.role !== this.nameRoles.get(3));
                        this.basicFields = [
                            {role: this.nameRoles.get(4)},
                            {role: this.nameRoles.get(3)}
                        ];
                    } else {
                        this.basicFields = this.basicFields.filter(field => field.role !== this.nameRoles.get(2));
                        this.fixedFields.push({role: this.nameRoles.get(2)});
                    }
                    break;
                case this.nameRoles.get(3):
                case this.nameRoles.get(4):
                    if (!init) {
                        const basicPreAdd = this.currentFields.filter(field => (field.role === this.nameRoles.get(4) || field.role === this.nameRoles.get(3)) && !field.hasOwnProperty('due'));
                        this._showDepRole(role, basicPreAdd[0], null);
                    } else {
                        const seniorMan = this.currentFields.filter(field => field.role === this.nameRoles.get(2) || field.role === this.nameRoles.get(5))[0];
                        if (!seniorMan) {
                            this.fixedFields = [
                                {role: this.nameRoles.get(0)},
                                {role: this.nameRoles.get(1)}
                            ];
                            this.basicFields = this.basicFields.filter(field => field.role !== this.nameRoles.get(0) && field.role !== this.nameRoles.get(1));
                        }
                    }
                    break;
            }
        } else {
            switch (role) {
                case this.nameRoles.get(0):
                case this.nameRoles.get(1):
                    this.basicFields = this.fixedFields.concat({role: role});
                    this.fixedFields = [];
                    break;
                case this.nameRoles.get(2):
                    this.basicFields = this.basicFields.filter(field => field.role !== this.nameRoles.get(5));
                    if (!this.currentFields.length) {
                        this.basicFields = this.fixedFields.concat(this.basicFields);
                        this.fixedFields = [];
                    } else {
                        this.fixedFields = this.fixedFields.filter(field => field.role !== this.nameRoles.get(5));
                        this.basicFields.push({role: this.nameRoles.get(5)});
                    }
                    break;
                case this.nameRoles.get(5):
                    this.basicFields = this.basicFields.filter(field => field.role !== this.nameRoles.get(2));
                    if (!this.currentFields.length) {
                       this.basicFields = this.fixedFields.concat(this.basicFields);
                       this.fixedFields = [];
                    } else {
                        this.fixedFields = this.fixedFields.filter(field => field.role !== this.nameRoles.get(2));
                        this.basicFields.push({role: this.nameRoles.get(2)});
                    }
                    break;
                case this.nameRoles.get(3):
                case this.nameRoles.get(4):
                    if (!this.currentFields.length) {
                        this.basicFields = this.fixedFields.concat(this.basicFields);
                        this.fixedFields = [];
                    }
                    break;
            }
        }
    }

    private _subscription(): void {
        this._subscriptionDrop = this._dragulaService.drop.subscribe((value) => {
            if (value[2].id !== value[3].id) {
                if (value[3].id === 'current') {
                    this.removeFromCurrent(value[1].children[0].innerText);
                } else {
                    this._addRole(value[1].innerText);
                }
            }
        });
        this._subscriptionDrag = this._dragulaService.drag.subscribe((val) => {
            if (val[1].id === 'cur-item') {
                if (val[1].children[1].innerText !== '') {
                    this.curPreDelete = this.currentFields.filter(item => item.dueName === val[1].children[1].innerText)[0];
                } else {
                    this.curPreDelete = this.currentFields.filter(item => item.role === val[1].children[0].innerText)[0];
                }
            }
            this.selectedBasicRole = null;
            this.selectedCurrRole = null;
            this.selectedFixedItem = null;
            this.btnChangeDue = false;
        });
    }

    private _showDepRole(role: string, basicPreAdd: IRoleCB, changeRole: boolean): Promise<any> {
        this.isShell = true;
        return this._waitClassifSrv.openClassif(OPEN_CLASSIF_DEPARTMENT)
            .then((data: string) => {
                this.isShell = false;
                if (data === '') {
                    throw new Error();
                }
                if (data === this._userParamSrv.curentUser.DUE_DEP) {
                    throw new Error('copy');
                }
                return this._pipRx.read<DEPARTMENT>({ DEPARTMENT: {
                    criteries: {
                        DUE: data,
                        ISN_CABINET: 'isnotnull'
                    }
                }});
            }).then((depD: any) => {
                if (depD && depD.length) {
                    return this._pipRx.read<DEPARTMENT>({ DEPARTMENT: {
                        criteries: {
                            ISN_CABINET: depD[0].ISN_CABINET
                        }
                    }}).then(dep => {
                        if (dep.length === 1) {
                            if (changeRole) {
                                const repeatRole = this.currentFields.filter(field => /* field.role === role && */ field.due === dep[0].DUE)[0];
                                if (!repeatRole) {
                                    this.selectedCurrRole.due = dep[0].DUE;
                                    this.selectedCurrRole.dueName = dep[0].CLASSIF_NAME;
                                } else {
                                    const msg = 'Невозможно добавить выбранное ДЛ в роль: у пользователя уже есть роль ' + repeatRole.role + ' с выбранным ДЛ';
                                    this.messageAlert(msg);
                                }
                            } else {
                                const checkField = this.currentFields.filter(field => field.role === this.nameRoles.get(5) || field.role === 'Директор департамента и заместитель директора департамент');
                                // проверка на дублирование при добавлении
                                const repeatRole = this.currentFields.filter(field => /* field.role === role && */ field.due === dep[0].DUE)[0];
                                if (checkField.length === 0) {
                                    this.fixedFields = !this.fixedFields.length ? this.basicFields.filter(field => field.role === this.nameRoles.get(0) || field.role === this.nameRoles.get(1)) : this.fixedFields;
                                    this.basicFields = this.basicFields.filter(field => field.role !== this.nameRoles.get(0) && field.role !== this.nameRoles.get(1));
                                }
                                if (!repeatRole) {
                                    if (basicPreAdd) {
                                        basicPreAdd.due = dep[0].DUE;
                                        basicPreAdd.dueName = dep[0].CLASSIF_NAME;
                                        basicPreAdd.isnRole = repeatRole ? repeatRole.isnRole : null;
                                    } else {
                                        this.currentFields.push({
                                            role: role,
                                            due: dep[0].DUE,
                                            dueName: dep[0].CLASSIF_NAME,
                                            isnRole : repeatRole ? repeatRole.isnRole : null
                                        });
                                    }
                                } else {
                                    const msg = 'Невозможно добавить выбранное ДЛ в роль: у пользователя уже есть роль ' + repeatRole.role + ' с выбранным ДЛ';
                                    this.messageAlert(msg, basicPreAdd);
                                }
                            }
                        } else {
                            const msg = 'Невозможно добавить выбранное ДЛ в роль: ДЛ не является единственным владельцем кабинета';
                            this.messageAlert(msg, basicPreAdd);
                        }
                    });
                } else {
                    const msg = 'Невозможно добавить выбранное ДЛ в роль: ДЛ не является единственным владельцем кабинета';
                    this.messageAlert(msg, basicPreAdd);
                }
            }).catch((e) => {
                this.isShell = false;
                if (e !== undefined  && e.message === 'copy') {
                    const msg = 'Невозможно добавить выбранное ДЛ в роль: ДЛ совпадает с ассоциированным ДЛ пользователя';
                    this.messageAlert(msg, basicPreAdd);
                } else {
                    if (basicPreAdd && !basicPreAdd.hasOwnProperty('due')) {
                        this.currentFields.splice(this.currentFields.indexOf(basicPreAdd), 1);
                    }
                }
            });
    }

    private messageAlert(msg: string, basicPreAdd?: any): void {
        this._msgSrv.addNewMessage(
            {
                type: 'warning',
                title: 'Предупреждение:',
                msg: msg,
                dismissOnTimeout: 6000,
            }
        );
        if (basicPreAdd) {
            this.currentFields.splice(this.currentFields.indexOf(basicPreAdd), 1);
        }
    }

}
