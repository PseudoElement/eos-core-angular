import { Component, Output, OnInit, OnDestroy, EventEmitter } from '@angular/core';
import { DragulaService } from 'ng2-dragula';
import { Subscription } from 'rxjs';
import { ConfirmWindowService } from 'eos-common/confirm-window/confirm-window.service';
import { CONFIRM_DELETE_ROLE } from 'eos-dictionaries/consts/confirm.consts';
import { OPEN_CLASSIF_DEPARTMENT } from 'eos-user-select/shered/consts/create-user.consts';
import { WaitClassifService } from 'app/services/waitClassif.service';
import { UserParamsService } from 'eos-user-params/shared/services/user-params.service';
import { PipRX, USER_CL } from 'eos-rest';
import { IRoleCB } from 'eos-user-params/shared/intrfaces/user-parm.intterfaces';
import { KIND_ROLES_CB } from 'eos-user-params/shared/consts/user-param.consts';
@Component({
    selector: 'eos-cb-user-role',
    templateUrl: 'cb-user-role.component.html',
    styleUrls: ['cb-user-role.component.scss'],
})
export class CbUserRoleComponent implements OnInit, OnDestroy {
    @Output() closeModal: EventEmitter<any> = new EventEmitter();
    @Output() saveCbRoles: EventEmitter<any> = new EventEmitter();
    basicFields: string[] = [
        'Председатель', 'Заместитель Председателя', 'Директор департамента и заместитель директора департамента', 'Помощник Председателя',
        'Помощник заместителя предстедателя и директоров', 'Исполнитель'
    ];
    currentFields: IRoleCB[] = [];
    fixedFields: string[] = [];
    selectedBasicRole: string;
    selectedCurrRole: IRoleCB;
    selectedFixedItem: string;
    curPreDelete: IRoleCB;
    asistMansStr: string = '';
    private _subscriptionDrop: Subscription;
    private _subscriptionDrag: Subscription;
    constructor(private _dragulaService: DragulaService, private _confirmSrv: ConfirmWindowService,
        private _waitClassifSrv: WaitClassifService, private _userParamSrv: UserParamsService, private _pipRx: PipRX) {
    }

    ngOnInit() {
        this.init();
        this._subscription();
    }

    init() {
        this._pipRx.read({CBR_USER_ROLE: {
            criteries: {DUE_PERSON: this._userParamSrv.curentUser.DUE_DEP}
        }}).then((data: any) => {
             const asistMansData = data.filter(el => el.ISN_USER !== this._userParamSrv.curentUser.ISN_LCLASSIF && (el.KIND_ROLE === 4 || el.KIND_ROLE === 5)).map(el => el.ISN_USER);
            if (asistMansData.length > 0) {
                this._getUserCl(asistMansData).then((users: USER_CL[]) => {
                    users.forEach(user => this.asistMansStr += `${user.SURNAME_PATRON}(${user.NOTE})\n`);
                    const curRoles = data.filter(el => el.ISN_USER === this._userParamSrv.curentUser.ISN_LCLASSIF);
                    this.parseData(curRoles);
                    this._fixInitRoles();
                });
            } else {
                this.parseData(data);
                this._fixInitRoles();
            }
        });
    }

