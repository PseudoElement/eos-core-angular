import { Component, Output, OnInit, OnDestroy, EventEmitter, Input } from '@angular/core';
import { DragulaService } from 'ng2-dragula';
import { Subscription } from 'rxjs';
import { ConfirmWindowService } from 'eos-common/confirm-window/confirm-window.service';
import { CONFIRM_DELETE_ROLE } from 'eos-dictionaries/consts/confirm.consts';
import { OPEN_CLASSIF_DEPARTMENT } from 'eos-user-select/shered/consts/create-user.consts';
import { WaitClassifService } from 'app/services/waitClassif.service';
import { IRoleCB } from 'eos-user-params/shared/intrfaces/user-parm.intterfaces';
import { KIND_ROLES_CB } from 'eos-user-params/shared/consts/user-param.consts';
import { DEPARTMENT, PipRX } from 'eos-rest';
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
    @Input() asistMansStr: string;
    startRolesCb: IRoleCB[];
    basicFields: string[] = [
        'Председатель', 'Заместитель Председателя', 'Директор департамента и заместитель директора департамента', 'Помощник Председателя',
        'Помощник заместителя председателя и директоров департаментов', 'Исполнитель'
    ];
    fixedFields: string[] = [];
    selectedBasicRole: string;
    selectedCurrRole: IRoleCB;
    selectedFixedItem: string;
    curPreDelete: IRoleCB;
    rightsDueRole: boolean = false;
    btnChangeDue: boolean;
    public deletRole: boolean = true;
    private _subscriptionDrop: Subscription;
    private _subscriptionDrag: Subscription;
    constructor(private _dragulaService: DragulaService, private _confirmSrv: ConfirmWindowService,
        private _waitClassifSrv: WaitClassifService, private _pipRx: PipRX, private _msgSrv: EosMessageService, private _userParamSrv: UserParamsService) {
    }

    ngOnInit() {
        this._fixInitRoles();
        this._subscription();
        this.startRolesCb = [...this.currentFields];
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

    select(item, type: number) {
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

    parseToCurRole(role: string): IRoleCB {
        let curObj: IRoleCB;
        const repeatRole = this.startRolesCb.filter(field => field.role === role)[0];
        if (role === 'Исполнитель') {
            curObj = {
                role: role,
                isnRole : repeatRole ? repeatRole.isnRole : null
            };
        } else {
            if (this.asistMansStr) {
                curObj = {role: role, asistMan: this.asistMansStr,  isnRole : repeatRole ? repeatRole.isnRole : null};
            } else {
                curObj = {
                    role: role,
                    isnRole : repeatRole ? repeatRole.isnRole : null
                };
            }
        }
        return curObj;
    }

    addToCurrent() {
        if (this.selectedBasicRole) {
            if (this.selectedBasicRole !== 'Помощник заместителя председателя и директоров департаментов' && this.selectedBasicRole !== 'Помощник Председателя') {
                this.currentFields.push(this.parseToCurRole(this.selectedBasicRole));
                this.basicFields.splice(this.basicFields.indexOf(this.selectedBasicRole), 1);
            } else {
                this._showDepRole(this.selectedBasicRole);
            }
            this._fixedRoles(this.selectedBasicRole, 'add');
            this.selectedBasicRole = null;
        }
    }

    removeFromCurrent(item?: string, dueN?: string) {
        this.basicFields = this.basicFields.filter(field => typeof field === 'string');
        if (this.selectedCurrRole || item) {
            this.deletRole = false;
            return this._confirmSrv.confirm(CONFIRM_DELETE_ROLE).then(res => {
                if (res) {
                    if (this.selectedCurrRole) {
                        if (this.selectedCurrRole.role !== 'Помощник заместителя председателя и директоров департаментов' && this.selectedCurrRole.role !== 'Помощник Председателя') {
                            this.basicFields.push(this.selectedCurrRole.role);
                        }
                        this.currentFields.splice(this.currentFields.indexOf(this.selectedCurrRole), 1);
                        this._fixedRoles(this.selectedCurrRole.role, 'del');
                        this.btnChangeDue = false;
                        this.selectedCurrRole = null;
                    } else {
                        this.basicFields.push(this.curPreDelete.role);
                        if (item === 'Помощник заместителя председателя и директоров департаментов' || item === 'Помощник Председателя') {
                            this.basicFields.splice(this.basicFields.lastIndexOf(item), 1);
                        }
                        this._fixedRoles(item, 'del');
                        const delFild = this.currentFields.filter(elem => JSON.stringify(this.curPreDelete) === JSON.stringify(elem));
                        if (delFild.length === 0) {
                            this.currentFields = this.currentFields.filter(elem => JSON.stringify(this.curPreDelete) !== JSON.stringify(elem));
                        }
                    }
                } else {
                    if (item) {
                        // убрал добавление в левую часть так как мы ничего не меняем
                        /* if (this.basicFields.filter(elem => this.curPreDelete.role === elem).length === 0) {
                            this.basicFields.push(this.curPreDelete.role);
                        } */
                        if (this.currentFields.filter(elem => JSON.stringify(this.curPreDelete) === JSON.stringify(elem)).length === 0) {
                            this.currentFields.push(this.curPreDelete);
                        }
                        /* if (item !== 'Помощник заместителя председателя и директоров департаментов' && item !== 'Помощник Председателя') {
                            this.basicFields.splice(this.basicFields.indexOf(item), 1);
                        } else {
                            this.basicFields.splice(this.basicFields.indexOf(item), 1);
                        } */
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
        this._showDepRole(this.selectedCurrRole.role, true);
    }

    private _addRole(role: string) {
        this._fixedRoles(role, 'add');
        this.currentFields = this.currentFields.filter(field => typeof field !== 'string');
        if (role === 'Помощник Председателя' || role === 'Помощник заместителя председателя и директоров департаментов') {
            setTimeout(() => {
                this.basicFields.push(role);
            }, 0);
        } else {
            this.currentFields.push(this.parseToCurRole(role));
        }
    }

    private _fixInitRoles() {
        const arrRoles = this.currentFields.map(field => field.role);
        KIND_ROLES_CB.forEach(role => {
            if (arrRoles.indexOf(role) !== -1) {
                if (role !== 'Помощник заместителя председателя и директоров департаментов' && role !== 'Помощник Председателя') {
                    this.basicFields.splice(this.basicFields.indexOf(role), 1);
                }
                this._fixedRoles(role, 'add', true);
            }
        });
    }

    private _fixedRoles(role: string, typeMove: string , init?: boolean): void {
        if (typeMove === 'add') {
            switch (role) {
                case 'Председатель':
                    this.fixedFields = this.basicFields;
                    this.basicFields = [];
                    break;
                case 'Заместитель Председателя':
                    this.fixedFields = this.basicFields;
                    this.basicFields = [];
                    break;
                case 'Директор департамента и заместитель директора департамента':
                    if (!this.fixedFields.length) {
                        this.fixedFields = this.basicFields.filter(field => field !== 'Помощник заместителя председателя и директоров департаментов' && field !== 'Помощник Председателя');
                        this.basicFields = ['Помощник заместителя председателя и директоров департаментов', 'Помощник Председателя'];
                    } else {
                        this.basicFields.splice(this.basicFields.indexOf('Исполнитель'), 1);
                        this.fixedFields.push('Исполнитель');
                    }
                    break;
                case 'Исполнитель':
                    if (!this.fixedFields.length) {
                        this.fixedFields = this.basicFields.filter(field => field !== 'Помощник заместителя председателя и директоров департаментов' && field !== 'Помощник Председателя');
                        this.basicFields = ['Помощник заместителя председателя и директоров департаментов', 'Помощник Председателя'];
                    } else {
                        this.basicFields.splice(this.basicFields.indexOf('Директор департамента и заместитель директора департамента'), 1);
                        this.fixedFields.push('Директор департамента и заместитель директора департамента');
                    }
                    break;
                case 'Помощник Председателя':
                    if (!init) {
                        this._showDepRole(role);
                    } else {
                        const seniorMan = this.currentFields.filter(field => field.role === 'Директор департамента и заместитель директора департамента' || field.role === 'Исполнитель')[0];
                        if (!seniorMan) {
                            this.fixedFields = ['Председатель', 'Заместитель Председателя'];
                            this.basicFields = this.basicFields.filter(field => field !== 'Председатель' && field !== 'Заместитель Председателя');
                        }
                    }
                    break;
                case 'Помощник заместителя председателя и директоров департаментов':
                    if (!init) {
                        this._showDepRole(role);
                    } else {
                        const seniorMan = this.currentFields.filter(field => field.role === 'Директор департамента и заместитель директора департамента' || field.role === 'Исполнитель')[0];
                        if (!seniorMan) {
                            this.fixedFields = ['Председатель', 'Заместитель Председателя'];
                            this.basicFields = this.basicFields.filter(field => field !== 'Председатель' && field !== 'Заместитель Председателя');
                        }
                    }
                    break;
            }
        } else {
            switch (role) {
                case 'Председатель':
                    this.basicFields = this.fixedFields.concat(role);
                    this.fixedFields = [];
                    break;
                case 'Заместитель Председателя':
                    this.basicFields = this.fixedFields.concat(role);
                    this.fixedFields = [];
                    break;
                case 'Директор департамента и заместитель директора департамента':
                    this.basicFields.splice(this.basicFields.indexOf('Исполнитель'), 1);
                    this.basicFields.push(role);
                    if (!this.currentFields.length) {
                        this.basicFields = this.fixedFields.concat(this.basicFields);
                        this.fixedFields = [];
                    } else {
                        this.fixedFields.splice(this.fixedFields.indexOf('Исполнитель'), 1);
                        this.basicFields.push('Исполнитель');
                    }
                    break;
                case 'Исполнитель':
                    this.basicFields.splice(this.basicFields.indexOf('Директор департамента и заместитель директора департамента'), 1);
                    this.basicFields.push(role);
                    if (!this.currentFields.length) {
                        this.basicFields = this.fixedFields.concat(this.basicFields);
                        this.fixedFields = [];
                    } else {
                        this.fixedFields.splice(this.fixedFields.indexOf('Директор департамента и заместитель директора департамента'), 1);
                        this.basicFields.push('Директор департамента и заместитель директора департамента');
                    }
                    break;
                case 'Помощник Председателя':
                    if (!this.currentFields.length) {
                        this.basicFields = this.fixedFields.concat(this.basicFields);
                        this.fixedFields = [];
                    }
                    break;
                case 'Помощник заместителя председателя и директоров департаментов':
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

    private _showDepRole(role: string, changeRole?: boolean): Promise<any> {
        return this._waitClassifSrv.openClassif(OPEN_CLASSIF_DEPARTMENT)
            .then((data: string) => {
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
                                    const indxRole = this.currentFields.indexOf(this.selectedCurrRole);
                                    this.selectedCurrRole.due = dep[0].DUE;
                                    this.selectedCurrRole.dueName = dep[0].CLASSIF_NAME;
                                    this.currentFields.splice(indxRole, 1, this.selectedCurrRole);
                                } else {
                                    this._msgSrv.addNewMessage({
                                        type: 'warning',
                                        title: 'Предупреждение:',
                                        msg: 'Невозможно добавить выбранное ДЛ в роль: у пользователя уже есть роль ' + repeatRole.role + ' с выбранным ДЛ',
                                        dismissOnTimeout: 6000,
                                    });
                                }
                            } else {
                                const checkField = this.currentFields.filter(field => field.role === 'Исполнитель' || field.role === 'Директор департамента и заместитель директора департамент');
                                // проверка на дублирование при добавлении
                                const repeatRole = this.currentFields.filter(field => /* field.role === role && */ field.due === dep[0].DUE)[0];
                                if (checkField.length === 0) {
                                    this.fixedFields = !this.fixedFields.length ? this.basicFields.filter(field => field === 'Председатель' || field === 'Заместитель Председателя') : this.fixedFields;
                                    this.basicFields = this.basicFields.filter(field => field !== 'Председатель' && field !== 'Заместитель Председателя');
                                }
                                if (!repeatRole) {
                                    this.currentFields.push({
                                        role: role,
                                        due: dep[0].DUE,
                                        dueName: dep[0].CLASSIF_NAME,
                                        isnRole : repeatRole ? repeatRole.isnRole : null
                                    });
                                } else {
                                    this._msgSrv.addNewMessage({
                                        type: 'warning',
                                        title: 'Предупреждение:',
                                        msg: 'Невозможно добавить выбранное ДЛ в роль: у пользователя уже есть роль ' + repeatRole.role + ' с выбранным ДЛ',
                                        dismissOnTimeout: 6000,
                                    });
                                }
                            }
                        } else {
                            this._msgSrv.addNewMessage({
                                type: 'warning',
                                title: 'Предупреждение:',
                                msg: 'Невозможно добавить выбранное ДЛ в роль: ДЛ не является единственным владельцем кабинета',
                                dismissOnTimeout: 6000,
                            });
                        }
                    });
                } else {
                    this._msgSrv.addNewMessage({
                        type: 'warning',
                        title: 'Предупреждение:',
                        msg: 'Невозможно добавить выбранное ДЛ в роль: ДЛ не является единственным владельцем кабинета',
                        dismissOnTimeout: 6000,
                    });
                }
            }).catch((e) => {
                if (e !== undefined  && e.message === 'copy') {
                    this._msgSrv.addNewMessage({
                        type: 'warning',
                        title: 'Предупреждение:',
                        msg: 'Невозможно добавить выбранное ДЛ в роль: ДЛ совпадает с ассоциированным ДЛ пользователя',
                        dismissOnTimeout: 6000,
                    });
                } else {
                    console.log('Ошибка', e);
                }
            });
    }

}