    parseData(data: any[]) {
        data.forEach(el => {
            if (el.KIND_ROLE === 4 || el.KIND_ROLE === 5) {
                this.currentFields.push({role: KIND_ROLES_CB[el.KIND_ROLE - 1], dueName: this._userParamSrv.curentUser.DUE_DEP_NAME,
                due: this._userParamSrv.curentUser.DUE_DEP});
            } else if (this.asistMansStr && (el.KIND_ROLE === 1 || el.KIND_ROLE === 2 || el.KIND_ROLE === 3)) {
                this.currentFields.push({role: KIND_ROLES_CB[el.KIND_ROLE - 1], asistMan: this.asistMansStr});
            } else {
                this.currentFields.push({role: KIND_ROLES_CB[el.KIND_ROLE - 1]});
            }
        });
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
                break;
            case 2:
                this.selectedBasicRole = null;
                this.selectedCurrRole = item;
                this.selectedFixedItem = null;
                break;
            case 3:
                this.selectedBasicRole = null;
                this.selectedCurrRole = null;
                this.selectedFixedItem = item;
                break;
        }
    }

    parseToCurRole(role: string): IRoleCB {
        let curObj;
        switch (role) {
            case 'Председатель':
                if (this.asistMansStr) {
                    curObj = {role: role, asistMan: this.asistMansStr};
                } else {
                    curObj = {
                        role: role,
                    };
                }
                break;
            case 'Заместитель Председателя':
                if (this.asistMansStr) {
                    curObj = {role: role, asistMan: this.asistMansStr};
                } else {
                    curObj = {
                        role: role,
                    };
                }
                break;
            case 'Директор департамента и заместитель директора департамента':
                if (this.asistMansStr) {
                    curObj = {role: role, asistMan: this.asistMansStr};
                } else {
                    curObj = {
                        role: role,
                    };
                }
                break;
            case 'Исполнитель':
                curObj = {
                    role: role
                };
                break;
        }
        return curObj;
    }

    addToCurrent() {
        if (this.selectedBasicRole) {
            if (this.selectedBasicRole !== 'Помощник заместителя предстедателя и директоров' && this.selectedBasicRole !== 'Помощник Председателя') {
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
            return this._confirmSrv.confirm(CONFIRM_DELETE_ROLE).then(res => {
                if (res) {
                    if (this.selectedCurrRole) {
                        if (this.selectedCurrRole.role !== 'Помощник заместителя предстедателя и директоров' && this.selectedCurrRole.role !== 'Помощник Председателя') {
                            this.basicFields.push(this.selectedCurrRole.role);
                        }
                        this.currentFields.splice(this.currentFields.indexOf(this.selectedCurrRole), 1);
                        this._fixedRoles(this.selectedCurrRole.role, 'del');
                        this.selectedCurrRole = null;
                    } else {
                        this.basicFields.push(this.curPreDelete.role);
                        if (item === 'Помощник заместителя предстедателя и директоров' || item === 'Помощник Председателя') {
                            this.basicFields.splice(this.basicFields.lastIndexOf(item), 1);
                        }
                        this._fixedRoles(item, 'del');
                    }
                } else {
                    if (item) {
                        this.basicFields.push(this.curPreDelete.role);
                        this.currentFields.push(this.curPreDelete);
                        if (item !== 'Помощник заместителя предстедателя и директоров' && item !== 'Помощник Председателя') {
                            this.basicFields.splice(this.basicFields.indexOf(item), 1);
                        } else {
                            this.basicFields.splice(this.basicFields.indexOf(item), 1);
                        }
                    }
                }
            });
        }
    }

    save() {
         this.saveCbRoles.emit(this.currentFields);
         this.closeModal.emit();
    }

    private _addRole(role: string) {
        this._fixedRoles(role, 'add');
        this.currentFields = this.currentFields.filter(field => typeof field !== 'string');
        if (role === 'Помощник Председателя' || role === 'Помощник заместителя предстедателя и директоров') {
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
                if (role !== 'Помощник заместителя предстедателя и директоров' && role !== 'Помощник Председателя') {
                    this.basicFields.splice(this.basicFields.indexOf(role), 1);
                }
                this._fixedRoles(role, 'add', true);
            }
        });
    }

    private _fixedRoles(role: string, typeMove: string , init?: boolean): void {
        const checkField = this.currentFields.filter(field => field.role === 'Исполнитель' || field.role === 'Директор департамента и заместитель директора департамент');
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
                        this.fixedFields = this.basicFields.filter(field => field !== 'Помощник заместителя предстедателя и директоров' && field !== 'Помощник Председателя');
                        this.basicFields = this.basicFields.filter(field => field === 'Помощник заместителя предстедателя и директоров' || field === 'Помощник Председателя');
                    } else {
                        this.basicFields.splice(this.basicFields.indexOf('Исполнитель'), 1);
                        this.fixedFields.push('Исполнитель');
                    }
                    break;
                case 'Исполнитель':
                    if (!this.fixedFields.length) {
                        this.fixedFields = this.basicFields.filter(field => field !== 'Помощник заместителя предстедателя и директоров' && field !== 'Помощник Председателя');
                        this.basicFields = this.basicFields.filter(field => field === 'Помощник заместителя предстедателя и директоров' || field === 'Помощник Председателя');
                    } else {
                        this.basicFields.splice(this.basicFields.indexOf('Директор департамента и заместитель директора департамента'), 1);
                        this.fixedFields.push('Директор департамента и заместитель директора департамента');
                    }
                    break;
                case 'Помощник Председателя':
                    if (checkField.length === 0) {
                        this.fixedFields = !this.fixedFields.length ? this.basicFields.filter(field => field === 'Председатель' || field === 'Заместитель Председателя') : this.fixedFields;
                        this.basicFields = this.basicFields.filter(field => field !== 'Председатель' && field !== 'Заместитель Председателя');
                    }
                    if (!init) {
                        this._showDepRole(role);
                    }
                    break;
                case 'Помощник заместителя предстедателя и директоров':
                    if (checkField.length === 0) {
                        this.fixedFields = !this.fixedFields.length ? this.basicFields.filter(field => field === 'Председатель' || field === 'Заместитель Председателя') : this.fixedFields;
                        this.basicFields = this.basicFields.filter(field => field !== 'Председатель' && field !== 'Заместитель Председателя');
                    }
                    if (!init) {
                        this._showDepRole(role);
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
                case 'Помощник заместителя предстедателя и директоров':
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
                    this.curPreDelete = this.currentFields.find(item => item.dueName === val[1].children[1].innerText);
                } else {
                    this.curPreDelete = this.currentFields.find(item => item.role === val[1].children[0].innerText);
                }
            }
            this.selectedBasicRole = null;
            this.selectedCurrRole = null;
            this.selectedFixedItem = null;
        });
    }

    private _showDepRole(role: string): Promise<any> {
        return this._waitClassifSrv.openClassif(OPEN_CLASSIF_DEPARTMENT)
            .then((data: string) => {
                if (data === '') {
                    throw new Error();
                }
                return this._userParamSrv.getDepartmentFromUser([data]);
            })
            .then((depD: any) => {
                this.currentFields.push({
                    role: role,
                    due: depD[0].DUE,
                    dueName: depD[0].SURNAME
                });
            }).catch((e) => {
                console.log('Ошибка', e);
            });
    }

    private _getUserCl(isn): Promise<any> {
        const queryUser = {
          USER_CL: isn
        };
        return this._pipRx.read<USER_CL>(queryUser);
    }
}
